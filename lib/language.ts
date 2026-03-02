export type Language = 'en' | 'sw' | 'zu' | 'yo' | 'am' | 'fr'

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: 'English',
  sw: 'Swahili',
  zu: 'isiZulu',
  yo: 'Yorùbá',
  am: 'አማርኛ',
  fr: 'Français',
}

export const LANGUAGES: Array<{ code: Language; label: string; flag: string }> = [
  { code: 'en', label: 'English',  flag: '🌐' },
  { code: 'sw', label: 'Swahili',  flag: '🇰🇪' },
  { code: 'zu', label: 'isiZulu',  flag: '🇿🇦' },
  { code: 'yo', label: 'Yorùbá',   flag: '🇳🇬' },
  { code: 'am', label: 'አማርኛ',    flag: '🇪🇹' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
]

export const MOOD_COLORS: Record<string, string> = {
  defiant:    '#E85D26',
  tender:     '#C77AC2',
  grief:      '#5B8FD4',
  joy:        '#E8C84A',
  resistance: '#4CAF72',
  love:       '#D4506A',
  identity:   '#6DB8A0',
  hope:       '#8BC34A',
}
