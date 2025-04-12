"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface WobbleCardProps {
  title: string
  description: string
  className?: string
}

export function WobbleCard({ title, description, className }: WobbleCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setMousePosition({ x, y })
  }

  const calculateRotation = () => {
    if (!cardRef.current || !isHovered) return { x: 0, y: 0 }

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateY = ((mousePosition.x - centerX) / centerX) * 10
    const rotateX = ((centerY - mousePosition.y) / centerY) * 10

    return { x: rotateX, y: rotateY }
  }

  const rotation = calculateRotation()

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-[#FCE7F3] to-[#FCE7F3] p-8 h-full",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      animate={{
        rotateX: rotation.x,
        rotateY: rotation.y,
        transformPerspective: 1000,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
    >
      <div className="relative z-10">
        <h3 className="text-2xl font-bold mb-2 text-[#0A1128]">{title}</h3>
        <p className="text-[#0A1128]/80">{description}</p>
      </div>

      <motion.div
        className="absolute inset-0 z-0 bg-gradient-to-br from-[#FCE7F3] to-[#FCE7F3]"
        animate={{
          opacity: isHovered ? 1 : 0.5,
        }}
        transition={{ duration: 0.3 }}
      />

      <motion.div
        className="absolute -inset-[100%] z-0 bg-gradient-to-br from-[#3B82F6]/10 to-[#2563EB]/10 rounded-full blur-3xl"
        animate={{
          x: isHovered ? mousePosition.x - 200 : 0,
          y: isHovered ? mousePosition.y - 200 : 0,
          opacity: isHovered ? 0.7 : 0,
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}
