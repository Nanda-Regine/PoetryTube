'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase-client'
import type { User } from '@supabase/supabase-js'

interface Book {
  id: string
  title: string
  author_name: string
  file_url: string | null
  cover_url: string | null
  language: string
  genre: string | null
  download_count: number
}

const GENRES   = ['all', 'poetry', 'chapbook', 'novel', 'short-stories', 'essay']
const LANG_MAP: Record<string, string> = { en: 'EN', sw: 'SW', zu: 'ZU', yo: 'YO', am: 'AM', fr: 'FR' }

const SKELETONS = Array.from({ length: 8 })

export default function BooksClient() {
  const [books, setBooks]     = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser]       = useState<User | null>(null)
  const [langFilter, setLangFilter]   = useState('all')
  const [genreFilter, setGenreFilter] = useState('all')
  const [modalOpen, setModalOpen]     = useState(false)
  const supabase = getSupabaseBrowser()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    loadBooks()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadBooks() {
    setLoading(true)
    const { data } = await supabase.from('books').select('*').order('created_at', { ascending: false })
    setBooks((data as Book[]) ?? [])
    setLoading(false)
  }

  const filtered = books.filter(b => {
    const langOk  = langFilter  === 'all' || b.language === langFilter
    const genreOk = genreFilter === 'all' || b.genre    === genreFilter
    return langOk && genreOk
  })

  return (
    <>
      {/* Hero */}
      <div className="books-hero">
        <div>
          <h1 className="books-hero-title">📚 Book Shelf</h1>
          <p className="books-hero-subtitle">
            Discover poetry collections, chapbooks, and literary works from African voices across the continent.
          </p>
        </div>
        {user && (
          <button className="upload-book-btn" onClick={() => setModalOpen(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Share a Book
          </button>
        )}
      </div>

      {/* Filter bar */}
      <div className="books-filter-bar">
        <div className="books-filter-group">
          <span className="filter-group-label">Genre</span>
          {GENRES.map(g => (
            <button
              key={g}
              className={`books-filter-btn${genreFilter === g ? ' active' : ''}`}
              onClick={() => setGenreFilter(g)}
            >
              {g.charAt(0).toUpperCase() + g.slice(1)}
            </button>
          ))}
        </div>
        <div className="books-filter-group">
          <span className="filter-group-label">Language</span>
          {['all', 'en', 'sw', 'zu', 'yo', 'am', 'fr'].map(l => (
            <button
              key={l}
              className={`books-filter-btn${langFilter === l ? ' active' : ''}`}
              onClick={() => setLangFilter(l)}
            >
              {l === 'all' ? 'All' : LANG_MAP[l] ?? l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="books-grid" id="books-grid">
        {loading
          ? SKELETONS.map((_, i) => <div key={i} className="book-card book-skeleton" />)
          : filtered.length === 0
            ? null
            : filtered.map((book, idx) => (
                <div key={book.id} className="book-card" style={{ animationDelay: `${idx * 0.04}s` }}>
                  <div className="book-cover">
                    {book.cover_url
                      ? <Image src={book.cover_url} alt={book.title} fill style={{ objectFit: 'cover' }} sizes="180px" />
                      : '📖'}
                    <span className="book-lang-badge">
                      {LANG_MAP[book.language] ?? book.language?.toUpperCase()}
                    </span>
                  </div>
                  <div className="book-info">
                    <p className="book-title">{book.title}</p>
                    <p className="book-author">{book.author_name}</p>
                    {book.genre && <span className="book-genre-tag">{book.genre}</span>}
                    {book.file_url && (
                      <a className="book-download-btn" href={book.file_url} target="_blank" rel="noopener noreferrer" download>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        Download · {book.download_count ?? 0}
                      </a>
                    )}
                  </div>
                </div>
              ))}
      </div>

      {!loading && filtered.length === 0 && (
        <div className="books-empty" id="books-empty-msg">
          <div className="books-empty-icon">📖</div>
          <p>No books match your filters yet.</p>
          {user && <button className="books-empty-cta" onClick={() => setModalOpen(true)}>Be the first to share one</button>}
        </div>
      )}

      {/* Upload book modal (basic) */}
      {modalOpen && (
        <div className="upload-book-modal open">
          <div className="upload-book-backdrop" onClick={() => setModalOpen(false)} />
          <div className="upload-book-card">
            <button className="auth-close" onClick={() => setModalOpen(false)}>&times;</button>
            <h2 className="edit-modal-title">Share a Book</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 20, fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
              Upload a poetry collection, chapbook, or any literary work.
            </p>
            <div className="form-group">
              <label className="edit-label">Book Title</label>
              <input type="text" className="form-input" placeholder="Title of the book…" />
            </div>
            <div className="form-group">
              <label className="edit-label">Author Name</label>
              <input type="text" className="form-input" placeholder="Author or poet name…" />
            </div>
            <div className="upload-book-row">
              <div className="upload-book-half">
                <label className="edit-label">Genre</label>
                <select className="form-input" style={{ cursor: 'pointer' }}>
                  <option value="">Select…</option>
                  {GENRES.filter(g => g !== 'all').map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="upload-book-half">
                <label className="edit-label">Language</label>
                <select className="form-input" style={{ cursor: 'pointer' }}>
                  <option value="en">English</option>
                  <option value="sw">Swahili</option>
                  <option value="zu">isiZulu</option>
                  <option value="yo">Yorùbá</option>
                  <option value="am">Amharic</option>
                  <option value="fr">Français</option>
                </select>
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <button className="submit-btn" onClick={() => { alert('Book upload — connect Supabase storage to activate.'); setModalOpen(false) }}>
                Share Book 📚
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
