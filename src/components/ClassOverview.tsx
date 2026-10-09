import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Upload,
  UserPlus,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Sparkles,
  Flame,
  Award,
  ChevronDown
} from 'lucide-react';
import { ClassRoom, Student, AttendanceStatus, SkillLevel, ScienceInterest, House, Gender } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { exportRosterToCsv, downloadSampleCsvTemplate, parseCsvRoster } from '../utils/csvHelper';

interface ClassOverviewProps {
  currentClass: ClassRoom;
  onUpdateStudents: (updatedStudents: Student[]) => void;
  language: string;
}

export const ClassOverview: React.FC<ClassOverviewProps> = ({
  currentClass,
  onUpdateStudents,
  language
}) => {
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;
  const [searchTerm, setSearchTerm] = useState('');
  const [houseFilter, setHouseFilter] = useState<string>('all');
  const [skillFilter, setSkillFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // New Student Form State
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    name: '',
    id: '',
    gender: 'F',
    house: 'Red',
    musicInstrument: 'Violin',
    cca: 'Robotics',
    skillLevel: 'Proficient',
    scienceInterest: 'Botany & Plant Cells'
  });

  const filteredStudents = useMemo(() => {
    return currentClass.students.filter(s => {
      const matchSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.includes(searchTerm) ||
        s.cca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.musicInstrument.toLowerCase().includes(searchTerm.toLowerCase());
      const matchHouse = houseFilter === 'all' || s.house === houseFilter;
      const matchSkill = skillFilter === 'all' || s.skillLevel === skillFilter;
      const matchGender = genderFilter === 'all' || s.gender === genderFilter;
      return matchSearch && matchHouse && matchSkill && matchGender;
    });
  }, [currentClass.students, searchTerm, houseFilter, skillFilter, genderFilter]);

  const handleAttendanceChange = (studentId: string, status: AttendanceStatus) => {
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

  const handleMarkAllPresent = () => {
    const updated = currentClass.students.map(s => ({
      ...s,
      attendance: 'present' as AttendanceStatus
    }));
    onUpdateStudents(updated);
  };

  const handleSkillChange = (studentId: string, skill: SkillLevel) => {
    const updated = currentClass.students.map(s => (s.id === studentId ? { ...s, skillLevel: skill } : s));
    onUpdateStudents(updated);
  };

  const handleInterestChange = (studentId: string, interest: ScienceInterest) => {
    const updated = currentClass.students.map(s => (s.id === studentId ? { ...s, scienceInterest: interest } : s));
    onUpdateStudents(updated);
  };

  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.id) return;

    const student: Student = {
      id: newStudent.id,
      name: newStudent.name,
      gender: newStudent.gender as Gender,
      house: newStudent.house as House,
      musicInstrument: newStudent.musicInstrument || 'Ensemble',
      cca: newStudent.cca || 'Science Club',
      skillLevel: (newStudent.skillLevel as SkillLevel) || 'Proficient',
      scienceInterest: (newStudent.scienceInterest as ScienceInterest) || 'Botany & Plant Cells',
      attendance: 'present',
      streakDays: 1,
      xp: 100,
      badges: ['lab-safety-hero'],
      parentName: `Parent of ${newStudent.name}`
    };

    onUpdateStudents([...currentClass.students, student]);
    setShowAddModal(false);
    setNewStudent({
      name: '',
      id: '',
      gender: 'F',
      house: 'Red',
      musicInstrument: 'Violin',
      cca: 'Robotics',
      skillLevel: 'Proficient',
      scienceInterest: 'Botany & Plant Cells'
    });
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const parsed = parseCsvRoster(text);
        if (parsed.length > 0) {
          onUpdateStudents(parsed);
          alert(`Successfully imported ${parsed.length} students into ${currentClass.name}!`);
        } else {
          alert('Could not parse any valid student records. Please ensure CSV headers match the template.');
        }
      };
      reader.readAsText(file);
    }
  };

  const getHouseBadgeColor = (house: House) => {
    switch (house) {
      case 'Red':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'Blue':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Green':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Yellow':
        return 'text-amber-800 bg-amber-50 border-amber-200';
    }
  };

  const getSkillColor = (skill: SkillLevel) => {
    switch (skill) {
      case 'Advanced':
        return 'text-purple-700 bg-purple-50 border-purple-200 font-bold';
      case 'Proficient':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200 font-semibold';
      case 'Developing':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Beginner':
        return 'text-amber-700 bg-amber-50 border-amber-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-purple-100/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search student name, ID number, CCA, or music instrument..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-slate-50/50"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* House Filter */}
          <select
            value={houseFilter}
            onChange={(e) => setHouseFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-purple-400"
          >
            <option value="all">All Houses</option>
            <option value="Red">Red House</option>
            <option value="Blue">Blue House</option>
            <option value="Green">Green House</option>
            <option value="Yellow">Yellow House</option>
          </select>

          {/* Skill Filter */}
          <select
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-purple-400"
          >
            <option value="all">All Skill Levels</option>
            <option value="Advanced">Advanced</option>
            <option value="Proficient">Proficient</option>
            <option value="Developing">Developing</option>
            <option value="Beginner">Beginner</option>
          </select>

          {/* Gender Filter */}
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-purple-400"
          >
            <option value="all">All Genders</option>
            <option value="F">Female (F)</option>
            <option value="M">Male (M)</option>
          </select>

          {/* Actions */}
          <button
            onClick={handleMarkAllPresent}
            className="px-3 py-2 text-xs font-medium rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Mark all students present"
          >
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            {t.markAllPresent}
          </button>
        </div>
      </div>

      {/* CSV and Add Student Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">
            Showing <strong className="text-slate-800">{filteredStudents.length}</strong> of{' '}
            <strong className="text-slate-800">{currentClass.students.length}</strong> students
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Add Student */}
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Add Student
          </button>

          {/* Export CSV */}
          <button
            onClick={() => exportRosterToCsv(currentClass.students, currentClass.name)}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium transition-colors flex items-center gap-1.5"
            title="Download CSV file for current class roster"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            {t.exportCsv}
          </button>

          {/* Download CSV Template */}
          <button
            onClick={downloadSampleCsvTemplate}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 font-medium transition-colors"
            title="Download blank template CSV"
          >
            CSV Template
          </button>

          {/* Upload CSV */}
          <label className="px-3 py-1.5 rounded-xl bg-mint-lavender/60 hover:bg-mint-lavender text-purple-900 border border-purple-200 font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs">
            <Upload className="w-3.5 h-3.5 text-purple-700" />
            {t.importCsv}
            <input
              type="file"
              accept=".csv"
              onChange={handleCsvUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Student Roster Table */}
      <div className="bg-white rounded-3xl border border-purple-100 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/80 border-b border-purple-100 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">No. / ID</th>
                <th className="py-3.5 px-4">Student Name</th>
                <th className="py-3.5 px-3">Gender</th>
                <th className="py-3.5 px-3">House</th>
                <th className="py-3.5 px-4">Music &amp; CCA</th>
                <th className="py-3.5 px-4">Skill Level</th>
                <th className="py-3.5 px-4">Science Interest</th>
                <th className="py-3.5 px-4 text-center">Attendance</th>
                <th className="py-3.5 px-4 text-center">Streak &amp; XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50/60 text-slate-700">
              {filteredStudents.map((student, idx) => {
                return (
                  <tr
                    key={student.id}
                    className="hover:bg-purple-50/40 transition-colors group"
                  >
                    {/* Index & ID */}
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                      <span className="font-bold text-slate-600 mr-1.5">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      {student.id}
                    </td>

                    {/* Name */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        {student.name}
                        {student.badges.includes('team-catalyst') && (
                          <span title="Team Catalyst Leader" className="text-amber-500">
                            🌟
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {student.roleInTeam ? (
                          <span className="text-purple-600 font-medium">
                            Role: {student.roleInTeam}
                          </span>
                        ) : (
                          'No team assigned'
                        )}
                      </div>
                    </td>

                    {/* Gender */}
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold ${
                          student.gender === 'F'
                            ? 'text-pink-700 bg-pink-50'
                            : 'text-sky-700 bg-sky-50'
                        }`}
                      >
                        {student.gender}
                      </span>
                    </td>

                    {/* House */}
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getHouseBadgeColor(
                          student.house
                        )}`}
                      >
                        {student.house}
                      </span>
                    </td>

                    {/* Music & CCA */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">
                        {student.musicInstrument || '—'}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        {student.cca || 'General'}
                      </div>
                    </td>

                    {/* Skill Level Selector */}
                    <td className="py-3 px-4">
                      <select
                        value={student.skillLevel}
                        onChange={(e) =>
                          handleSkillChange(student.id, e.target.value as SkillLevel)
                        }
                        className={`px-2.5 py-1 rounded-xl text-xs font-medium border focus:ring-2 focus:ring-purple-400 cursor-pointer ${getSkillColor(
                          student.skillLevel
                        )}`}
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Developing">Developing</option>
                        <option value="Proficient">Proficient</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </td>

                    {/* Science Interest Selector */}
                    <td className="py-3 px-4">
                      <select
                        value={student.scienceInterest}
                        onChange={(e) =>
                          handleInterestChange(student.id, e.target.value as ScienceInterest)
                        }
                        className="px-2 py-1 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-700 focus:ring-2 focus:ring-purple-400 max-w-[170px] truncate"
                      >
                        <option value="Botany & Plant Cells">🌿 Botany & Plant Cells</option>
                        <option value="Robotics & Automation">🤖 Robotics & Automation</option>
                        <option value="Renewable Energy & Physics">⚡ Renewable Energy & Physics</option>
                        <option value="Chemistry & Solutions">🧪 Chemistry & Solutions</option>
                        <option value="Space Exploration & Astronomy">🪐 Space Exploration</option>
                        <option value="Ecology & Biodiversity">🦋 Ecology & Biodiversity</option>
                      </select>
                    </td>

                    {/* Attendance Pill Toggles */}
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1 bg-slate-100/70 p-1 rounded-xl">
                        <button
                          onClick={() => handleAttendanceChange(student.id, 'present')}
                          className={`p-1 rounded-lg transition-colors ${
                            student.attendance === 'present'
                              ? 'bg-emerald-600 text-white shadow-2xs'
                              : 'text-slate-400 hover:text-emerald-700'
                          }`}
                          title="Mark Present"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleAttendanceChange(student.id, 'late')}
                          className={`p-1 rounded-lg transition-colors ${
                            student.attendance === 'late'
                              ? 'bg-amber-500 text-white shadow-2xs'
                              : 'text-slate-400 hover:text-amber-600'
                          }`}
                          title="Mark Late"
                        >
                          <Clock className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleAttendanceChange(student.id, 'absent')}
                          className={`p-1 rounded-lg transition-colors ${
                            student.attendance === 'absent'
                              ? 'bg-rose-500 text-white shadow-2xs'
                              : 'text-slate-400 hover:text-rose-600'
                          }`}
                          title="Mark Absent"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                    {/* Streak & XP */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 font-bold text-xs text-orange-600">
                        <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                        <span>{student.streakDays}d</span>
                        <span className="text-slate-300">·</span>
                        <span className="text-purple-700">{student.xp} XP</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-xl border border-purple-100">
            <h3 className="text-lg font-bold text-slate-900 font-heading mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-purple-600" />
              Add Student to {currentClass.name}
            </h3>
            <form onSubmit={handleAddStudentSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Student Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jonathan Wong"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Student ID Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 226100120"
                    value={newStudent.id}
                    onChange={(e) => setNewStudent({ ...newStudent, id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Gender</label>
                  <select
                    value={newStudent.gender}
                    onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value as Gender })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  >
                    <option value="F">Female (F)</option>
                    <option value="M">Male (M)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">House</label>
                  <select
                    value={newStudent.house}
                    onChange={(e) => setNewStudent({ ...newStudent, house: e.target.value as House })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  >
                    <option value="Red">Red</option>
                    <option value="Blue">Blue</option>
                    <option value="Green">Green</option>
                    <option value="Yellow">Yellow</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Skill Level</label>
                  <select
                    value={newStudent.skillLevel}
                    onChange={(e) => setNewStudent({ ...newStudent, skillLevel: e.target.value as SkillLevel })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Developing">Developing</option>
                    <option value="Proficient">Proficient</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Music Instrument</label>
                  <input
                    type="text"
                    placeholder="e.g. Violin, Clarinet"
                    value={newStudent.musicInstrument}
                    onChange={(e) => setNewStudent({ ...newStudent, musicInstrument: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">CCA Activity</label>
                  <input
                    type="text"
                    placeholder="e.g. Robotics, Debate"
                    value={newStudent.cca}
                    onChange={(e) => setNewStudent({ ...newStudent, cca: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Science Inquiry Topic</label>
                <select
                  value={newStudent.scienceInterest}
                  onChange={(e) => setNewStudent({ ...newStudent, scienceInterest: e.target.value as ScienceInterest })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                >
                  <option value="Botany & Plant Cells">Botany & Plant Cells</option>
                  <option value="Robotics & Automation">Robotics & Automation</option>
                  <option value="Renewable Energy & Physics">Renewable Energy & Physics</option>
                  <option value="Chemistry & Solutions">Chemistry & Solutions</option>
                  <option value="Space Exploration & Astronomy">Space Exploration & Astronomy</option>
                  <option value="Ecology & Biodiversity">Ecology & Biodiversity</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium shadow-xs"
                >
                  Add to Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
