import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // or 'Outlook', or custom SMTP
    auth: {
      user: process.env.EMAIL_USER, // your email
      pass: process.env.EMAIL_PASS  // your app password
    }
  });

  const verificationUrl = `http://localhost:3000/api/v1/user/verify-email?token=${token}`;

  await transporter.sendMail({
    from: '"Chat App" <no-reply@chatapp.com>',
    to: email,
    subject: 'Email Verification',
    html: `
      <h2>Verify your email</h2>
      <p>Click the link below to verify your email:</p>
      <a href="${verificationUrl}">Verify Email</a>
    `
  });
};
