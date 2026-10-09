import React from 'react';
import {
  Sparkles,
  Wifi,
  WifiOff,
  RefreshCw,
  Printer,
  Globe,
  UserCheck,
  GraduationCap,
  Users,
  Shield,
  FileSpreadsheet
} from 'lucide-react';
import { ClassRoom, Language, UserRole } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface NavbarProps {
  classes: ClassRoom[];
  currentClassId: string;
  onSelectClass: (classId: string) => void;
  userRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  language: Language;
  onChangeLanguage: (lang: Language) => void;
  isOffline: boolean;
  onToggleSimulateOffline: () => void;
  onOpenSyncModal: () => void;
  onTriggerPrint: () => void;
  onAddNewClass: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  classes,
  currentClassId,
  onSelectClass,
  userRole,
  onChangeRole,
  language,
  onChangeLanguage,
  isOffline,
  onToggleSimulateOffline,
  onOpenSyncModal,
  onTriggerPrint,
  onAddNewClass
}) => {
  const t = TRANSLATIONS[language];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-purple-100 shadow-xs no-print">
      {/* Top Utility Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-emerald-400 flex items-center justify-center text-white shadow-sm ring-2 ring-purple-100">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight font-heading">
                Ms. Janet&apos;s Science Lab
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Bina Bangsa School
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Action Controls: Role Switcher, Offline Indicator, Sync, Language, Print */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* Role Switcher */}
          <div className="flex items-center bg-purple-50/80 p-0.5 rounded-xl border border-purple-200/80">
            <button
              onClick={() => onChangeRole('teacher')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                userRole === 'teacher'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-purple-900 hover:bg-purple-100'
              }`}
              title="Faculty / Teacher Mode"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t.roleFaculty}</span>
              <span className="md:hidden">Teacher</span>
            </button>
            <button
              onClick={() => onChangeRole('student')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                userRole === 'student'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-purple-900 hover:bg-purple-100'
              }`}
              title="Student View & Quests"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t.roleStudent}</span>
              <span className="md:hidden">Student</span>
            </button>
            <button
              onClick={() => onChangeRole('parent')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                userRole === 'parent'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-purple-900 hover:bg-purple-100'
              }`}
              title="Parental Progress Portal"
            >
              <Users className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t.roleParent}</span>
              <span className="md:hidden">Parent</span>
            </button>
            <button
              onClick={() => onChangeRole('admin')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                userRole === 'admin'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-purple-900 hover:bg-purple-100'
              }`}
              title="Administrator Controls"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t.roleAdmin}</span>
              <span className="md:hidden">Admin</span>
            </button>
          </div>

          {/* Offline Status & Toggle */}
          <button
            onClick={onToggleSimulateOffline}
            className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 font-medium transition-colors ${
              isOffline
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-emerald-50 text-emerald-800 border-emerald-300'
            }`}
            title="Click to toggle offline simulation"
          >
            {isOffline ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden lg:inline">{t.offlineStatus}</span>
                <span className="lg:hidden">Offline</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden lg:inline">{t.onlineStatus}</span>
                <span className="lg:hidden">Online</span>
              </>
            )}
          </button>

          {/* Sync Button */}
          <button
            onClick={onOpenSyncModal}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 transition-colors flex items-center gap-1.5 font-medium"
            title="Sync with Google Classroom / BBS SIS"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sync LMS</span>
          </button>

          {/* Print / Export PDF */}
          <button
            onClick={onTriggerPrint}
            className="px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors flex items-center gap-1.5 font-medium shadow-2xs"
            title="Print or Save PDF Report"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.exportPdf}</span>
          </button>

          {/* Language Switcher */}
          <div className="relative flex items-center bg-slate-100 rounded-xl px-2 py-1 border border-slate-200 text-slate-700">
            <Globe className="w-3.5 h-3.5 mr-1 text-slate-500" />
            <select
              value={language}
              onChange={(e) => onChangeLanguage(e.target.value as Language)}
              className="bg-transparent border-none text-xs font-medium focus:ring-0 cursor-pointer pr-1"
            >
              <option value="en">English (EN)</option>
              <option value="id">Bahasa Indonesia (ID)</option>
              <option value="zh">中文 (ZH)</option>
              <option value="es">Español (ES)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Class Level Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-purple-50 bg-purple-50/30">
        <div className="flex items-center justify-between overflow-x-auto py-2 no-scrollbar gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-900 mr-2 flex items-center gap-1">
              <FileSpreadsheet className="w-3.5 h-3.5 text-purple-600" />
              Classes:
            </span>
            {classes.map((cls) => {
              const isSelected = cls.id === currentClassId;
              return (
                <button
                  key={cls.id}
                  onClick={() => onSelectClass(cls.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-white hover:bg-purple-100/70 text-slate-700 border border-purple-100'
                  }`}
                >
                  {cls.isPriorityModule && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-200 animate-pulse" />
                  )}
                  <span>{cls.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                      isSelected ? 'bg-purple-700 text-purple-100' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {cls.students.length}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            onClick={onAddNewClass}
            className="text-xs font-medium text-purple-700 hover:text-purple-900 bg-white hover:bg-purple-50 border border-dashed border-purple-300 px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1 shadow-2xs"
          >
            + Add New Class / Import
          </button>
        </div>
      </div>
    </header>
  );
};
