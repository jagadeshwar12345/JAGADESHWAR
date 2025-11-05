import React, { useState, useMemo } from 'react';
import { STUDENTS as initialStudents } from './constants';
import { AttendanceStatus, Student, AttendanceRecord } from './types';
import Header from './components/Header';
import StudentCard from './components/StudentCard';
import AttendanceSummary from './components/AttendanceSummary';
import ReportGenerator from './components/ReportGenerator';

const App: React.FC = () => {
  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [attendance, setAttendance] = useState<AttendanceRecord>({});

  const todaysAttendance = useMemo(() => {
    const defaultAttendance: Record<string, AttendanceStatus> = {};
    students.forEach(student => {
      defaultAttendance[student.id] = AttendanceStatus.PRESENT;
    });
    return attendance[selectedDate] || defaultAttendance;
  }, [selectedDate, attendance, students]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => ({
      ...prev,
      [selectedDate]: {
        ...prev[selectedDate],
        ...todaysAttendance,
        [studentId]: status,
      }
    }));
  };
  
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const handleNoteChange = (studentId: string, notes: string) => {
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.id === studentId ? { ...student, notes } : student
      )
    );
  };
  
  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="mb-8 p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
          <label htmlFor="date-picker" className="block text-sm font-medium text-slate-600 mb-2">
            Select Attendance Date
          </label>
          <input
            id="date-picker"
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="w-full md:w-auto px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold text-slate-800 px-2">Student List</h2>
            {students.map(student => (
              <StudentCard
                key={student.id}
                student={student}
                status={todaysAttendance[student.id] || AttendanceStatus.PRESENT}
                onStatusChange={handleStatusChange}
                onNoteChange={handleNoteChange}
              />
            ))}
          </div>

          <div className="lg:col-span-1 space-y-8">
             <AttendanceSummary attendance={todaysAttendance} totalStudents={students.length} />
             <ReportGenerator
                attendance={todaysAttendance}
                students={students}
                date={selectedDate}
              />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;