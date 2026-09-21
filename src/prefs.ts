export type Theme = 'dark' | 'light'

export type Prefs = {
  theme: Theme
  fontScale: number
}

const KEY = 'mind-prefs-v1'
export const FONT_STEPS = [0.85, 1, 1.15, 1.3, 1.5] as const

const DEFAULT_PREFS: Prefs = {
  theme: 'dark',
  fontScale: 1,
}

export function loadPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return DEFAULT_PREFS
    const parsed = JSON.parse(raw) as Partial<Prefs>
    const fontScale = (FONT_STEPS as readonly number[]).includes(parsed.fontScale ?? -1)
      ? (parsed.fontScale as number)
      : 1
    return {
      theme: parsed.theme === 'light' ? 'light' : 'dark',
      fontScale,
    }
  } catch {
    return DEFAULT_PREFS
  }
}

export function savePrefs(prefs: Prefs) {
  localStorage.setItem(KEY, JSON.stringify(prefs))
}

export function applyPrefs(prefs: Prefs) {
  document.documentElement.dataset.theme = prefs.theme
  document.documentElement.style.setProperty('--font-scale', String(prefs.fontScale))
}

export function nextFontScale(current: number, direction: 'up' | 'down') {
  const index = FONT_STEPS.indexOf(current as (typeof FONT_STEPS)[number])
  const from = index === -1 ? 1 : index
  const next = direction === 'up' ? from + 1 : from - 1
  return FONT_STEPS[Math.min(FONT_STEPS.length - 1, Math.max(0, next))]
}
