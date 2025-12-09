import React from 'react'
import { cn } from '@/lib/utils'

interface CardWithHeaderProps {
  children: React.ReactNode
  className?: string
  headerClassName?: string
  contentClassName?: string
}

interface CardHeaderProps {
  children: React.ReactNode
  className?: string
  variant?: 'primary' | 'secondary' | 'accent' | 'muted'
}

interface CardContentProps {
  children: React.ReactNode
  className?: string
  noPadding?: boolean
}

// Componente principal do Card
function CardWithHeader({ 
  children, 
  className,
  ...props 
}: CardWithHeaderProps) {
  return (
    <div 
      className={cn(
        "bg-card text-card-foreground rounded-xl border shadow-sm overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Header do Card com variantes de cor
function CardHeader({ 
  children, 
  className, 
  variant = 'primary',
  ...props 
}: CardHeaderProps) {
  const variantStyles = {
    primary: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    accent: 'bg-accent text-accent-foreground',
    muted: 'bg-muted text-muted-foreground'
  }

  return (
    <div 
      className={cn(
        "p-4 rounded-t-xl",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Conteúdo do Card
function CardContent({ 
  children, 
  className, 
  noPadding = false,
  ...props 
}: CardContentProps) {
  return (
    <div 
      className={cn(
        !noPadding && "p-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Seção com borda inferior (para dividir conteúdos)
function CardSection({ 
  children, 
  className, 
  noBorder = false,
  ...props 
}: { 
  children: React.ReactNode
  className?: string
  noBorder?: boolean
}) {
  return (
    <div 
      className={cn(
        "p-4",
        !noBorder && "border-b",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { CardWithHeader, CardHeader, CardContent, CardSection }
