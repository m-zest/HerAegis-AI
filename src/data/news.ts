export interface NewsItem {
  id: number
  title: string
  source: string
  time: string
  category: 'CRIME' | 'PROTEST' | 'ADVISORY' | 'RESCUE' | 'ALERT' | 'POLITICS'
  location?: string
  urgent: boolean
}

export const newsItems: NewsItem[] = [
  { id: 1, title: "Woman attacked near Paharganj railway station, suspect arrested", source: "DELHI POLICE", time: "1h ago", category: "CRIME", location: "Paharganj", urgent: true },
  { id: 2, title: "Protest march planned at Jantar Mantar over women's safety bill", source: "NDTV", time: "2h ago", category: "PROTEST", location: "Connaught Place", urgent: false },
  { id: 3, title: "Delhi Police deploys 500 additional personnel in North-East district", source: "TIMES NOW", time: "3h ago", category: "ADVISORY", location: "Seelampur", urgent: false },
  { id: 4, title: "Missing 19-year-old found safe in Dwarka after 48-hour search", source: "ANI", time: "4h ago", category: "RESCUE", urgent: false },
  { id: 5, title: "Two arrested for stalking college student near Lajpat Nagar metro", source: "DELHI POLICE", time: "5h ago", category: "CRIME", location: "Lajpat Nagar", urgent: true },
  { id: 6, title: "Political rally in Shahdara may cause traffic disruption tonight", source: "TRAFFIC POLICE", time: "6h ago", category: "POLITICS", location: "Shahdara", urgent: false },
  { id: 7, title: "CCTV coverage expanded in Chandni Chowk after spike in chain-snatching", source: "HINDUSTAN TIMES", time: "8h ago", category: "ADVISORY", location: "Chandni Chowk", urgent: false },
  { id: 8, title: "Acid attack survivor rehabilitation center opens in Saket", source: "INDIAN EXPRESS", time: "10h ago", category: "RESCUE", urgent: false },
  { id: 9, title: "Night patrol doubled in Jahangirpuri after harassment complaints", source: "DELHI POLICE", time: "12h ago", category: "ADVISORY", location: "Jahangirpuri", urgent: true },
  { id: 10, title: "BJP-AAP clash fears: heavy police deployment in Burari", source: "INDIA TODAY", time: "14h ago", category: "POLITICS", location: "Burari", urgent: false },
  { id: 11, title: "Women safety app 'Himmat' records 15,000 downloads this month", source: "DELHI POLICE", time: "16h ago", category: "ADVISORY", urgent: false },
  { id: 12, title: "Gang of eve-teasers busted near GB Road, 4 held", source: "PTI", time: "18h ago", category: "CRIME", location: "GB Road", urgent: true },
  { id: 13, title: "Anti-encroachment drive in Mangolpuri sparks tension with locals", source: "TOI", time: "20h ago", category: "PROTEST", location: "Mangolpuri", urgent: false },
  { id: 14, title: "Delhi Metro increases last train timing on Violet Line for women commuters", source: "DMRC", time: "1d ago", category: "ADVISORY", urgent: false },
  { id: 15, title: "CAA protests: Section 144 imposed near Seemapuri", source: "NDTV", time: "1d ago", category: "POLITICS", location: "Seemapuri", urgent: true },
]
