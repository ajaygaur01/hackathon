"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface TextRevealCardProps {
  text: string
  revealText: string
  className?: string
}

export function TextRevealCard({ text, revealText, className }: TextRevealCardProps) {
  const [isRevealed, setIsRevealed] = useState(false)

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-[#3B82F6]/10 to-[#2563EB]/10 p-8 h-full",
        className,
      )}
      onMouseEnter={() => setIsRevealed(true)}
      onMouseLeave={() => setIsRevealed(false)}
    >
      <div className="relative z-10">
        <h3 className="text-2xl font-bold mb-2 text-white">{text}</h3>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isRevealed ? 1 : 0, y: isRevealed ? 0 : 20 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-gray-300">{revealText}</p>
        </motion.div>
      </div>

      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/20 to-[#2563EB]/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: isRevealed ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />

        <motion.div
          className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050A1C] to-transparent"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: isRevealed ? 0.8 : 0.5 }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  )
}
