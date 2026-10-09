import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Flame,
  Award,
  Sparkles,
  CheckCircle,
  Clock,
  Compass,
  Zap,
  BookOpen,
  Users,
  Smile,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Student, StudentGroup, ScienceQuest } from '../types';
import { INITIAL_BADGES, INITIAL_QUESTS } from '../data/initialData';

interface StudentGamifiedViewProps {
  students: Student[];
  groups: StudentGroup[];
  language: string;
}

export const StudentGamifiedView: React.FC<StudentGamifiedViewProps> = ({
  students,
  groups,
  language
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [quests, setQuests] = useState<ScienceQuest[]>(INITIAL_QUESTS);

  const student = students.find(s => s.id === selectedStudentId) || students[0];
  const myGroup = groups.find(g => g.students.some(m => m.id === student?.id));

  const handleCompleteQuest = (questId: string) => {
    setQuests(prev =>
      prev.map(q => {
        if (q.id === questId && !q.completed) {
          // Trigger joyful confetti for kids!
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#a7f3d0', '#c084fc', '#fde047', '#67e8f9']
          });
          return { ...q, completed: true };
        }
        return q;
      })
    );
  };

  if (!student) return null;

  return (
    <div className="space-y-6">
      {/* Student Picker Strip */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-purple-100 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-400 to-emerald-300 flex items-center justify-center text-2xl shadow-xs">
            🎒
          </div>
          <div>
            <div className="text-[11px] text-purple-700 font-bold uppercase tracking-wider">
              Student Science Arena
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 font-heading">
              Welcome back, {student.name.split(' ')[0]}! 🌟
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Switch Student View:
          </span>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:ring-2 focus:ring-purple-400"
          >
            {students.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.house} House)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Gamified Hero Banner with Pastel Gradient & Streaks */}
      <div className="bg-gradient-to-r from-purple-200 via-indigo-100 to-emerald-200 rounded-3xl p-6 sm:p-8 border border-purple-200 shadow-sm relative overflow-hidden">
        {/* Floating science bubbles */}
        <div className="absolute top-0 right-10 w-48 h-48 bg-emerald-300/30 rounded-full blur-2xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-purple-900 text-xs font-bold backdrop-blur-md shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              Primary Science Explorer Level 5
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading leading-tight">
              Ready for today&apos;s microscope discoveries?
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 max-w-xl">
              Complete your daily science quest with your lab group to protect your streak and earn badge rewards!
            </p>

            {/* Streak & XP Counters */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* Daily Streak */}
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-orange-200 shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Flame className="w-5 h-5 fill-orange-500 animate-bounce" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Learning Streak</div>
                  <div className="text-sm font-extrabold text-orange-600">{student.streakDays} Days in a Row!</div>
                </div>
              </div>

              {/* Total XP */}
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-purple-200 shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                  ⚡
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Science XP</div>
                  <div className="text-sm font-extrabold text-purple-900">{student.xp + 50} Points</div>
                </div>
              </div>

              {/* House Pride */}
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-emerald-200 shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-sm font-bold">
                  🏰
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">BBS House</div>
                  <div className="text-sm font-extrabold text-emerald-800">{student.house} House</div>
                </div>
              </div>
            </div>
          </div>

          {/* Friendly Mascot Companion */}
          <div className="md:col-span-4 flex justify-center">
            <div className="bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-purple-200 text-center shadow-xs max-w-xs">
              <div className="text-5xl mb-2">🐱🔬</div>
              <div className="text-xs font-bold text-slate-800">
                &quot;Dr. Whiskers &amp; Ms. Janet believe in you!&quot;
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Tip: Remember to wipe microscope lenses with lens paper only!
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Daily Science Quests */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-600" />
                Daily Science Quests
              </h4>
              <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                {quests.filter(q => q.completed).length}/{quests.length} Completed
              </span>
            </div>

            <div className="space-y-3">
              {quests.map(quest => {
                return (
                  <div
                    key={quest.id}
                    className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                      quest.completed
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : 'bg-slate-50/70 hover:bg-purple-50/40 border-slate-200'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{quest.title}</span>
                        <span className="text-[10px] font-semibold text-purple-600 bg-purple-100 px-2 py-0.2 rounded-md">
                          +{quest.xpReward} XP
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {quest.description}
                      </p>
                      <div className="text-[10px] text-slate-400 font-medium">
                        Due: {quest.dueDate} · {quest.category}
                      </div>
                    </div>

                    <button
                      onClick={() => handleCompleteQuest(quest.id)}
                      disabled={quest.completed}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                        quest.completed
                          ? 'bg-emerald-600 text-white cursor-default'
                          : 'bg-purple-600 hover:bg-purple-700 text-white shadow-2xs'
                      }`}
                    >
                      {quest.completed ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" /> Done!
                        </>
                      ) : (
                        'Complete'
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* My Science Lab Team Card */}
          {myGroup && (
            <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-xs">
              <h4 className="text-sm font-bold text-slate-900 font-heading mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                My Science Lab Team: <span className="text-purple-700">{myGroup.name}</span>
              </h4>

              <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-50 to-emerald-50 border border-purple-100 mb-3 flex items-center justify-between text-xs">
                <div>
                  <div className="text-[11px] text-slate-500 font-medium">Inquiry Topic</div>
                  <div className="font-bold text-slate-900">🔬 {myGroup.topic}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-slate-500 font-medium">My Assigned Lab Role</div>
                  <div className="font-extrabold text-purple-800">
                    {student.roleInTeam || 'Lead Investigator'}
                  </div>
                </div>
              </div>

              <div className="text-xs font-semibold text-slate-700 mb-2">Teammates:</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {myGroup.students.map(teammate => (
                  <div
                    key={teammate.id}
                    className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2"
                  >
                    <span className="text-lg">
                      {teammate.gender === 'F' ? '👧🏻' : '👦🏻'}
                    </span>
                    <div className="truncate">
                      <div className="font-bold text-slate-800 truncate">{teammate.name}</div>
                      <div className="text-[10px] text-slate-500">
                        {teammate.roleInTeam || teammate.house}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Badges Showcase */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 font-heading mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Science Badges &amp; Recognitions
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {INITIAL_BADGES.map(badge => {
                const isUnlocked = student.badges.includes(badge.id);

                return (
                  <div
                    key={badge.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                      isUnlocked
                        ? 'bg-gradient-to-br from-white to-purple-50/40 border-purple-200 shadow-2xs'
                        : 'bg-slate-50/70 border-slate-200 opacity-60'
                    }`}
                  >
                    <span className="text-3xl shrink-0">{badge.icon}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900">{badge.name}</span>
                        {isUnlocked && (
                          <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                            UNLOCKED
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                        {badge.description}
                      </p>
                      <div className="text-[10px] font-semibold text-purple-600 mt-1.5">
                        {badge.rarity} · {badge.category}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
