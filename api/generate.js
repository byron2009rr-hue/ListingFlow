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

    let systemPrompt = 'You are an expert real estate marketing copywriter.';
    let userPrompt = '';

    if (language === 'spanish') {
      systemPrompt = 'Eres un experto en marketing inmobiliario.';
    }

    switch (type) {
      case 'mls':
        userPrompt = `Create an MLS listing description:\n${content}`;
        break;
      case 'social':
        userPrompt = `Create 3 social media captions:\n${content}`;
        break;
      case 'flyer':
        userPrompt = `Create property flyer copy:\n${content}`;
        break;
      default:
        return res.status(400).json({ error: 'Invalid type' });
    }

    console.log('Calling Groq with:', { systemPrompt, userPrompt });

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

    const responseText = await groqResponse.text();
    console.log('Groq response status:', groqResponse.status);
    console.log('Groq response:', responseText);

    if (!groqResponse.ok) {
      return res.status(500).json({ error: `Groq error: ${responseText}` });
    }

    const groqData = JSON.parse(responseText);
    const generatedContent = groqData.choices[0].message.content;

    return res.status(200).json({
      success: true,
      content: generatedContent,
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
