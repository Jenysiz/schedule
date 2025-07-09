export const facilities = [
  // Kitchen Facilities
  { id: 'kitchen-1', name: 'Main Kitchen', department: 'Kitchen', capacity: 8, type: 'kitchen' },
  { id: 'kitchen-2', name: 'Prep Station', department: 'Kitchen', capacity: 4, type: 'kitchen' },
  { id: 'kitchen-3', name: 'Pastry Section', department: 'Kitchen', capacity: 3, type: 'kitchen' },
  
  // Service Facilities
  { id: 'service-1', name: 'Dining Hall A', department: 'Service', capacity: 12, type: 'service' },
  { id: 'service-2', name: 'Dining Hall B', department: 'Service', capacity: 10, type: 'service' },
  { id: 'service-3', name: 'Private Dining', department: 'Service', capacity: 4, type: 'service' },
  
  // Admin Facilities
  { id: 'admin-1', name: 'Front Desk', department: 'Administration', capacity: 2, type: 'admin' },
  { id: 'admin-2', name: 'Manager Office', department: 'Administration', capacity: 1, type: 'admin' },
  
  // Bar Facilities
  { id: 'bar-1', name: 'Main Bar', department: 'Bar', capacity: 6, type: 'bar' },
  { id: 'bar-2', name: 'Cocktail Lounge', department: 'Bar', capacity: 4, type: 'bar' },
];

export const employees = [
  // Kitchen Staff
  { id: 'emp-1', name: 'Amanda Johnson', role: 'Sous Chef', department: 'Kitchen' },
  { id: 'emp-2', name: 'Ella Harper', role: 'Line Cook', department: 'Kitchen' },
  { id: 'emp-3', name: 'Michel Flynn', role: 'Prep Cook', department: 'Kitchen' },
  { id: 'emp-4', name: 'Sarah Wilson', role: 'Pastry Chef', department: 'Kitchen' },
  
  // Service Staff
  { id: 'emp-5', name: 'Amelia Reyes', role: 'Server', department: 'Service' },
  { id: 'emp-6', name: 'Danny Hansen', role: 'Host', department: 'Service' },
  { id: 'emp-7', name: 'Lisa Martinez', role: 'Server', department: 'Service' },
  { id: 'emp-8', name: 'Tom Richards', role: 'Server', department: 'Service' },
  
  // Admin Staff
  { id: 'emp-9', name: 'Jennifer Adams', role: 'Manager', department: 'Administration' },
  { id: 'emp-10', name: 'Robert Chen', role: 'Assistant Manager', department: 'Administration' },
  
  // Bar Staff
  { id: 'emp-11', name: 'Samanta Atherton', role: 'Bartender', department: 'Bar' },
  { id: 'emp-12', name: 'Henry Wills', role: 'Bartender', department: 'Bar' },
  { id: 'emp-13', name: 'Maya Rodriguez', role: 'Bar Back', department: 'Bar' },
];

export const initialSchedule = {
  '2024-01-22': {
    'kitchen-1': { morning: 'emp-1', evening: 'emp-2' },
    'kitchen-2': { morning: 'emp-3', evening: 'emp-4' },
    'service-1': { morning: 'emp-5', evening: 'emp-6' },
    'bar-1': { morning: 'emp-11', evening: 'emp-12' },
  },
  '2024-01-23': {
    'kitchen-1': { morning: 'emp-2', evening: 'emp-1' },
    'service-1': { morning: 'emp-7', evening: 'emp-8' },
    'bar-1': { morning: 'emp-12', evening: 'emp-11' },
  },
};