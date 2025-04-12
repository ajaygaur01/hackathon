"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { LucideCode, LucideBrain, LucideCloud, LucideCodesandbox } from "lucide-react"
import { cn } from "@/lib/utils"

export function TracksSection() {
  const [activeTrack, setActiveTrack] = useState(0)

  const tracks = [
    {
      title: "Full-Stack Development",
      description:
        "Master front-end and back-end technologies to build complete web applications. Learn React, Node.js, databases, and deployment.",
      icon: <LucideCode className="h-8 w-8" />,
      color: "from-[#3B82F6] to-[#2563EB]",
      modules: [
        "HTML/CSS Fundamentals",
        "JavaScript Essentials",
        "React Framework",
        "Node.js & Express",
        "Databases",
        "Authentication",
        "Deployment",
      ],
    },
    {
      title: "AI & Machine Learning",
      description:
        "Dive into the world of artificial intelligence and machine learning. Build intelligent applications and understand the math behind AI.",
      icon: <LucideBrain className="h-8 w-8" />,
      color: "from-[#3B82F6] to-[#2563EB]",
      modules: [
        "Python for AI",
        "Math Foundations",
        "Machine Learning Basics",
        "Neural Networks",
        "Natural Language Processing",
        "Computer Vision",
        "AI Ethics",
      ],
    },
    {
      title: "Cloud Computing",
      description:
        "Learn to deploy and scale applications in the cloud. Master AWS, Azure, or Google Cloud and implement DevOps practices.",
      icon: <LucideCloud className="h-8 w-8" />,
      color: "from-[#3B82F6] to-[#2563EB]",
      modules: [
        "Cloud Fundamentals",
        "AWS/Azure/GCP",
        "Serverless Architecture",
        "Containers & Kubernetes",
        "CI/CD Pipelines",
        "Cloud Security",
        "Cost Optimization",
      ],
    },
    {
      title: "Data Structures & Algorithms",
      description:
        "Build a strong foundation in computer science fundamentals. Master data structures, algorithms, and problem-solving techniques.",
      icon: <LucideCodesandbox className="h-8 w-8" />,
      color: "from-[#3B82F6] to-[#2563EB]",
      modules: [
        "Basic Data Structures",
        "Advanced Data Structures",
        "Sorting Algorithms",
        "Searching Algorithms",
        "Dynamic Programming",
        "Graph Algorithms",
        "Interview Prep",
      ],
    },
  ]

  return (
    <div className="w-full py-20 bg-[#050A1C]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Structured Learning Tracks</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Follow guided paths to master different areas of software development
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          {tracks.map((track, index) => (
            <motion.div
              key={index}
              className={cn(
                "p-4 rounded-xl cursor-pointer transition-all duration-300 border",
                activeTrack === index ? "bg-white/10 border-white/20" : "border-transparent hover:bg-white/5",
              )}
              onClick={() => setActiveTrack(index)}
              whileHover={{ y: -5 }}
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className={cn("p-3 rounded-lg bg-gradient-to-br", track.color)}>{track.icon}</div>
                <h3 className="text-lg font-semibold text-white">{track.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          key={activeTrack}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/5 border border-white/10 rounded-xl p-8"
        >
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <div className={cn("p-4 rounded-lg bg-gradient-to-br inline-block mb-4", tracks[activeTrack].color)}>
                {tracks[activeTrack].icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">{tracks[activeTrack].title}</h3>
              <p className="text-gray-300 mb-6">{tracks[activeTrack].description}</p>
              <button
                className={cn(
                  "px-6 py-3 rounded-lg text-white font-medium bg-gradient-to-r",
                  tracks[activeTrack].color,
                )}
              >
                Start Learning
              </button>
            </div>

            <div className="md:w-1/2">
              <h4 className="text-xl font-semibold mb-4 text-white">Track Modules</h4>
              <div className="space-y-2">
                {tracks[activeTrack].modules.map((module, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <span className="text-white">{module}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
