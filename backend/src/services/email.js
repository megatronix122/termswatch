const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.resend.com',
  port: parseInt(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER || 'resend',
    pass: process.env.SMTP_PASS || '',
  },
});

async function sendAlert(email, monitorName, url, diffText, keywords) {
  const subject = `🚨 TermsWatch Alert: ${monitorName} has changed`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #dc2626;">📋 Legal Document Change Detected</h2>
      <p><strong>Service:</strong> ${monitorName}</p>
      <p><strong>URL:</strong> <a href="${url}">${url}</a></p>
      <p><strong>Detected:</strong> ${new Date().toLocaleString()}</p>
      
      ${keywords.length > 0 ? `
      <div style="background: #fef3c7; padding: 12px; border-radius: 6px; margin: 16px 0;">
        <strong>⚠️ Compliance Keywords Found:</strong> ${keywords.join(', ')}
      </div>
      ` : ''}
      
      <div style="background: #f3f4f6; padding: 16px; border-radius: 6px; margin: 16px 0;">
        <h3>Summary of Changes:</h3>
        <pre style="white-space: pre-wrap; font-size: 12px;">${diffText.substring(0, 2000)}${diffText.length > 2000 ? '\n\n... (truncated)' : ''}</pre>
      </div>
      
      <p style="margin-top: 24px;">
        <a href="${process.env.FRONTEND_URL}/dashboard" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          View Full Diff in Dashboard
        </a>
      </p>
      
      <hr style="margin-top: 32px; border: none; border-top: 1px solid #e5e7eb;">
      <p style="font-size: 12px; color: #6b7280;">
        You're receiving this because you're monitoring ${monitorName} on TermsWatch.
        <a href="${process.env.FRONTEND_URL}/settings">Manage alerts</a>
      </p>
    </div>
  `;

  const text = `TermsWatch Alert: ${monitorName} has changed\n\nURL: ${url}\nDetected: ${new Date().toISOString()}\n\nKeywords: ${keywords.join(', ')}\n\nChanges:\n${diffText.substring(0, 2000)}\n\nView: ${process.env.FRONTEND_URL}/dashboard`;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'alerts@termswatch.io',
      to: email,
      subject,
      text,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error('Email send failed:', error);
    return { success: false, error: error.message };
  }
}

async function sendWelcome(email, name) {
  const subject = 'Welcome to TermsWatch — Your compliance monitoring is now active';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Welcome to TermsWatch, ${name || 'there'}! 👋</h2>
      <p>You're now set up to monitor legal document changes across your SaaS stack.</p>
      
      <div style="background: #eff6ff; padding: 16px; border-radius: 6px; margin: 16px 0;">
        <h3>Quick Start:</h3>
        <ol>
          <li>Add your first monitor from the <a href="${process.env.FRONTEND_URL}/dashboard">Dashboard</a></li>
          <li>We'll check it automatically and alert you to any changes</li>
          <li>Review changes with highlighted diffs and compliance context</li>
        </ol>
      </div>
      
      <p>Questions? Reply to this email or check our <a href="${process.env.FRONTEND_URL}/help">Help Center</a>.</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'alerts@termswatch.io',
      to: email,
      subject,
      html,
      text: `Welcome to TermsWatch! Get started: ${process.env.FRONTEND_URL}/dashboard`,
    });
    return { success: true };
  } catch (error) {
    console.error('Welcome email failed:', error);
    return { success: false, error: error.message };
  }
}

module.exports = { sendAlert, sendWelcome };
