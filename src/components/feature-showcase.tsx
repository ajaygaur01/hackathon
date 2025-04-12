"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { LucideCode, LucideRocket, LucideImage, LucideBrain, LucideNotebook, LucideTerminalSquare } from "lucide-react"
import { cn } from "@/lib/utils"

export function FeatureShowcase() {
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      title: "Find Hackathons",
      description:
        "Discover exciting hackathons and competitions to showcase your skills and win prizes. Filter by technology, location, and prize pool.",
      icon: <LucideRocket className="h-8 w-8" />,
      color: "from-[#3B82F6] to-[#2563EB]",
    },
    {
      title: "AI Project Ideas",
      description:
        "Get AI-powered project suggestions based on hackathon topics. Our AI analyzes the requirements and suggests innovative ideas tailored to your skills.",
      icon: <LucideBrain className="h-8 w-8" />,
      color: "from-[#3B82F6] to-[#2563EB]",
    },
    {
      title: "AI Playground",
      description:
        "Build full-stack applications with AI assistance. Write code, design UI, and deploy your projects with intelligent suggestions at every step.",
      icon: <LucideCode className="h-8 w-8" />,
      color: "from-[#3B82F6] to-[#2563EB]",
    },
    {
      title: "Notes to Quiz",
      description:
        "Transform your study notes into interactive quizzes. Our AI analyzes your notes and generates questions to test your knowledge and reinforce learning.",
      icon: <LucideNotebook className="h-8 w-8" />,
      color: "from-[#3B82F6] to-[#2563EB]",
    },
    {
      title: "Image Generation",
      description:
        "Create diagrams, social media posts, and educational visuals with AI. Generate custom images for your projects, presentations, and study materials.",
      icon: <LucideImage className="h-8 w-8" />,
      color: "from-[#3B82F6] to-[#2563EB]",
    },
    {
      title: "Coding Tracks",
      description:
        "Follow structured learning paths for full-stack, AI, cloud, and DSA. Track your progress and build real-world projects along the way.",
      icon: <LucideTerminalSquare className="h-8 w-8" />,
      color: "from-[#3B82F6] to-[#2563EB]",
    },
  ]

  return (
    <div className="w-full py-20 bg-[#050A1C]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Powerful Features for Modern Learning</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Explore our suite of AI-powered tools designed to enhance your coding journey
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={cn(
                  "p-4 rounded-xl cursor-pointer transition-all duration-300",
                  activeFeature === index ? "bg-white/10 border border-white/20" : "hover:bg-white/5",
                )}
                onClick={() => setActiveFeature(index)}
                whileHover={{ x: 5 }}
              >
                <div className="flex items-start gap-4">
                  <div className={cn("p-3 rounded-lg bg-gradient-to-br", feature.color)}>{feature.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                    {activeFeature === index && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-sm text-gray-300"
                      >
                        {feature.description}
                      </motion.p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="relative h-[400px] rounded-xl overflow-hidden border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/20 to-[#2563EB]/20" />
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="text-center">
                <div
                  className={cn(
                    "mx-auto p-4 rounded-full bg-gradient-to-br mb-6 inline-block",
                    features[activeFeature].color,
                  )}
                >
                  {features[activeFeature].icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{features[activeFeature].title}</h3>
                <p className="text-gray-300">{features[activeFeature].description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
