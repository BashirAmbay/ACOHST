const db = require('../database/db');
const { sendApplicationConfirmationEmail } = require('../services/emailService');

async function getApplicantProfile(req, res) {
  try {
    let applicant = db.prepare(`
      SELECT a.*, 
             p1.name as first_choice_name, p1.fee_amount as first_choice_fee,
             p2.name as second_choice_name
      FROM applicants a
      LEFT JOIN programmes p1 ON a.first_choice_programme_id = p1.id
      LEFT JOIN programmes p2 ON a.second_choice_programme_id = p2.id
      WHERE a.user_id = ?
    `).get(req.user.id);

    if (!applicant) {
      // Create initial applicant draft if missing
      const activeSession = db.prepare('SELECT id FROM academic_sessions WHERE is_current = 1').get() || { id: 1 };
      const appNum = `ACOHST/${new Date().getFullYear()}/APP/${String(req.user.id).padStart(4, '0')}`;
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
      
      const insert = db.prepare(`
        INSERT INTO applicants (user_id, application_number, academic_session_id, first_name, last_name, email, phone, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'Draft')
      `).run(req.user.id, appNum, activeSession.id, user.first_name, user.last_name, user.email, user.phone || '');

      applicant = db.prepare('SELECT * FROM applicants WHERE id = ?').get(insert.lastInsertRowid);
    }

    // Get documents
    const documents = db.prepare('SELECT * FROM application_documents WHERE applicant_id = ?').all(applicant.id);

    // Get payment records
    const payments = db.prepare('SELECT * FROM payments WHERE applicant_id = ? OR user_id = ?').all(applicant.id, req.user.id);

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
    console.error('getApplicantProfile Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to load applicant profile.' });
  }
}

async function saveApplication(req, res) {
  try {
    const userId = req.user.id;
    const {
      first_name, middle_name, last_name, phone, gender, date_of_birth,
      marital_status, nationality, state_of_origin, lga, address,
      first_choice_programme_id, second_choice_programme_id, ssce_data
    } = req.body;

    const applicant = db.prepare('SELECT id, status FROM applicants WHERE user_id = ?').get(userId);
    if (!applicant) {
      return res.status(404).json({ success: false, message: 'Applicant record not found.' });
    }

    db.prepare(`
      UPDATE applicants SET
        first_name = COALESCE(?, first_name),
        middle_name = COALESCE(?, middle_name),
        last_name = COALESCE(?, last_name),
        phone = COALESCE(?, phone),
        gender = COALESCE(?, gender),
        date_of_birth = COALESCE(?, date_of_birth),
        marital_status = COALESCE(?, marital_status),
        nationality = COALESCE(?, nationality),
        state_of_origin = COALESCE(?, state_of_origin),
        lga = COALESCE(?, lga),
        address = COALESCE(?, address),
        first_choice_programme_id = COALESCE(?, first_choice_programme_id),
        second_choice_programme_id = COALESCE(?, second_choice_programme_id),
        ssce_data = COALESCE(?, ssce_data),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      first_name, middle_name, last_name, phone, gender, date_of_birth,
      marital_status, nationality, state_of_origin, lga, address,
      first_choice_programme_id ? parseInt(first_choice_programme_id) : null,
      second_choice_programme_id ? parseInt(second_choice_programme_id) : null,
      typeof ssce_data === 'object' ? JSON.stringify(ssce_data) : ssce_data,
      applicant.id
    );

    const updatedApplicant = db.prepare('SELECT * FROM applicants WHERE id = ?').get(applicant.id);

    return res.json({
      success: true,
      message: 'Application form progress saved successfully.',
      applicant: {
        ...updatedApplicant,
        ssce_data: updatedApplicant.ssce_data ? JSON.parse(updatedApplicant.ssce_data) : null
      }
    });
  } catch (error) {
    console.error('saveApplication Error:', error);
    return res.status(500).json({ success: false, message: 'Error saving application.' });
  }
}

async function uploadDocument(req, res) {
  try {
    const userId = req.user.id;
    const { document_type } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: 'No file was uploaded.' });
    }

    const applicant = db.prepare('SELECT id FROM applicants WHERE user_id = ?').get(userId);
    if (!applicant) {
      return res.status(404).json({ success: false, message: 'Applicant profile missing.' });
    }

    const docPath = `/uploads/${file.filename}`;
    
    // Check if document type already uploaded, update or insert
    const existingDoc = db.prepare('SELECT id FROM application_documents WHERE applicant_id = ? AND document_type = ?').get(applicant.id, document_type || 'General');
    
    if (existingDoc) {
      db.prepare('UPDATE application_documents SET document_name = ?, file_path = ?, status = "Uploaded" WHERE id = ?')
        .run(file.originalname, docPath, existingDoc.id);
    } else {
      db.prepare('INSERT INTO application_documents (applicant_id, document_type, document_name, file_path) VALUES (?, ?, ?, ?)')
        .run(applicant.id, document_type || 'General', file.originalname, docPath);
    }

    // If passport photo, update passport_photo field on applicant table as well
    if (document_type === 'Passport') {
      db.prepare('UPDATE applicants SET passport_photo = ? WHERE id = ?').run(docPath, applicant.id);
    }

    const documents = db.prepare('SELECT * FROM application_documents WHERE applicant_id = ?').all(applicant.id);

    return res.json({
      success: true,
      message: `${document_type || 'Document'} uploaded successfully.`,
      documents
    });
  } catch (error) {
    console.error('uploadDocument Error:', error);
    return res.status(500).json({ success: false, message: 'File upload failed.' });
  }
}

async function submitApplication(req, res) {
  try {
    const userId = req.user.id;
    const applicant = db.prepare('SELECT * FROM applicants WHERE user_id = ?').get(userId);

    if (!applicant) {
      return res.status(404).json({ success: false, message: 'Applicant profile not found.' });
    }

    if (!applicant.first_choice_programme_id) {
      return res.status(400).json({ success: false, message: 'Please select your first choice programme before submitting.' });
    }

    db.prepare('UPDATE applicants SET status = "Submitted", updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(applicant.id);

    const updatedApplicant = db.prepare('SELECT * FROM applicants WHERE id = ?').get(applicant.id);

    // Send confirmation email
    sendApplicationConfirmationEmail(updatedApplicant);

    return res.json({
      success: true,
      message: 'Application submitted successfully! Our Admissions Office will review your file.',
      applicant: updatedApplicant
    });
  } catch (error) {
    console.error('submitApplication Error:', error);
    return res.status(500).json({ success: false, message: 'Submission failed.' });
  }
}

async function getAdmissionLetter(req, res) {
  try {
    const applicant = db.prepare(`
      SELECT a.*, p.name as programme_name, p.degree_type, p.duration_years, d.name as department_name, s.name as school_name
      FROM applicants a
      LEFT JOIN programmes p ON a.first_choice_programme_id = p.id
      LEFT JOIN departments d ON p.department_id = d.id
      LEFT JOIN schools s ON d.school_id = s.id
      WHERE a.user_id = ?
    `).get(req.user.id);

    if (!applicant || applicant.status !== 'Admitted') {
      return res.status(403).json({ success: false, message: 'Official admission letter is only available for admitted students.' });
    }

    return res.json({
      success: true,
      letterData: {
        refNumber: applicant.application_number,
        candidateName: `${applicant.first_name} ${applicant.middle_name || ''} ${applicant.last_name}`,
        email: applicant.email,
        phone: applicant.phone,
        programme: applicant.programme_name,
        school: applicant.school_name,
        department: applicant.department_name,
        degreeType: applicant.degree_type,
        duration: `${applicant.duration_years} Years`,
        session: '2026/2027',
        issueDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
        provostName: 'Dr. Salisu Kore Abdullahi',
        registrarName: 'Alh. Garba Muhammad Kore'
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching admission letter.' });
  }
}

module.exports = {
  getApplicantProfile,
  saveApplication,
  uploadDocument,
  submitApplication,
  getAdmissionLetter
};
