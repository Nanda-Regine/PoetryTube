import { NextRequest, NextResponse } from 'next/server'

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  sw: 'Swahili',
  zu: 'isiZulu',
  yo: 'Yorùbá',
  am: 'Amharic (አማርኛ)',
  fr: 'French',
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)

  if (!body || !body.systemPrompt || !body.userContent) {
    return NextResponse.json({ error: 'systemPrompt and userContent are required' }, { status: 400 })
  }

  const { systemPrompt, userContent, language } = body as {
    systemPrompt: string
    userContent: string
    language?: string
  }

  const langName = language && language !== 'en' ? LANGUAGE_NAMES[language] : null
  const finalSystemPrompt = langName
    ? `${systemPrompt}\n\nIMPORTANT: Respond entirely in ${langName}. The user writes in ${langName}.`
    : systemPrompt

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'OPENAI_API_KEY not configured on server' }, { status: 500 })
  }

  try {
    const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:  `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model:       'gpt-4o-mini',
        messages: [
          { role: 'system', content: finalSystemPrompt },
          { role: 'user',   content: userContent },
        ],
        max_tokens:  400,
        temperature: 0.85,
      }),
    })

    if (!upstream.ok) {
      const err = await upstream.json().catch(() => ({}))
      return NextResponse.json(
        { error: (err as { error?: { message?: string } }).error?.message ?? `OpenAI error ${upstream.status}` },
        { status: upstream.status },
      )
    }

    const data = await upstream.json() as { choices: Array<{ message: { content: string } }> }
    const text = data.choices[0].message.content.trim()
    return NextResponse.json({ text })

  } catch (err) {
    return NextResponse.json({ error: (err as Error).message ?? 'Internal server error' }, { status: 500 })
  }
}
