import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  try {
    const { address, bedrooms, bathrooms, squareFeet, price, features, type, language } = req.body;
    let prompt = '';
    const info = `Address: ${address}, Beds: ${bedrooms}, Baths: ${bathrooms}, SqFt: ${squareFeet}, Price: ${price}, Features: ${features}`;
    
    if (type === 'mls') prompt = `Write a professional MLS description for: ${info}. ${language === 'es' ? 'Respond in Spanish.' : ''}`;
    else if (type === 'social') prompt = `Write 3 social media captions for: ${info}. ${language === 'es' ? 'Respond in Spanish.' : ''}`;
    else if (type === 'flyer') prompt = `Generate HTML for an open house flyer for: ${info}. Return only valid HTML. ${language === 'es' ? 'Use Spanish.' : ''}`;
    
    const message = await groq.messages.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });
    
    const content = message.content[0].text || '';
    if (type === 'mls') return res.status(200).json({ description: content });
    else if (type === 'social') return res.status(200).json({ socialCaption: content });
    else if (type === 'flyer') return res.status(200).json({ flyerText: content });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Generation failed' });
  }
}
