import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  Plus,
  Save,
  CheckCircle,
  Star,
  FileText,
  Sliders,
  Edit3,
  BookOpen,
  MessageSquare
} from 'lucide-react';
import { ClassRoom, RubricCriterion, StudentGroup, Student } from '../types';
import { DEFAULT_RUBRIC_CRITERIA } from '../data/initialData';
import { TRANSLATIONS } from '../data/translations';

interface RubricsModuleProps {
  currentClass: ClassRoom;
  groups: StudentGroup[];
  language: string;
}

export const RubricsModule: React.FC<RubricsModuleProps> = ({
  currentClass,
  groups,
  language
}) => {
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;
  const [criteria, setCriteria] = useState<RubricCriterion[]>(DEFAULT_RUBRIC_CRITERIA);
  const [selectedTargetType, setSelectedTargetType] = useState<'group' | 'student'>('group');
  const [selectedGroupId, setSelectedGroupId] = useState<string>(groups[0]?.id || '');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(currentClass.students[0]?.id || '');
  const [scores, setScores] = useState<Record<string, number>>({
    'crit-hypothesis': 3,
    'crit-experimentation': 4,
    'crit-data': 3,
    'crit-collaboration': 4,
    'crit-presentation': 3
  });
  const [teacherNotes, setTeacherNotes] = useState<string>(
    'Demonstrated thorough safety checks before beginning microscope slide prep. Excellent note-taking by the data recorder!'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showEditCriteriaModal, setShowEditCriteriaModal] = useState(false);

  // New criterion form
  const [newCritName, setNewCritName] = useState('');
  const [newCritDesc, setNewCritDesc] = useState('');
  const [newCritWeight, setNewCritWeight] = useState(20);

  // Calculate weighted score
  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);
  const weightedScore = criteria.reduce((sum, c) => {
    const s = scores[c.id] || 3;
    return sum + (s / 4) * c.weight;
  }, 0);
  const percentage = Math.round((weightedScore / (totalWeight || 1)) * 100);

  const getLetter = (pct: number) => {
    if (pct >= 90) return 'A+';
    if (pct >= 80) return 'A';
    if (pct >= 70) return 'B';
    if (pct >= 60) return 'C';
    return 'D';
  };

  const handleScoreChange = (critId: string, level: number) => {
    setScores(prev => ({ ...prev, [critId]: level }));
    setSavedSuccess(false);
  };

  const handleSaveEvaluation = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddCriterion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCritName.trim()) return;

    const newCrit: RubricCriterion = {
      id: `crit-${Date.now()}`,
      name: newCritName,
      description: newCritDesc || 'Custom assessment criterion',
      weight: Number(newCritWeight) || 15,
      levels: [
        { score: 1, label: 'Beginning', descriptor: 'Requires significant intervention.' },
        { score: 2, label: 'Developing', descriptor: 'Meets minimum standards with assistance.' },
        { score: 3, label: 'Proficient', descriptor: 'Meets high scientific accuracy independently.' },
        { score: 4, label: 'Exemplary', descriptor: 'Exceeds standard with creative leadership.' }
      ]
    };

    setCriteria([...criteria, newCrit]);
    setScores(prev => ({ ...prev, [newCrit.id]: 3 }));
    setShowEditCriteriaModal(false);
    setNewCritName('');
    setNewCritDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Priority Classroom Module Header */}
      <div className="bg-gradient-to-r from-purple-100/90 via-indigo-50/70 to-emerald-100/90 rounded-3xl p-6 border border-purple-200 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold mb-2 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              Ms. Janet&apos;s Priority Science Assessment Standard
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">
              Customizable Science Lab Rubric &amp; Feedback Module
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Calibrated specifically for Primary 5 &amp; 6 Science Investigations at Bina Bangsa School. Measure hypothesis rigor, lab bench safety, data fidelity, and collaborative inquiry.
            </p>
          </div>

          <button
            onClick={() => setShowEditCriteriaModal(true)}
            className="px-4 py-2 rounded-2xl bg-white hover:bg-purple-50 text-purple-900 border border-purple-200 text-xs font-bold transition-all flex items-center gap-2 shadow-2xs shrink-0"
          >
            <Sliders className="w-4 h-4 text-purple-600" />
            Customize Rubric Criteria
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Evaluation Target & Live Grade Summary */}
        <div className="lg:col-span-4 space-y-5">
          {/* Target Selection Card */}
          <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 font-heading mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-600" />
              Select Assessment Target
            </h4>

            {/* Target Type Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl mb-4 text-xs">
              <button
                onClick={() => setSelectedTargetType('group')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                  selectedTargetType === 'group'
                    ? 'bg-purple-600 text-white shadow-2xs'
                    : 'text-slate-600'
                }`}
              >
                Team Assessment
              </button>
              <button
                onClick={() => setSelectedTargetType('student')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                  selectedTargetType === 'student'
                    ? 'bg-purple-600 text-white shadow-2xs'
                    : 'text-slate-600'
                }`}
              >
                Individual Student
              </button>
            </div>

            {selectedTargetType === 'group' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Team
                </label>
                <select
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 text-slate-800"
                >
                  {groups.map(g => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.students.length} members)
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Student
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 text-slate-800"
                >
                  {currentClass.students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.house} House)
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Calculated Grade Ring & Score */}
            <div className="mt-5 p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-emerald-50 border border-purple-100 text-center">
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-1">
                Overall Rubric Score
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-4xl font-extrabold text-purple-900 font-heading">
                  {percentage}%
                </span>
                <span className="text-2xl font-black text-emerald-600 bg-emerald-100 px-3 py-0.5 rounded-xl border border-emerald-200">
                  {getLetter(percentage)}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Calculated across {criteria.length} weighted criteria dimensions.
              </p>
            </div>

            {/* Teacher Feedback Notes */}
            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
                {t.feedbackNotes}
              </label>
              <textarea
                rows={3}
                value={teacherNotes}
                onChange={(e) => setTeacherNotes(e.target.value)}
                placeholder="Write personalized lab feedback or guidance for student/team..."
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              />
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveEvaluation}
              className={`w-full mt-4 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-xs ${
                savedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {savedSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4" /> Saved Evaluation Successfully!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> {t.saveEvaluation}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Rubric Scoring Criteria */}
        <div className="lg:col-span-8 space-y-4">
          {criteria.map((crit) => {
            const currentScore = scores[crit.id] || 3;

            return (
              <div
                key={crit.id}
                className="bg-white rounded-3xl p-5 border border-purple-100 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-slate-900 font-heading">
                        {crit.name}
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-700">
                        Weight: {crit.weight}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{crit.description}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-extrabold text-purple-700">
                      Level {currentScore} / 4
                    </span>
                  </div>
                </div>

                {/* 4 Performance Level Selector Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-1">
                  {crit.levels.map((lvl) => {
                    const isSelected = currentScore === lvl.score;

                    return (
                      <button
                        key={lvl.score}
                        type="button"
                        onClick={() => handleScoreChange(crit.id, lvl.score)}
                        className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                            : 'bg-slate-50/60 hover:bg-purple-50/50 text-slate-700 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${
                            isSelected ? 'text-purple-200' : 'text-slate-400'
                          }`}>
                            Score {lvl.score}
                          </span>
                          <span className={`text-xs font-extrabold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                            {lvl.label}
                          </span>
                        </div>
                        <p className={`text-[11px] leading-snug line-clamp-3 ${
                          isSelected ? 'text-purple-100' : 'text-slate-500'
                        }`}>
                          {lvl.descriptor}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Customize Criteria Modal */}
      {showEditCriteriaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-xl border border-purple-100">
            <h3 className="text-lg font-bold text-slate-900 font-heading mb-3 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-purple-600" />
              Add Custom Science Rubric Dimension
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Add specialized inquiry dimensions (e.g., &quot;Microscopic Slide Preparation Precision&quot; or &quot;Arduino Sensor Calibration&quot;).
            </p>

            <form onSubmit={handleAddCriterion} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Criterion Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Microscopic Slide Mounting Accuracy"
                  value={newCritName}
                  onChange={(e) => setNewCritName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Bubble-free cover slip placement and iodine staining clarity"
                  value={newCritDesc}
                  onChange={(e) => setNewCritDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Weight Percentage (%)</label>
                <input
                  type="number"
                  min="5"
                  max="50"
                  value={newCritWeight}
                  onChange={(e) => setNewCritWeight(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEditCriteriaModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium shadow-xs"
                >
                  Add Dimension
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
