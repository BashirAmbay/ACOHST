const db = require('../database/db');

async function getStudentProfile(req, res) {
  try {
    const student = db.prepare(`
      SELECT s.*, 
             u.first_name, u.last_name, u.email, u.phone,
             p.name as programme_name, p.degree_type, p.code as programme_code,
             d.name as department_name, d.code as department_code,
             sch.name as school_name,
             a.passport_photo
      FROM students s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN programmes p ON s.programme_id = p.id
      LEFT JOIN departments d ON s.department_id = d.id
      LEFT JOIN schools sch ON d.school_id = sch.id
      LEFT JOIN applicants a ON s.applicant_id = a.id
      WHERE s.user_id = ?
    `).get(req.user.id);

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student record not found.' });
    }

    // Get current registered courses
    const registeredCourses = db.prepare(`
      SELECT cr.id as reg_id, cr.semester, cr.status, c.*
      FROM course_registrations cr
      JOIN courses c ON cr.course_id = c.id
      WHERE cr.student_id = ?
    `).all(student.id);

    // Get results
    const results = db.prepare(`
      SELECT sr.*, c.code as course_code, c.title as course_title, c.credit_units
      FROM student_results sr
      JOIN courses c ON sr.course_id = c.id
      WHERE sr.student_id = ?
    `).all(student.id);

    // Get payments
    const payments = db.prepare('SELECT * FROM payments WHERE student_id = ? OR user_id = ?').all(student.id, req.user.id);

    return res.json({
      success: true,
      student,
      registeredCourses,
      results,
      payments
    });
  } catch (error) {
    console.error('getStudentProfile Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch student profile.' });
  }
}

async function getAvailableCourses(req, res) {
  try {
    const student = db.prepare('SELECT programme_id, level FROM students WHERE user_id = ?').get(req.user.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student record not found.' });
    }

    const availableCourses = db.prepare(`
      SELECT * FROM courses 
      WHERE programme_id = ? AND level <= ? 
      ORDER BY semester ASC, code ASC
    `).all(student.programme_id, student.level || 100);

    return res.json({
      success: true,
      courses: availableCourses
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to load available courses.' });
  }
}

async function registerCourses(req, res) {
  try {
    const { course_ids, semester = 1 } = req.body;
    const student = db.prepare('SELECT id, academic_session_id FROM students WHERE user_id = ?').get(req.user.id);

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student record not found.' });
    }

    if (!Array.isArray(course_ids) || course_ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Select at least one course to register.' });
    }

    // Insert course registrations
    const insert = db.prepare(`
      INSERT OR IGNORE INTO course_registrations (student_id, course_id, academic_session_id, semester, status)
      VALUES (?, ?, ?, ?, 'Approved')
    `);

    course_ids.forEach(courseId => {
      insert.run(student.id, parseInt(courseId), student.academic_session_id || 1, parseInt(semester));
    });

    const registered = db.prepare(`
      SELECT cr.id as reg_id, cr.semester, cr.status, c.*
      FROM course_registrations cr
      JOIN courses c ON cr.course_id = c.id
      WHERE cr.student_id = ?
    `).all(student.id);

    return res.json({
      success: true,
      message: 'Course registration completed successfully!',
      registeredCourses: registered
    });
  } catch (error) {
    console.error('registerCourses Error:', error);
    return res.status(500).json({ success: false, message: 'Course registration failed.' });
  }
}

async function getStudentResults(req, res) {
  try {
    const student = db.prepare('SELECT id FROM students WHERE user_id = ?').get(req.user.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student record not found.' });
    }

    const results = db.prepare(`
      SELECT sr.*, c.code as course_code, c.title as course_title, c.credit_units
      FROM student_results sr
      JOIN courses c ON sr.course_id = c.id
      WHERE sr.student_id = ? AND sr.is_published = 1
      ORDER BY sr.semester ASC, c.code ASC
    `).all(student.id);

    // Compute GPA
    let totalUnits = 0;
    let totalPoints = 0;

    results.forEach(r => {
      totalUnits += r.credit_units;
      totalPoints += (r.grade_point * r.credit_units);
    });

    const gpa = totalUnits > 0 ? (totalPoints / totalUnits).toFixed(2) : '0.00';

    return res.json({
      success: true,
      results,
      summary: {
        totalCourses: results.length,
        totalUnits,
        totalPoints,
        cgpa: gpa
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch academic results.' });
  }
}

module.exports = {
  getStudentProfile,
  getAvailableCourses,
  registerCourses,
  getStudentResults
};
