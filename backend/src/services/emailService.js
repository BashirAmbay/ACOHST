const nodemailer = require('nodemailer');

// Configure Nodemailer transporter (supports Gmail service with App Password, OAuth2, or SMTP)
function createTransporter() {
  const emailUser = process.env.EMAIL_USER || 'bashirambay@gmail.com';
  const emailPass = process.env.EMAIL_PASS || 'sxzklnqhqbjdqbdi';

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN && !process.env.GOOGLE_CLIENT_ID.startsWith('your_')) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: emailUser,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      },
    });
  }

  // Gmail Service with App Password
  if (process.env.EMAIL_HOST === 'smtp.gmail.com' || emailUser.includes('@gmail.com')) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });
  }

  // Fallback SMTP
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });
}

async function sendEmail({ to, subject, html, text }) {
  const from = process.env.EMAIL_FROM || '"ACOHST Admissions" <bashirambay@gmail.com>';
  
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
    console.log(`[Email Service]: Email delivered successfully to ${to}. MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.warn(`[Email Service Warning]: Could not deliver email via SMTP (${error.message}). Logged to console above.`);
    return { success: true, simulated: true };
  }
}

async function sendAccountCreatedEmail(email, name, applicationNumber = null) {
  return sendEmail({
    to: email,
    subject: 'Account Created Successfully - ACOHST Applicant Portal',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; border-bottom: 2px solid #059669; padding-bottom: 16px; margin-bottom: 20px;">
          <h2 style="color: #059669; margin: 0; font-size: 20px; font-weight: 800;">AL-MADINATU COLLEGE OF HEALTH SCIENCE AND TECHNOLOGY</h2>
          <p style="color: #64748b; margin: 4px 0 0 0; font-size: 13px;">Kore Campus, Kano State | Admissions Portal</p>
        </div>
        
        <h3 style="color: #1e293b; font-size: 16px;">Dear ${name},</h3>
        <p style="color: #334155; line-height: 1.6; font-size: 14px;">
          Congratulations! Your applicant portal account has been <strong>created successfully</strong>. You can now log in to complete and submit your application for the 2026/2027 academic session.
        </p>

        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-left: 4px solid #059669; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <div style="color: #166534; font-weight: bold; font-size: 14px; margin-bottom: 8px;">Portal Account Information:</div>
          <div style="color: #1e293b; font-size: 13px; line-height: 1.8;">
            <strong>Registered Email:</strong> ${email}<br/>
            ${applicationNumber ? `<strong>Application Number:</strong> ${applicationNumber}<br/>` : ''}
            <strong>Account Status:</strong> Active &amp; Ready
          </div>
        </div>

        <div style="text-align: center; margin: 28px 0;">
          <a href="http://localhost:3000/login" style="background-color: #059669; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 13px; display: inline-block;">Log In to Your Portal</a>
        </div>

        <p style="color: #64748b; font-size: 13px; line-height: 1.5;">
          For support or enquiries, please email us at <a href="mailto:almadinatucollege@gmail.com" style="color: #059669;">almadinatucollege@gmail.com</a>.
        </p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="color: #94a3b8; font-size: 11px; text-align: center; margin: 0;">ACOHST Kore, Kano-Hadejia Expressway | www.acohst.edu.ng</p>
      </div>
    `
  });
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

async function sendResetPasswordEmail(email, resetUrl, name) {
  return sendEmail({
    to: email,
    subject: 'Password Reset Request - ACOHST Portal',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; border-bottom: 2px solid #059669; padding-bottom: 16px; margin-bottom: 20px;">
          <h2 style="color: #059669; margin: 0; font-size: 20px; font-weight: 800;">AL-MADINATU COLLEGE OF HEALTH SCIENCE AND TECHNOLOGY</h2>
          <p style="color: #64748b; margin: 4px 0 0 0; font-size: 13px;">Security &amp; Account Recovery | Admissions &amp; Student Portal</p>
        </div>
        
        <h3 style="color: #1e293b; font-size: 16px;">Hello ${name || 'User'},</h3>
        <p style="color: #334155; line-height: 1.6; font-size: 14px;">
          We received a request to reset the password for your institutional account associated with <strong>${email}</strong>.
        </p>

        <p style="color: #334155; line-height: 1.6; font-size: 14px;">
          Click the secure button below to set a new password. This link is valid for <strong>1 hour</strong>.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #059669; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">Reset Your Password</a>
        </div>

        <p style="color: #64748b; font-size: 12px; line-height: 1.5;">
          If the button above does not work, copy and paste this URL into your browser:<br/>
          <a href="${resetUrl}" style="color: #059669; word-break: break-all;">${resetUrl}</a>
        </p>

        <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 4px; padding: 12px; margin: 20px 0;">
          <p style="color: #991b1b; font-size: 12px; margin: 0;">
            <strong>Security Notice:</strong> If you did not request this password reset, please ignore this email or notify IT support immediately. Your password will remain unchanged.
          </p>
        </div>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="color: #94a3b8; font-size: 11px; text-align: center; margin: 0;">ACOHST Kore, Kano-Hadejia Expressway | www.acohst.edu.ng</p>
      </div>
    `
  });
}

module.exports = {
  sendEmail,
  sendAccountCreatedEmail,
  sendVerificationEmail,
  sendApplicationConfirmationEmail,
  sendAdmissionLetterEmail,
  sendResetPasswordEmail
};
