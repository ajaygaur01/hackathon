interface Course {
  id: string;
  title: string;
  description: string;
  author: string;
  authorImage?: string;
  category: string;
  date: string;
  views: number;
  comments: number;
  image: string;
  isVerified?: boolean;
}

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    author: string;
    authorImage?: string;
    category: string;
    date: string;
    views: number;
    comments: number;
    image: string;
    isVerified?: boolean;
  };
}
