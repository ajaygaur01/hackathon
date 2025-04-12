"use client"

import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

export function CanvasReveal() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const [isRevealed, setIsRevealed] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    // Set canvas dimensions
    const updateCanvasSize = () => {
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width = width
      canvas.height = height
    }

    updateCanvasSize()
    window.addEventListener("resize", updateCanvasSize)

    // Load image
    const image = new Image()
    image.crossOrigin = "anonymous"
    image.src = "/placeholder.svg?height=600&width=1200"
    imageRef.current = image

    image.onload = () => {
      drawImage()
    }

    // Draw image
    const drawImage = () => {
      if (!context || !imageRef.current) return

      context.clearRect(0, 0, canvas.width, canvas.height)

      if (isRevealed) {
        context.globalCompositeOperation = "source-over"
        context.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height)

        // Draw reveal circle
        context.globalCompositeOperation = "destination-in"
        const radius = 150
        context.beginPath()
        context.arc(mousePosition.x, mousePosition.y, radius, 0, Math.PI * 2)
        context.fill()
      }
    }

    // Handle mouse move
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }

    const handleMouseEnter = () => setIsRevealed(true)
    const handleMouseLeave = () => setIsRevealed(false)

    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseenter", handleMouseEnter)
    canvas.addEventListener("mouseleave", handleMouseLeave)

    // Animation loop
    let animationFrameId: number

    const render = () => {
      drawImage()
      animationFrameId = window.requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener("resize", updateCanvasSize)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseenter", handleMouseEnter)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [isRevealed, mousePosition])

  return (
    <div className="w-full py-20 bg-[#050A1C]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Reveal the Future of Learning</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Hover over the image to see what's possible with Edu-Ease.ai
          </p>
        </div>

        <div className="relative w-full h-[400px] rounded-xl overflow-hidden border border-white/10">
          <Image
            src="/placeholder.svg?height=600&width=1200"
            alt="AI-powered learning platform"
            fill
            className="object-cover"
          />

          <canvas ref={canvasRef} className="absolute inset-0 z-10 cursor-none" />

          {!isRevealed && (
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl font-medium bg-black/50 backdrop-blur-sm px-6 py-3 rounded-full"
              >
                Hover to reveal the future
              </motion.p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
