import { Student, StudentGroup, ScienceInterest } from '../types';

export type GroupingStrategy = 'stratBalanced' | 'stratInterest' | 'stratCrossDiscipline' | 'stratPureSkill';

const SCIENCE_TEAM_NAMES = [
  'Team Chloroplast',
  'Team Astro-Voyagers',
  'Team Quantum Sparks',
  'Team Bio-Genesis',
  'Team Terra-Nova',
  'Team Solar Flux',
  'Team Helix Explorers',
  'Team Catalyst Pioneers',
  'Team Stomata Rangers',
  'Team Photon Orbiters'
];

const LAB_ROLES = [
  'Lead Investigator',
  'Data Recorder & Analyst',
  'Safety & Equipment Specialist',
  'Communications & Reporter',
  'Materials & Timekeeper'
];

const SKILL_NUMERIC: Record<string, number> = {
  Beginner: 1,
  Developing: 2,
  Proficient: 3,
  Advanced: 4
};

export interface GroupDiversityMetrics {
  maleCount: number;
  femaleCount: number;
  genderRatioScore: number; // 0 - 100
  houseCounts: Record<string, number>;
  houseVarietyScore: number; // 0 - 100
  avgSkillScore: number;
  skillSpreadScore: number; // 0 - 100
  uniqueCcaCount: number;
  ccaSynergyScore: number; // 0 - 100
  overallScore: number; // 0 - 100
  warnings: string[];
}

export function calculateGroupDiversity(students: Student[]): GroupDiversityMetrics {
  if (students.length === 0) {
    return {
      maleCount: 0,
      femaleCount: 0,
      genderRatioScore: 100,
      houseCounts: {},
      houseVarietyScore: 100,
      avgSkillScore: 0,
      skillSpreadScore: 100,
      uniqueCcaCount: 0,
      ccaSynergyScore: 100,
      overallScore: 100,
      warnings: []
    };
  }

  const warnings: string[] = [];
  const maleCount = students.filter(s => s.gender === 'M').length;
  const femaleCount = students.filter(s => s.gender === 'F').length;
  const total = students.length;

  // Gender balance: best when ~50/50
  let genderRatioScore = 100;
  if (total > 1) {
    const diff = Math.abs(maleCount - femaleCount);
    genderRatioScore = Math.max(30, Math.round(100 - (diff / total) * 60));
    if (maleCount === 0) {
      warnings.push('No male students in this group');
    } else if (femaleCount === 0) {
      warnings.push('No female students in this group');
    }
  }

  // House variety: 4 BBS Houses: Red, Blue, Green, Yellow
  const houseCounts: Record<string, number> = { Red: 0, Blue: 0, Green: 0, Yellow: 0 };
  students.forEach(s => {
    if (houseCounts[s.house] !== undefined) {
      houseCounts[s.house]++;
    }
  });
  const housesPresent = Object.values(houseCounts).filter(c => c > 0).length;
  const maxPossibleHouses = Math.min(4, total);
  const houseVarietyScore = Math.round((housesPresent / maxPossibleHouses) * 100);
  if (housesPresent === 1 && total >= 3) {
    warnings.push('All students belong to the same House');
  }

  // Skill balance:
  const skillValues = students.map(s => SKILL_NUMERIC[s.skillLevel] || 2);
  const avgSkillScore = Number((skillValues.reduce((a, b) => a + b, 0) / total).toFixed(1));
  const hasAdvanced = students.some(s => s.skillLevel === 'Advanced');
  const hasProficient = students.some(s => s.skillLevel === 'Proficient');
  const hasBeginner = students.some(s => s.skillLevel === 'Beginner' || s.skillLevel === 'Developing');
  
  let skillSpreadScore = 80;
  if (hasAdvanced && (hasProficient || hasBeginner)) skillSpreadScore = 100;
  if (students.every(s => s.skillLevel === 'Beginner')) {
    skillSpreadScore = 40;
    warnings.push('Group may need peer-mentorship support (all beginners)');
  }

  // CCA synergy:
  const uniqueCcas = new Set(students.map(s => s.cca)).size;
  const ccaSynergyScore = Math.min(100, Math.round((uniqueCcas / total) * 100));

  // Overall combined score:
  const overallScore = Math.round(
    genderRatioScore * 0.3 + houseVarietyScore * 0.25 + skillSpreadScore * 0.3 + ccaSynergyScore * 0.15
  );

  return {
    maleCount,
    femaleCount,
    genderRatioScore,
    houseCounts,
    houseVarietyScore,
    avgSkillScore,
    skillSpreadScore,
    uniqueCcaCount: uniqueCcas,
    ccaSynergyScore,
    overallScore,
    warnings
  };
}

export function autoGenerateGroups(
  students: Student[],
  groupSize: number = 4,
  strategy: GroupingStrategy = 'stratBalanced',
  existingGroups: StudentGroup[] = []
): StudentGroup[] {
  if (students.length === 0) return [];

  const numGroups = Math.max(1, Math.round(students.length / groupSize));
  
  // Preserve locked students if existing
  const lockedAssignments = new Map<string, string>(); // studentId -> groupId
  const existingGroupNames = new Map<string, string>();
  existingGroups.forEach(g => {
    existingGroupNames.set(g.id, g.name);
    g.students.forEach(s => {
      if (s.lockedToGroupId) {
        lockedAssignments.set(s.id, s.lockedToGroupId);
      }
    });
  });

  // Prepare groups
  const groups: StudentGroup[] = [];
  for (let i = 0; i < numGroups; i++) {
    const groupId = existingGroups[i]?.id || `group-${i + 1}`;
    const name = existingGroups[i]?.name || SCIENCE_TEAM_NAMES[i % SCIENCE_TEAM_NAMES.length];
    groups.push({
      id: groupId,
      name,
      students: []
    });
  }

  // Separate locked and unlocked students
  const unassigned: Student[] = [];
  students.forEach(s => {
    const targetGroupId = lockedAssignments.get(s.id) || s.lockedToGroupId;
    if (targetGroupId) {
      const g = groups.find(grp => grp.id === targetGroupId) || groups[0];
      g.students.push({ ...s, lockedToGroupId: g.id });
    } else {
      unassigned.push({ ...s, lockedToGroupId: null });
    }
  });

  // Distribute unassigned students according to strategy
  if (strategy === 'stratInterest') {
    // Sort primarily by interest, secondarily by skill level
    unassigned.sort((a, b) => {
      if (a.scienceInterest !== b.scienceInterest) {
        return a.scienceInterest.localeCompare(b.scienceInterest);
      }
      return (SKILL_NUMERIC[b.skillLevel] || 2) - (SKILL_NUMERIC[a.skillLevel] || 2);
    });

    // Assign to groups prioritizing group interest coherence
    unassigned.forEach(s => {
      // Find group with fewest members, preferring ones with matching interest
      let bestGroup = groups[0];
      let bestScore = -999;

      groups.forEach(g => {
        const matchingInterests = g.students.filter(m => m.scienceInterest === s.scienceInterest).length;
        const sizePenalty = g.students.length * 4;
        const score = matchingInterests * 10 - sizePenalty;
        if (score > bestScore) {
          bestScore = score;
          bestGroup = g;
        }
      });

      bestGroup.students.push(s);
    });
  } else if (strategy === 'stratPureSkill' || strategy === 'stratBalanced') {
    // Snake draft based on skill level:
    unassigned.sort((a, b) => (SKILL_NUMERIC[b.skillLevel] || 2) - (SKILL_NUMERIC[a.skillLevel] || 2));

    // Snake draft: 0, 1, ..., numGroups-1, then numGroups-1, ..., 0
    let forward = true;
    let idx = 0;

    unassigned.forEach(s => {
      // Find candidate groups that are not full
      // Prefer group with lowest current average skill or best gender balance
      let chosenGroup = groups[idx];

      // Smart swap candidate if gender or house balance can be improved
      if (strategy === 'stratBalanced') {
        const eligibleGroups = groups.filter(g => g.students.length < groupSize + 1);
        if (eligibleGroups.length > 0) {
          // Sort by fewest count of this student's gender
          eligibleGroups.sort((g1, g2) => {
            const g1SameGender = g1.students.filter(m => m.gender === s.gender).length;
            const g2SameGender = g2.students.filter(m => m.gender === s.gender).length;
            if (g1SameGender !== g2SameGender) return g1SameGender - g2SameGender;
            return g1.students.length - g2.students.length;
          });
          chosenGroup = eligibleGroups[0];
        }
      } else {
        // Snake draft directly
        const minLen = Math.min(...groups.map(g => g.students.length));
        const candidate = groups.find(g => g.students.length === minLen) || groups[0];
        chosenGroup = candidate;
      }

      chosenGroup.students.push(s);

      if (forward) {
        idx++;
        if (idx >= numGroups) {
          idx = numGroups - 1;
          forward = false;
        }
      } else {
        idx--;
        if (idx < 0) {
          idx = 0;
          forward = true;
        }
      }
    });
  } else {
    // Cross-Discipline CCA Mix
    unassigned.sort((a, b) => a.cca.localeCompare(b.cca));
    unassigned.forEach(s => {
      // Find group with no students in this CCA, or fewest members
      let bestGroup = groups[0];
      let minConflicts = 999;
      groups.forEach(g => {
        const ccaMatch = g.students.filter(m => m.cca === s.cca).length;
        const total = g.students.length * 2;
        const cost = ccaMatch * 5 + total;
        if (cost < minConflicts) {
          minConflicts = cost;
          bestGroup = g;
        }
      });
      bestGroup.students.push(s);
    });
  }

  // Assign lab roles & primary topic to each group
  groups.forEach((group, gIndex) => {
    // Topic: majority interest
    const interestCounts: Record<string, number> = {};
    group.students.forEach(s => {
      interestCounts[s.scienceInterest] = (interestCounts[s.scienceInterest] || 0) + 1;
    });
    let topTopic: ScienceInterest = 'Botany & Plant Cells';
    let maxC = 0;
    Object.entries(interestCounts).forEach(([topic, count]) => {
      if (count > maxC) {
        maxC = count;
        topTopic = topic as ScienceInterest;
      }
    });
    group.topic = topTopic;

    // Leader: student with Advanced skill or highest streak
    const sortedForLeadership = [...group.students].sort((a, b) => {
      const skillDiff = (SKILL_NUMERIC[b.skillLevel] || 0) - (SKILL_NUMERIC[a.skillLevel] || 0);
      if (skillDiff !== 0) return skillDiff;
      return b.streakDays - a.streakDays;
    });
    if (sortedForLeadership[0]) {
      group.leaderId = sortedForLeadership[0].id;
    }

    // Assign distinct lab roles
    group.students.forEach((student, sIdx) => {
      student.roleInTeam = LAB_ROLES[sIdx % LAB_ROLES.length];
    });
  });

  return groups;
}

export function manuallyMoveStudent(
  groups: StudentGroup[],
  studentId: string,
  targetGroupId: string,
  lockState?: boolean
): StudentGroup[] {
  let movedStudent: Student | null = null;

  // Extract student
  const updatedGroups = groups.map(group => {
    const found = group.students.find(s => s.id === studentId);
    if (found) {
      movedStudent = { ...found };
      return {
        ...group,
        students: group.students.filter(s => s.id !== studentId)
      };
    }
    return group;
  });

  if (!movedStudent) return groups;

  // Update lock state if provided
  if (lockState !== undefined) {
    (movedStudent as Student).lockedToGroupId = lockState ? targetGroupId : null;
  }

  // Insert into target group
  return updatedGroups.map(group => {
    if (group.id === targetGroupId && movedStudent) {
      return {
        ...group,
        students: [...group.students, movedStudent]
      };
    }
    return group;
  });
}
