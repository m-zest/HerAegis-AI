export interface Area {
  id: number
  name: string
  district: string
  lat: number
  lng: number
  risk: number
  total: number
  month: number
  peak: string
  trend: string
  crimes: Record<string, number>
  times: number[]
}

export interface SafeSpot {
  name: string
  type: 'metro' | 'police' | 'hospital' | 'fire_station'
  lat: number
  lng: number
  phone?: string
}

export interface EmergencyContact {
  name: string
  phone: string
  description: string
  category: string
}

export type TimeFilter = 'all' | 'night' | 'evening' | 'day' | 'early_morning'
export type CrimeCategory = 'all' | 'harassment' | 'assault' | 'stalking' | 'robbery' | 'kidnapping' | 'domestic_violence'
