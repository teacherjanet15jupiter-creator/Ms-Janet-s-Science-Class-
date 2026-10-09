import React from 'react';
import { ClassRoom, StudentGroup } from '../types';
import { calculateGroupDiversity } from '../utils/groupingEngine';
import { DEFAULT_RUBRIC_CRITERIA } from '../data/initialData';

interface PrintableReportProps {
  currentClass: ClassRoom;
  groups: StudentGroup[];
}

export const PrintableReport: React.FC<PrintableReportProps> = ({ currentClass, groups }) => {
  const totalStudents = currentClass.students.length;
  const presentCount = currentClass.students.filter(s => s.attendance === 'present').length;
  const attendanceRate = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 100;

  return (
    <div className="hidden print:block p-8 bg-white text-black font-sans print-container">
      {/* Official Header */}
      <div className="border-b-2 border-slate-800 pb-4 mb-6 flex justify-between items-end">
        <div>
          <div className="text-xs uppercase tracking-widest font-bold text-slate-500">
            Bina Bangsa School · Science Department
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Science Laboratory Team Assignments &amp; Diversity Report
          </h1>
          <div className="text-sm text-slate-600 mt-1">
            Class: <strong>{currentClass.name}</strong> · Room: {currentClass.room} · Academic Year 2026/2027
          </div>
        </div>
        <div className="text-right text-xs text-slate-600">
          <div>Form Teacher: <strong>{currentClass.formTeacher}</strong></div>
          <div>Date Generated: {new Date().toLocaleDateString()}</div>
          <div>Total Students: {totalStudents} · Attendance: {attendanceRate}%</div>
        </div>
      </div>

      {/* Diversity Summary Table */}
      <div className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-2 border-b border-slate-300 pb-1">
          1. Team Diversity &amp; Distribution Overview
        </h2>
        <table className="w-full text-xs text-left border border-slate-300">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-2 border border-slate-300">Team Name</th>
              <th className="p-2 border border-slate-300">Inquiry Topic</th>
              <th className="p-2 border border-slate-300">Members</th>
              <th className="p-2 border border-slate-300">Gender Ratio</th>
              <th className="p-2 border border-slate-300">House Spread</th>
              <th className="p-2 border border-slate-300">Avg Skill</th>
              <th className="p-2 border border-slate-300">Balance Grade</th>
            </tr>
          </thead>
          <tbody>
            {groups.map(g => {
              const m = calculateGroupDiversity(g.students);
              return (
                <tr key={g.id}>
                  <td className="p-2 border border-slate-300 font-bold">{g.name}</td>
                  <td className="p-2 border border-slate-300">{g.topic}</td>
                  <td className="p-2 border border-slate-300">{g.students.length}</td>
                  <td className="p-2 border border-slate-300">{m.maleCount}M / {m.femaleCount}F</td>
                  <td className="p-2 border border-slate-300">
                    {Object.entries(m.houseCounts).filter(([, c]) => c > 0).map(([h, c]) => `${h[0]}:${c}`).join(' ')}
                  </td>
                  <td className="p-2 border border-slate-300">{m.avgSkillScore} / 4.0</td>
                  <td className="p-2 border border-slate-300 font-bold">{m.overallScore}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detailed Team Rosters */}
      <div className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-3 border-b border-slate-300 pb-1">
          2. Complete Laboratory Team Rosters &amp; Student Roles
        </h2>

        <div className="space-y-4">
          {groups.map((g, idx) => (
            <div key={g.id} className="border border-slate-300 p-3 rounded-lg break-inside-avoid">
              <div className="flex justify-between items-center mb-2 bg-slate-50 p-2 rounded">
                <span className="font-bold text-sm">
                  {idx + 1}. {g.name} — Topic: {g.topic}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {g.students.length} Members Assigned
                </span>
              </div>

              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600">
                    <th className="py-1 px-2">ID</th>
                    <th className="py-1 px-2">Student Name</th>
                    <th className="py-1 px-2">G</th>
                    <th className="py-1 px-2">House</th>
                    <th className="py-1 px-2">Skill Level</th>
                    <th className="py-1 px-2">Assigned Lab Role</th>
                    <th className="py-1 px-2">Music &amp; CCA</th>
                  </tr>
                </thead>
                <tbody>
                  {g.students.map(s => (
                    <tr key={s.id} className="border-b border-slate-100">
                      <td className="py-1 px-2 font-mono">{s.id}</td>
                      <td className="py-1 px-2 font-bold">{s.name}</td>
                      <td className="py-1 px-2">{s.gender}</td>
                      <td className="py-1 px-2">{s.house}</td>
                      <td className="py-1 px-2">{s.skillLevel}</td>
                      <td className="py-1 px-2 font-semibold text-slate-800">{s.roleInTeam || 'Investigator'}</td>
                      <td className="py-1 px-2">{s.musicInstrument} · {s.cca}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>

      {/* Science Lab Rubric Evaluation Criteria */}
      <div className="mb-6 print-page-break">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-2 border-b border-slate-300 pb-1">
          3. Assessment Standards &amp; Lab Grading Rubric
        </h2>
        <div className="space-y-2 text-xs">
          {DEFAULT_RUBRIC_CRITERIA.map(crit => (
            <div key={crit.id} className="border border-slate-200 p-2 rounded">
              <div className="font-bold text-slate-800">
                {crit.name} (Weight: {crit.weight}%)
              </div>
              <p className="text-slate-600 text-[11px] mb-1">{crit.description}</p>
              <div className="grid grid-cols-4 gap-1 text-[10px] text-slate-500">
                {crit.levels.map(l => (
                  <div key={l.score} className="bg-slate-50 p-1 rounded">
                    <strong>Level {l.score} ({l.label}):</strong> {l.descriptor}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sign-off footer */}
      <div className="pt-6 border-t border-slate-300 grid grid-cols-2 gap-8 text-xs text-slate-700">
        <div>
          <div className="h-10 border-b border-slate-400" />
          <div className="mt-1 font-bold">Science Lead: {currentClass.formTeacher}</div>
          <div className="text-slate-500">Bina Bangsa School Faculty</div>
        </div>
        <div>
          <div className="h-10 border-b border-slate-400" />
          <div className="mt-1 font-bold">Head of Science Department</div>
          <div className="text-slate-500">Academic Verification</div>
        </div>
      </div>
    </div>
  );
};
