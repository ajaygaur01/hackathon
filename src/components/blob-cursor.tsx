"use client"

import { useEffect, useState } from "react"

export function BlobCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [isPointer, setIsPointer] = useState(false)

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })

      // Check if cursor is over a clickable element
      const target = e.target as HTMLElement
      const isClickable =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        window.getComputedStyle(target).cursor === "pointer"

      setIsPointer(isClickable)
    }

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    window.addEventListener("mousemove", updatePosition)
    window.addEventListener("mouseenter", handleMouseEnter)
    window.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", updatePosition)
      window.removeEventListener("mouseenter", handleMouseEnter)
      window.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  if (typeof window === "undefined") return null

  return (
    <>
      <style jsx global>{`
        body {
          cursor: none;
        }
        
        a, button, [role="button"], [type="button"], [type="submit"], [type="reset"] {
          cursor: none;
        }
      `}</style>

      <div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.3s ease, transform 0.1s ease",
        }}
      >
        <div
          className={`rounded-full bg-white ${isPointer ? "scale-75" : "scale-100"}`}
          style={{
            width: isPointer ? "40px" : "20px",
            height: isPointer ? "40px" : "20px",
            marginLeft: isPointer ? "-20px" : "-10px",
            marginTop: isPointer ? "-20px" : "-10px",
            transition: "width 0.3s ease, height 0.3s ease, margin 0.3s ease, transform 0.3s ease",
            filter: "blur(2px)",
          }}
        />
      </div>
    </>
  )
}
