export interface Resource {
  id: string;
  title: string;
  type: 'curriculum' | 'coding_task' | 'quiz' | 'slides';
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  grade: string;
  createdAt: string;
  status: 'draft' | 'published';
  content: string; // Markdown or structure
  logsId?: string; // Reference to agent logs for this resource
  fineTuneCount?: number;
}

export interface StudentQuizProgress {
  id: string;
  studentName: string;
  studentId: string;
  progress: number; // percentage
  score: number; // out of 100
  status: 'online' | 'idle' | 'offline';
  completedAt?: string;
  submissions: {
    problemId: string;
    code: string;
    language: string;
    status: 'pass' | 'fail' | 'running' | 'pending';
    error?: string;
    timestamp: string;
  }[];
}

export interface ActiveQuiz {
  id: string;
  title: string;
  className: string;
  studentCount: number;
  completedCount: number;
  avgScore: number;
  status: 'active' | 'paused' | 'ended';
  releasedAt: string;
  students: StudentQuizProgress[];
}

export interface KnowledgeWeakness {
  topic: string;
  mastery: number; // 0-100
  studentCount: number; // number of students struggling
  recommendation: string; // AI recommendation text
}

export interface AgentLog {
  id: string;
  resourceId?: string;
  timestamp: string;
  agentName: string;
  agentRole: 'planner' | 'executor' | 'verifier' | 'coach';
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  details?: string; // expanded details / markdown / code
  rawJson?: string; // payload inspect
  durationMs?: number;
}

export interface ImportedQuestion {
  id: string;
  topic: string;
  question: string;
  type: 'single' | 'multiple' | 'coding' | 'completion';
  options?: string[];
  answer: string;
  analysis: string;
  difficulty: 'easy' | 'medium' | 'hard';
}
