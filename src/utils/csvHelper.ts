import { Student, StudentGroup, ClassRoom, Gender, House, SkillLevel, ScienceInterest } from '../types';

export function exportRosterToCsv(students: Student[], className: string): void {
  const headers = [
    'ID Number',
    'Name',
    'Gender',
    'House',
    'Music Instrument',
    'CCA',
    'Skill Level',
    'Science Interest',
    'Attendance',
    'Streak Days',
    'XP',
    'Assigned Team',
    'Team Role'
  ];

  const rows = students.map(s => [
    `"${s.id}"`,
    `"${s.name}"`,
    `"${s.gender}"`,
    `"${s.house}"`,
    `"${s.musicInstrument || '-'}"`,
    `"${s.cca || '-'}"`,
    `"${s.skillLevel}"`,
    `"${s.scienceInterest}"`,
    `"${s.attendance}"`,
    s.streakDays,
    s.xp,
    `"${s.lockedToGroupId || 'Unassigned'}"`,
    `"${s.roleInTeam || '-'}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  downloadBlob(csvContent, `${className.replace(/\s+/g, '_')}_Roster.csv`, 'text/csv;charset=utf-8;');
}

export function exportGroupsToCsv(groups: StudentGroup[], className: string): void {
  const headers = [
    'Team Name',
    'Team Topic',
    'Student ID',
    'Student Name',
    'Gender',
    'House',
    'Skill Level',
    'Team Role',
    'CCA'
  ];

  const rows: string[][] = [];
  groups.forEach(group => {
    group.students.forEach(s => {
      rows.push([
        `"${group.name}"`,
        `"${group.topic || '-'}"`,
        `"${s.id}"`,
        `"${s.name}"`,
        `"${s.gender}"`,
        `"${s.house}"`,
        `"${s.skillLevel}"`,
        `"${s.roleInTeam || '-'}"`,
        `"${s.cca || '-'}"`
      ]);
    });
  });

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  downloadBlob(csvContent, `${className.replace(/\s+/g, '_')}_Groups.csv`, 'text/csv;charset=utf-8;');
}

export function downloadSampleCsvTemplate(): void {
  const template = `ID Number,Name,Gender,House,Music Instrument,CCA,Skill Level,Science Interest
222050128,Abigail Riley Tanios,F,Red,Violin,Debate,Advanced,Botany & Plant Cells
222050025,Axel Nickryan Ong,M,Yellow,Clarinet,Robotics,Proficient,Robotics & Automation
222050001,Barnett John Cokro,M,Green,Saxophone,Junior Chef,Developing,Chemistry & Solutions
222050083,Calvin Arvelius Tan,M,Yellow,Zhongruan,Swimming,Proficient,Renewable Energy & Physics`;

  downloadBlob(template, 'BBS_Science_Class_Roster_Template.csv', 'text/csv;charset=utf-8;');
}

function downloadBlob(content: string, fileName: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function parseCsvRoster(csvText: string): Student[] {
  const lines = csvText.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.replace(/["\r]/g, '').trim().toLowerCase());
  
  // Helper to find column index
  const findCol = (keywords: string[]) => {
    return headers.findIndex(h => keywords.some(k => h.includes(k)));
  };

  const idCol = findCol(['id', 'number', 'no']);
  const nameCol = findCol(['name', 'student']);
  const genderCol = findCol(['gender', 'g', 'sex']);
  const houseCol = findCol(['house']);
  const musicCol = findCol(['music', 'instrument']);
  const ccaCol = findCol(['cca', 'activity', 'club']);
  const skillCol = findCol(['skill', 'level']);
  const interestCol = findCol(['interest', 'topic']);

  const validHouses: House[] = ['Red', 'Blue', 'Green', 'Yellow'];
  const validSkills: SkillLevel[] = ['Beginner', 'Developing', 'Proficient', 'Advanced'];
  const validInterests: ScienceInterest[] = [
    'Botany & Plant Cells',
    'Robotics & Automation',
    'Renewable Energy & Physics',
    'Chemistry & Solutions',
    'Space Exploration & Astronomy',
    'Ecology & Biodiversity'
  ];

  const parsedStudents: Student[] = [];

  for (let i = 1; i < lines.length; i++) {
    // Regex matching CSV values handling quoted commas
    const rowValues = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(',');
    const cleanValues = rowValues.map(v => v.replace(/^"|"$/g, '').trim());

    const name = nameCol !== -1 && cleanValues[nameCol] ? cleanValues[nameCol] : `Student ${i}`;
    const id = idCol !== -1 && cleanValues[idCol] ? cleanValues[idCol] : `${220000000 + i}`;
    
    let gender: Gender = 'M';
    if (genderCol !== -1 && cleanValues[genderCol]) {
      const gStr = cleanValues[genderCol].toUpperCase();
      if (gStr.startsWith('F')) gender = 'F';
    }

    let house: House = 'Blue';
    if (houseCol !== -1 && cleanValues[houseCol]) {
      const hStr = cleanValues[houseCol];
      const match = validHouses.find(h => h.toLowerCase() === hStr.toLowerCase());
      if (match) house = match;
    }

    const musicInstrument = musicCol !== -1 && cleanValues[musicCol] ? cleanValues[musicCol] : 'Ensemble';
    const cca = ccaCol !== -1 && cleanValues[ccaCol] ? cleanValues[ccaCol] : 'General Science';

    let skillLevel: SkillLevel = 'Proficient';
    if (skillCol !== -1 && cleanValues[skillCol]) {
      const sStr = cleanValues[skillCol];
      const match = validSkills.find(s => s.toLowerCase() === sStr.toLowerCase());
      if (match) skillLevel = match;
    }

    let scienceInterest: ScienceInterest = validInterests[i % validInterests.length];
    if (interestCol !== -1 && cleanValues[interestCol]) {
      const inStr = cleanValues[interestCol];
      const match = validInterests.find(inT => inT.toLowerCase().includes(inStr.toLowerCase()));
      if (match) scienceInterest = match;
    }

    parsedStudents.push({
      id,
      name,
      gender,
      house,
      musicInstrument,
      cca,
      skillLevel,
      scienceInterest,
      attendance: 'present',
      streakDays: Math.floor(Math.random() * 6) + 3,
      xp: 250,
      badges: ['lab-safety-hero']
    });
  }

  return parsedStudents;
}
