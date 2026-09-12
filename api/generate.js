export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, content } = req.body;

    if (!type || !content) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    // Just return placeholder for now
    return res.status(200).json({
      success: true,
      content: `Generated ${type} content for: ${content.substring(0, 50)}...`
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
