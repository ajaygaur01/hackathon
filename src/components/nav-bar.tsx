"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/button"
import { LucideMenu, LucideX, LucideMessageCircle } from "lucide-react"
import { GooeyNav } from "./gooey-nav"

export function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-[#050A1C]/80 backdrop-blur-md py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#3B82F6] flex items-center justify-center">
              <LucideMessageCircle className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#3B82F6]">Edu-Ease.ai</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <GooeyNav />
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Ai-playground
            </Button>
            <Button className="bg-[#3B82F6] hover:bg-[#2563EB] text-white">Login</Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <LucideX className="h-6 w-6" /> : <LucideMenu className="h-6 w-6" />}
          </Button>
        </div>
      </header>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-16 left-0 right-0 bg-[#050A1C]/95 backdrop-blur-md z-40 border-b border-white/10"
        >
          <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
            <Link
              href="/hackathons"
              className="text-white hover:text-[#3B82F6] py-3 px-4 rounded-md hover:bg-white/5 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Hackathons
            </Link>
            <Link
              href="/ai-playground"
              className="text-white hover:text-[#3B82F6] py-3 px-4 rounded-md hover:bg-white/5 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              AI Playground
            </Link>
            <Link
              href="/tracks"
              className="text-white hover:text-[#3B82F6] py-3 px-4 rounded-md hover:bg-white/5 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Learning Tracks
            </Link>
            <Link
              href="/tools"
              className="text-white hover:text-[#3B82F6] py-3 px-4 rounded-md hover:bg-white/5 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Tools
            </Link>
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/10">
              <Button variant="outline" className="w-full justify-center">
                Download App
              </Button>
              <Button className="w-full justify-center bg-[#3B82F6] hover:bg-[#2563EB]">Login</Button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  )
}
