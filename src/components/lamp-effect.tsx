"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface LampEffectProps {
  children: ReactNode
  className?: string
}

export function LampEffect({ children, className }: LampEffectProps) {
  return (
    <div className={cn("relative overflow-hidden w-full py-24", className)}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[100%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/3 h-1/3 bg-[#3B82F6] rounded-full opacity-20 blur-[100px]" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </div>
  )
}
