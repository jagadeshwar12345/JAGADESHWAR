
import React, { useMemo } from 'react';
import { AttendanceStatus } from '../types';

interface AttendanceSummaryProps {
  attendance: Record<string, AttendanceStatus>;
  totalStudents: number;
}

const AttendanceSummary: React.FC<AttendanceSummaryProps> = ({ attendance, totalStudents }) => {
  const summary = useMemo(() => {
    let present = 0;
    let absent = 0;
    let late = 0;
    
    Object.values(attendance).forEach(status => {
      if (status === AttendanceStatus.PRESENT) present++;
      else if (status === AttendanceStatus.ABSENT) absent++;
      else if (status === AttendanceStatus.LATE) late++;
    });

    return { present, absent, late };
  }, [attendance]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Daily Summary</h2>
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
          <span className="font-semibold text-emerald-800">Present</span>
          <span className="font-bold text-lg text-emerald-800">{summary.present} / {totalStudents}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-rose-50 rounded-lg">
          <span className="font-semibold text-rose-800">Absent</span>
          <span className="font-bold text-lg text-rose-800">{summary.absent}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
          <span className="font-semibold text-amber-800">Late</span>
          <span className="font-bold text-lg text-amber-800">{summary.late}</span>
        </div>
      </div>
      <button className="w-full mt-6 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg">
        Save Attendance
      </button>
    </div>
  );
};

export default AttendanceSummary;
