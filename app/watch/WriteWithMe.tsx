'use client'

import { useRef, useState } from 'react'
import { callOpenAI } from '@/lib/ai'
import { LANGUAGES, type Language } from '@/lib/language'

const SYSTEM_PROMPT = `You are a poet who writes in the African spoken word tradition. Complete the following poem opening in 4-6 lines that honor the emotional tone and imagery the writer has begun. Write only the poem continuation — no explanation, no preamble. Make it powerful.`

export default function WriteWithMe() {
  const [lang, setLang]       = useState<Language>('en')
  const [result, setResult]   = useState('')
  const [loading, setLoading] = useState(false)
  const [open, setOpen]       = useState(false)
  const [copied, setCopied]   = useState(false)
  const textareaRef           = useRef<HTMLTextAreaElement>(null)

  async function complete() {
    const poem = textareaRef.current?.value.trim() ?? ''
    if (!poem) {
      if (textareaRef.current) {
        textareaRef.current.style.borderColor = 'var(--burgundy-light)'
        setTimeout(() => { if (textareaRef.current) textareaRef.current.style.borderColor = '' }, 1500)
      }
      return
    }
    setLoading(true)
    setResult('')
    try {
      const text = await callOpenAI(SYSTEM_PROMPT, poem, lang)
      setResult(text)
    } catch (e) {
      setResult(`⚠️ ${(e as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  async function copy() {
    const poem = textareaRef.current?.value.trim() ?? ''
    await navigator.clipboard.writeText(poem + '\n\n' + result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function shareWhatsApp() {
    const poem = textareaRef.current?.value.trim() ?? ''
    const full = `${poem}\n\n${result}\n\n✍️ Written with PoetryTube AI — Where African Voices Live Forever`
    window.open(`https://wa.me/?text=${encodeURIComponent(full)}`, '_blank')
  }

  return (
    <>
      {/* Mobile trigger */}
      <button className="mobile-panel-trigger" aria-label="Open Write With Me" onClick={() => setOpen(o => !o)}>✍️</button>

      <div className={`write-with-me-panel${open ? ' panel-open' : ''}`}>
        <div className="panel-drag-handle" />
        <div className="panel-header">
          <p className="panel-title">✍️ Write With Me</p>
          <p className="panel-subtitle">Co-create a poem with African AI</p>
        </div>

        <div className="panel-body">
          {/* Language selector */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }} id="lang-selector-watch">
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                className={`mood-filter-btn${lang === l.code ? ' active filter-all-btn' : ''}`}
                style={{ padding: '5px 10px', fontSize: '0.75rem' }}
                onClick={() => setLang(l.code)}
              >
                {l.flag} {l.label}
              </button>
            ))}
          </div>

          <div>
            <label className="panel-label">Start your poem…</label>
            <textarea
              ref={textareaRef}
              className="poem-textarea"
              id="poem-input"
              placeholder="I was born between two rivers,\nwhere the dust remembers my grandmother's name…"
              rows={5}
            />
          </div>

          <button className="complete-btn" id="complete-poem-btn" onClick={complete} disabled={loading}>
            {loading
              ? <><span className="loading-dots"><span/><span/><span/></span> Writing…</>
              : '🌹 Complete My Poem with AI'}
          </button>

          {result && (
            <div className="ai-output-box visible" id="ai-output-box">
              <div className="ai-output-label">AI continuation</div>
              <p className="ai-poem-text" id="ai-poem-text">{result}</p>
              <div className="ai-output-actions">
                <button className="output-action-btn copy-btn" id="copy-poem-btn" onClick={copy}>
                  <svg viewBox="0 0 24 24" width="14" height="14"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" fill="none" strokeWidth="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" fill="none" strokeWidth="2"/></svg>
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
                <button className="output-action-btn whatsapp-btn" id="whatsapp-share-btn" onClick={shareWhatsApp}>
                  📲 Share on WhatsApp
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
