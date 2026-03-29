export interface RiotZone {
  id: number
  name: string
  lat: number
  lng: number
  radius: number
  type: 'PROTEST' | 'POLITICAL_TENSION' | 'COMMUNAL' | 'LABOR_UNREST'
  severity: 'low' | 'medium' | 'high'
  description: string
  lastUpdated: string
}

export const riotZones: RiotZone[] = [
  { id: 1, name: "Shaheen Bagh Area", lat: 28.5433, lng: 77.2867, radius: 800, type: "PROTEST", severity: "high", description: "Ongoing sit-in protest against citizenship amendment. Heavy police presence.", lastUpdated: "2h ago" },
  { id: 2, name: "Jantar Mantar", lat: 28.6271, lng: 77.2167, radius: 500, type: "PROTEST", severity: "medium", description: "Regular protest site. Women's safety march scheduled this weekend.", lastUpdated: "6h ago" },
  { id: 3, name: "Jahangirpuri Market", lat: 28.7285, lng: 77.1693, radius: 600, type: "COMMUNAL", severity: "high", description: "Communal tension following procession clashes. Curfew likely.", lastUpdated: "4h ago" },
  { id: 4, name: "Burari Ground", lat: 28.7560, lng: 77.1940, radius: 1000, type: "POLITICAL_TENSION", severity: "medium", description: "Political rally ground. Large gatherings expected this week.", lastUpdated: "8h ago" },
  { id: 5, name: "India Gate", lat: 28.6129, lng: 77.2295, radius: 700, type: "PROTEST", severity: "low", description: "Candlelight vigil for women safety. Peaceful. Police monitoring.", lastUpdated: "12h ago" },
  { id: 6, name: "Red Fort Area", lat: 28.6562, lng: 77.2410, radius: 600, type: "POLITICAL_TENSION", severity: "medium", description: "Political demonstrations near historic site. Traffic restrictions.", lastUpdated: "10h ago" },
  { id: 7, name: "Seemapuri Industrial Area", lat: 28.6875, lng: 77.3315, radius: 500, type: "LABOR_UNREST", severity: "medium", description: "Factory workers strike. Road blockade possible.", lastUpdated: "1d ago" },
  { id: 8, name: "Mayapuri Industrial", lat: 28.6340, lng: 77.1260, radius: 400, type: "LABOR_UNREST", severity: "low", description: "Labor union negotiations ongoing. Minor disruptions expected.", lastUpdated: "1d ago" },
  { id: 9, name: "Nizamuddin Area", lat: 28.5895, lng: 77.2432, radius: 500, type: "COMMUNAL", severity: "low", description: "Heightened sensitivity. Additional patrolling deployed.", lastUpdated: "2d ago" },
  { id: 10, name: "Trilokpuri Block 36", lat: 28.6105, lng: 77.3110, radius: 400, type: "COMMUNAL", severity: "high", description: "Communal clashes reported. Section 144 in effect.", lastUpdated: "3h ago" },
]
