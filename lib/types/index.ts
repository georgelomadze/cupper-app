export type SessionType = 'open' | 'closed'
export type SessionStatus = 'active' | 'completed' | 'scheduled'
export type CoffeeSampleType = 'single_origin' | 'espresso'

export interface User {
  id: string
  name: string
  position: string | null
  company: string | null
  photo_url: string | null
  email: string
  created_at: string
}

export interface Session {
  id: string
  host_id: string
  name: string
  type: SessionType
  status: SessionStatus
  cup_count: number
  created_at: string
  completed_at: string | null
  // joined via query
  member_count?: number
  sample_count?: number
  host?: User
}

export interface SessionMember {
  id: string
  session_id: string
  user_id: string
  joined_at: string
  user?: User
}

export interface CoffeeSample {
  id: string
  owner_id: string
  type: CoffeeSampleType
  name: string
  country: string | null
  process: string | null
  roaster: string | null
  roast_date: string | null
  created_at: string
  // computed
  last_score?: number
  cupping_count?: number
}

export interface SessionSample {
  id: string
  session_id: string
  coffee_sample_id: string
  position: number
  blind_label: string | null
  created_at: string
  coffee_sample?: CoffeeSample
}

export interface Score {
  id: string
  session_sample_id: string
  user_id: string
  fragrance: number
  flavor: number
  aftertaste: number
  acidity: number
  body: number
  uniformity: number
  balance: number
  clean_cup: number
  sweetness: number
  overall: number
  final_score: number
  updated_at: string
  user?: User
}

export interface ScoreUpdate {
  fragrance?: number
  flavor?: number
  aftertaste?: number
  acidity?: number
  body?: number
  uniformity?: number
  balance?: number
  clean_cup?: number
  sweetness?: number
  overall?: number
}

export type ScoreCriterion = keyof ScoreUpdate

export interface DescriptorGroup {
  id: string
  name: string
  color: string
  position: number
  subgroups?: DescriptorSubgroup[]
}

export interface DescriptorSubgroup {
  id: string
  group_id: string
  name: string
  position: number
  descriptors?: Descriptor[]
}

export interface Descriptor {
  id: string
  subgroup_id: string
  name: string
  position: number
}

export interface SampleNote {
  id: string
  score_id: string
  descriptor_id: string | null
  custom_text: string | null
  created_at: string
  descriptor?: Descriptor
}

export interface Invite {
  id: string
  session_id: string
  email: string | null
  token: string
  used_at: string | null
  created_at: string
}

// SCA scoring
export const SCORE_MIN = 6.0
export const SCORE_MAX = 10.0
export const SCORE_STEP = 0.25

export const CRITERIA: { key: ScoreCriterion; label: string; shortLabel: string }[] = [
  { key: 'fragrance',  label: 'Fragrance / Aroma', shortLabel: 'Fragrance' },
  { key: 'flavor',     label: 'Flavor',             shortLabel: 'Flavor'    },
  { key: 'aftertaste', label: 'Aftertaste',         shortLabel: 'Aftertaste'},
  { key: 'acidity',    label: 'Acidity',            shortLabel: 'Acidity'   },
  { key: 'body',       label: 'Body',               shortLabel: 'Body'      },
  { key: 'uniformity', label: 'Uniformity',         shortLabel: 'Uniformity'},
  { key: 'balance',    label: 'Balance',            shortLabel: 'Balance'   },
  { key: 'clean_cup',  label: 'Clean Cup',          shortLabel: 'Clean Cup' },
  { key: 'sweetness',  label: 'Sweetness',          shortLabel: 'Sweetness' },
  { key: 'overall',    label: 'Overall',            shortLabel: 'Overall'   },
]
