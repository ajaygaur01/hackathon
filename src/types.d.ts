interface Hackathon {
    id: string;
    name: string;
    website: string;
    start: string;
    end: string;
    createdAt: string;
    logo: string | null;
    banner: string | null ;
    city: string | null;
    state: string | null;
    country: string | null;
    countryCode: string | null;
    latitude: number | null;
    longitude: number | null;
    virtual: boolean;
    hybrid: boolean;
    mlhAssociated: boolean;
    apac: boolean;
    themes: string[];
  }

  interface Problem {
    id: string;
    name: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    description: string;
    examples: Array<{
      input: string;
      output: string;
      explanation?: string;
    }>;
    constraints: string[];
    starterCode: {
      [key: string]: string;
    };
    testCases: Array<{
      input: string;
      output: string;
    }>;
  }

interface ConsoleEntry {
  type: 'input' | 'output' | 'error' | 'info';
  content: string;
  timestamp: number;
}

interface EditorState {
  language: string;
  code: string;
}

interface SubmissionResult {
  status: 'success' | 'error' | 'processing';
  output?: string;
  error?: string;
  executionTime?: number;
  memory?: number;
  testCases?: {
    passed: boolean;
    input: string;
    expectedOutput: string;
    actualOutput: string;
    error?: string;
  }[];
}
  
interface HackathonCardProps {
  hackathon: Hackathon;
}



interface Step {
  id: number;
  title: string;
  description: string;
  type: StepType;
  status: 'pending' | 'in-progress' | 'completed';
  code?: string;
  path?: string;
}

interface Project {
  prompt: string;
  steps: Step[];
}

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  children?: FileItem[];
  content?: string;
  path: string;
}

interface FileViewerProps {
  file: FileItem | null;
  onClose: () => void;
}