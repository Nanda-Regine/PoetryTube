import type { Metadata } from 'next'
import MoodFilter from '@/components/MoodFilter'
import VideoCard  from '@/components/VideoCard'

export const metadata: Metadata = {
  title: 'PoetryTube — Where African Voices Live Forever',
  description: "Discover Africa's finest spoken word, slam poetry, and performance art. Stream, share and celebrate African voices.",
}

const FEATURED = [
  { title: 'Roots & Rebellion',     author: 'Amara K.',     views: '12K views',  duration: '4:32',  moods: ['defiant', 'identity'],         thumb: 'thumb-1' },
  { title: 'Letters to Lagos',       author: 'Kofi Mensah',  views: '8.4K views', duration: '6:14',  moods: ['grief', 'love'],               thumb: 'thumb-2' },
  { title: 'When Mama Danced',       author: 'Nandi Cele',   views: '21K views',  duration: '5:47',  moods: ['tender', 'love'],              thumb: 'thumb-3' },
  { title: 'The Weight of Wings',    author: 'Sipho Dlamini',views: '5.1K views', duration: '3:58',  moods: ['hope', 'identity'],            thumb: 'thumb-4' },
  { title: 'Ubuntu Sessions Ep 4',   author: 'Fatima Said',  views: '33K views',  duration: '18:22', moods: ['joy', 'identity'],             thumb: 'thumb-5' },
  { title: 'Daughters of the Soil',  author: 'Aisha Bangura',views: '9.8K views', duration: '7:03',  moods: ['resistance', 'defiant'],       thumb: 'thumb-6' },
]

const SPOKEN_WORD = [
  { title: 'Blood and Bougainvillea',author: 'Zara Ndlovu',  views: '4.2K views', duration: '5:19',  moods: ['love', 'grief'],               thumb: 'thumb-7' },
  { title: 'She Spoke Mountains',    author: 'Lerato P.',    views: '7.7K views', duration: '4:44',  moods: ['tender', 'identity'],          thumb: 'thumb-8' },
  { title: 'The Griots Remember',    author: 'Kwame A.',     views: '15K views',  duration: '8:37',  moods: ['resistance', 'identity'],      thumb: 'thumb-9' },
]

export default function HomePage() {
  return (
    <>
      <MoodFilter />

      <section className="video-section" data-moods="defiant,love,grief,joy,resistance,identity,tender,hope">
        <h2 className="section-title">✦ Featured</h2>
        <div className="video-grid">
          {FEATURED.map(v => (
            <VideoCard key={v.title} title={v.title} author={v.author} views={v.views} duration={v.duration} moods={v.moods} thumbClass={v.thumb} />
          ))}
        </div>
      </section>

      <section className="video-section" data-moods="love,tender,grief,identity,resistance">
        <h2 className="section-title">🎤 Spoken Word</h2>
        <div className="video-grid">
          {SPOKEN_WORD.map(v => (
            <VideoCard key={v.title} title={v.title} author={v.author} views={v.views} duration={v.duration} moods={v.moods} thumbClass={v.thumb} />
          ))}
        </div>
      </section>
    </>
  )
}
