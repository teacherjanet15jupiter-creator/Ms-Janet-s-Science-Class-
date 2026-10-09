import React, { useState } from 'react';
import {
  Users,
  Shuffle,
  Lock,
  Unlock,
  MoveRight,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  Download,
  AlertTriangle,
  CheckCircle2,
  Award,
  Crown
} from 'lucide-react';
import { Student, StudentGroup, ClassRoom } from '../types';
import { GroupingStrategy, autoGenerateGroups, calculateGroupDiversity, manuallyMoveStudent } from '../utils/groupingEngine';
import { exportGroupsToCsv } from '../utils/csvHelper';
import { TRANSLATIONS } from '../data/translations';

interface GroupingViewProps {
  currentClass: ClassRoom;
  groups: StudentGroup[];
  onUpdateGroups: (groups: StudentGroup[]) => void;
  language: string;
}

export const GroupingView: React.FC<GroupingViewProps> = ({
  currentClass,
  groups,
  onUpdateGroups,
  language
}) => {
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;
  const [groupSize, setGroupSize] = useState<number>(4);
  const [strategy, setStrategy] = useState<GroupingStrategy>('stratBalanced');
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingGroupName, setEditingGroupName] = useState<string>('');
  const [moveDropdownStudentId, setMoveDropdownStudentId] = useState<string | null>(null);

  const handleGenerate = () => {
    const generated = autoGenerateGroups(currentClass.students, groupSize, strategy, groups);
    onUpdateGroups(generated);
  };

  const handleToggleLock = (studentId: string, currentGroupId: string) => {
    const updated = groups.map(g => {
      return {
        ...g,
        students: g.students.map(s => {
          if (s.id === studentId) {
            const nextLocked = s.lockedToGroupId ? null : currentGroupId;
            return { ...s, lockedToGroupId: nextLocked };
          }
          return s;
        })
      };
    });
    onUpdateGroups(updated);
  };

  const handleManualMove = (studentId: string, targetGroupId: string) => {
    const updated = manuallyMoveStudent(groups, studentId, targetGroupId);
    onUpdateGroups(updated);
    setMoveDropdownStudentId(null);
  };

  const handleSetLeader = (groupId: string, studentId: string) => {
    const updated = groups.map(g => {
      if (g.id === groupId) {
        return { ...g, leaderId: studentId };
      }
      return g;
    });
    onUpdateGroups(updated);
  };

  const handleAddCustomGroup = () => {
    const newId = `group-${Date.now()}`;
    const newName = `Team Science Alpha ${groups.length + 1}`;
    onUpdateGroups([
      ...groups,
      {
        id: newId,
        name: newName,
        students: [],
        topic: 'Botany & Plant Cells'
      }
    ]);
  };

  const handleDeleteGroup = (groupId: string) => {
    if (confirm('Delete this team? Its members will become unassigned or distributed.')) {
      const target = groups.find(g => g.id === groupId);
      const remaining = groups.filter(g => g.id !== groupId);
      if (target && target.students.length > 0 && remaining.length > 0) {
        // distribute orphaned students to remaining groups
        target.students.forEach((s, idx) => {
          remaining[idx % remaining.length].students.push(s);
        });
      }
      onUpdateGroups(remaining);
    }
  };

  const handleSaveGroupName = (groupId: string) => {
    if (!editingGroupName.trim()) return;
    const updated = groups.map(g => (g.id === groupId ? { ...g, name: editingGroupName } : g));
    onUpdateGroups(updated);
    setEditingGroupId(null);
  };

  return (
    <div className="space-y-6">
      {/* Control Header Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-purple-100 shadow-xs">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5">
          {/* Strategy & Team Size Configuration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 flex-1">
            {/* Algorithm Strategy */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.groupingStrategy}
              </label>
              <select
                value={strategy}
                onChange={(e) => setStrategy(e.target.value as GroupingStrategy)}
                className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50/70 text-slate-800 focus:ring-2 focus:ring-purple-400"
              >
                <option value="stratBalanced">⚖️ Balanced Skills & Diverse Houses</option>
                <option value="stratInterest">🌱 Project Interest Affinity First</option>
                <option value="stratCrossDiscipline">🎭 Cross-Disciplinary CCA Mix</option>
                <option value="stratPureSkill">📊 Skill Equalization Matrix</option>
              </select>
            </div>

            {/* Target Team Size */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.groupSize} (Members per Team)
              </label>
              <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200">
                {[3, 4, 5, 6].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setGroupSize(num)}
                    className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all ${
                      groupSize === num
                        ? 'bg-purple-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-200/60'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Estimated Output */}
            <div className="flex flex-col justify-end">
              <div className="text-xs text-slate-500 bg-purple-50/60 p-2 rounded-xl border border-purple-100 flex items-center justify-between">
                <span>Estimated Teams:</span>
                <span className="font-bold text-purple-900">
                  {Math.ceil(currentClass.students.length / groupSize)} teams ({currentClass.students.length} students)
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 lg:pt-0">
            <button
              onClick={handleGenerate}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
            >
              <Shuffle className="w-4 h-4" />
              {groups.length === 0 ? t.createGroups : t.rebalance}
            </button>

            <button
              onClick={handleAddCustomGroup}
              className="px-3 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add Team
            </button>

            {groups.length > 0 && (
              <button
                onClick={() => exportGroupsToCsv(groups, currentClass.name)}
                className="px-3 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
                title="Export Group Rosters to CSV"
              >
                <Download className="w-4 h-4 text-slate-500" />
                {t.exportCsv}
              </button>
            )}
          </div>
        </div>

        {/* Tip for manual override */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
          <Sparkles className="w-3.5 h-3.5 text-purple-500 shrink-0" />
          <span>
            {t.dragHint} Use the lock icon <Lock className="w-3 h-3 inline text-purple-600" /> to pin specific students to their assigned group during automatic reshuffles.
          </span>
        </div>
      </div>

      {/* No Groups Empty State */}
      {groups.length === 0 && (
        <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-purple-200">
          <div className="w-16 h-16 rounded-3xl bg-purple-50 text-purple-600 mx-auto flex items-center justify-center text-3xl mb-4">
            🧪
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-heading">
            No Teams Formed Yet
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-5">
            Click <strong>Generate Smart Groups</strong> above to automatically distribute {currentClass.students.length} students into balanced science lab teams based on skills, houses, and project affinities.
          </p>
          <button
            onClick={handleGenerate}
            className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm"
          >
            {t.createGroups}
          </button>
        </div>
      )}

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {groups.map((group, gIdx) => {
          const metrics = calculateGroupDiversity(group.students);
          const isOverloaded = group.students.length > groupSize + 1;
          const isUnderloaded = group.students.length < Math.max(2, groupSize - 1);

          return (
            <div
              key={group.id}
              className="bg-white rounded-3xl border border-purple-100 shadow-xs flex flex-col justify-between overflow-hidden transition-all hover:border-purple-300"
            >
              {/* Group Header */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-50/70 to-emerald-50/50 border-b border-purple-100">
                <div className="flex items-center justify-between gap-2 mb-2">
                  {editingGroupId === group.id ? (
                    <div className="flex items-center gap-1.5 flex-1">
                      <input
                        type="text"
                        value={editingGroupName}
                        onChange={(e) => setEditingGroupName(e.target.value)}
                        className="px-2 py-1 text-xs font-bold rounded-lg border border-purple-300 w-full"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveGroupName(group.id)}
                        className="px-2 py-1 bg-purple-600 text-white text-xs font-semibold rounded-lg"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-slate-900 text-sm font-heading flex items-center gap-1.5">
                        {group.name}
                      </h4>
                      <button
                        onClick={() => {
                          setEditingGroupId(group.id);
                          setEditingGroupName(group.name);
                        }}
                        className="text-slate-400 hover:text-purple-600 p-0.5"
                        title="Rename Team"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        metrics.overallScore >= 80
                          ? 'bg-emerald-100 text-emerald-800'
                          : metrics.overallScore >= 60
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                      title={`Diversity Health Score: ${metrics.overallScore}%`}
                    >
                      {metrics.overallScore}% Balanced
                    </span>
                    <button
                      onClick={() => handleDeleteGroup(group.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-lg"
                      title="Remove Team"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Team Topic & Diversity breakdown */}
                <div className="flex items-center justify-between text-[11px] text-slate-600 mt-1">
                  <span className="font-medium text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-md">
                    🔬 {group.topic || 'General Science Inquiry'}
                  </span>
                  <span className="text-slate-400 font-mono">
                    {group.students.length} members
                  </span>
                </div>

                {/* Micro Metric Pills */}
                <div className="flex items-center gap-2 mt-2.5 text-[10px] text-slate-500 font-medium">
                  <span title="Gender Count">
                    {metrics.maleCount}M · {metrics.femaleCount}F
                  </span>
                  <span>·</span>
                  <span title="House Variety">
                    {Object.values(metrics.houseCounts).filter(c => c > 0).length} Houses
                  </span>
                  <span>·</span>
                  <span title="Average Skill Level">
                    Avg Skill {metrics.avgSkillScore}/4.0
                  </span>
                </div>

                {/* Warnings if any */}
                {metrics.warnings.length > 0 && (
                  <div className="mt-2 text-[10px] text-amber-700 bg-amber-50/80 px-2 py-1 rounded-lg border border-amber-200 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                    <span>{metrics.warnings[0]}</span>
                  </div>
                )}
              </div>

              {/* Students Member List */}
              <div className="p-4 space-y-2.5 flex-1 min-h-[220px]">
                {group.students.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 text-xs py-8">
                    <span>Empty Team</span>
                    <span className="text-[10px] text-slate-400 mt-1">
                      Move students here using the transfer action
                    </span>
                  </div>
                ) : (
                  group.students.map((student) => {
                    const isLeader = group.leaderId === student.id;
                    const isLocked = Boolean(student.lockedToGroupId);

                    return (
                      <div
                        key={student.id}
                        className="p-2.5 rounded-2xl border border-slate-100 hover:border-purple-200 bg-slate-50/60 hover:bg-white transition-all text-xs flex items-center justify-between gap-2 shadow-2xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {/* Leader Crown button */}
                          <button
                            onClick={() => handleSetLeader(group.id, student.id)}
                            className={`p-1 rounded-md transition-colors ${
                              isLeader
                                ? 'text-amber-500 hover:text-amber-600'
                                : 'text-slate-300 hover:text-amber-400'
                            }`}
                            title={isLeader ? 'Group Leader' : 'Promote to Team Leader'}
                          >
                            <Crown className="w-3.5 h-3.5 fill-current" />
                          </button>

                          <div className="truncate">
                            <div className="font-semibold text-slate-900 truncate flex items-center gap-1">
                              <span>{student.name}</span>
                              <span
                                className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                                  student.gender === 'F' ? 'text-pink-600' : 'text-blue-600'
                                }`}
                              >
                                {student.gender}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                              <span
                                className={`px-1 rounded text-[9px] font-semibold ${
                                  student.house === 'Red'
                                    ? 'bg-rose-100 text-rose-700'
                                    : student.house === 'Blue'
                                    ? 'bg-blue-100 text-blue-700'
                                    : student.house === 'Green'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {student.house}
                              </span>
                              <span>·</span>
                              <span className="font-medium text-slate-600">
                                {student.roleInTeam || student.skillLevel}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions: Lock & Move */}
                        <div className="flex items-center gap-1 shrink-0 relative">
                          {/* Pin / Lock Toggle */}
                          <button
                            onClick={() => handleToggleLock(student.id, group.id)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isLocked
                                ? 'bg-purple-100 text-purple-700'
                                : 'text-slate-400 hover:text-purple-600 hover:bg-slate-100'
                            }`}
                            title={isLocked ? t.locked : 'Lock student to this team'}
                          >
                            {isLocked ? (
                              <Lock className="w-3.5 h-3.5" />
                            ) : (
                              <Unlock className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* Reassign Move Dropdown */}
                          <div className="relative">
                            <button
                              onClick={() =>
                                setMoveDropdownStudentId(
                                  moveDropdownStudentId === student.id ? null : student.id
                                )
                              }
                              className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                              title="Transfer student to another team"
                            >
                              <MoveRight className="w-3.5 h-3.5" />
                            </button>

                            {moveDropdownStudentId === student.id && (
                              <div className="absolute right-0 top-8 z-30 w-44 bg-white rounded-xl shadow-lg border border-purple-100 p-1.5 text-xs">
                                <div className="text-[10px] font-bold text-slate-400 px-2 py-1">
                                  Move to:
                                </div>
                                {groups
                                  .filter(g => g.id !== group.id)
                                  .map(targetG => (
                                    <button
                                      key={targetG.id}
                                      onClick={() => handleManualMove(student.id, targetG.id)}
                                      className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-purple-50 text-slate-700 font-medium text-xs flex items-center justify-between"
                                    >
                                      <span className="truncate">{targetG.name}</span>
                                      <span className="text-[10px] text-slate-400">
                                        ({targetG.students.length})
                                      </span>
                                    </button>
                                  ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Group Footer: Add Member Shortcut */}
              <div className="p-3 bg-slate-50/70 border-t border-slate-100 text-center">
                <span className="text-[11px] text-slate-400 font-medium">
                  {metrics.maleCount > 0 && metrics.femaleCount > 0
                    ? '✨ Gender Balanced'
                    : '⚠️ Gender Imbalanced'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
