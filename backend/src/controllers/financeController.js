const db = require('../database/db');
const { generatePaymentReference } = require('../utils/helpers');
const { initializePayment: initPaystack, verifyPayment: verifyPaystack } = require('../services/paymentService');

async function initializeTransaction(req, res) {
  try {
    const userId = req.user.id;
    const { payment_type = 'Application Fee', amount = 10000 } = req.body;

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    const applicant = db.prepare('SELECT id FROM applicants WHERE user_id = ?').get(userId);
    const student = db.prepare('SELECT id FROM students WHERE user_id = ?').get(userId);

    const reference = generatePaymentReference(payment_type === 'Application Fee' ? 'APP' : 'TUI');

    // Create payment record in database
    const insert = db.prepare(`
      INSERT INTO payments (user_id, applicant_id, student_id, reference, payment_type, amount, channel, status)
      VALUES (?, ?, ?, ?, ?, ?, 'Paystack', 'Pending')
    `).run(userId, applicant ? applicant.id : null, student ? student.id : null, reference, payment_type, parseFloat(amount));

    const callbackUrl = `http://localhost:3000/payment-verify?reference=${reference}`;

    const gatewayResult = await initPaystack({
      email: user.email,
      amount: parseFloat(amount),
      reference,
      callbackUrl,
      metadata: { userId, paymentType: payment_type }
    });

    return res.json({
      success: true,
      reference,
      paymentId: insert.lastInsertRowid,
      authorizationUrl: gatewayResult.data.authorization_url,
      message: 'Payment gateway initialized successfully.'
    });
  } catch (error) {
    console.error('initializeTransaction Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to initialize payment.' });
  }
}

async function verifyTransaction(req, res) {
  try {
    const { reference } = req.params;

    const payment = db.prepare('SELECT * FROM payments WHERE reference = ?').get(reference);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found.' });
    }

    const verification = await verifyPaystack(reference);

    if (verification.data && verification.data.status === 'success') {
      // Update payment record
      db.prepare(`
        UPDATE payments SET 
          status = 'Successful', 
          paystack_response = ?, 
          paid_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `).run(JSON.stringify(verification.data), payment.id);

      // If application fee, update applicant payment status
      if (payment.applicant_id) {
        db.prepare('UPDATE applicants SET payment_status = "Paid", payment_reference = ? WHERE id = ?')
          .run(reference, payment.applicant_id);
      }

      return res.json({
        success: true,
        message: 'Payment verified and completed successfully!',
        reference,
        amount: payment.amount,
        paidAt: new Date().toISOString()
      });
    } else {
      db.prepare('UPDATE payments SET status = "Failed" WHERE id = ?').run(payment.id);
      return res.status(400).json({ success: false, message: 'Payment verification failed.' });
    }
  } catch (error) {
    console.error('verifyTransaction Error:', error);
    return res.status(500).json({ success: false, message: 'Error verifying payment transaction.' });
  }
}

async function getTransactions(req, res) {
  try {
    const { status, type } = req.query;
    let query = `
      SELECT p.*, u.first_name, u.last_name, u.email
      FROM payments p
      JOIN users u ON p.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ` AND p.status = ?`;
      params.push(status);
    }
    if (type) {
      query += ` AND p.payment_type = ?`;
      params.push(type);
    }

    query += ` ORDER BY p.created_at DESC LIMIT 50`;

    const transactions = db.prepare(query).all(...params);
    return res.json({ success: true, transactions });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch financial transactions.' });
  }
}

module.exports = {
  initializeTransaction,
  verifyTransaction,
  getTransactions
};
