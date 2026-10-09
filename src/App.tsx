import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Shuffle,
  PieChart,
  Award,
  CalendarCheck,
  FileText,
  Sparkles,
  Wifi,
  WifiOff,
  UserCheck,
  Shield,
  Layers,
  Flame,
  Plus
} from 'lucide-react';
import { ClassRoom, Language, UserRole, Student, StudentGroup } from './types';
import { INITIAL_CLASSES } from './data/initialData';
import { TRANSLATIONS } from './data/translations';
import { autoGenerateGroups, calculateGroupDiversity } from './utils/groupingEngine';
import { Navbar } from './components/Navbar';
import { Banner } from './components/Banner';
import { ClassOverview } from './components/ClassOverview';
import { GroupingView } from './components/GroupingView';
import { DiversityDashboard } from './components/DiversityDashboard';
import { RubricsModule } from './components/RubricsModule';
import { AttendanceModule } from './components/AttendanceModule';
import { ParentReportModule } from './components/ParentReportModule';
import { StudentGamifiedView } from './components/StudentGamifiedView';
import { ParentalView } from './components/ParentalView';
import { LmsSyncModal } from './components/LmsSyncModal';
import { PrintableReport } from './components/PrintableReport';

export default function App() {
  // Load saved classes or initialize with default P5 & P6 classes
  const [classes, setClasses] = useState<ClassRoom[]>(() => {
    try {
      const saved = localStorage.getItem('ms_janet_science_classes_v2');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }

    // Auto-generate initial groups for each class
    return INITIAL_CLASSES.map(cls => ({
      ...cls,
      groups: autoGenerateGroups(cls.students, 4, 'stratBalanced')
    }));
  });

  const [currentClassId, setCurrentClassId] = useState<string>('p5-forgiveness');
  const [userRole, setUserRole] = useState<UserRole>('teacher');
  const [activeTab, setActiveTab] = useState<
    'roster' | 'grouping' | 'diversity' | 'rubrics' | 'attendance' | 'parentReports'
  >('grouping');
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('ms_janet_lang') as Language) || 'en';
  });
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isSimulateOffline, setIsSimulateOffline] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassTeacher, setNewClassTeacher] = useState('');
  const [newClassGrade, setNewClassGrade] = useState<5 | 6>(5);
  const [newClassRoom, setNewClassRoom] = useState('A 405');

  // Translations
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Persist classes to localStorage whenever updated (offline support)
  useEffect(() => {
    try {
      localStorage.setItem('ms_janet_science_classes_v2', JSON.stringify(classes));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [classes]);

  // Handle Online/Offline window events
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const effectiveOffline = !isOnline || isSimulateOffline;

  const currentClass = useMemo(() => {
    return classes.find(c => c.id === currentClassId) || classes[0];
  }, [classes, currentClassId]);

  const handleUpdateStudents = (updatedStudents: Student[]) => {
    setClasses(prev =>
      prev.map(c => {
        if (c.id === currentClassId) {
          // Re-evaluate group references with updated student info
          const updatedGroups = c.groups.map(g => ({
            ...g,
            students: g.students.map(m => {
              const fresh = updatedStudents.find(s => s.id === m.id);
              return fresh || m;
            })
          }));
          return {
            ...c,
            students: updatedStudents,
            groups: updatedGroups
          };
        }
        return c;
      })
    );
  };

  const handleUpdateGroups = (updatedGroups: StudentGroup[]) => {
    setClasses(prev =>
      prev.map(c => {
        if (c.id === currentClassId) {
          return { ...c, groups: updatedGroups };
        }
        return c;
      })
    );
  };

  const handleAutoRebalance = () => {
    const rebalanced = autoGenerateGroups(currentClass.students, 4, 'stratBalanced', currentClass.groups);
    handleUpdateGroups(rebalanced);
  };

  const handleAddClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    const newClass: ClassRoom = {
      id: `class-${Date.now()}`,
      name: newClassName.trim(),
      gradeLevel: newClassGrade,
      formTeacher: newClassTeacher || 'Faculty Member',
      room: newClassRoom || 'A 410',
      isPriorityModule: false,
      students: [],
      groups: []
    };

    setClasses(prev => [...prev, newClass]);
    setCurrentClassId(newClass.id);
    setShowAddClassModal(false);
    setNewClassName('');
    setNewClassTeacher('');
  };

  // Overall Diversity Metric for Banner
  const currentDiversityScore = useMemo(() => {
    if (!currentClass.groups.length) return 100;
    const scores = currentClass.groups.map(g => calculateGroupDiversity(g.students).overallScore);
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }, [currentClass.groups]);

  // Overall Attendance streak average
  const avgClassStreak = useMemo(() => {
    if (!currentClass.students.length) return 5;
    return Math.round(
      currentClass.students.reduce((a, b) => a + b.streakDays, 0) / currentClass.students.length
    );
  }, [currentClass.students]);

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-800 flex flex-col selection:bg-purple-200 selection:text-purple-900">
      {/* Top Navbar */}
      <Navbar
        classes={classes}
        currentClassId={currentClassId}
        onSelectClass={setCurrentClassId}
        userRole={userRole}
        onChangeRole={setUserRole}
        language={language}
        onChangeLanguage={(l) => {
          setLanguage(l);
          localStorage.setItem('ms_janet_lang', l);
        }}
        isOffline={effectiveOffline}
        onToggleSimulateOffline={() => setIsSimulateOffline(!isSimulateOffline)}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        onTriggerPrint={() => window.print()}
        onAddNewClass={() => setShowAddClassModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 no-print">
        {/* Banner with Cartoon of Ms. Janet, Students, Einstein & Mascot */}
        <Banner
          currentClass={currentClass}
          activeGroupCount={currentClass.groups.length}
          overallDiversity={currentDiversityScore}
          streakCount={avgClassStreak}
        />

        {/* View Switcher based on Role */}
        {userRole === 'student' ? (
          /* Student Gamified Hub */
          <StudentGamifiedView
            students={currentClass.students}
            groups={currentClass.groups}
            language={language}
          />
        ) : userRole === 'parent' ? (
          /* Parental Portal & Controls */
          <ParentalView
            students={currentClass.students}
            language={language}
          />
        ) : (
          /* Faculty / Teacher / Admin Multi-Tab Dashboard */
          <div className="space-y-6">
            {/* Navigation Tabs Bar */}
            <div className="bg-white rounded-2xl p-1.5 border border-purple-100 shadow-2xs flex items-center overflow-x-auto gap-1 no-scrollbar">
              <button
                onClick={() => setActiveTab('grouping')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'grouping'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50/70'
                }`}
              >
                <Shuffle className="w-4 h-4" />
                {t.tabGrouping}
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  activeTab === 'grouping' ? 'bg-purple-700 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {currentClass.groups.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('roster')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'roster'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50/70'
                }`}
              >
                <Users className="w-4 h-4" />
                {t.tabRoster}
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  activeTab === 'roster' ? 'bg-purple-700 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {currentClass.students.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('diversity')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'diversity'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50/70'
                }`}
              >
                <PieChart className="w-4 h-4" />
                {t.tabDiversity}
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  activeTab === 'diversity' ? 'bg-purple-700 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {currentDiversityScore}%
                </span>
              </button>

              <button
                onClick={() => setActiveTab('rubrics')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'rubrics'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50/70'
                }`}
              >
                <Award className="w-4 h-4" />
                {t.tabRubrics}
                {currentClass.isPriorityModule && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('attendance')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'attendance'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50/70'
                }`}
              >
                <CalendarCheck className="w-4 h-4" />
                {t.tabAttendance}
              </button>

              <button
                onClick={() => setActiveTab('parentReports')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'parentReports'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50/70'
                }`}
              >
                <FileText className="w-4 h-4" />
                {t.tabParentReports}
              </button>
            </div>

            {/* Tab Views */}
            {activeTab === 'grouping' && (
              <GroupingView
                currentClass={currentClass}
                groups={currentClass.groups}
                onUpdateGroups={handleUpdateGroups}
                language={language}
              />
            )}

            {activeTab === 'roster' && (
              <ClassOverview
                currentClass={currentClass}
                onUpdateStudents={handleUpdateStudents}
                language={language}
              />
            )}

            {activeTab === 'diversity' && (
              <DiversityDashboard
                currentClass={currentClass}
                groups={currentClass.groups}
                language={language}
                onAutoRebalance={handleAutoRebalance}
              />
            )}

            {activeTab === 'rubrics' && (
              <RubricsModule
                currentClass={currentClass}
                groups={currentClass.groups}
                language={language}
              />
            )}

            {activeTab === 'attendance' && (
              <AttendanceModule
                currentClass={currentClass}
                onUpdateStudents={handleUpdateStudents}
                language={language}
              />
            )}

            {activeTab === 'parentReports' && (
              <ParentReportModule
                currentClass={currentClass}
                language={language}
              />
            )}
          </div>
        )}
      </main>

      {/* Printable PDF Layout (Visible only when window.print() is executed) */}
      <PrintableReport
        currentClass={currentClass}
        groups={currentClass.groups}
      />

      {/* LMS Sync Modal */}
      <LmsSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        classes={classes}
        onImportBackup={setClasses}
      />

      {/* Add New Class Modal */}
      {showAddClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-xl border border-purple-100">
            <h3 className="text-lg font-bold text-slate-900 font-heading mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-600" />
              Add New Primary Class
            </h3>
            <form onSubmit={handleAddClassSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Class Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Primary 6 Diligence"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Grade Level</label>
                  <select
                    value={newClassGrade}
                    onChange={(e) => setNewClassGrade(Number(e.target.value) as 5 | 6)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  >
                    <option value={5}>Primary 5</option>
                    <option value={6}>Primary 6</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Room Number</label>
                  <input
                    type="text"
                    placeholder="e.g. A 407"
                    value={newClassRoom}
                    onChange={(e) => setNewClassRoom(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Form Teacher</label>
                <input
                  type="text"
                  placeholder="e.g. Ms. EVELYN TAN"
                  value={newClassTeacher}
                  onChange={(e) => setNewClassTeacher(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddClassModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium shadow-xs"
                >
                  Create Class Tab
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-purple-100 bg-white/70 py-4 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-medium">
            <span>Ms. Janet&apos;s Science Lab Platform</span>
            <span>·</span>
            <span className="text-purple-700 font-semibold">Primary 5 &amp; 6 Division</span>
            <span>·</span>
            <span>Bina Bangsa School</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>Offline Sync Enabled</span>
            <span>·</span>
            <span>Pastel Calming Palette</span>
            <span>·</span>
            <span>Global Multi-Language</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
