import { Resend } from 'resend';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CLEAN: No "VITE_" prefix here. This is a secure server secret.
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("❌ Server Error: RESEND_API_KEY is missing.");
    return res.status(500).json({ error: 'Server Config Error' });
  }

  const resend = new Resend(apiKey);
  const { toEmail, toName, clientName, packageName } = req.body;

  try {
    const data = await resend.emails.send({
      from: 'CPA Platform <onboarding@resend.dev>',
      to: [toEmail],
      subject: `New Client Assigned: ${clientName}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #006FBA;">New Assignment</h2>
          <p>Hello <strong>${toName}</strong>,</p>
          <p>You have been assigned a new client.</p>
          <p><strong>Client:</strong> ${clientName}</p>
          <p><strong>Package:</strong> ${packageName}</p>
          <br />
          <a href="https://cpa-canada.vercel.app/dashboard">Login to Dashboard</a>
        </div>
      `,
    });

    if (data.error) throw new Error(data.error.message);
    return res.status(200).json(data);

  } catch (error) {
    console.error("Resend Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
