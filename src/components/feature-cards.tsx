"use client"

import { motion } from "framer-motion"
import { LucideUsers, LucideUserCheck, LucideMap, LucideCode, LucideRss } from "lucide-react"

export function FeatureCards() {
  const features = [
    {
      title: "Community",
      description: "Connect with 1Lakh+ peers",
      icon: <LucideUsers className="h-12 w-12 text-[#0A1128]" />,
      bgColor: "bg-[#E0F2FE]",
      textColor: "text-[#0A1128]",
    },
    {
      title: "Mentors",
      description: "300+ Mentors, 5000+ Queries Resolved",
      icon: <LucideUserCheck className="h-12 w-12 text-[#0A1128]" />,
      bgColor: "bg-[#FCE7F3]",
      textColor: "text-[#0A1128]",
    },
    {
      title: "Roadmaps",
      description: "Solve skill based roadmaps",
      icon: <LucideMap className="h-12 w-12 text-[#0A1128]" />,
      bgColor: "bg-[#FCE7F3]",
      textColor: "text-[#0A1128]",
    },
    {
      title: "Problems",
      description: "Daily Problem Challenges",
      icon: <LucideCode className="h-12 w-12 text-[#0A1128]" />,
      bgColor: "bg-[#E0F2FE]",
      textColor: "text-[#0A1128]",
    },
    {
      title: "Feed",
      description: "Skill Based Posts",
      icon: <LucideRss className="h-12 w-12 text-[#0A1128]" />,
      bgColor: "bg-[#E0F2FE]",
      textColor: "text-[#0A1128]",
    },
  ]

  return (
    <div className="w-full py-20 bg-[#050A1C]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Everything You Need</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            All the tools and resources to accelerate your learning journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`rounded-xl p-6 ${feature.bgColor} ${index === 0 ? "md:col-span-2" : ""} ${
                index === 1 ? "md:col-span-1" : ""
              } ${index === 2 ? "md:col-span-1" : ""} ${index === 3 ? "md:col-span-1" : ""} ${
                index === 4 ? "md:col-span-2" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="rounded-lg">{feature.icon}</div>
                <div>
                  <h3 className={`text-xl font-bold ${feature.textColor}`}>{feature.title}</h3>
                  <p className={`${feature.textColor}/80`}>{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
