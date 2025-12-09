'use client'

import React, { createContext, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface BorderedCardProps {
  children: React.ReactNode
  className?: string
  variant?: 'primary' | 'secondary' | 'accent'
  link?: string
  onClick?: () => void
  onMouseEnter?: () => void
}

interface BorderedCardHeaderProps {
  children: React.ReactNode
  className?: string
}

interface BorderedCardContentProps {
  children: React.ReactNode
  className?: string
  noPadding?: boolean
}

const BorderedCardContext = createContext<{ hasLink: boolean }>({ hasLink: false })

/**
 * Card com borda colorida na lateral esquerda
 * Variantes: primary (azul), secondary, accent
 * Com efeito hover e navegação opcional por link
 */
function BorderedCard({
  children,
  className,
  variant = 'primary',
  link,
  onClick,
  onMouseEnter,
  ...props
}: BorderedCardProps) {
  const router = useRouter()

  const variantStyles = {
    primary: 'border-l-primary',
    secondary: 'border-l-secondary',
    accent: 'border-l-accent'
  }

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (link) {
      router.push(link)
    }
  }

  const hasInteraction = !!link || !!onClick

  return (
    <BorderedCardContext.Provider value={{ hasLink: hasInteraction }}>
      <div
        className={cn(
          "bg-card text-card-foreground rounded-xl border border-l-4 shadow-sm overflow-hidden transition-all duration-200",
          variantStyles[variant],
          hasInteraction && "hover:scale-[1.01] hover:shadow-lg",
          className
        )}
        onClick={handleClick}
        onMouseEnter={onMouseEnter}
        {...props}
      >
        {children}
      </div>
    </BorderedCardContext.Provider>
  )
}

/**
 * Header do BorderedCard com background sutil (10% de opacidade)
 * Não é clicável para evitar conflitos com elementos interativos dentro dele
 */
function BorderedCardHeader({
  children,
  className,
  ...props
}: BorderedCardHeaderProps) {
  return (
    <div
      className={cn(
        "p-4 rounded-t-xl bg-primary/10 border-b cursor-default",
        className
      )}
      onClick={(e) => e.stopPropagation()}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Conteúdo do BorderedCard
 * Mostra cursor pointer apenas quando o card tem link
 */
function BorderedCardContent({
  children,
  className,
  noPadding = false,
  ...props
}: BorderedCardContentProps) {
  const { hasLink } = useContext(BorderedCardContext)

  return (
    <div
      className={cn(
        !noPadding && "p-4",
        hasLink && "cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { BorderedCard, BorderedCardHeader, BorderedCardContent }
