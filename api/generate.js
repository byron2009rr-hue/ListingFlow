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
      return res.status(500).json({ error: 'Groq API key not configured' });
    }

    let systemPrompt = 'You are an expert real estate marketing copywriter. Create compelling, engaging content that sells properties.';
    let userPrompt = '';

    if (language === 'spanish') {
      systemPrompt = 'Eres un experto en marketing inmobiliario. Crea contenido atractivo y convincente que venda propiedades.';
    }

    switch (type) {
      case 'mls':
        userPrompt = `Create a compelling, SEO-optimized MLS listing description for:\n\n${content}\n\nMake it engaging, highlight key features, and follow MLS best practices.`;
        break;
      case 'social':
        userPrompt = `Create 3 engaging social media captions (Instagram/Facebook) for:\n\n${content}\n\nMake them catchy, include relevant hashtags, and encourage engagement.`;
        break;
      case 'flyer':
        userPrompt = `Create marketing copy for a property flyer based on:\n\n${content}\n\nInclude headlines, bullet points, and a call-to-action. Format for easy reading.`;
        break;
      default:
        return res.status(400).json({ error: 'Invalid content type' });
    }

    // Call Groq API
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!groqResponse.ok) {
      const error = await groqResponse.text();
      console.error('Groq API error:', error);
      return res.status(500).json({ error: 'Generation failed' });
    }

    const groqData = await groqResponse.json();
    const generatedContent = groqData.choices[0].message.content;

    return res.status(200).json({
      success: true,
      content: generatedContent,
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Generation failed: ' + error.message });
  }
}
