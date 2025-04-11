// src/pages/index.tsx
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import CourseCard from './Components/CourseCard';
import TopicNav from './Components/TopicNav';
import AiAssistantButton from './Components/AiAssitantButton';

  
export const Course= [
  {
    id: '1',
    title: 'Testing Document Contextualized AI—Intuitively and Exhaustively Explained',
    description: 'How to Know If RAG and Agentic Systems Actually Work',
    author: 'Daniel Warfield',
    authorImage: '/images/authors/daniel-warfield.jpg',
    category: 'Intuitively and Exhaustively Explained',
    date: '3d ago',
    views: 152,
    comments: 5,
    image: '/images/courses/ai-course.jpg',
  },
  {
    id: '2',
    title: "The Most Disturbing Epictetus Quote I've Ever Read",
    description: 'An unsettling truth that will stay with you forever.',
    author: 'Thomas Oppong',
    authorImage: '/images/authors/thomas-oppong.jpg',
    category: 'Personal Growth',
    date: 'Feb 24',
    views: 511,
    comments: 4,
    image: '/images/courses/philosophy.jpg',
    isVerified: true,
  },
  {
    id: '3',
    title: 'Mastering Data Structures in Python',
    description: 'A comprehensive guide to implementing and using data structures in Python.',
    author: 'Samantha Wong',
    authorImage: '/images/authors/samantha-wong.jpg',
    category: 'Python',
    date: '1w ago',
    views: 478,
    comments: 12,
    image: '/images/courses/python-ds.jpg',
  },
  {
    id: '4',
    title: 'Building APIs with Next.js',
    description: 'Learn how to create robust REST and GraphQL APIs using Next.js.',
    author: 'Michael Johnson',
    authorImage: '/images/authors/michael-johnson.jpg',
    category: 'Web Development',
    date: '2d ago',
    views: 324,
    comments: 8,
    image: '/images/courses/nextjs-api.jpg',
    isVerified: true,
  },
];


export default function Home() {
  const [courses, setCourses] = useState<Course[]>(Course);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>("For you");
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/courses');
        const data = await response.json();
        setCourses(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Tech Courses for CSE Students</title>
        <meta name="description" content="Browse the best tech courses for CSE students" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <TopicNav 
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
        
        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center">
              <p className="text-lg">Loading courses...</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {courses?.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </main>

      <AiAssistantButton />
    </div>
  );
}