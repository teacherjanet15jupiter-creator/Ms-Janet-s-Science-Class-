import React, { useState } from 'react';
import {
  Printer,
  Mail,
  Sparkles,
  Award,
  Flame,
  CheckCircle,
  Calendar,
  User,
  HeartHandshake,
  Send,
  BookOpen
} from 'lucide-react';
import { ClassRoom, Student } from '../types';
import { INITIAL_BADGES } from '../data/initialData';
import { TRANSLATIONS } from '../data/translations';

interface ParentReportModuleProps {
  currentClass: ClassRoom;
  language: string;
}

export const ParentReportModule: React.FC<ParentReportModuleProps> = ({
  currentClass,
  language
}) => {
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    currentClass.students[0]?.id || ''
  );
  const [emailSent, setEmailSent] = useState(false);

  const student =
    currentClass.students.find(s => s.id === selectedStudentId) || currentClass.students[0];

  const studentBadges = INITIAL_BADGES.filter(b => student?.badges.includes(b.id));

  const handleSimulateEmail = () => {
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3500);
  };

  const handlePrintReport = () => {
    window.print();
  };

  if (!student) return null;

  return (
    <div className="space-y-6">
      {/* Selector & Actions Bar */}
      <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 no-print">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Select Student for Weekly Parent Report
          </label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:ring-2 focus:ring-purple-400"
          >
            {currentClass.students.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.house} House · {s.gender})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSimulateEmail}
            className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-bold transition-all flex items-center gap-2 shadow-2xs"
          >
            <Mail className="w-3.5 h-3.5 text-purple-600" />
            {emailSent ? 'Sent to Parent Email!' : 'Send Parent Digest (Email)'}
          </button>

          <button
            onClick={handlePrintReport}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Save Parent PDF
          </button>
        </div>
      </div>

      {/* Official Weekly Science Progress Report Card (Styled for Print and Screen) */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-purple-100 shadow-sm max-w-4xl mx-auto print-container">
        {/* Report Header */}
        <div className="border-b border-purple-100 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-emerald-400 flex items-center justify-center text-white text-2xl shadow-xs">
              🔬
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider font-extrabold text-emerald-700">
                Bina Bangsa School · Science Department
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">
                Weekly Student Science Progress Letter
              </h2>
              <div className="text-xs text-slate-500 mt-0.5">
                Academic Year 2026/2027 · Week 6 Term 1 Report
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs">
            <div className="font-semibold text-slate-700">
              Form Teacher: <span className="text-purple-900 font-bold">{currentClass.formTeacher}</span>
            </div>
            <div className="text-slate-500">
              Class: <strong>{currentClass.name}</strong> · Room {currentClass.room}
            </div>
            <div className="text-slate-400 mt-0.5">Date: October 9, 2026</div>
          </div>
        </div>

        {/* Student Profile Strip */}
        <div className="mt-6 p-4 rounded-2xl bg-purple-50/50 border border-purple-100 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Student Information
            </div>
            <div className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>{student.name}</span>
              <span className="text-xs font-mono text-purple-700 bg-white px-2 py-0.5 rounded-md border border-purple-200">
                ID: {student.id}
              </span>
            </div>
            <div className="text-xs text-slate-600 mt-1 flex items-center gap-2">
              <span>House: <strong className="text-slate-800">{student.house}</strong></span>
              <span>·</span>
              <span>CCA: <strong className="text-slate-800">{student.cca}</strong></span>
              <span>·</span>
              <span>Music: <strong className="text-slate-800">{student.musicInstrument}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white px-3.5 py-2 rounded-xl border border-purple-100 text-center shadow-2xs">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Learning Streak</div>
              <div className="text-base font-extrabold text-orange-600 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 fill-orange-500" /> {student.streakDays} Days
              </div>
            </div>

            <div className="bg-white px-3.5 py-2 rounded-xl border border-purple-100 text-center shadow-2xs">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Science XP</div>
              <div className="text-base font-extrabold text-purple-700">
                {student.xp} XP
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: This Week's Lab Exploration */}
        <div className="mt-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2 border-b pb-2 border-slate-100">
            <BookOpen className="w-4 h-4 text-purple-600" />
            1. Lab Investigation Focus: Plant Cells &amp; Photosynthesis Microstructures
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            This week in Ms. Janet&apos;s science laboratory, {student.name} engaged with high-power optical microscopes to investigate onion epidermal cells, stomata guard cells, and chloroplast cytoplasmic streaming in Elodea leaves. The students formulated independent testable hypotheses and worked in collaborative peer groups.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-800 mb-1">Collaborative Science Team</div>
              <div className="text-purple-700 font-semibold">
                {student.lockedToGroupId ? 'Assigned Team' : 'Team Chloroplast Discovery'}
              </div>
              <div className="text-slate-500 text-[11px] mt-0.5">
                Assigned Team Role: <strong>{student.roleInTeam || 'Lead Scientific Investigator'}</strong>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-800 mb-1">Laboratory Attendance &amp; Punctuality</div>
              <div className="text-emerald-700 font-semibold flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> 100% Present &amp; Punctual (5/5 Sessions)
              </div>
              <div className="text-slate-500 text-[11px] mt-0.5">
                Zero safety infringements recorded this cycle.
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Rubric Assessment Highlights */}
        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2 border-b pb-2 border-slate-100">
            <Award className="w-4 h-4 text-emerald-600" />
            2. Science Competency Matrix &amp; Rubric Scores
          </h3>

          <div className="space-y-2 text-xs">
            {[
              { dim: 'Scientific Hypothesis & Question Rigor', score: 'Level 4 (Exemplary)', desc: 'Formulated testable variables grounded in prior photosynthetic knowledge.' },
              { dim: 'Lab Safety & Microscope Handling', score: 'Level 4 (Exemplary)', desc: 'Perfect slide staining, zero cover slip air bubbles, orderly cleanup.' },
              { dim: 'Data Recording & Stomata Diagramming', score: 'Level 3 (Proficient)', desc: 'Clear labelled sketches of chloroplasts with accurate scale magnification.' },
              { dim: 'Peer Collaboration & Communication', score: 'Level 4 (Exemplary)', desc: 'Actively facilitated group discussions and encouraged fellow teammates.' }
            ].map(r => (
              <div key={r.dim} className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-xl bg-purple-50/40 border border-purple-100 gap-1 sm:gap-4">
                <div>
                  <span className="font-bold text-slate-800">{r.dim}</span>
                  <p className="text-[11px] text-slate-500">{r.desc}</p>
                </div>
                <span className="font-extrabold text-purple-800 bg-white px-2.5 py-1 rounded-lg border border-purple-200 text-right shrink-0">
                  {r.score}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Earned Badges Showcase */}
        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2 border-b pb-2 border-slate-100">
            <Sparkles className="w-4 h-4 text-amber-500" />
            3. Earned Badges &amp; Scientific Recognitions
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {studentBadges.map(badge => (
              <div key={badge.id} className="p-3 rounded-2xl bg-white border border-purple-100 shadow-2xs flex items-center gap-2.5">
                <span className="text-2xl">{badge.icon}</span>
                <div>
                  <div className="font-bold text-slate-900 text-xs">{badge.name}</div>
                  <div className="text-[10px] text-purple-700 font-semibold">{badge.rarity} Recognition</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Ms. Janet's Personalized Teacher Feedback */}
        <div className="mt-6 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
          <div className="font-bold text-emerald-950 text-xs sm:text-sm flex items-center gap-2 mb-1.5">
            <HeartHandshake className="w-4 h-4 text-emerald-700" />
            Personalized Teacher Commendation from Ms. Janet
          </div>
          <p className="text-xs text-slate-700 leading-relaxed italic">
            &quot;{student.notes || `${student.name} has demonstrated outstanding curiosity and leadership during this week's science module. In team investigations, ${student.name} ensured everyone had a turn focusing the slide under 40x magnification and carefully logged our cellular observations. Keep up the phenomenal scientific inquiry!`}&quot;
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-emerald-200/60">
            <span>Teacher Signature: <strong>Ms. Janet Mejia Abenoja</strong></span>
            <span>Parent Signature: _________________________</span>
          </div>
        </div>
      </div>
    </div>
  );
};
