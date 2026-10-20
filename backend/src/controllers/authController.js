const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../database/db');
const { generateToken, sanitizeUser } = require('../utils/helpers');
const { sendVerificationEmail, sendAccountCreatedEmail, sendResetPasswordEmail } = require('../services/emailService');

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

    // If applicant role, initialize applicant draft record
    let appNum = null;
    if (userRole === 'Applicant') {
      const activeSession = db.prepare('SELECT id FROM academic_sessions WHERE is_current = 1').get() || { id: 1 };
      appNum = `ACOHST/${new Date().getFullYear()}/APP/${String(result.lastInsertRowid).padStart(4, '0')}`;
      db.prepare(`
        INSERT OR IGNORE INTO applicants (user_id, application_number, academic_session_id, first_name, last_name, email, phone, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'Draft')
      `).run(newUser.id, appNum, activeSession.id, first_name, last_name, email, phone || '');
    }

    // Send account creation confirmation email in background
    sendAccountCreatedEmail(email, `${first_name} ${last_name}`, appNum);

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

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide your registered email address.' });
    }

    const user = db.prepare('SELECT id, email, first_name FROM users WHERE email = ?').get(email);
    if (!user) {
      // For security, do not expose which emails exist, but provide reassuring message
      return res.json({
        success: true,
        message: 'If an account exists with this email address, a password reset link has been sent.'
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000).toISOString(); // 1 hour validity

    db.prepare('UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?')
      .run(resetToken, resetExpires, user.id);

    let origin = 'http://localhost:3000';
    if (req.headers.origin) {
      origin = req.headers.origin;
    } else if (req.headers.referer) {
      try {
        origin = new URL(req.headers.referer).origin;
      } catch (e) {
        origin = 'http://localhost:3000';
      }
    }

    const frontendUrl = (process.env.NODE_ENV === 'production' || process.env.VERCEL) && process.env.FRONTEND_URL
      ? process.env.FRONTEND_URL
      : origin;

    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(user.email)}`;

    sendResetPasswordEmail(user.email, resetUrl, user.first_name);

    return res.json({
      success: true,
      message: 'Password reset link sent! Please check your email inbox.'
    });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    return res.status(500).json({ success: false, message: 'Server error processing password reset.' });
  }
}

async function resetPassword(req, res) {
  try {
    const { email, token, password } = req.body;

    if (!email || !token || !password) {
      return res.status(400).json({ success: false, message: 'Email, token, and new password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const user = db.prepare('SELECT id, reset_token, reset_token_expires FROM users WHERE email = ?').get(email);
    if (!user || !user.reset_token || user.reset_token !== token) {
      return res.status(400).json({ success: false, message: 'Invalid or expired password reset link. Please request a new link.' });
    }

    const now = new Date();
    const expires = new Date(user.reset_token_expires);
    if (expires < now) {
      return res.status(400).json({ success: false, message: 'This password reset link has expired. Please request a new link.' });
    }

    const newHash = bcrypt.hashSync(password, 10);
    db.prepare('UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(newHash, user.id);

    return res.json({
      success: true,
      message: 'Your password has been reset successfully! You can now sign in with your new password.'
    });
  } catch (error) {
    console.error('Reset Password Error:', error);
    return res.status(500).json({ success: false, message: 'Server error resetting password.' });
  }
}

module.exports = {
  register,
  login,
  getCurrentProfile,
  forgotPassword,
  resetPassword
};
