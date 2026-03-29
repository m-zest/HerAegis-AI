import type { EmergencyContact } from './types'

export const emergencyContacts: EmergencyContact[] = [
  { name: 'Police', phone: '112', description: 'National Emergency Number', category: 'police' },
  { name: 'Women Helpline', phone: '1091', description: 'Women in distress', category: 'women_helpline' },
  { name: 'Women Helpline (NCW)', phone: '7827-170-170', description: 'National Commission for Women', category: 'women_helpline' },
  { name: 'DCW Helpline', phone: '181', description: 'Delhi Commission for Women', category: 'women_helpline' },
  { name: 'Ambulance', phone: '102', description: 'Emergency Medical Services', category: 'ambulance' },
  { name: 'Fire', phone: '101', description: 'Fire Emergency', category: 'fire' },
  { name: 'Child Helpline', phone: '1098', description: 'Child in distress', category: 'child' },
  { name: 'Delhi Police Women Cell', phone: '011-23379181', description: 'Delhi Police Women Cell', category: 'police' },
]
