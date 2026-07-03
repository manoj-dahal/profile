/**
 * Email Service
 * Sends transactional emails via SMTP / SendGrid / Resend / etc.
 */

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST || 'smtp.gmail.com',
  port:   parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export async function sendNotification(submission) {
  if (!process.env.SMTP_USER) {
    console.warn('SMTP not configured — skipping notification');
    return;
  }

  const html = `
    <h2>New contact form submission</h2>
    <table style="border-collapse: collapse;">
      <tr><td><strong>Name</strong></td><td style="padding-left:12px;">${escapeHtml(submission.name)}</td></tr>
      <tr><td><strong>Email</strong></td><td style="padding-left:12px;">${escapeHtml(submission.email)}</td></tr>
      <tr><td><strong>Subject</strong></td><td style="padding-left:12px;">${escapeHtml(submission.subject || '(none)')}</td></tr>
    </table>
    <h3>Message</h3>
    <p style="white-space: pre-wrap;">${escapeHtml(submission.message)}</p>
    <hr>
    <p style="color:#888;font-size:12px;">
      Submitted ${submission.created_at} from ${submission.ip_address}
    </p>
  `;

  return transporter.sendMail({
    from:    `"Portfolio Contact" <${process.env.SMTP_USER}>`,
    to:      process.env.NOTIFY_EMAIL || 'info@manoj-dahal.com.np',
    replyTo: submission.email,
    subject: `[Contact] ${submission.subject || submission.name}`,
    html
  });
}

export async function sendReply({ to, subject, message }) {
  return transporter.sendMail({
    from:    `"Manoj Dahal" <${process.env.SMTP_USER}>`,
    to,
    subject: subject.startsWith('Re:') ? subject : `Re: ${subject}`,
    text:    message
  });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
