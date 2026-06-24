import type { Score, ScoreUpdate } from '@/lib/types'

/** SCA cupping score formula */
export function calcFinalScore(s: Partial<Score>): number {
  const {
    fragrance  = 6,
    flavor     = 6,
    aftertaste = 6,
    acidity    = 6,
    body       = 6,
    uniformity = 10,
    balance    = 6,
    clean_cup  = 10,
    sweetness  = 10,
    overall    = 6,
  } = s

  // SCA: sum of all criteria minus 36 (baseline offset)
  const raw =
    fragrance + flavor + aftertaste + acidity + body +
    uniformity + balance + clean_cup + sweetness + overall - 36

  return Math.round(raw * 100) / 100
}

/** Default scores for a new cupping record */
export function defaultScores(cupCount: number): ScoreUpdate {
  const isMultiCup = cupCount > 1
  return {
    fragrance:  6.00,
    flavor:     6.00,
    aftertaste: 6.00,
    acidity:    6.00,
    body:       6.00,
    uniformity: isMultiCup ? 6.00 : 10.00,
    balance:    6.00,
    clean_cup:  isMultiCup ? 6.00 : 10.00,
    sweetness:  10.00,
    overall:    6.00,
  }
}

/** Round to nearest 0.25 step */
export function roundToStep(value: number, step = 0.25): number {
  return Math.round(value / step) * step
}

/** Score quality label */
export function scoreLabel(score: number): string {
  if (score >= 90) return 'Outstanding'
  if (score >= 85) return 'Excellent'
  if (score >= 80) return 'Very Good'
  if (score >= 75) return 'Very Good'
  if (score >= 70) return 'Good'
  return 'Below Standard'
}

export function scoreColor(score: number): string {
  if (score >= 90) return '#30D158'  // green
  if (score >= 85) return '#C8A96E'  // gold
  if (score >= 80) return '#C8A96E'  // gold
  return 'rgba(255,255,255,0.6)'
}
