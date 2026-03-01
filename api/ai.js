// api/ai.js — PoetryTube AI proxy (Vercel Serverless Function)
// Keeps OPENAI_API_KEY server-side. Never exposes it to the browser.

const LANGUAGE_NAMES = {
  en: 'English',
  sw: 'Swahili',
  zu: 'isiZulu',
  yo: 'Yorùbá',
  am: 'Amharic (አማርኛ)',
  fr: 'French',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { systemPrompt, userContent, language } = req.body;

  if (!systemPrompt || !userContent) {
    return res.status(400).json({ error: 'systemPrompt and userContent are required' });
  }

  // Append language instruction if not English
  const langName = language && language !== 'en' ? LANGUAGE_NAMES[language] : null;
  const finalSystemPrompt = langName
    ? `${systemPrompt}\n\nIMPORTANT: Respond entirely in ${langName}. The user writes in ${langName}.`
    : systemPrompt;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OPENAI_API_KEY not configured on server' });
  }

  try {
    const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: finalSystemPrompt },
          { role: 'user',   content: userContent },
        ],
        max_tokens: 400,
        temperature: 0.85,
      }),
    });

    if (!upstream.ok) {
      const err = await upstream.json().catch(() => ({}));
      return res.status(upstream.status).json({ error: err?.error?.message || `OpenAI error ${upstream.status}` });
    }

    const data = await upstream.json();
    const text = data.choices[0].message.content.trim();

    return res.status(200).json({ text });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
