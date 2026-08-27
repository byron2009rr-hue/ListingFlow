import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'supportlistingflow@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  try {
    const { from, type, message } = req.body;
    const mailOptions = {
      from: 'supportlistingflow@gmail.com',
      to: 'supportlistingflow@gmail.com',
      subject: `ListingFlow Feedback: ${type}`,
      html: `<h2>Feedback</h2><p><strong>From:</strong> ${from}</p><p><strong>Type:</strong> ${type}</p><p>${message}</p>`,
    };
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return res.status(200).json({ success: true });
  }
}
