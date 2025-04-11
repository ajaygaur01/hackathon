// src/components/TopicNav.tsx
import React from 'react';

interface TopicNavProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const TopicNav: React.FC<TopicNavProps> = ({ activeCategory, setActiveCategory }) => {
  const categories = ["For you", "Following", "Featured", "Self Improvement", "Python", "Science"];
  
  return (
    <div className="border-b border-gray-200">
      <div className="flex items-center space-x-6 overflow-x-auto pb-1 no-scrollbar">
        <button className="p-2 text-gray-500 hover:text-black">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
        
        {categories.map((category) => (
          <button
            key={category}
            className={`whitespace-nowrap py-4 px-1 text-sm font-medium border-b-2 ${
              activeCategory === category
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
            {category === "Featured" && (
              <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                New
              </span>
            )}
          </button>
        ))}
        
        <button className="p-2 text-gray-500 hover:text-black">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TopicNav;

// src/components/CourseCard.tsx


// src/components/AiAssistantButton.tsx
