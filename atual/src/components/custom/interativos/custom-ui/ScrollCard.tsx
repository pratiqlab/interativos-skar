"use client"

import React, { useRef, useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface ScrollCardProps {
  children: React.ReactNode
  className?: string
  /** any value to watch and re-check scrollability when it changes */
  watch?: unknown
  /** inline style applied to the scroll container (use to set fixed height / maxHeight) */
  style?: React.CSSProperties
  /** convenience height prop in px or CSS string (overrides style.height) */
  height?: number | string
  /** remove background, border and shadow */
  variant?: 'default' | 'transparent'
}

export default function ScrollCard({ children, className = '', watch, style, height, variant = 'default' }: ScrollCardProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [showScrollIndicator, setShowScrollIndicator] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Detectar quando está no cliente para mostrar indicador de scroll
  useEffect(() => {
    setIsClient(true)
  }, [])

  const checkScrollable = () => {
    const el = scrollRef.current
    if (!el) return

    const { scrollTop, scrollHeight, clientHeight } = el
    const hasMoreContent = scrollHeight > clientHeight
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10
    setShowScrollIndicator(hasMoreContent && !isAtBottom)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    // initial check
    checkScrollable()

    const onScroll = () => checkScrollable()
    el.addEventListener('scroll', onScroll)

    const ro = new ResizeObserver(checkScrollable)
    ro.observe(el)

    return () => {
      el.removeEventListener('scroll', onScroll)
      ro.disconnect()
    }
  }, [])

  // re-check when watched value changes (e.g. passos desbloqueados)
  useEffect(() => {
    const t = setTimeout(checkScrollable, 100)
    return () => clearTimeout(t)
  }, [watch])

  const containerStyle: React.CSSProperties = { ...(style || {}) }
  
  // Apply explicit height if provided
  if (height !== undefined) {
    containerStyle.height = typeof height === 'number' ? `${height}px` : height
    containerStyle.overflow = 'hidden' // Prevent expansion
  }

  const cardClasses = variant === 'transparent' 
    ? "overflow-y-auto lg:pr-2 space-y-4 h-full flex flex-col"
    : "overflow-y-auto lg:pr-2 space-y-4 bg-card text-foreground rounded-lg shadow-md h-full flex flex-col p-4";

  const wrapperClasses = height
    ? `${className} relative`
    : `${className} h-auto lg:h-full lg:min-h-0 relative`;

  return (
    <div className={wrapperClasses} style={height ? containerStyle : undefined}>
      <div
        ref={scrollRef}
        className={cardClasses}
      >
        {children}
      </div>

  {(isClient && showScrollIndicator) && (
        <div className="hidden lg:block absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-primary/90 backdrop-blur-sm rounded-full p-2 shadow-lg animate-bounce">
            <ChevronDown className="h-4 w-4 text-primary-foreground" />
          </div>
        </div>
      )}
    </div>
  )
}
