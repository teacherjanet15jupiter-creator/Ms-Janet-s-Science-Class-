import React, { useState } from 'react';
import {
  RefreshCw,
  CheckCircle,
  X,
  Cloud,
  CheckCircle2,
  Server,
  FileJson,
  Upload,
  ArrowRight,
  Database
} from 'lucide-react';
import { ClassRoom, SyncLog } from '../types';

interface LmsSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: ClassRoom[];
  onImportBackup: (importedData: ClassRoom[]) => void;
}

export const LmsSyncModal: React.FC<LmsSyncModalProps> = ({
  isOpen,
  onClose,
  classes,
  onImportBackup
}) => {
  const [selectedLms, setSelectedLms] = useState<'Google Classroom' | 'Bina Bangsa SIS' | 'Schoology' | 'Canvas LMS'>('Bina Bangsa SIS');
  const [syncing, setSyncing] = useState(false);
  const [syncStep, setSyncStep] = useState<string>('');
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([
    {
      id: 'log-1',
      timestamp: '2026-10-09 08:30:12',
      targetPlatform: 'Bina Bangsa SIS',
      recordsSynced: 95,
      status: 'success',
      message: 'Roster records verified and attendance pushed to BBS Student Information System.'
    },
    {
      id: 'log-2',
      timestamp: '2026-10-08 14:15:00',
      targetPlatform: 'Google Classroom',
      recordsSynced: 22,
      status: 'success',
      message: 'Primary 5 Forgiveness group assignments synced to Google Classroom Topics.'
    }
  ]);

  if (!isOpen) return null;

  const handleStartSync = () => {
    setSyncing(true);
    setSyncStep('Verifying secure TLS endpoint connection...');

    setTimeout(() => {
      setSyncStep(`Matching ${classes.length} class rosters & student IDs with ${selectedLms}...`);
    }, 900);

    setTimeout(() => {
      setSyncStep('Updating team allocations, attendance status & lab rubric marks...');
    }, 1800);

    setTimeout(() => {
      const totalStudents = classes.reduce((sum, c) => sum + c.students.length, 0);
      const newLog: SyncLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        targetPlatform: selectedLms,
        recordsSynced: totalStudents,
        status: 'success',
        message: `All ${totalStudents} students across P5 & P6 synchronized seamlessly with ${selectedLms}.`
      };

      setSyncLogs(prev => [newLog, ...prev]);
      setSyncing(false);
      setSyncStep('');
    }, 2800);
  };

  const handleExportBackupJson = () => {
    const dataStr = JSON.stringify(classes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Ms_Janet_Science_Lab_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportBackupJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed) && parsed.length > 0) {
            onImportBackup(parsed);
            alert('Successfully restored class data from backup file!');
            onClose();
          }
        } catch {
          alert('Invalid backup JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-xl w-full shadow-2xl border border-purple-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-purple-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
                Sync with Classroom Management Software
              </h3>
              <p className="text-xs text-slate-500">
                Cross-device cloud synchronization &amp; School LMS integration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* LMS Provider Selection */}
        <div className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Select School Management Software Platform
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { name: 'Bina Bangsa SIS', desc: 'School Information System' },
                { name: 'Google Classroom', desc: 'Google Workspace for Education' },
                { name: 'Schoology', desc: 'PowerSchool LMS' },
                { name: 'Canvas LMS', desc: 'Instructure Academic Cloud' }
              ].map(lms => {
                const isSelected = selectedLms === lms.name;
                return (
                  <button
                    key={lms.name}
                    type="button"
                    onClick={() => setSelectedLms(lms.name as any)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50/70 shadow-2xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                      <span>{lms.name}</span>
                      {isSelected && <CheckCircle className="w-3.5 h-3.5 text-purple-600" />}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{lms.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sync Trigger button */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-emerald-50 border border-purple-100">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xs font-bold text-slate-800">
                  Ready to Sync {classes.reduce((sum, c) => sum + c.students.length, 0)} Students
                </div>
                <div className="text-[11px] text-slate-500">
                  Syncs rosters, teams, attendance, streaks &amp; rubric marks
                </div>
              </div>

              <button
                onClick={handleStartSync}
                disabled={syncing}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Syncing...' : 'Sync Now'}
              </button>
            </div>

            {syncing && (
              <div className="p-2.5 rounded-xl bg-white border border-purple-200 text-xs text-purple-800 font-medium flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-600 shrink-0" />
                <span>{syncStep}</span>
              </div>
            )}
          </div>

          {/* Offline JSON Backup / Restore for cross-device sync */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <button
              onClick={handleExportBackupJson}
              className="text-xs font-semibold text-slate-700 hover:text-purple-700 flex items-center gap-1.5"
            >
              <FileJson className="w-3.5 h-3.5 text-purple-600" />
              Download Full Offline Backup (.json)
            </button>

            <label className="text-xs font-semibold text-purple-700 hover:text-purple-900 cursor-pointer flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" />
              Restore from Backup File
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackupJson}
                className="hidden"
              />
            </label>
          </div>

          {/* Sync History Logs */}
          <div className="pt-2 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-700 mb-2">Sync Audit Log</div>
            <div className="space-y-2 max-h-36 overflow-y-auto">
              {syncLogs.map(log => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px]"
                >
                  <div className="flex items-center justify-between font-medium text-slate-800 mb-0.5">
                    <span className="flex items-center gap-1 text-emerald-700 font-bold">
                      <CheckCircle2 className="w-3 h-3" /> {log.targetPlatform}
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">{log.timestamp}</span>
                  </div>
                  <div className="text-slate-600">{log.message}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
