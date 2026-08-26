import nodemailer from 'nodemailer';

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST,
    port: Number(process.env.BREVO_SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.BREVO_SMTP_USER,
      pass: process.env.BREVO_SMTP_KEY,
    },
  });
}

async function sendMail({ to, subject, html, text }) {
  if (!process.env.BREVO_SMTP_USER || !process.env.BREVO_SMTP_KEY) {
    console.warn('Brevo SMTP credentials missing. Email skipped.');
    return;
  }

  const transporter = getTransporter();
  await transporter.sendMail({
    from: `"${process.env.MAIL_FROM_NAME || 'TechStore Pro'}" <${process.env.MAIL_FROM_EMAIL || process.env.BREVO_SMTP_USER}>`,
    to,
    subject,
    html,
    text,
  });
}

export async function sendVerificationEmail(user, token) {
  const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
  const apiVerifyUrl = `${process.env.API_PUBLIC_URL || `http://localhost:${process.env.PORT || 5000}`}/api/auth/verify-email?token=${token}`;

  await sendMail({
    to: user.email,
    subject: 'Verifiko email-in per TechStore Pro',
    text: `Pershendetje ${user.emri}, hap kete link per verifikim: ${apiVerifyUrl}`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
        <h2>Pershendetje ${user.emri},</h2>
        <p>Llogaria juaj ne TechStore Pro u krijua me sukses.</p>
        <p>Per ta verifikuar email-in, klikoni butonin me poshte:</p>
        <p>
          <a href="${apiVerifyUrl}" style="background:#4f46e5;color:white;padding:12px 18px;border-radius:8px;text-decoration:none;font-weight:700">
            Verifiko email-in
          </a>
        </p>
        <p>Nese frontend-i ka faqe verifikimi, mund te perdoret edhe ky link:</p>
        <p><a href="${verifyUrl}">${verifyUrl}</a></p>
      </div>
    `,
  });
}

export async function sendWelcomeEmail(user) {
  await sendMail({
    to: user.email,
    subject: 'Mire se vini ne TechStore Pro',
    text: `Mire se vini, ${user.emri}! Llogaria juaj eshte verifikuar.`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
        <h2>Mire se vini, ${user.emri}!</h2>
        <p>Llogaria juaj ne TechStore Pro u verifikua dhe eshte gati per perdorim.</p>
      </div>
    `,
  });
}
