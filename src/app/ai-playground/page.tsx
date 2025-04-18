'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Wand2, Code, Sparkles, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

// Import Aceternity UI components
import  Lightning  from "@/components/ui/lightning";
import { Spotlight } from "@/components/ui/spotlight";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { SparklesCore } from "@/components/ui/sparkles";
// import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

// Features section data
const features = [
  {
    title: "AI-Powered",
    description: "Our advanced AI understands your vision and converts it to code",
    icon: <Sparkles className="h-5 w-5 text-blue-300" />
  },
  {
    title: "Lightning Fast",
    description: "Generate complete website structures in seconds",
    icon: <Zap className="h-5 w-5 text-yellow-300" />
  },
  {
    title: "Clean Code",
    description: "Get production-ready code that follows best practices",
    icon: <Code className="h-5 w-5 text-purple-300" />
  }
];

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim()) {
      router.push(`/show?prompt=${encodeURIComponent(prompt)}`);
    }
  };

  const introText = "Describe your dream website, and we'll help you build it step by step with cutting-edge AI technology.";

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 w-full h-full bg-black">
        <Lightning
          size={150}
          gap={40}
          speed={1.5}
          color="blue"
          className="w-full h-full opacity-50"
        />
      </div>
      <Spotlight
        className="absolute top-0 left-0 h-full w-full"
        fill="blue"
      />
      
      {/* Main container */}
      <div className="relative z-10 max-w-4xl w-full px-4">
        {/* Header with animated effect */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="h-24 w-24 rounded-full bg-blue-900/20 flex items-center justify-center relative">
              <div className="absolute inset-0">
                <SparklesCore
                  id="sparkles"
                  background="transparent"
                  minSize={0.6}
                  maxSize={1.4}
                  particleDensity={60}
                  className="w-full h-full"
                  particleColor="#60a5fa"
                />
              </div>
              <Wand2 className="w-10 h-10 text-blue-400 relative z-10" />
            </div>
          </div>
          
          <motion.h1 
            className="text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Website Builder AI
          </motion.h1>
          
          <div className="max-w-xl mx-auto">
            <TextGenerateEffect words={introText} className="text-lg text-gray-300" />
          </div>
        </div>

        {/* Main form with animations */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6 mx-[200px]">
          <HoverBorderGradient
            as="div"
            className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-8"
          >
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the website you want to build..."
                className="w-full h-40 p-5 bg-gray-900/50 text-gray-100 border border-gray-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-gray-500 transition-all"
              />
              
              <motion.button
                type="submit"
                className="w-full mt-6 bg-blue-600 text-gray-100 py-4 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors relative overflow-hidden group"
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 w-full h-full">
                  <SparklesCore
                    id="submitSparkles"
                    background="transparent"
                    minSize={0.2}
                    maxSize={0.6}
                    particleDensity={60}
                    className={`w-full h-full transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                    particleColor="#ffffff"
                  />
                </div>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Generate Website Plan
                  <Wand2 className="w-4 h-4" />
                </span>
              </motion.button>
            </HoverBorderGradient>
          </form>
        </motion.div>

        {/* Features section */}
        <motion.div 
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-gray-900/40 backdrop-blur-sm p-6 rounded-xl border border-gray-800/50 hover:border-gray-700/50 transition-all"
            >
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-blue-900/20 flex items-center justify-center mr-3">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
              </div>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </motion.div>

        {/* Footer */}
        <div className="mt-20 text-center text-gray-500 text-sm">
          Powered by advanced AI technology
        </div>
      </div>
    </div>
  );
}
