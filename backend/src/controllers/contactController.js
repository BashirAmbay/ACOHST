const db = require('../database/db');

async function submitContactMessage(req, res) {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Please fill in your name, email, subject, and message.' });
    }

    const insert = db.prepare(`
      INSERT INTO contact_messages (name, email, phone, subject, message, status)
      VALUES (?, ?, ?, ?, ?, 'New')
    `).run(name, email, phone || '', subject, message);

    return res.status(201).json({
      success: true,
      message: 'Thank you for reaching out to ACOHST! Your message has been received and our inquiry team will respond shortly.',
      messageId: insert.lastInsertRowid
    });
  } catch (error) {
    console.error('submitContactMessage Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to send inquiry.' });
  }
}

async function getContactMessages(req, res) {
  try {
    const messages = db.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC').all();
    return res.json({ success: true, messages });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch contact messages.' });
  }
}

async function updateContactMessageStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, reply_notes } = req.body;

    db.prepare('UPDATE contact_messages SET status = ?, reply_notes = ? WHERE id = ?')
      .run(status || 'Resolved', reply_notes || '', id);

    return res.json({ success: true, message: 'Inquiry status updated.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error updating inquiry.' });
  }
}

module.exports = {
  submitContactMessage,
  getContactMessages,
  updateContactMessageStatus
};
