import { useEffect, useRef } from "react"

const COLORS = ["#1D9E75", "#534AB7", "#BA7517", "#993C1D", "#FFD700", "#4ECBA3", "#E0A843", "#FF6B8A"]

const rand = (min, max) => Math.random() * (max - min) + min

export default function Confetti({ active }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const particlesRef = useRef([])

  useEffect(() => {
    if (!active) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    particlesRef.current = Array.from({ length: 90 }, () => ({
      x: rand(0, canvas.width),
      y: rand(-40, -4),
      w: rand(6, 12),
      h: rand(3, 7),
      color: COLORS[Math.floor(rand(0, COLORS.length))],
      vx: rand(-1.5, 1.5),
      vy: rand(3, 6),
      rotation: rand(0, Math.PI * 2),
      rotSpeed: rand(-0.08, 0.08),
      alpha: 1,
    }))

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particlesRef.current = particlesRef.current.filter((p) => p.alpha > 0.02)

      for (const p of particlesRef.current) {
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.rotSpeed
        if (p.y > canvas.height * 0.65) p.alpha -= 0.018
        ctx.save()
        ctx.globalAlpha = p.alpha
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.rect(-p.w / 2, -p.h / 2, p.w, p.h)
        ctx.fill()
        ctx.restore()
      }

      if (particlesRef.current.length > 0) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", resize)
    }
  }, [active])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9999 }}
    />
  )
}
