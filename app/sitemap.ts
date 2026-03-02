import type { MetadataRoute } from 'next'

const BASE = 'https://poetrytube.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE,           lastModified: new Date(), changeFrequency: 'daily',   priority: 1 },
    { url: `${BASE}/watch`,   lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/books`,   lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/upload`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/profile`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]
}
