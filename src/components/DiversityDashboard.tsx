import React from 'react';
import {
  PieChart,
  BarChart3,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  CheckCircle,
  Users,
  Compass,
  Zap,
  Info
} from 'lucide-react';
import { StudentGroup, ClassRoom } from '../types';
import { calculateGroupDiversity } from '../utils/groupingEngine';
import { TRANSLATIONS } from '../data/translations';

interface DiversityDashboardProps {
  currentClass: ClassRoom;
  groups: StudentGroup[];
  language: string;
  onAutoRebalance: () => void;
}

export const DiversityDashboard: React.FC<DiversityDashboardProps> = ({
  currentClass,
  groups,
  language,
  onAutoRebalance
}) => {
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;

  // Aggregate stats across all groups
  const totalStudents = currentClass.students.length;
  const totalMales = currentClass.students.filter(s => s.gender === 'M').length;
  const totalFemales = currentClass.students.filter(s => s.gender === 'F').length;

  const houseTotals = {
    Red: currentClass.students.filter(s => s.house === 'Red').length,
    Blue: currentClass.students.filter(s => s.house === 'Blue').length,
    Green: currentClass.students.filter(s => s.house === 'Green').length,
    Yellow: currentClass.students.filter(s => s.house === 'Yellow').length
  };

  const skillTotals = {
    Advanced: currentClass.students.filter(s => s.skillLevel === 'Advanced').length,
    Proficient: currentClass.students.filter(s => s.skillLevel === 'Proficient').length,
    Developing: currentClass.students.filter(s => s.skillLevel === 'Developing').length,
    Beginner: currentClass.students.filter(s => s.skillLevel === 'Beginner').length
  };

  const groupMetrics = groups.map(g => ({
    group: g,
    metrics: calculateGroupDiversity(g.students)
  }));

  const avgDiversityScore =
    groupMetrics.length > 0
      ? Math.round(groupMetrics.reduce((acc, curr) => acc + curr.metrics.overallScore, 0) / groupMetrics.length)
      : 100;

  const totalWarnings = groupMetrics.reduce((acc, curr) => acc + curr.metrics.warnings.length, 0);

  return (
    <div className="space-y-6">
      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Diversity Score */}
        <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t.diversityHealth}
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-heading">
            {avgDiversityScore}%
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Optimal cross-house mix</span>
          </div>
        </div>

        {/* Gender Balance */}
        <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t.genderRatio}
            </span>
            <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-heading">
            {totalFemales} F <span className="text-slate-300">/</span> {totalMales} M
          </div>
          <div className="mt-2 w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
            <div
              className="bg-pink-400 h-full"
              style={{ width: `${(totalFemales / (totalStudents || 1)) * 100}%` }}
              title={`Female: ${Math.round((totalFemales / (totalStudents || 1)) * 100)}%`}
            />
            <div
              className="bg-sky-400 h-full"
              style={{ width: `${(totalMales / (totalStudents || 1)) * 100}%` }}
              title={`Male: ${Math.round((totalMales / (totalStudents || 1)) * 100)}%`}
            />
          </div>
        </div>

        {/* House Variety */}
        <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t.houseSpread}
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-heading flex items-center gap-1.5">
            <span>4 Houses</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold">
            <span className="text-rose-600">{houseTotals.Red} Red</span>
            <span className="text-slate-300">·</span>
            <span className="text-blue-600">{houseTotals.Blue} Blue</span>
            <span className="text-slate-300">·</span>
            <span className="text-emerald-600">{houseTotals.Green} Green</span>
            <span className="text-slate-300">·</span>
            <span className="text-amber-600">{houseTotals.Yellow} Ylw</span>
          </div>
        </div>

        {/* Skill Dispersion */}
        <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t.skillBalance}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-heading">
            {skillTotals.Advanced} Adv <span className="text-slate-300">/</span> {skillTotals.Proficient} Pro
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <span>{skillTotals.Developing} Developing</span>
            <span>·</span>
            <span>{skillTotals.Beginner} Beginner</span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* House Distribution Bar Comparison */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-purple-100 shadow-xs">
          <h4 className="text-sm font-bold text-slate-900 font-heading mb-4 flex items-center gap-2">
            <Compass className="w-4 h-4 text-purple-600" />
            House Representation in {currentClass.name}
          </h4>

          <div className="space-y-3.5">
            {[
              { name: 'Red House', count: houseTotals.Red, color: 'bg-rose-500', text: 'text-rose-700' },
              { name: 'Blue House', count: houseTotals.Blue, color: 'bg-blue-500', text: 'text-blue-700' },
              { name: 'Green House', count: houseTotals.Green, color: 'bg-emerald-500', text: 'text-emerald-700' },
              { name: 'Yellow House', count: houseTotals.Yellow, color: 'bg-amber-500', text: 'text-amber-700' }
            ].map(h => (
              <div key={h.name}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className={`font-semibold ${h.text}`}>{h.name}</span>
                  <span className="font-bold text-slate-700">
                    {h.count} students ({Math.round((h.count / (totalStudents || 1)) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`${h.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${(h.count / (totalStudents || 1)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Levels Breakdown */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-purple-100 shadow-xs">
          <h4 className="text-sm font-bold text-slate-900 font-heading mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-600" />
            Science Skill Level Distribution
          </h4>

          <div className="space-y-3.5">
            {[
              { label: 'Advanced', count: skillTotals.Advanced, color: 'bg-purple-600', text: 'text-purple-700' },
              { label: 'Proficient', count: skillTotals.Proficient, color: 'bg-emerald-500', text: 'text-emerald-700' },
              { label: 'Developing', count: skillTotals.Developing, color: 'bg-blue-400', text: 'text-blue-700' },
              { label: 'Beginner', count: skillTotals.Beginner, color: 'bg-amber-400', text: 'text-amber-700' }
            ].map(s => (
              <div key={s.label}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className={`font-semibold ${s.text}`}>{s.label}</span>
                  <span className="font-bold text-slate-700">
                    {s.count} students ({Math.round((s.count / (totalStudents || 1)) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`${s.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${(s.count / (totalStudents || 1)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Breakdown Table with Individual Health Scores */}
      <div className="bg-white rounded-3xl border border-purple-100 shadow-xs p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-600" />
              Team-by-Team Diversity Health Matrix
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Detailed balance diagnostics comparing gender ratio, house spread, and skill peer mentoring.
            </p>
          </div>

          {totalWarnings > 0 && (
            <button
              onClick={onAutoRebalance}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {t.rebalance} ({totalWarnings} suggestions)
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-purple-50/50 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-purple-100">
              <tr>
                <th className="py-2.5 px-3">Team Name</th>
                <th className="py-2.5 px-3">Members</th>
                <th className="py-2.5 px-3">Gender Balance</th>
                <th className="py-2.5 px-3">House Representation</th>
                <th className="py-2.5 px-3">Avg Skill</th>
                <th className="py-2.5 px-3 text-center">Score</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50/50 text-slate-700">
              {groupMetrics.map(({ group, metrics }) => {
                return (
                  <tr key={group.id} className="hover:bg-purple-50/20">
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {group.name}
                      <div className="text-[10px] text-purple-600 font-normal">
                        {group.topic}
                      </div>
                    </td>
                    <td className="py-3 px-3">{group.students.length} students</td>
                    <td className="py-3 px-3">
                      <span className="font-medium">
                        {metrics.maleCount}M · {metrics.femaleCount}F
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1">
                        {Object.entries(metrics.houseCounts)
                          .filter(([, count]) => count > 0)
                          .map(([house, count]) => (
                            <span
                              key={house}
                              className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 font-bold"
                            >
                              {house[0]}:{count}
                            </span>
                          ))}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono font-medium">
                      {metrics.avgSkillScore} / 4.0
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full font-bold text-[11px] ${
                          metrics.overallScore >= 80
                            ? 'bg-emerald-100 text-emerald-800'
                            : metrics.overallScore >= 60
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {metrics.overallScore}%
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {metrics.warnings.length === 0 ? (
                        <span className="text-emerald-600 font-medium flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Balanced
                        </span>
                      ) : (
                        <span className="text-amber-700 font-medium flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" /> {metrics.warnings[0]}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
