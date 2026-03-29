export interface PoliceStation {
  id: number
  name: string
  lat: number
  lng: number
  district: string
  phone: string
  officers: number
  responseTime: string
  status: 'active' | 'high-alert'
}

export const policeStations: PoliceStation[] = [
  { id: 1, name: "Parliament Street PS", lat: 28.6235, lng: 77.2140, district: "New Delhi", phone: "011-23362700", officers: 120, responseTime: "6 min", status: "active" },
  { id: 2, name: "Paharganj PS", lat: 28.6440, lng: 77.2145, district: "Central", phone: "011-23529666", officers: 85, responseTime: "8 min", status: "high-alert" },
  { id: 3, name: "Connaught Place PS", lat: 28.6300, lng: 77.2170, district: "New Delhi", phone: "011-23741400", officers: 95, responseTime: "5 min", status: "active" },
  { id: 4, name: "Karol Bagh PS", lat: 28.6530, lng: 77.1890, district: "Central", phone: "011-25720044", officers: 78, responseTime: "9 min", status: "active" },
  { id: 5, name: "Lajpat Nagar PS", lat: 28.5710, lng: 77.2390, district: "South East", phone: "011-26831074", officers: 70, responseTime: "10 min", status: "active" },
  { id: 6, name: "Hauz Khas PS", lat: 28.5497, lng: 77.2028, district: "South", phone: "011-26851473", officers: 65, responseTime: "12 min", status: "active" },
  { id: 7, name: "Shahdara PS", lat: 28.6720, lng: 77.2940, district: "East", phone: "011-22814544", officers: 80, responseTime: "11 min", status: "active" },
  { id: 8, name: "Jahangirpuri PS", lat: 28.7275, lng: 77.1705, district: "North West", phone: "011-27682424", officers: 90, responseTime: "9 min", status: "high-alert" },
  { id: 9, name: "Sultanpuri PS", lat: 28.7095, lng: 77.0805, district: "North West", phone: "011-28375544", officers: 75, responseTime: "13 min", status: "active" },
  { id: 10, name: "Dwarka North PS", lat: 28.5960, lng: 77.0420, district: "South West", phone: "011-28085400", officers: 70, responseTime: "12 min", status: "active" },
  { id: 11, name: "Saket PS", lat: 28.5260, lng: 77.2100, district: "South", phone: "011-29562040", officers: 60, responseTime: "10 min", status: "active" },
  { id: 12, name: "Rohini PS", lat: 28.7450, lng: 77.0600, district: "North West", phone: "011-27567744", officers: 82, responseTime: "11 min", status: "active" },
  { id: 13, name: "Okhla PS", lat: 28.5340, lng: 77.2680, district: "South East", phone: "011-26837333", officers: 72, responseTime: "14 min", status: "active" },
  { id: 14, name: "Chandni Chowk PS", lat: 28.6510, lng: 77.2305, district: "Central", phone: "011-23272424", officers: 88, responseTime: "7 min", status: "high-alert" },
  { id: 15, name: "Seelampur PS", lat: 28.6775, lng: 77.2725, district: "North East", phone: "011-22814455", officers: 90, responseTime: "10 min", status: "high-alert" },
  { id: 16, name: "Mangolpuri PS", lat: 28.7055, lng: 77.0695, district: "North West", phone: "011-27934488", officers: 76, responseTime: "12 min", status: "active" },
  { id: 17, name: "Trilokpuri PS", lat: 28.6095, lng: 77.3095, district: "East", phone: "011-22721122", officers: 80, responseTime: "11 min", status: "high-alert" },
  { id: 18, name: "Vasant Kunj PS", lat: 28.5198, lng: 77.1592, district: "South West", phone: "011-26134000", officers: 55, responseTime: "15 min", status: "active" },
  { id: 19, name: "Defence Colony PS", lat: 28.5740, lng: 77.2310, district: "South", phone: "011-24334100", officers: 50, responseTime: "9 min", status: "active" },
  { id: 20, name: "Rajouri Garden PS", lat: 28.6488, lng: 77.1230, district: "West", phone: "011-25428866", officers: 68, responseTime: "10 min", status: "active" },
  { id: 21, name: "Nand Nagri PS", lat: 28.6925, lng: 77.3125, district: "North East", phone: "011-22810055", officers: 85, responseTime: "12 min", status: "high-alert" },
  { id: 22, name: "Pitampura PS", lat: 28.6990, lng: 77.1320, district: "North West", phone: "011-27312200", officers: 60, responseTime: "11 min", status: "active" },
  { id: 23, name: "Burari PS", lat: 28.7555, lng: 77.1945, district: "North", phone: "011-27634433", officers: 72, responseTime: "13 min", status: "active" },
]
