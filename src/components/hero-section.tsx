"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation"

export function HeroSection() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="w-full min-h-screen relative flex flex-col items-center justify-center overflow-hidden bg-[#050A1C]">
      <BackgroundGradientAnimation>
        <div className="absolute inset-0 w-full h-full bg-[#050A1C]/50 z-10" />
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 py-32 md:py-40">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
                Your one stop solution for
              </h1>
              <TextGenerateEffect
                words="skill-based learning"
                className="text-4xl md:text-6xl font-bold text-[#3B82F6] leading-tight"
              />
              <motion.div
                className="w-[300px] h-[3px] bg-[#3B82F6] mx-auto mt-4"
                initial={{ width: 0 }}
                animate={{ width: 300 }}
                transition={{ delay: 1, duration: 0.8 }}
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-10"
            >
              Supercharge your coding skills with AI-powered tools, project ideas, and structured learning tracks
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="lg"
                className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-8 py-6 text-lg rounded-xl"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                Join Now
                <motion.span animate={{ x: isHovered ? 5 : 0 }} transition={{ duration: 0.2 }} className="ml-2">
                  →
                </motion.span>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl"
              >
                Download App →
              </Button>
            </motion.div>
          </div>
        </div>
      </BackgroundGradientAnimation>
    </div>
  )
}
