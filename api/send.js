const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  // Set JSON content header explicitly
  res.setHeader('Content-Type', 'application/json');

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }

    const { name, email, message } = req.body || {};

    // Validate incoming data
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields: Identity Designation (name), Secure Endpoint Email (email), or Structural Overview (message).' 
      });
    }

    // Explicitly assigned credentials (fallback to environment variables if provided)
    const gmailUser = process.env.GMAIL_USER || 'gigapulze.uppstrom.tech@gmail.com';
    // Spaces stripped from app password for reliable SMTP authentication
    const gmailPass = (process.env.GMAIL_APP_PASSWORD || 'refhhpakleylexgo').replace(/\s+/g, '');
    const recipientEmail = process.env.TO_EMAIL || 'gigapulze.uppstrom.tech@gmail.com';

    // Configure Transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    // Send Mail
    await transporter.sendMail({
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
    });

    return res.status(200).json({ 
      success: true, 
      message: 'Transmission dispatched successfully!' 
    });

  } catch (error) {
    console.error('Unhandled Serverless Error:', error);
    return res.status(500).json({ 
      error: error.message || 'Internal Server Error during execution.' 
    });
  }
};
