'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { ReactNode } from 'react'

interface ScrollPageProps {
  children: ReactNode
  className?: string
}

interface ScrollPageHeaderProps {
  children: ReactNode
  className?: string
}

interface ScrollPageContentProps {
  children: ReactNode
  className?: string
  auto?: boolean
}

/**
 * Container principal que gerencia a altura e o overflow
 * Mobile: 100vh - 4rem (bottom nav)
 * Tablet/Desktop: 100vh - 1rem (inset)
 */
export function ScrollPage({ children, className = '' }: ScrollPageProps) {
  return (
    <div className={`flex flex-col h-[calc(100vh-4rem)] sm:h-[calc(100vh-1rem)] overflow-hidden ${className}`}>
      {children}
    </div>
  )
}

/**
 * Componente para o cabecalho fixo (nao faz scroll)
 */
export function ScrollPageHeader({ children, className = '' }: ScrollPageHeaderProps) {
  return <div className={className}>{children}</div>
}

/**
 * Componente para o conteudo com scroll
 * @param auto - Se true, desativa o ScrollArea e retorna uma div simples para controle customizado de layout
 */
export function ScrollPageContent({ children, className = '', auto = false }: ScrollPageContentProps) {
  // Modo auto: div simples sem ScrollArea
  if (auto) {
    return (
      <div className={`flex-1 overflow-hidden relative ${className}`}>
        {children}
      </div>
    )
  }

  // Modo padrão: com ScrollArea e padding
  return (
    <div className="flex-1 overflow-hidden relative">
      <ScrollArea className="h-full">
        <div className={`flex flex-col gap-6 p-4 ${className}`}>
          {children}
        </div>
      </ScrollArea>
    </div>
  )
}
