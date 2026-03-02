import type { Metadata } from 'next'
import WriteWithMe from './WriteWithMe'

export const metadata: Metadata = {
  title: 'Roots & Rebellion — Watch',
  description: 'Watch Roots & Rebellion by Amara K. on PoetryTube — Where African Voices Live Forever',
  openGraph: {
    title: 'Roots & Rebellion | PoetryTube',
    description: 'Watch spoken word performance by Amara K.',
    type: 'video.other',
  },
}

export default function WatchPage() {
  return (
    <div className="watch-layout">
      {/* ── Left: video player + info ── */}
      <div>
        <div className="player-container">
          <div className="player-bg thumb-1">
            <button className="player-play-btn" aria-label="Play">
              <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </button>
          </div>
        </div>

        <div className="video-player-info">
          <h1 className="player-title">Roots &amp; Rebellion</h1>

          <div className="player-meta-row">
            <div className="player-author-info">
              <div className="author-avatar">AK</div>
              <div>
                <p className="author-name">Amara K.</p>
                <p className="author-subs">2.4K followers</p>
              </div>
              <button className="follow-btn">Follow</button>
            </div>
            <p className="player-stats">12,483 views · March 2025</p>
          </div>

          <div className="player-actions">
            <button className="action-btn" id="like-btn">
              <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              <span className="like-count" data-base="847">847</span>
            </button>
            <button className="action-btn">
              <svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              Share
            </button>
            <button className="action-btn">
              <svg viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              Save
            </button>
          </div>

          <div className="video-description" style={{ marginTop: 16 }}>
            <p className="desc-title">About this poem</p>
            <p>A defiant exploration of heritage and resistance. Amara K. weaves personal memory with collective struggle in this landmark spoken word piece that has resonated with audiences across the continent.</p>
          </div>
        </div>
      </div>

      {/* ── Right: Write With Me AI panel ── */}
      <WriteWithMe />
    </div>
  )
}
