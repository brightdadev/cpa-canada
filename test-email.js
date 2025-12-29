// test-email.js
import { Resend } from 'resend';

// PASTE YOUR KEY HERE MANUALLY FOR THIS TEST
const resend = new Resend('re_JPRH8EnP_5ZMMsZVzSSmp5fx7VYVTq1YJ'); // <--- REPLACE THIS WITH YOUR REAL KEY

(async function() {
  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'eneh.bright@salesenforcer.com.ng', // <--- REPLACE THIS WITH YOUR EMAIL
      subject: 'Test from Terminal',
      html: '<p>If you see this, the Key works!</p>'
    });

    console.log('✅ Success:', data);
  } catch (error) {
    console.error('❌ Failed:', error);
  }
})();
