const db = require('../database/db');
const { generateMatricNumber } = require('../utils/helpers');
const { sendAdmissionLetterEmail } = require('../services/emailService');

async function getApplications(req, res) {
  try {
    const { status, programme_id, search, page = 1, limit = 15 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = `
      SELECT a.*, 
             p1.name as first_choice_name, 
             p2.name as second_choice_name,
             u.is_verified
      FROM applicants a
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN programmes p1 ON a.first_choice_programme_id = p1.id
      LEFT JOIN programmes p2 ON a.second_choice_programme_id = p2.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ` AND a.status = ?`;
      params.push(status);
    }

    if (programme_id) {
      query += ` AND (a.first_choice_programme_id = ? OR a.second_choice_programme_id = ?)`;
      params.push(programme_id, programme_id);
    }

    if (search) {
      query += ` AND (a.first_name LIKE ? OR a.last_name LIKE ? OR a.email LIKE ? OR a.application_number LIKE ?)`;
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    query += ` ORDER BY a.updated_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    const applications = db.prepare(query).all(...params);

    // Count total records for pagination
    let countQuery = `SELECT COUNT(*) as count FROM applicants a WHERE 1=1`;
    const countParams = [];

    if (status) {
      countQuery += ` AND a.status = ?`;
      countParams.push(status);
    }
    if (programme_id) {
      countQuery += ` AND (a.first_choice_programme_id = ? OR a.second_choice_programme_id = ?)`;
      countParams.push(programme_id, programme_id);
    }
    if (search) {
      countQuery += ` AND (a.first_name LIKE ? OR a.last_name LIKE ? OR a.email LIKE ? OR a.application_number LIKE ?)`;
      const searchPattern = `%${search}%`;
      countParams.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    const total = db.prepare(countQuery).get(...countParams).count;

    return res.json({
      success: true,
      applications: applications.map(app => ({
        ...app,
        ssce_data: app.ssce_data ? JSON.parse(app.ssce_data) : null
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('getApplications Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch applications.' });
  }
}

async function getApplicationById(req, res) {
  try {
    const { id } = req.params;

    const applicant = db.prepare(`
      SELECT a.*, 
             p1.name as first_choice_name, p1.code as first_choice_code, p1.fee_amount as first_choice_fee,
             p2.name as second_choice_name,
             d.name as department_name, s.name as school_name
      FROM applicants a
      LEFT JOIN programmes p1 ON a.first_choice_programme_id = p1.id
      LEFT JOIN programmes p2 ON a.second_choice_programme_id = p2.id
      LEFT JOIN departments d ON p1.department_id = d.id
      LEFT JOIN schools s ON d.school_id = s.id
      WHERE a.id = ?
    `).get(id);

    if (!applicant) {
      return res.status(404).json({ success: false, message: 'Applicant record not found.' });
    }

    const documents = db.prepare('SELECT * FROM application_documents WHERE applicant_id = ?').all(applicant.id);
    const payments = db.prepare('SELECT * FROM payments WHERE applicant_id = ? OR user_id = ?').all(applicant.id, applicant.user_id);

    return res.json({
      success: true,
      applicant: {
        ...applicant,
        ssce_data: applicant.ssce_data ? JSON.parse(applicant.ssce_data) : null
      },
      documents,
      payments
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching application dossier.' });
  }
}

async function updateApplicationStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, admin_remarks } = req.body;

    const validStatuses = ['Draft', 'Submitted', 'Under Review', 'Shortlisted', 'Approved', 'Admitted', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status provided.' });
    }

    const applicant = db.prepare(`
      SELECT a.*, p.name as programme_name, p.code as programme_code, p.department_id
      FROM applicants a
      LEFT JOIN programmes p ON a.first_choice_programme_id = p.id
      WHERE a.id = ?
    `).get(id);

    if (!applicant) {
      return res.status(404).json({ success: false, message: 'Applicant not found.' });
    }

    // Update status & remarks
    db.prepare('UPDATE applicants SET status = ?, admin_remarks = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(status, admin_remarks || applicant.admin_remarks, id);

    // If status is Admitted, create student record & convert role
    if (status === 'Admitted') {
      const existingStudent = db.prepare('SELECT id FROM students WHERE user_id = ?').get(applicant.user_id);
      
      if (!existingStudent) {
        const dept = db.prepare('SELECT code FROM departments WHERE id = ?').get(applicant.department_id || 1) || { code: 'CHEW' };
        const matricNo = generateMatricNumber(dept.code, applicant.id);

        db.prepare(`
          INSERT INTO students (user_id, applicant_id, matric_number, programme_id, department_id, academic_session_id, level, status)
          VALUES (?, ?, ?, ?, ?, ?, 100, 'Active')
        `).run(
          applicant.user_id,
          applicant.id,
          matricNo,
          applicant.first_choice_programme_id || 1,
          applicant.department_id || 1,
          applicant.academic_session_id || 1
        );

        // Update user role to Student
        db.prepare('UPDATE users SET role = "Student" WHERE id = ?').run(applicant.user_id);
      }

      // Send admission notification email
      sendAdmissionLetterEmail(applicant, applicant.programme_name || 'Health Science Diploma');
    }

    // Log audit trail
    db.prepare(`
      INSERT INTO audit_logs (user_id, user_email, action, resource, details)
      VALUES (?, ?, ?, ?, ?)
    `).run(req.user.id, req.user.email, 'UPDATE_STATUS', `Application #${applicant.application_number}`, `Status changed to ${status}`);

    const updatedApplicant = db.prepare('SELECT * FROM applicants WHERE id = ?').get(id);

    return res.json({
      success: true,
      message: `Application #${applicant.application_number} status updated to ${status}.`,
      applicant: updatedApplicant
    });
  } catch (error) {
    console.error('updateApplicationStatus Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update application status.' });
  }
}

module.exports = {
  getApplications,
  getApplicationById,
  updateApplicationStatus
};
