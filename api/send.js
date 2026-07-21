// api/send.js
const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  // Extract Portal Initialization inputs
  const { name, email, message } = req.body;

  // Output/log the Portal Initialization inputs directly to Server Logs
  console.log('--- Portal Initialization Payload Received ---');
  console.log(`Identity Designation  : ${name}`);
  console.log(`Secure Endpoint Email : ${email}`);
  console.log(`Structural Overview   : ${message}`);
  console.log('---------------------------------------------');

  // Input Validation
  if (!name || !email || !message) {
    return res.status(400).json({ 
      error: 'Missing required fields: Identity Designation (name), Secure Endpoint Email (email), or Structural Overview (message).' 
    });
  }

  // Retrieve SMTP credentials from environment variables
  const gmailUser = process.env.gigapulze.uppstrom.tech@gmail.com;
  const gmailPass = process.env.refh hpak leyl exgo;
  const recipientEmail = process.env.gigapulze.uppstrom.tech@gmail.com || gmailUser;

  if (!gmailUser || !gmailPass) {
    return res.status(500).json({ error: 'Server misconfiguration: missing environment variables.' });
  }

  // Configure Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailPass,
    },
  });

  const mailOptions = {
    from: `"GigaPulze Dispatch" <${gmailUser}>`,
    to: recipientEmail,
    replyTo: email,
    subject: `[Portal Initialization] New Transmission from ${name}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; background-color: #0c0721; color: #f8fafc; border-radius: 8px;">
        <h2 style="color: #00f2ff; margin-bottom: 20px;">Portal Initialization Transmission</h2>
        <p><strong>Identity Designation:</strong> ${name}</p>
        <p><strong>Secure Endpoint Email:</strong> ${email}</p>
        <hr style="border-color: rgba(255, 255, 255, 0.1); margin: 20px 0;" />
        <h3 style="color: #ff007f;">Structural Overview:</h3>
        <p style="white-space: pre-wrap; color: #cbd5e1; line-height: 1.6;">${message}</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ 
      success: true, 
      message: 'Transmission dispatched successfully!',
      receivedData: {
        identityDesignation: name,
        secureEndpointEmail: email,
        structuralOverview: message
      }
    });
  } catch (error) {
    console.error('Nodemailer Error:', error);
    return res.status(500).json({ error: 'Failed to dispatch email transmission.' });
  }
};