export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { type, content, language, userId } = req.body;

    if (!type || !content || !userId) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    // For now, just return a placeholder response
    const responses = {
      mls: `Stunning property located at the heart of prime real estate. This beautiful home features modern amenities and exceptional craftsmanship throughout. Don't miss this opportunity!`,
      social: `Just listed! 🏡 Beautiful property in the area. Check it out! 📍 #RealEstate #PropertyListing #DreamHome`,
      flyer: `BEAUTIFUL NEW LISTING\n\nThis exceptional property offers everything you're looking for. Located in a desirable neighborhood with excellent schools and amenities nearby.\n\nCall today for a showing!`
    };

    return res.status(200).json({
      success: true,
      content: responses[type] || 'Content generated successfully'
    });
  } catch (error) {
    return res.status(500).json({ error: 'Generation failed' });
  }
}
