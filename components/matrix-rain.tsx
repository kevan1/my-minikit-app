"use client"

import { useEffect, useRef, useState } from "react"

const asciiChars = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "!",
  "@",
  "#",
  "$",
  "%",
  "^",
  "&",
  "*",
  "(",
  ")",
  "-",
  "_",
  "=",
  "+",
  "[",
  "]",
  "{",
  "}",
  "|",
  "\\",
  ":",
  ";",
  '"',
  "'",
  "<",
  ">",
  ",",
  ".",
  "?",
  "/",
  "~",
  "`",
]

const skullArt = [
  "                    . c7.''",
  "                 d@@@@:",
  "               d@@@@@@@:",
  "              d@@@@@@@@@:",
  "             d@@@@@@@@@@:",
  "           .d@@@@@@@@@@@:",
  "          ''\"4@@@@@@@@@@:",
  "         d\"   'Y@@@@@@@'';",
  "              8@7'@@:",
  "        @c.    .d'.  ''4@",
  "         '@@@@7''        '.",
  "          '4@7  <         ||J",
  "           }@{ .'< .@      2",
  "         . d@' . cd7,bc=7 '2",
  "           @@7.d@47)@@@b",
  "          '7<'bd'     '",
]

const necryptoArt = [
  "░   ░░░  ░░        ░░░      ░░░       ░░░  ░░░░  ░░       ░░░        ░░░      ░░",
  "▒    ▒▒  ▒▒  ▒▒▒▒▒▒▒▒  ▒▒▒▒  ▒▒  ▒▒▒▒  ▒▒▒  ▒▒  ▒▒▒  ▒▒▒▒  ▒▒▒▒▒  ▒▒▒▒▒  ▒▒▒▒  ▒",
  "▓  ▓  ▓  ▓▓      ▓▓▓▓  ▓▓▓▓▓▓▓▓       ▓▓▓▓▓    ▓▓▓▓       ▓▓▓▓▓▓  ▓▓▓▓▓  ▓▓▓▓  ▓",
  "█  ██    ██  ████████  ████  ██  ███  ██████  █████  ███████████  █████  ████  ██",
  "███   ██        ███      ███  ████  █████  █████  ███████████  ██████      ██",
]

interface Drop {
  x: number
  y: number
  speed: number
  characters: string[]
  currentCharIndex: number
  updateFrequency: number
  lastUpdate: number
}

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const dropsRef = useRef<Drop[]>([])
  const animationRef = useRef<number>(0)

  // Initialize canvas and drops
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current
        const width = window.innerWidth
        const height = window.innerHeight

        // Set canvas dimensions
        canvas.width = width
        canvas.height = height
        setDimensions({ width, height })

        // Reinitialize drops when resizing
        initializeDrops(width, height)
      }
    }

    // Initialize drops based on canvas dimensions
    const initializeDrops = (width: number, height: number) => {
      const drops: Drop[] = []
      const dropCount = Math.floor(width / 25) // Adjust density here

      for (let i = 0; i < dropCount; i++) {
        drops.push(createDrop(width, height))
      }

      dropsRef.current = drops
    }

    // Create a single drop with random properties
    const createDrop = (width: number, height: number): Drop => {
      const charCount = Math.floor(Math.random() * 15) + 5 // 5-20 characters per drop
      const characters: string[] = []

      for (let i = 0; i < charCount; i++) {
        const randomIndex = Math.floor(Math.random() * asciiChars.length)
        characters.push(asciiChars[randomIndex])
      }

      return {
        x: Math.random() * width,
        y: Math.random() * -height, // Start above the screen
        speed: Math.random() * 2 + 1.5,
        characters,
        currentCharIndex: 0,
        updateFrequency: Math.floor(Math.random() * 10) + 5, // How often to change characters
        lastUpdate: 0,
      }
    }

    // Set up event listeners
    window.addEventListener("resize", handleResize)
    handleResize() // Initial setup

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  // Animation loop
  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const createDrop = (width: number): Drop => {
      const charCount = Math.floor(Math.random() * 15) + 5
      const characters: string[] = []

      for (let i = 0; i < charCount; i++) {
        const randomIndex = Math.floor(Math.random() * asciiChars.length)
        characters.push(asciiChars[randomIndex])
      }

      return {
        x: Math.random() * width,
        y: -100, // Start just above the screen
        speed: Math.random() * 2 + 1.5,
        characters,
        currentCharIndex: 0,
        updateFrequency: Math.floor(Math.random() * 10) + 5,
        lastUpdate: 0,
      }
    }

    const animate = () => {
      // Semi-transparent black background for trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)"
      ctx.fillRect(0, 0, dimensions.width, dimensions.height)

      // Update and draw each drop
      dropsRef.current.forEach((drop, index) => {
        // Calculate distance from mouse
        const dx = mousePos.x - drop.x
        const dy = mousePos.y - drop.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const influenceRadius = 180 // Radius of mouse influence

        // Draw each character in the drop
        drop.characters.forEach((char, charIndex) => {
          const y = drop.y - charIndex * 24 // Spacing between characters

          if (y < dimensions.height && y > 0) {
            // Determine character color based on mouse proximity
            if (distance < influenceRadius) {
              // Calculate color based on distance (closer = more vibrant)
              const intensity = 1 - distance / influenceRadius
              // Create a brighter cyan-to-purple gradient based on distance
              const r = Math.floor(120 * intensity)
              const g = Math.floor(220 * intensity)
              const b = Math.floor(255 * intensity)
              ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
            } else {
              // Default white with varying opacity based on position in the drop
              const opacity = charIndex === 0 ? 1 : 1 - charIndex / drop.characters.length
              ctx.fillStyle = `rgba(180, 180, 180, ${opacity})`
            }

            ctx.font = '18px "Courier New", monospace'
            ctx.fillText(char, drop.x, y)
          }
        })

        // Update drop position
        drop.y += drop.speed
        drop.lastUpdate++

        // Randomly change the first character occasionally
        if (drop.lastUpdate > drop.updateFrequency) {
          drop.lastUpdate = 0
          const randomIndex = Math.floor(Math.random() * asciiChars.length)
          drop.characters[0] = asciiChars[randomIndex]
        }

        // Reset drop when it goes off screen
        if (drop.y - drop.characters.length * 24 > dimensions.height) {
          dropsRef.current[index] = createDrop(dimensions.width)
        }
      })

      const centerX = dimensions.width / 2
      const centerY = dimensions.height / 2
      
      // Responsive sizing based on screen width
      const isMobile = dimensions.width < 768
      const skullFontSize = isMobile ? 12 : 16
      const skullLineHeight = isMobile ? 14 : 20
      const necryptoFontSize = isMobile ? 8 : 12
      const necryptoLineHeight = isMobile ? 10 : 14
      const spacing = isMobile ? 20 : 40
      
      const startY = centerY - ((skullArt.length * skullLineHeight) + spacing + (necryptoArt.length * necryptoLineHeight)) / 2

      // Draw skull in white and bold
      ctx.fillStyle = "rgba(255, 255, 255, 1)" // White color for the skull
      ctx.font = `bold ${skullFontSize}px "Courier New", monospace`

      skullArt.forEach((line, index) => {
        const textWidth = ctx.measureText(line).width
        const x = centerX - textWidth / 2
        const y = startY + index * skullLineHeight
        ctx.fillText(line, x, y)
      })

      ctx.fillStyle = "rgba(255, 255, 255, 1)" // White color for ASCII art
      ctx.font = `bold ${necryptoFontSize}px "Courier New", monospace`

      const necryptoStartY = startY + skullArt.length * skullLineHeight + spacing
      necryptoArt.forEach((line, index) => {
        const textWidth = ctx.measureText(line).width
        const x = centerX - textWidth / 2
        const y = necryptoStartY + index * necryptoLineHeight
        ctx.fillText(line, x, y)
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [dimensions, mousePos])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
      aria-label="ASCII character rain animation with skull logo"
    />
  )
}
