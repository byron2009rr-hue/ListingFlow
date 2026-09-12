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
    const { type, content, language, userId } = req.body;

    if (!type || !content || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
      return res.status(500).json({ error: 'Groq API key not set' });
    }

    // Use Groq REST API directly
    let systemPrompt = 'You are an expert real estate marketing copywriter. Create compelling, engaging content.';
    let userPrompt = '';

    if (language === 'spanish') {
      systemPrompt = 'Eres un experto en marketing inmobiliario. Crea contenido atractivo y convincente.';
    }

    switch (type) {
      case 'mls':
        userPrompt = `Write a compelling MLS listing description for this property:\n\n${content}\n\nMake it engaging, highlight unique features, use power words, and optimize for search.`;
        break;
      case 'social':
        userPrompt = `Write 3 engaging social media captions for this property listing:\n\n${content}\n\nInclude emojis, hashtags, and calls to action for Instagram/Facebook.`;
        break;
      case 'flyer':
        userPrompt = `Write compelling marketing copy for a property flyer:\n\n${content}\n\nInclude attention-grabbing headline, bullet points of features, and strong call-to-action.`;
        break;
      default:
        return res.status(400).json({ error: 'Invalid type' });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API error:', errorData);
      return res.status(500).json({ error: `Groq error: ${errorData.error?.message || 'Unknown'}` });
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    return res.status(200).json({
      success: true,
      content: generatedContent,
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
