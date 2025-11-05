
import React, { useState, useCallback } from 'react';
import { AttendanceStatus, Student } from '../types';
import { generateAttendanceReport } from '../services/geminiService';

interface ReportGeneratorProps {
  attendance: Record<string, AttendanceStatus>;
  students: Student[];
  date: string;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ attendance, students, date }) => {
  const [report, setReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateReport = useCallback(async () => {
    setIsLoading(true);
    setReport(null);
    setError(null);
    try {
      const summary = {
        present: Object.values(attendance).filter(s => s === AttendanceStatus.PRESENT).length,
        absent: Object.values(attendance).filter(s => s === AttendanceStatus.ABSENT).length,
        late: Object.values(attendance).filter(s => s === AttendanceStatus.LATE).length,
        absentNames: students.filter(st => attendance[st.id] === AttendanceStatus.ABSENT).map(st => st.name),
        lateNames: students.filter(st => attendance[st.id] === AttendanceStatus.LATE).map(st => st.name),
        total: students.length,
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      };
      
      const generatedReport = await generateAttendanceReport(summary);
      setReport(generatedReport);

    } catch (e) {
      setError('Failed to generate report. Please check your API key and try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [attendance, students, date]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">AI-Powered Report</h2>
      <p className="text-sm text-slate-500 mb-4">
        Click the button below to generate a professional daily attendance summary using Gemini.
      </p>
      <button
        onClick={handleGenerateReport}
        disabled={isLoading}
        className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          'Generate Daily Report'
        )}
      </button>

      {error && <div className="mt-4 p-3 bg-rose-50 text-rose-700 rounded-lg text-sm">{error}</div>}

      {report && (
        <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h3 className="font-semibold text-slate-700 mb-2">Generated Summary:</h3>
          <p className="text-slate-600 whitespace-pre-wrap text-sm leading-relaxed">{report}</p>
        </div>
      )}
    </div>
  );
};

export default ReportGenerator;
