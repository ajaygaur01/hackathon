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