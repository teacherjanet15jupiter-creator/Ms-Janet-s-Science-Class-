import React, { useState } from 'react';
import {
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Calendar,
  Flame,
  Search,
  Filter,
  CheckCircle2,
  TrendingUp,
  Download
} from 'lucide-react';
import { ClassRoom, Student, AttendanceStatus } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface AttendanceModuleProps {
  currentClass: ClassRoom;
  onUpdateStudents: (students: Student[]) => void;
  language: string;
}

export const AttendanceModule: React.FC<AttendanceModuleProps> = ({
  currentClass,
  onUpdateStudents,
  language
}) => {
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const total = currentClass.students.length;
  const presentCount = currentClass.students.filter(s => s.attendance === 'present').length;
  const lateCount = currentClass.students.filter(s => s.attendance === 'late').length;
  const absentCount = currentClass.students.filter(s => s.attendance === 'absent').length;
  const excusedCount = currentClass.students.filter(s => s.attendance === 'excused').length;

  const attendanceRate = total > 0 ? Math.round(((presentCount + lateCount) / total) * 100) : 100;

  const handleSetAttendance = (studentId: string, status: AttendanceStatus) => {
    const updated = currentClass.students.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          attendance: status,
          streakDays: status === 'present' ? s.streakDays + 1 : Math.max(0, s.streakDays - 1)
        };
      }
      return s;
    });
    onUpdateStudents(updated);
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    const updated = currentClass.students.map(s => ({ ...s, attendance: status }));
    onUpdateStudents(updated);
  };

  const filteredStudents = currentClass.students.filter(s => {
    const matchSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.includes(searchTerm);
    const matchStatus = filterStatus === 'all' || s.attendance === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Attendance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Attendance Rate */}
        <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-xs sm:col-span-2 lg:col-span-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            {t.attendanceRate}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-heading">
              {attendanceRate}%
            </span>
            <span className="text-xs font-bold text-emerald-600">On Track</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${attendanceRate}%` }}
            />
          </div>
        </div>

        {/* Present */}
        <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>{t.present}</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-700 font-heading">
            {presentCount}
          </div>
          <span className="text-[11px] text-slate-400">In lab station</span>
        </div>

        {/* Late */}
        <div className="bg-white rounded-3xl p-5 border border-amber-100 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>{t.late}</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-amber-700 font-heading">
            {lateCount}
          </div>
          <span className="text-[11px] text-slate-400">Arrived &gt; 10m</span>
        </div>

        {/* Absent */}
        <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>{t.absent}</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-extrabold text-rose-700 font-heading">
            {absentCount}
          </div>
          <span className="text-[11px] text-slate-400">Unexcused</span>
        </div>

        {/* Excused */}
        <div className="bg-white rounded-3xl p-5 border border-blue-100 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>{t.excused}</span>
            <AlertCircle className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-blue-700 font-heading">
            {excusedCount}
          </div>
          <span className="text-[11px] text-slate-400">Clinic / Official</span>
        </div>
      </div>

      {/* Control & Filter Strip */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-purple-100 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search student..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-slate-50/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs">
            {['all', 'present', 'late', 'absent', 'excused'].map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 rounded-lg capitalize font-medium transition-all ${
                  filterStatus === st
                    ? 'bg-white text-purple-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Quick Mark All Present */}
          <button
            onClick={() => handleMarkAll('present')}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {t.markAllPresent}
          </button>
        </div>
      </div>

      {/* Real-time Roster Attendance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredStudents.map(student => {
          return (
            <div
              key={student.id}
              className="bg-white rounded-2xl p-4 border border-purple-100 shadow-xs flex items-center justify-between gap-3 hover:border-purple-300 transition-all"
            >
              <div>
                <div className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                  <span>{student.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                      student.gender === 'F' ? 'text-pink-600 bg-pink-50' : 'text-blue-600 bg-blue-50'
                    }`}
                  >
                    {student.gender}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                  <span className="font-mono text-slate-400">{student.id}</span>
                  <span>·</span>
                  <span className="font-semibold text-purple-700">{student.house} House</span>
                </div>
                <div className="mt-2 flex items-center gap-1 text-[11px] text-orange-600 font-bold">
                  <Flame className="w-3.5 h-3.5 fill-orange-500" />
                  <span>{student.streakDays} Day Active Streak</span>
                </div>
              </div>

              {/* Status Switcher Buttons */}
              <div className="flex flex-col gap-1 shrink-0">
                <button
                  onClick={() => handleSetAttendance(student.id, 'present')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all text-center ${
                    student.attendance === 'present'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-slate-50 hover:bg-emerald-50 text-slate-600'
                  }`}
                >
                  Present
                </button>
                <button
                  onClick={() => handleSetAttendance(student.id, 'late')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all text-center ${
                    student.attendance === 'late'
                      ? 'bg-amber-500 text-white shadow-2xs'
                      : 'bg-slate-50 hover:bg-amber-50 text-slate-600'
                  }`}
                >
                  Late
                </button>
                <button
                  onClick={() => handleSetAttendance(student.id, 'absent')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all text-center ${
                    student.attendance === 'absent'
                      ? 'bg-rose-500 text-white shadow-2xs'
                      : 'bg-slate-50 hover:bg-rose-50 text-slate-600'
                  }`}
                >
                  Absent
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
