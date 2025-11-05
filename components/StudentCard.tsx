import React, { useState } from 'react';
import { Student, AttendanceStatus } from '../types';

interface StudentCardProps {
  student: Student;
  status: AttendanceStatus;
  onStatusChange: (studentId: string, status: AttendanceStatus) => void;
  onNoteChange: (studentId: string, notes: string) => void;
}

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);
const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);
const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
    </svg>
);

const NoteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);


const StatusButton = ({
  Icon,
  label,
  onClick,
  isActive,
  activeClasses,
  inactiveClasses,
}: {
  Icon: React.ElementType,
  label: string,
  onClick: () => void,
  isActive: boolean,
  activeClasses: string,
  inactiveClasses: string
}) => {
  const baseClasses = "flex items-center justify-center w-full px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const finalClasses = `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;

  return (
    <button onClick={onClick} className={finalClasses}>
      <Icon/>
      {label}
    </button>
  );
};


const StudentCard: React.FC<StudentCardProps> = ({ student, status, onStatusChange, onNoteChange }) => {
  const [isNotesVisible, setIsNotesVisible] = useState(false);

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center mb-4 sm:mb-0 mr-4">
          <img src={student.avatarUrl} alt={student.name} className="w-12 h-12 rounded-full mr-4 border-2 border-slate-200" />
          <span className="font-semibold text-slate-800 text-lg whitespace-nowrap">{student.name}</span>
        </div>
        <div className="flex space-x-2 w-full sm:w-auto">
          <StatusButton
            label="Present"
            Icon={CheckIcon}
            onClick={() => onStatusChange(student.id, AttendanceStatus.PRESENT)}
            isActive={status === AttendanceStatus.PRESENT}
            activeClasses="bg-emerald-500 text-white shadow-md ring-emerald-500"
            inactiveClasses="bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-700"
          />
           <StatusButton
            label="Absent"
            Icon={XIcon}
            onClick={() => onStatusChange(student.id, AttendanceStatus.ABSENT)}
            isActive={status === AttendanceStatus.ABSENT}
            activeClasses="bg-rose-500 text-white shadow-md ring-rose-500"
            inactiveClasses="bg-slate-100 text-slate-600 hover:bg-rose-100 hover:text-rose-700"
          />
          <StatusButton
            label="Late"
            Icon={ClockIcon}
            onClick={() => onStatusChange(student.id, AttendanceStatus.LATE)}
            isActive={status === AttendanceStatus.LATE}
            activeClasses="bg-amber-500 text-white shadow-md ring-amber-500"
            inactiveClasses="bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-700"
          />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100">
        <button 
          onClick={() => setIsNotesVisible(!isNotesVisible)}
          className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors focus:outline-none"
          aria-expanded={isNotesVisible}
          aria-controls={`notes-${student.id}`}
        >
          <NoteIcon />
          <span className="ml-2">{isNotesVisible ? 'Hide Notes' : student.notes ? 'View/Edit Notes' : 'Add Note'}</span>
        </button>

        {isNotesVisible && (
          <div id={`notes-${student.id}`} className="mt-3">
            <label htmlFor={`textarea-${student.id}`} className="sr-only">Notes for {student.name}</label>
            <textarea
              id={`textarea-${student.id}`}
              value={student.notes || ''}
              onChange={(e) => onNoteChange(student.id, e.target.value)}
              placeholder="Add notes (e.g., reason for absence)..."
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-sm"
              rows={3}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentCard;