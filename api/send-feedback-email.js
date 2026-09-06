export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    // Log feedback (in production, send email)
    console.log('Feedback received:', { userId, message });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed' });
  }
}
