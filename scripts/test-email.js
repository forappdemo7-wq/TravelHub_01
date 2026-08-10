const { Resend } = require('resend');
require('dotenv').config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  console.log('API Key:', process.env.RESEND_API_KEY ? '✅ Loaded' : '❌ Missing');
  console.log('Email From:', process.env.EMAIL_FROM);

  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: 'notimp270@gmail.com', // Replace with your email
      subject: 'Test Email from TravelHub',
      html: '<h1>Test</h1><p>This is a test email.</p>',
    });
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

testEmail();