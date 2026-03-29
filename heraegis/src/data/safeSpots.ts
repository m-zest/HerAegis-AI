import type { SafeSpot } from './types'

export const safeSpots: SafeSpot[] = [
  // Metro stations
  { name: 'Rajiv Chowk Metro', type: 'metro', lat: 28.6328, lng: 77.2197 },
  { name: 'Kashmere Gate Metro', type: 'metro', lat: 28.6675, lng: 77.2284 },
  { name: 'Central Secretariat Metro', type: 'metro', lat: 28.6148, lng: 77.2115 },
  { name: 'Hauz Khas Metro', type: 'metro', lat: 28.5431, lng: 77.2068 },
  { name: 'Chandni Chowk Metro', type: 'metro', lat: 28.6562, lng: 77.2300 },
  { name: 'Lajpat Nagar Metro', type: 'metro', lat: 28.5698, lng: 77.2434 },
  { name: 'Saket Metro', type: 'metro', lat: 28.5218, lng: 77.2100 },
  { name: 'Dwarka Sector 21 Metro', type: 'metro', lat: 28.5525, lng: 77.0586 },
  { name: 'Nehru Place Metro', type: 'metro', lat: 28.5494, lng: 77.2529 },
  { name: 'INA Metro', type: 'metro', lat: 28.5744, lng: 77.2098 },

  // Police stations
  { name: 'Parliament Street PS', type: 'police', lat: 28.6235, lng: 77.2140, phone: '011-23362700' },
  { name: 'Connaught Place PS', type: 'police', lat: 28.6315, lng: 77.2167, phone: '011-23741400' },
  { name: 'Sarojini Nagar PS', type: 'police', lat: 28.5780, lng: 77.2003, phone: '011-26886614' },
  { name: 'Hauz Khas PS', type: 'police', lat: 28.5497, lng: 77.2028, phone: '011-26851473' },
  { name: 'Lajpat Nagar PS', type: 'police', lat: 28.5710, lng: 77.2390, phone: '011-26831074' },
  { name: 'Defence Colony PS', type: 'police', lat: 28.5740, lng: 77.2310, phone: '011-24334100' },
  { name: 'Vasant Kunj PS', type: 'police', lat: 28.5198, lng: 77.1592, phone: '011-26134000' },
  { name: 'Malviya Nagar PS', type: 'police', lat: 28.5344, lng: 77.2102, phone: '011-26680088' },

  // Hospitals
  { name: 'AIIMS Hospital', type: 'hospital', lat: 28.5672, lng: 77.2100, phone: '011-26588500' },
  { name: 'Safdarjung Hospital', type: 'hospital', lat: 28.5684, lng: 77.2066, phone: '011-26707437' },
  { name: 'RML Hospital', type: 'hospital', lat: 28.6259, lng: 77.2020, phone: '011-23404446' },
  { name: 'GTB Hospital', type: 'hospital', lat: 28.6842, lng: 77.3101, phone: '011-22586262' },
  { name: 'Lok Nayak Hospital', type: 'hospital', lat: 28.6380, lng: 77.2378, phone: '011-23232400' },
  { name: 'Max Hospital Saket', type: 'hospital', lat: 28.5270, lng: 77.2110, phone: '011-26515050' },
  { name: 'Fortis Vasant Kunj', type: 'hospital', lat: 28.5215, lng: 77.1560, phone: '011-42776222' },
  { name: 'Apollo Hospital', type: 'hospital', lat: 28.5587, lng: 77.2560, phone: '011-26925858' },
]
