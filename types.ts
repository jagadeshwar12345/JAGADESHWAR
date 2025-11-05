export enum AttendanceStatus {
  PRESENT = 'Present',
  ABSENT = 'Absent',
  LATE = 'Late',
}

export interface Student {
  id: string;
  name: string;
  avatarUrl: string;
  notes?: string;
}

export interface AttendanceRecord {
  [date: string]: {
    [studentId: string]: AttendanceStatus;
  };
}