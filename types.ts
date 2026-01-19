
export interface FileData {
  name: string;
  type: string;
  data: string; // base64
}

export interface Project {
  id: string;
  title: string;
  description: string;
  files: FileData[];
}

export interface UserProfile {
  name: string;
  email: string;
  education: string;
  projects: Project[];
}

export interface RoleEvaluation {
  roleType: string;
  relevance: number; // 0-100
  why: string;
}

export interface SkillMatch {
  skill: string;
  importance: 'High' | 'Medium' | 'Low';
  status: 'Proficient' | 'Learning' | 'Gap';
  why: string;
}

export interface AppState {
  profile: UserProfile;
  evaluations: RoleEvaluation[];
  selectedRole: RoleEvaluation | null;
  skillMatches: SkillMatch[];
  resume: string;
  interestRole: string;
}
