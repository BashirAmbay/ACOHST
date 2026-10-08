const db = require('../database/db');

async function getDashboardMetrics(req, res) {
  try {
    const totalApplicants = db.prepare('SELECT COUNT(*) as count FROM applicants').get().count;
    const totalAdmitted = db.prepare('SELECT COUNT(*) as count FROM applicants WHERE status = "Admitted"').get().count;
    const pendingReview = db.prepare('SELECT COUNT(*) as count FROM applicants WHERE status IN ("Submitted", "Under Review")').get().count;
    const totalStudents = db.prepare('SELECT COUNT(*) as count FROM students WHERE status = "Active"').get().count;
    const totalRevenue = db.prepare('SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = "Successful"').get().total;
    const totalProgrammes = db.prepare('SELECT COUNT(*) as count FROM programmes WHERE is_active = 1').get().count;
    const totalSchools = db.prepare('SELECT COUNT(*) as count FROM schools').get().count;

    // Recent 5 applications
    const recentApplications = db.prepare(`
      SELECT a.id, a.application_number, a.first_name, a.last_name, a.status, a.created_at, p.name as programme_name
      FROM applicants a
      LEFT JOIN programmes p ON a.first_choice_programme_id = p.id
      ORDER BY a.updated_at DESC LIMIT 5
    `).all();

    // Applications count by status breakdown
    const statusCounts = db.prepare(`
      SELECT status, COUNT(*) as count
      FROM applicants
      GROUP BY status
    `).all();

    return res.json({
      success: true,
      metrics: {
        totalApplicants,
        totalAdmitted,
        pendingReview,
        totalStudents,
        totalRevenue,
        totalProgrammes,
        totalSchools,
        recentApplications,
        statusCounts
      }
    });
  } catch (error) {
    console.error('getDashboardMetrics Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch admin metrics.' });
  }
}

async function getUsers(req, res) {
  try {
    const { role, search } = req.query;
    let query = `SELECT id, email, first_name, last_name, phone, role, is_verified, created_at FROM users WHERE 1=1`;
    const params = [];

    if (role) {
      query += ` AND role = ?`;
      params.push(role);
    }

    if (search) {
      query += ` AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)`;
      const p = `%${search}%`;
      params.push(p, p, p);
    }

    query += ` ORDER BY id DESC`;

    const users = db.prepare(query).all(...params);
    return res.json({ success: true, users });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch users.' });
  }
}

async function updateUserRole(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ['Super Admin', 'Administrator', 'Admission Officer', 'Academic Officer', 'Finance Officer', 'Content Manager', 'Student', 'Applicant'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role specified.' });
    }

    db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, id);

    // Audit log
    db.prepare(`
      INSERT INTO audit_logs (user_id, user_email, action, resource, details)
      VALUES (?, ?, 'UPDATE_ROLE', 'User ID ' || ?, 'Role updated to ' || ?)
    `).run(req.user.id, req.user.email, id, role);

    return res.json({ success: true, message: `User role updated to ${role}.` });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error updating user role.' });
  }
}

async function getSystemSettings(req, res) {
  try {
    const settingsRows = db.prepare('SELECT * FROM system_settings').all();
    const settings = {};
    settingsRows.forEach(s => {
      settings[s.key] = s.value;
    });
    return res.json({ success: true, settings });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch system settings.' });
  }
}

async function updateSystemSettings(req, res) {
  try {
    const settings = req.body;
    const updateStmt = db.prepare('INSERT OR REPLACE INTO system_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)');

    Object.entries(settings).forEach(([key, value]) => {
      updateStmt.run(key, String(value));
    });

    return res.json({ success: true, message: 'System settings updated successfully!' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update system settings.' });
  }
}

async function getAuditLogs(req, res) {
  try {
    const logs = db.prepare('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100').all();
    return res.json({ success: true, logs });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch audit logs.' });
  }
}

module.exports = {
  getDashboardMetrics,
  getUsers,
  updateUserRole,
  getSystemSettings,
  updateSystemSettings,
  getAuditLogs
};
