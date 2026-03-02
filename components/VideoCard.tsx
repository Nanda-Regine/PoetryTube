import Link from 'next/link'

export interface VideoCardProps {
  title: string
  author: string
  views: string
  duration: string
  moods: string[]
  thumbClass: string
  href?: string
}

export default function VideoCard({
  title,
  author,
  views,
  duration,
  moods,
  thumbClass,
  href = '/watch',
}: VideoCardProps) {
  const moodStr = moods.join(',')

  return (
    <Link href={href} className="video-card" data-moods={moodStr}>
      <div className="video-thumbnail">
        <div className={`thumbnail-gradient ${thumbClass}`}>
          <span className="thumb-title">{title}</span>
        </div>
        <span className="video-duration">{duration}</span>
        <div className="play-overlay">
          <div className="play-icon">
            <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </div>
        </div>
      </div>
      <div className="video-info">
        <h3 className="video-title">{title}</h3>
        <div className="video-meta">
          <span className="video-author">{author}</span>
          <span className="video-views">{views}</span>
        </div>
        <div className="mood-pills">
          {moods.map(mood => (
            <span key={mood} className="mood-pill" data-mood={mood.toLowerCase()}>
              {getMoodLabel(mood)}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}

function getMoodLabel(mood: string) {
  const map: Record<string, string> = {
    defiant: 'Defiant 🔥', tender: 'Tender 🌸', grief: 'Grief 💙',
    joy: 'Joy ✨', resistance: 'Resistance ✊', love: 'Love 🌹',
    identity: 'Identity 🌍', hope: 'Hope 🌱',
  }
  return map[mood.toLowerCase()] ?? mood
}
