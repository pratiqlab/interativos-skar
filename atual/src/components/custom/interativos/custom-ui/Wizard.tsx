"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface WizardProps {
  children: React.ReactNode
  onStepChange?: (step: number) => void
  onComplete?: () => void
}

interface WizardStepProps {
  children: React.ReactNode
  title?: string
  onComplete?: () => void
}

const WizardContext = React.createContext<{
  currentStep: number
  totalSteps: number
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  canGoNext: boolean
  canGoPrev: boolean
  markStepComplete: () => void
  isStepComplete: (step: number) => boolean
}>({
  currentStep: 0,
  totalSteps: 0,
  nextStep: () => {},
  prevStep: () => {},
  goToStep: () => {},
  canGoNext: false,
  canGoPrev: false,
  markStepComplete: () => {},
  isStepComplete: () => false
})

/**
 * Wizard - Componente para navegação passo a passo
 *
 * Automaticamente intercepta callbacks `onRespostaCorreta` dos componentes filhos
 * e marca o passo como completo quando o usuário acerta a questão.
 *
 * Você pode adicionar lógica customizada no callback `onRespostaCorreta` que será
 * executada APÓS marcar o passo como completo automaticamente.
 *
 * @example
 * ```tsx
 * <Wizard onComplete={() => console.log('Completo!')}>
 *   <WizardStep title="Passo 1">
 *     <Passo
 *       tipo="numerico"
 *       enunciado="Quanto é 2 + 2?"
 *       resposta="4"
 *       textoresposta="Correto!"
 *       onRespostaCorreta={() => {
 *         // Opcional: adicione lógica customizada aqui
 *         console.log('Acertou!')
 *       }}
 *     />
 *   </WizardStep>
 *   <WizardStep title="Passo 2">
 *     <MultiplaEscolha
 *       enunciado="Qual a capital do Brasil?"
 *       alternativas={[...]}
 *       resposta="C"
 *       textoresposta="Correto!"
 *       onRespostaCorreta={() => {
 *         // Opcional: adicione lógica customizada aqui
 *       }}
 *     />
 *   </WizardStep>
 * </Wizard>
 * ```
 */
export function Wizard({ children, onStepChange, onComplete }: WizardProps) {
  const childrenArray = React.Children.toArray(children)
  const totalSteps = childrenArray.length

  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      const newStep = currentStep + 1
      setCurrentStep(newStep)
      onStepChange?.(newStep)
    } else if (currentStep === totalSteps - 1) {
      // Último passo completo
      onComplete?.()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1
      setCurrentStep(newStep)
      onStepChange?.(newStep)
    }
  }

  const goToStep = (step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step)
      onStepChange?.(step)
    }
  }

  const markStepComplete = () => {
    setCompletedSteps(prev => new Set([...prev, currentStep]))
  }

  const isStepComplete = (step: number) => {
    return completedSteps.has(step)
  }

  const canGoNext = currentStep < totalSteps - 1
  const canGoPrev = currentStep > 0

  return (
    <WizardContext.Provider value={{
      currentStep,
      totalSteps,
      nextStep,
      prevStep,
      goToStep,
      canGoNext,
      canGoPrev,
      markStepComplete,
      isStepComplete
    }}>
      <div className="flex flex-col h-full">
        {/* Indicador de progresso */}
        <div className="mb-4 px-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Passo {currentStep + 1} de {totalSteps}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {Math.round(((completedSteps.size) / totalSteps) * 100)}% completo
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${((completedSteps.size) / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Conteúdo do passo atual */}
        <div className="flex-1 overflow-auto">
          {childrenArray[currentStep]}
        </div>

        {/* Navegação */}
        <div className="flex items-center justify-between gap-4 mt-4 pt-4 border-t">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={!canGoPrev}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </Button>

          <div className="flex gap-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToStep(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'bg-primary w-8'
                    : isStepComplete(index)
                      ? 'bg-success'
                      : 'bg-muted'
                }`}
                title={`Ir para passo ${index + 1}`}
              />
            ))}
          </div>

          <Button
            onClick={nextStep}
            disabled={!isStepComplete(currentStep)}
            className="flex items-center gap-2"
          >
            {currentStep === totalSteps - 1 ? 'Finalizar' : 'Próximo'}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </WizardContext.Provider>
  )
}

/**
 * WizardStep - Um passo individual do Wizard
 * Injeta automaticamente markStepComplete nos componentes filhos
 */
export function WizardStep({ children, title, onComplete }: WizardStepProps) {
  const { markStepComplete } = useWizard()

  // Injeta markStepComplete recursivamente nos filhos
  const injectMarkStepComplete = (element: React.ReactNode): React.ReactNode => {
    if (!React.isValidElement(element)) {
      return element
    }

    // Se tem onRespostaCorreta, injeta markStepComplete
    if ('onRespostaCorreta' in element.props && element.props.onRespostaCorreta) {
      const originalCallback = element.props.onRespostaCorreta

      return React.cloneElement(element as React.ReactElement<any>, {
        onRespostaCorreta: () => {
          markStepComplete()
          originalCallback?.()
        }
      })
    }

    // Processa filhos recursivamente
    if (element.props.children) {
      return React.cloneElement(element as React.ReactElement<any>, {
        children: React.Children.map(element.props.children, injectMarkStepComplete)
      })
    }

    return element
  }

  const processedChildren = injectMarkStepComplete(children)

  return (
    <div className="h-full">
      {processedChildren}
    </div>
  )
}

/**
 * Hook para acessar o contexto do Wizard
 */
export function useWizard() {
  const context = React.useContext(WizardContext)
  if (!context) {
    throw new Error('useWizard deve ser usado dentro de um Wizard')
  }
  return context
}
