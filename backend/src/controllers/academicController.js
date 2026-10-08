const db = require('../database/db');

// Schools
async function getSchools(req, res) {
  try {
    const schools = db.prepare(`
      SELECT s.*, COUNT(d.id) as total_departments
      FROM schools s
      LEFT JOIN departments d ON d.school_id = s.id
      GROUP BY s.id
      ORDER BY s.id ASC
    `).all();
    return res.json({ success: true, schools });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch schools.' });
  }
}

async function createSchool(req, res) {
  try {
    const { name, code, description, icon, dean_name } = req.body;
    if (!name || !code) {
      return res.status(400).json({ success: false, message: 'School name and code are required.' });
    }

    const insert = db.prepare('INSERT INTO schools (name, code, description, icon, dean_name) VALUES (?, ?, ?, ?, ?)')
      .run(name, code, description || '', icon || 'GraduationCap', dean_name || '');

    const newSchool = db.prepare('SELECT * FROM schools WHERE id = ?').get(insert.lastInsertRowid);
    return res.status(201).json({ success: true, school: newSchool, message: 'School created successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error creating school.' });
  }
}

// Departments
async function getDepartments(req, res) {
  try {
    const { school_id } = req.query;
    let query = `
      SELECT d.*, s.name as school_name, s.code as school_code, COUNT(p.id) as total_programmes
      FROM departments d
      JOIN schools s ON d.school_id = s.id
      LEFT JOIN programmes p ON p.department_id = d.id
    `;
    const params = [];

    if (school_id) {
      query += ` WHERE d.school_id = ?`;
      params.push(school_id);
    }

    query += ` GROUP BY d.id ORDER BY d.id ASC`;

    const departments = db.prepare(query).all(...params);
    return res.json({ success: true, departments });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch departments.' });
  }
}

// Programmes
async function getProgrammes(req, res) {
  try {
    const { department_id, school_id } = req.query;
    let query = `
      SELECT p.*, d.name as department_name, d.code as department_code, s.name as school_name, s.id as school_id
      FROM programmes p
      JOIN departments d ON p.department_id = d.id
      JOIN schools s ON d.school_id = s.id
      WHERE p.is_active = 1
    `;
    const params = [];

    if (department_id) {
      query += ` AND p.department_id = ?`;
      params.push(department_id);
    }

    if (school_id) {
      query += ` AND s.id = ?`;
      params.push(school_id);
    }

    query += ` ORDER BY p.id ASC`;

    const programmes = db.prepare(query).all(...params);
    return res.json({ success: true, programmes });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch programmes.' });
  }
}

async function createProgramme(req, res) {
  try {
    const { department_id, name, code, degree_type, duration_years, requirement_summary, fee_amount, description } = req.body;
    
    if (!department_id || !name || !code || !degree_type) {
      return res.status(400).json({ success: false, message: 'Please provide department, programme name, code, and degree type.' });
    }

    const insert = db.prepare(`
      INSERT INTO programmes (department_id, name, code, degree_type, duration_years, requirement_summary, fee_amount, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(department_id, name, code, degree_type, duration_years || 3, requirement_summary || '', fee_amount || 65000, description || '');

    const newProg = db.prepare('SELECT * FROM programmes WHERE id = ?').get(insert.lastInsertRowid);
    return res.status(201).json({ success: true, programme: newProg, message: 'Programme created successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error creating programme.' });
  }
}

// Courses
async function getCourses(req, res) {
  try {
    const { programme_id } = req.query;
    let query = `
      SELECT c.*, p.name as programme_name
      FROM courses c
      JOIN programmes p ON c.programme_id = p.id
    `;
    const params = [];

    if (programme_id) {
      query += ` WHERE c.programme_id = ?`;
      params.push(programme_id);
    }

    query += ` ORDER BY c.level ASC, c.semester ASC, c.code ASC`;

    const courses = db.prepare(query).all(...params);
    return res.json({ success: true, courses });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch courses.' });
  }
}

// Academic Sessions
async function getSessions(req, res) {
  try {
    const sessions = db.prepare('SELECT * FROM academic_sessions ORDER BY id DESC').all();
    return res.json({ success: true, sessions });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch academic sessions.' });
  }
}

module.exports = {
  getSchools,
  createSchool,
  getDepartments,
  getProgrammes,
  createProgramme,
  getCourses,
  getSessions
};
