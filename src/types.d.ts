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
interface HackathonCardProps {
    hackathon: Hackathon;
}

enum StepType {
  CreateFile,
  CreateFolder,
  EditFile,
  DeleteFile,
  RunScript
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