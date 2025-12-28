import { Resend } from 'resend';

export default async function handler(req, res) {
  // 1. Allow CORS (Fixes some cross-origin issues)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ 
      error: 'Configuration Error', 
      details: 'RESEND_API_KEY is missing on the server.' 
    });
  }

  const resend = new Resend(apiKey);
  const { toEmail, toName, clientName, packageName } = req.body;

  try {
    const data = await resend.emails.send({
      from: 'CPA Platform <onboarding@resend.dev>',
      to: [toEmail], // MUST be your verified email on Free Tier
      subject: `New Client Assigned: ${clientName}`,
      html: `
        <p>Hello <strong>${toName}</strong>,</p>
        <p>You have a new client: <strong>${clientName}</strong> (${packageName})</p>
      `,
    });

    if (data.error) {
      console.error("Resend API Rejected:", data.error);
      return res.status(400).json({ 
        error: 'Email Rejected by Resend', 
        details: data.error.message, 
        hint: 'On free tier, you can only send to your own email.' 
      });
    }

    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ 
      error: 'Server Execution Error', 
      details: error.message 
    });
  }
}
