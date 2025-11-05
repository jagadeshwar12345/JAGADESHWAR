
import { GoogleGenAI } from "@google/genai";

interface AttendanceSummaryData {
  present: number;
  absent: number;
  late: number;
  absentNames: string[];
  lateNames: string[];
  total: number;
  date: string;
}

export async function generateAttendanceReport(summary: AttendanceSummaryData): Promise<string> {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const absentList = summary.absentNames.length > 0 ? `The following students were absent: ${summary.absentNames.join(', ')}.` : 'No students were absent.';
  const lateList = summary.lateNames.length > 0 ? `The following students were late: ${summary.lateNames.join(', ')}.` : 'No students were late.';

  const prompt = `
    Generate a concise and professional daily attendance report for a school class.
    
    Date: ${summary.date}
    Total Students: ${summary.total}
    
    Attendance Breakdown:
    - Present: ${summary.present}
    - Absent: ${summary.absent}
    - Late: ${summary.late}
    
    Details:
    - ${absentList}
    - ${lateList}
    
    Based on this data, provide a brief summary paragraph. Start with a clear heading like "Attendance Report for [Date]".
    Keep the tone formal and informative. Do not add any extra commentary beyond the summary.
  `;
  
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating report from Gemini:", error);
    throw new Error("Failed to communicate with the Gemini API.");
  }
}
