import React from 'react';
import { MapPin, Calendar, Clock, Globe } from 'lucide-react';

const HackathonCard: React.FC<HackathonCardProps> = ({ hackathon }) => {

  // Format date for display
  const formatDate = (date:Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short', 
      day: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (date:Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Calculate event duration in hours
  const getDuration = () => {
    const durationMs = new Date(hackathon.end).getTime() - new Date(hackathon.start).getTime();
    const durationHours = Math.round(durationMs / (1000 * 60 * 60));
    return `${durationHours} hours`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48 w-full">
        <img 
          src={hackathon.banner || 'https://via.placeholder.com/600x200'} 
          alt={`${hackathon.name} banner`}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-md">
          <img 
            src={hackathon.logo || 'https://via.placeholder.com/150'} 
            alt={`${hackathon.name} logo`}
            className="w-12 h-12 rounded-full"
          />
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{hackathon.name}</h2>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {hackathon.virtual ? "Virtual" : "In-Person"}
          </span>
        </div>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-600">
            <MapPin className="w-5 h-5 mr-2 text-gray-500" />
            <span>{`${hackathon.city}, ${hackathon.state}, ${hackathon.country}`}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Calendar className="w-5 h-5 mr-2 text-gray-500" />
            <span>{`${formatDate(new Date(hackathon.start))} - ${formatDate(new Date(hackathon.end))}`}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Clock className="w-5 h-5 mr-2 text-gray-500" />
            <span>{`${formatTime(new Date(hackathon.start))} - ${formatTime(new Date(hackathon.end))} (${getDuration()})`}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Globe className="w-5 h-5 mr-2 text-gray-500" />
            <a href={hackathon.website} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
              {hackathon.website.replace('https://', '')}
            </a>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {hackathon.mlhAssociated && (
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">MLH</span>
          )}
          {hackathon.hybrid && (
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Hybrid</span>
          )}
          {hackathon.apac && (
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">APAC</span>
          )}
          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
            ID: {hackathon.id}
          </span>
        </div>
      </div>
      
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="text-gray-500 text-sm">
            Created on {new Date("2025-03-27T01:38:35.012Z").toLocaleDateString()}
          </div>
          <a href={hackathon.website} > <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors">
            Register Now
          </button></a>
        </div>
      </div>
    </div>
  );
};

export default HackathonCard;