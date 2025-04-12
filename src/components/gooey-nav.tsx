"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function GooeyNav() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Hackcathons", href: "/Hackathons" },
    { label: "Ai-Playground", href: "/ai-playground" },
    { label: "DSA", href: "/dsa" },
    { label: "Ai-Quizbot", href: "/quizbot" },
    { label: "Ai Code review", href: "/reviewbot" },
  ]

  return (
    <div className="relative flex items-center">
      <div className="relative z-0 flex items-center bg-[#0A1128]/20 backdrop-blur-sm rounded-full p-1 border border-white/10">
        {activeIndex !== null && (
          <motion.div
            className="absolute inset-0 z-0 bg-white/10 rounded-full"
            layoutId="navBackground"
            initial={false}
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 30,
            }}
            style={{
              width: "var(--width)",
              height: "var(--height)",
              left: "var(--left)",
              top: "var(--top)",
            }}
          />
        )}

        {navItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={cn(
              "relative z-10 px-4 py-2 text-sm font-medium rounded-full transition-colors",
              activeIndex === index ? "text-white" : "text-white/70 hover:text-white",
            )}
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              document.documentElement.style.setProperty("--width", `${rect.width}px`)
              document.documentElement.style.setProperty("--height", `${rect.height}px`)
              document.documentElement.style.setProperty(
                "--left",
                `${rect.left - (e.currentTarget.parentElement?.getBoundingClientRect().left || 0)}px`,
              )
              document.documentElement.style.setProperty(
                "--top",
                `${rect.top - (e.currentTarget.parentElement?.getBoundingClientRect().top || 0)}px`,
              )
              setActiveIndex(index)
            }}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
