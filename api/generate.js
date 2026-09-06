import { createClient } from '@supabase/supabase-js';
import Groq from 'groq-sdk';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

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

    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('tier, generation_count, generation_limit')
      .eq('user_id', userId)
      .single();

    if (!userProfile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    if (userProfile.tier === 'free' && userProfile.generation_count >= 5) {
      return res.status(429).json({ error: 'Free tier limit reached' });
    }

    let systemPrompt = 'You are an expert real estate marketing copywriter.';
    let userPrompt = '';

    if (language === 'spanish') {
      systemPrompt += ' Responde siempre en español.';
    }

    switch (type) {
      case 'mls':
        userPrompt = `Create a compelling MLS listing description:\n${content}`;
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

    const message = await groq.messages.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1024,
      messages: [{ role: 'user', content: userPrompt }],
      system: systemPrompt,
    });

    const generatedContent = message.content[0].text;

    await supabase.from('generations').insert([
      {
        user_id: userId,
        type,
        language,
        input: content,
        output: generatedContent,
      },
    ]);

    const newCount = userProfile.generation_count + 1;
    await supabase
      .from('user_profiles')
      .update({ generation_count: newCount })
      .eq('user_id', userId);

    return res.status(200).json({
      success: true,
      content: generatedContent,
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Generation failed' });
  }
}
