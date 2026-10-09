import React, { useState } from 'react';
import {
  ShieldCheck,
  Clock,
  BookOpen,
  Mail,
  Sliders,
  CheckCircle,
  Flame,
  Award,
  Lock,
  Heart,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Student, ScienceInterest, ParentalControlSettings } from '../types';

interface ParentalViewProps {
  students: Student[];
  language: string;
}

export const ParentalView: React.FC<ParentalViewProps> = ({ students, language }) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');

  const student = students.find(s => s.id === selectedStudentId) || students[0];

  const [settings, setSettings] = useState<ParentalControlSettings>({
    dailyLearningTimeCapMinutes: 45,
    allowedTopics: [
      'Botany & Plant Cells',
      'Robotics & Automation',
      'Renewable Energy & Physics',
      'Chemistry & Solutions',
      'Space Exploration & Astronomy',
      'Ecology & Biodiversity'
    ],
    weeklyEmailDigest: true,
    safeSearchLocked: true,
    viewHistory: [
      { date: '2026-10-09', minutesSpent: 28, topic: 'Botany & Plant Cells' },
      { date: '2026-10-08', minutesSpent: 35, topic: 'Photosynthesis Stomata' },
      { date: '2026-10-07', minutesSpent: 22, topic: 'Lab Safety Video' },
      { date: '2026-10-06', minutesSpent: 40, topic: 'Microscope Cell Walls' }
    ]
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleToggleTopic = (topic: ScienceInterest) => {
    setSettings(prev => {
      const exists = prev.allowedTopics.includes(topic);
      return {
        ...prev,
        allowedTopics: exists
          ? prev.allowedTopics.filter(t => t !== topic)
          : [...prev.allowedTopics, topic]
      };
    });
  };

  const handleSaveControls = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  if (!student) return null;

  return (
    <div className="space-y-6">
      {/* Header Profile Switcher */}
      <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white text-2xl shadow-xs">
            👨‍👩‍👧
          </div>
          <div>
            <div className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">
              Parent Guardian Portal
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 font-heading">
              Monitoring {student.name}&apos;s Science Growth
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Select Child:</span>
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Child Development Overview */}
        <div className="lg:col-span-7 space-y-5">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl p-4 border border-purple-100 shadow-xs text-center">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Learning Consistency</div>
              <div className="text-xl font-extrabold text-orange-600 mt-1 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 fill-orange-500" /> {student.streakDays} Days
              </div>
              <span className="text-[10px] text-slate-400">Daily streak active</span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-purple-100 shadow-xs text-center">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Class Attendance</div>
              <div className="text-xl font-extrabold text-emerald-600 mt-1 flex items-center justify-center gap-1">
                <CheckCircle className="w-4 h-4" /> 100%
              </div>
              <span className="text-[10px] text-slate-400">Punctual this term</span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-purple-100 shadow-xs text-center">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Science Badges</div>
              <div className="text-xl font-extrabold text-purple-700 mt-1 flex items-center justify-center gap-1">
                <Award className="w-4 h-4" /> {student.badges.length} Badges
              </div>
              <span className="text-[10px] text-slate-400">Lab competencies</span>
            </div>
          </div>

          {/* Teacher Observation */}
          <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 font-heading mb-2 flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
              Teacher Observation &amp; Feedback
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed bg-purple-50/40 p-3.5 rounded-2xl border border-purple-100 italic">
              &quot;{student.notes || `${student.name} is excelling in scientific curiosity! Always ensures teammates have proper eye protection and accurately records lab observations.`}&quot;
            </p>
            <div className="text-[11px] text-slate-400 mt-2 text-right">
              — Ms. Janet Mejia Abenoja, Primary 5 &amp; 6 Science
            </div>
          </div>

          {/* Weekly Learning Duration Log */}
          <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 font-heading mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600" />
              Recent Learning Sessions (Screen Time Duration)
            </h4>

            <div className="space-y-2.5 text-xs">
              {settings.viewHistory.map((h, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">{h.date}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-purple-700 font-medium">{h.topic}</span>
                  </div>
                  <span className="font-bold text-slate-700">
                    {h.minutesSpent} mins
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Parental Controls Panel */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 font-heading mb-4 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-600" />
              Parental Controls &amp; Preferences
            </h4>

            <form onSubmit={handleSaveControls} className="space-y-4 text-xs">
              {/* Daily Screen Time Limit */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Daily Learning Screen Time Cap</span>
                  <span className="text-purple-700 font-bold">
                    {settings.dailyLearningTimeCapMinutes} minutes
                  </span>
                </label>
                <input
                  type="range"
                  min="15"
                  max="120"
                  step="5"
                  value={settings.dailyLearningTimeCapMinutes}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      dailyLearningTimeCapMinutes: Number(e.target.value)
                    })
                  }
                  className="w-full accent-purple-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>15 min</span>
                  <span>45 min (Recommended)</span>
                  <span>120 min</span>
                </div>
              </div>

              {/* Allowed Inquiry Topics */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Active Science Investigation Topics
                </label>
                <div className="space-y-1.5">
                  {(
                    [
                      'Botany & Plant Cells',
                      'Robotics & Automation',
                      'Renewable Energy & Physics',
                      'Chemistry & Solutions',
                      'Space Exploration & Astronomy',
                      'Ecology & Biodiversity'
                    ] as ScienceInterest[]
                  ).map(topic => {
                    const isChecked = settings.allowedTopics.includes(topic);
                    return (
                      <label
                        key={topic}
                        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleTopic(topic)}
                          className="rounded text-purple-600 focus:ring-purple-400"
                        />
                        <span className="text-slate-700 font-medium">{topic}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Email Digest & Safe Mode Toggles */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
                  <div>
                    <div className="font-semibold text-slate-800">Weekly Email Digest</div>
                    <div className="text-[10px] text-slate-400">Receive automatic summary report card</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.weeklyEmailDigest}
                    onChange={(e) =>
                      setSettings({ ...settings, weeklyEmailDigest: e.target.checked })
                    }
                    className="rounded text-purple-600 focus:ring-purple-400"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
                  <div>
                    <div className="font-semibold text-slate-800">Kid-Safe Link Lock</div>
                    <div className="text-[10px] text-slate-400">Prevent external web navigations</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.safeSearchLocked}
                    onChange={(e) =>
                      setSettings({ ...settings, safeSearchLocked: e.target.checked })
                    }
                    className="rounded text-purple-600 focus:ring-purple-400"
                  />
                </label>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-2"
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle className="w-4 h-4" /> Preferences Updated!
                  </>
                ) : (
                  'Save Parental Controls'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
