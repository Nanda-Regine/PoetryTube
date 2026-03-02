import type { Language } from './language'

export async function callOpenAI(
  systemPrompt: string,
  userContent: string,
  language?: Language | null,
): Promise<string> {
  const body: Record<string, string> = { systemPrompt, userContent }
  if (language && language !== 'en') body.language = language

  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error((err as { error?: string }).error ?? `API error ${response.status}`)
  }

  const data = await response.json() as { text: string }
  return data.text
}
