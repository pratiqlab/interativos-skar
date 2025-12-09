"use client"

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Confetti from "./Confetti"

interface CompletionDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Dialog de conclusão de exercício com confetti
 * Exibido quando o aluno completa todas as questões
 */
export default function CompletionDialog({ isOpen, onOpenChange }: CompletionDialogProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true)
      // Remove confetti após 3 segundos
      const timer = setTimeout(() => {
        setShowConfetti(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  return (
    <>
      {showConfetti && <Confetti duration={3000} particleCount={150} />}

      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              🎉 Parabéns!
            </DialogTitle>
          </DialogHeader>
          <div className="text-center text-base pt-4 space-y-3">
            <div className="text-lg font-medium text-foreground">
              Você completou todas as questões!
            </div>

            <div className="text-muted-foreground">
              Agora é hora de revisar suas respostas para consolidar o aprendizado.
            </div>

            <div className="text-muted-foreground">
              Quando terminar a revisão, clique no <strong>botão flutuante</strong> no canto inferior direito para marcar como concluída ou iniciar uma nova revisão.
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <button
              onClick={() => onOpenChange(false)}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
            >
              Entendido
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
