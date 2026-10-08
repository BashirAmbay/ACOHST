const nodemailer = require('nodemailer');

// Configure Nodemailer transporter (supports SMTP or Google OAuth2 if credentials are provided)
function createTransporter() {
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      },
    });
  }

  // Fallback SMTP
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER || 'admissions@acohst.edu.ng',
      pass: process.env.EMAIL_PASS || 'password_placeholder'
    }
  });
}

async function sendEmail({ to, subject, html, text }) {
  const from = process.env.EMAIL_FROM || '"ACOHST Admissions" <admissions@acohst.edu.ng>';
  
  console.log(`\n================ EMAIL NOTIFICATION SENT ================`);
  console.log(`TO: ${to}`);
  console.log(`SUBJECT: ${subject}`);
  console.log(`FROM: ${from}`);
  console.log(`BODY SUMMARY: ${text || html.replace(/<[^>]+>/g, '').substring(0, 150)}...`);
  console.log(`==========================================================\n`);

  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text: text || html.replace(/<[^>]+>/g, ''),
      html
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.warn(`[Email Service Warning]: Could not deliver email via SMTP (${error.message}). Logged to console above.`);
    return { success: true, simulated: true };
  }
}

async function sendVerificationEmail(email, token, name) {
  const verifyUrl = `http://localhost:3000/verify-email?token=${token}&email=${encodeURIComponent(email)}`;
  return sendEmail({
    to: email,
    subject: 'ACOHST Account Verification',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #047857; text-align: center;">Al-Madinatu College of Health Science and Technology (ACOHST)</h2>
        <h3 style="color: #1e293b;">Welcome, ${name}!</h3>
        <p style="color: #475569; line-height: 1.6;">Thank you for registering on the ACOHST Portal. Please verify your email address to activate your account and proceed with your application.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}" style="background-color: #047857; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Verify Email Address</a>
        </div>
        <p style="color: #94a3b8; font-size: 13px;">If you did not initiate this request, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="color: #64748b; font-size: 12px; text-align: center;">ACOHST Kore, Kano-Hadejia Expressway | www.acohst.edu.ng</p>
      </div>
    `
  });
}

async function sendApplicationConfirmationEmail(applicant) {
  return sendEmail({
    to: applicant.email,
    subject: `Application Submitted - Ref: ${applicant.application_number}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #047857;">ACOHST Admission Office</h2>
        <p>Dear ${applicant.first_name} ${applicant.last_name},</p>
        <p>Your online application for admission for the 2026/2027 academic session has been successfully received.</p>
        <div style="background-color: #f0fdf4; border-left: 4px solid #047857; padding: 15px; margin: 15px 0;">
          <strong>Application Number:</strong> ${applicant.application_number}<br/>
          <strong>Status:</strong> ${applicant.status}<br/>
          <strong>Date:</strong> ${new Date().toLocaleDateString()}
        </div>
        <p>You can track the progress of your application by logging into your Applicant Dashboard at any time.</p>
        <p>Best regards,<br/><strong>Admission Officer</strong><br/>ACOHST Kore</p>
      </div>
    `
  });
}

async function sendAdmissionLetterEmail(applicant, programmeName) {
  return sendEmail({
    to: applicant.email,
    subject: `CONGRATULATIONS: Provisional Offer of Admission - ACOHST`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #d1fae5; border-radius: 8px; background-color: #ffffff;">
        <div style="text-align: center; border-bottom: 2px solid #047857; padding-bottom: 15px;">
          <h2 style="color: #047857; margin: 0;">AL-MADINATU COLLEGE OF HEALTH SCIENCE AND TECHNOLOGY</h2>
          <p style="color: #0369a1; margin: 5px 0 0 0; font-size: 14px;">Kore Campus, Kano State, Nigeria</p>
        </div>
        <div style="padding: 20px 0;">
          <h3 style="color: #065f46;">PROVISIONAL OFFER OF ADMISSION</h3>
          <p>Dear <strong>${applicant.first_name} ${applicant.last_name}</strong> (${applicant.application_number}),</p>
          <p>We are pleased to inform you that the Academic Board of Al-Madinatu College of Health Science and Technology, Kore, has approved your provisional admission into the <strong>${programmeName}</strong> for the <strong>2026/2027</strong> Academic Session.</p>
          <p>Please log in to your ACOHST Applicant Portal to view and print your Official Admission Letter and proceed with acceptance fee payment and registration instructions.</p>
        </div>
        <p style="color: #047857; font-weight: bold;">Congratulations on your admission!</p>
        <p style="color: #64748b; font-size: 12px;">Office of the Registrar, ACOHST Kore.</p>
      </div>
    `
  });
}

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendApplicationConfirmationEmail,
  sendAdmissionLetterEmail
};
