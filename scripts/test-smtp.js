const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

async function testSMTP() {
  console.log('Testing Brevo SMTP...');
  console.log('Using user:', process.env.BREVO_SMTP_USER);
  console.log('Using sender:', process.env.BREVO_SENDER_EMAIL);

  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.BREVO_SMTP_USER,
      pass: process.env.BREVO_SMTP_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"TravelHub" <${process.env.BREVO_SENDER_EMAIL}>`,
      to: 'notimp270@gmail.com',
      subject: 'Test Email from TravelHub',
      text: 'If you receive this, SMTP is working!',
      html: '<h1>SMTP Test</h1><p>If you receive this, Brevo SMTP is configured correctly.</p>',
    });
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ SMTP error:', error.message);
    console.error('Full error:', error);
  }
}

testSMTP();