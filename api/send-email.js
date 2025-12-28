import { Resend } from 'resend';

// Vercel Serverless Function
export default async function handler(req, res) {
  // 1. Secure the method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. Get the Key (Securely from Server Env)
  const resend = new Resend(process.env.VITE_RESEND_API_KEY);
  
  const { toEmail, toName, clientName, packageName } = req.body;

  try {
    const data = await resend.emails.send({
      from: 'CPA Platform <onboarding@resend.dev>', // Free tier uses this
      to: [toEmail],
      subject: `New Client Assigned: ${clientName}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h1 style="color: #006FBA;">New Assignment</h1>
          <p>Hello <strong>${toName}</strong>,</p>
          <p>You have been matched with a new client!</p>
          
          <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Client:</strong> ${clientName}</p>
            <p><strong>Package:</strong> ${packageName}</p>
          </div>

          <a href="https://cpa-canada.vercel.app/dashboard" style="background: #009A49; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Order</a>
        </div>
      `,
    });

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
