import { Resend } from 'resend';

export default async function handler(req, res) {
  // 1. CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // 2. Auth Check
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Configuration Error', details: 'RESEND_API_KEY missing' });
  }

  const resend = new Resend(apiKey);
  const { toEmail, toName, clientName, packageName } = req.body;

  try {
    const data = await resend.emails.send({
      from: 'CPA Platform <onboarding@resend.dev>',
      to: [toEmail],
      subject: `New Client Assigned: ${clientName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e0e0e0;">
            
            <!-- Header -->
            <tr>
              <td style="background-color: #006FBA; padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px; font-weight: 700;">CPA CONNECT</h1>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding: 40px 30px;">
                <h2 style="color: #1a202c; margin-top: 0; font-size: 20px;">New Client Assignment</h2>
                <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">Hello <strong>${toName}</strong>,</p>
                <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">You have been matched with a new business client. Please review the details below and initiate contact via the dashboard.</p>
                
                <!-- Info Box -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; margin: 25px 0;">
                  <tr>
                    <td style="padding: 20px;">
                      <p style="margin: 0 0 10px 0; color: #006FBA; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Assignment Details</p>
                      <p style="margin: 5px 0; color: #2d3748; font-size: 16px;"><strong>Client:</strong> ${clientName}</p>
                      <p style="margin: 5px 0; color: #2d3748; font-size: 16px;"><strong>Package:</strong> ${packageName}</p>
                      <p style="margin: 5px 0; color: #2d3748; font-size: 16px;"><strong>Status:</strong> <span style="color: #009A49; font-weight: bold;">Active & Paid</span></p>
                    </td>
                  </tr>
                </table>

                <!-- CTA Button -->
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="padding: 10px 0 30px 0;">
                      <a href="https://cpa-canada.vercel.app/dashboard" style="background-color: #009A49; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 2px 4px rgba(0,154,73,0.3);">
                        Open Workspace
                      </a>
                    </td>
                  </tr>
                </table>
                
                <p style="color: #718096; font-size: 14px; text-align: center;">
                  Need help? Contact <a href="#" style="color: #006FBA; text-decoration: none;">admin support</a>.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #edf2f7;">
                <p style="color: #a0aec0; font-size: 12px; margin: 0;">&copy; 2025 CPA Canada Platform. Secure & Encrypted.</p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (data.error) throw new Error(data.error.message);
    return res.status(200).json(data);

  } catch (error) {
    console.error("Resend API Error:", error.message);
    return res.status(400).json({ error: 'Email Failed', details: error.message });
  }
}
