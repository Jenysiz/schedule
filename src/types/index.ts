export interface Facility {
  id: string;
  name: string;
  department: string;
  capacity: number;
  type: 'kitchen' | 'service' | 'admin' | 'bar';
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  department: string;
}

export interface ShiftAssignment {
  id: string;
  facilityId: string;
  employeeId: string;
  date: string;
  shift: 'morning' | 'evening';
  startTime: string;
  endTime: string;
}

export interface ShiftSchedule {
  [date: string]: {
    [facilityId: string]: {
      morning?: string; // employee ID
      evening?: string; // employee ID
    };
  };
}