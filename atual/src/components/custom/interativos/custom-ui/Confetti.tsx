"use client"

import { useEffect, useRef } from 'react'

interface ConfettiProps {
  /** Duração do efeito em ms (padrão: 3000) */
  duration?: number
  /** Número de partículas (padrão: 150) */
  particleCount?: number
}

/**
 * Componente de Confetti que anima partículas saindo das bordas inferiores
 * Dispara automaticamente ao ser montado
 */
export default function Confetti({ duration = 3000, particleCount = 150 }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Ajusta o canvas para o tamanho da janela
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    interface Particle {
      x: number
      y: number
      vx: number
      vy: number
      color: string
      size: number
      rotation: number
      rotationSpeed: number
      gravity: number
    }

    const particles: Particle[] = []
    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4']

    // Criar partículas saindo dos cantos inferiores
    for (let i = 0; i < particleCount; i++) {
      const fromLeft = i < particleCount / 2
      const startX = fromLeft ? 0 : canvas.width
      const startY = canvas.height

      // Ângulo de 45 graus apontando para o centro
      // Esquerda: 45° (direita-cima), Direita: 135° (esquerda-cima)
      const baseAngle = fromLeft ? -45 : -135
      const angleVariation = (Math.random() - 0.5) * 30 // ±15° de variação
      const angle = (baseAngle + angleVariation) * (Math.PI / 180)

      // Velocidade inicial
      const speed = 8 + Math.random() * 6

      particles.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 8 + Math.random() * 6,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        gravity: 0.3 + Math.random() * 0.2
      })
    }

    const startTime = Date.now()
    let animationFrameId: number

    const animate = () => {
      const elapsed = Date.now() - startTime

      // Para a animação após a duração
      if (elapsed > duration) {
        cancelAnimationFrame(animationFrameId)
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(particle => {
        // Atualizar posição
        particle.x += particle.vx
        particle.y += particle.vy
        particle.vy += particle.gravity
        particle.rotation += particle.rotationSpeed

        // Desacelerar horizontalmente (resistência do ar)
        particle.vx *= 0.99

        // Desenhar partícula
        ctx.save()
        ctx.translate(particle.x, particle.y)
        ctx.rotate(particle.rotation * Math.PI / 180)
        ctx.fillStyle = particle.color
        ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size)
        ctx.restore()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // Limpar ao desmontar
    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [duration, particleCount])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ width: '100%', height: '100%' }}
    />
  )
}
