const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../database/db');
const { generateToken, sanitizeUser } = require('../utils/helpers');
const { sendVerificationEmail } = require('../services/emailService');

async function register(req, res) {
  try {
    const { email, password, first_name, last_name, phone, role } = req.body;

    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({ success: false, message: 'Please provide email, password, first name, and last name.' });
    }

    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
    }

    const userRole = role && ['Applicant', 'Student'].includes(role) ? role : 'Applicant';
    const password_hash = bcrypt.hashSync(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const result = db.prepare(`
      INSERT INTO users (email, password_hash, first_name, last_name, phone, role, is_verified, verification_token)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(email, password_hash, first_name, last_name, phone || '', userRole, 1, verificationToken); // Auto-verify for seamless demo

    const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);

    // Send verification email in background
    sendVerificationEmail(email, verificationToken, `${first_name} ${last_name}`);

    // If applicant role, initialize applicant draft record
    if (userRole === 'Applicant') {
      const activeSession = db.prepare('SELECT id FROM academic_sessions WHERE is_current = 1').get() || { id: 1 };
      const appNum = `ACOHST/${new Date().getFullYear()}/APP/${String(result.lastInsertRowid).padStart(4, '0')}`;
      db.prepare(`
        INSERT OR IGNORE INTO applicants (user_id, application_number, academic_session_id, first_name, last_name, email, phone, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'Draft')
      `).run(newUser.id, appNum, activeSession.id, first_name, last_name, email, phone || '');
    }

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully!',
      token,
      user: sanitizeUser(newUser)
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email address or password.' });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email address or password.' });
    }

    const token = generateToken(user);

    // Fetch related profile IDs if applicable
    let applicantInfo = null;
    let studentInfo = null;

    if (user.role === 'Applicant') {
      applicantInfo = db.prepare('SELECT id, application_number, status, payment_status FROM applicants WHERE user_id = ?').get(user.id);
    } else if (user.role === 'Student') {
      studentInfo = db.prepare('SELECT id, matric_number, level, status FROM students WHERE user_id = ?').get(user.id);
    }

    return res.json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: sanitizeUser(user),
      applicant: applicantInfo,
      student: studentInfo
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
}

async function getCurrentProfile(req, res) {
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    let applicantInfo = null;
    let studentInfo = null;

    if (user.role === 'Applicant') {
      applicantInfo = db.prepare('SELECT * FROM applicants WHERE user_id = ?').get(user.id);
    } else if (user.role === 'Student') {
      studentInfo = db.prepare(`
        SELECT s.*, p.name as programme_name, d.name as department_name, sch.name as school_name
        FROM students s
        LEFT JOIN programmes p ON s.programme_id = p.id
        LEFT JOIN departments d ON s.department_id = d.id
        LEFT JOIN schools sch ON d.school_id = sch.id
        WHERE s.user_id = ?
      `).get(user.id);
    }

    return res.json({
      success: true,
      user: sanitizeUser(user),
      applicant: applicantInfo,
      student: studentInfo
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching profile.' });
  }
}

module.exports = {
  register,
  login,
  getCurrentProfile
};
