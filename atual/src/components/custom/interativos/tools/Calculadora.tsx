'use client'

import { useState } from 'react'
import { CalculatorIcon, DeleteIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface CalculadoraProps {
  justOpen?: boolean
}

export function Calculadora({ justOpen = false }: CalculadoraProps) {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [newNumber, setNewNumber] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Função para adicionar número/ponto
  const handleNumber = (num: string) => {
    if (newNumber) {
      setDisplay(num)
      setNewNumber(false)
    } else {
      setDisplay(display === '0' ? num : display + num)
    }
  }

  // Função para operações básicas
  const handleOperation = (op: string) => {
    const current = parseFloat(display)

    if (previousValue !== null && operation && !newNumber) {
      const result = calculate(previousValue, current, operation)
      setDisplay(String(result))
      setPreviousValue(result)
    } else {
      setPreviousValue(current)
    }

    setOperation(op)
    setNewNumber(true)
  }

  // Função para calcular
  const calculate = (prev: number, current: number, op: string): number => {
    switch (op) {
      case '+': return prev + current
      case '-': return prev - current
      case '×': return prev * current
      case '÷': return prev / current
      case '^': return Math.pow(prev, current)
      default: return current
    }
  }

  // Função para igual
  const handleEquals = () => {
    if (previousValue !== null && operation) {
      const current = parseFloat(display)
      const result = calculate(previousValue, current, operation)
      setDisplay(String(result))
      setPreviousValue(null)
      setOperation(null)
      setNewNumber(true)
    }
  }

  // Funções científicas
  const handleScientific = (func: string) => {
    const current = parseFloat(display)
    let result: number

    switch (func) {
      case 'sin':
        result = Math.sin(current * Math.PI / 180)
        break
      case 'cos':
        result = Math.cos(current * Math.PI / 180)
        break
      case 'tan':
        result = Math.tan(current * Math.PI / 180)
        break
      case 'asin':
        result = Math.asin(current) * 180 / Math.PI
        break
      case 'acos':
        result = Math.acos(current) * 180 / Math.PI
        break
      case 'atan':
        result = Math.atan(current) * 180 / Math.PI
        break
      case 'log':
        result = Math.log10(current)
        break
      case 'ln':
        result = Math.log(current)
        break
      case '√':
        result = Math.sqrt(current)
        break
      case 'x²':
        result = current * current
        break
      default:
        result = current
    }

    setDisplay(String(result))
    setNewNumber(true)
  }

  // Limpar
  const handleClear = () => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
    setNewNumber(true)
  }

  // Deletar último caractere
  const handleDelete = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1))
    } else {
      setDisplay('0')
      setNewNumber(true)
    }
  }

  // Trocar sinal
  const handleNegate = () => {
    setDisplay(String(parseFloat(display) * -1))
  }

  // Componente da calculadora
  const CalculatorContent = () => (
    <div className="w-full max-w-md mx-auto space-y-3">
      {/* Display */}
      <Input
        value={display}
        readOnly
        className="text-right text-2xl font-mono h-14 bg-muted"
      />

      {/* Botões Científicos */}
      <div className="grid grid-cols-5 gap-2">
        <Button variant="outline" onClick={() => handleScientific('sin')} className="text-xs">
          sin
        </Button>
        <Button variant="outline" onClick={() => handleScientific('cos')} className="text-xs">
          cos
        </Button>
        <Button variant="outline" onClick={() => handleScientific('tan')} className="text-xs">
          tan
        </Button>
        <Button variant="outline" onClick={() => handleScientific('log')} className="text-xs">
          log
        </Button>
        <Button variant="outline" onClick={() => handleScientific('ln')} className="text-xs">
          ln
        </Button>
      </div>

      <div className="grid grid-cols-5 gap-2">
        <Button variant="outline" onClick={() => handleScientific('asin')} className="text-xs">
          asin
        </Button>
        <Button variant="outline" onClick={() => handleScientific('acos')} className="text-xs">
          acos
        </Button>
        <Button variant="outline" onClick={() => handleScientific('atan')} className="text-xs">
          atan
        </Button>
        <Button variant="outline" onClick={() => handleScientific('√')} className="text-xs">
          √
        </Button>
        <Button variant="outline" onClick={() => handleScientific('x²')} className="text-xs">
          x²
        </Button>
      </div>

      {/* Botões Principais */}
      <div className="grid grid-cols-4 gap-2">
        <Button variant="destructive" onClick={handleClear}>
          C
        </Button>
        <Button variant="outline" onClick={handleDelete}>
          <DeleteIcon className="w-4 h-4" />
        </Button>
        <Button variant="outline" onClick={handleNegate}>
          +/-
        </Button>
        <Button variant="outline" onClick={() => handleOperation('÷')}>
          ÷
        </Button>

        <Button variant="outline" onClick={() => handleNumber('7')}>
          7
        </Button>
        <Button variant="outline" onClick={() => handleNumber('8')}>
          8
        </Button>
        <Button variant="outline" onClick={() => handleNumber('9')}>
          9
        </Button>
        <Button variant="outline" onClick={() => handleOperation('×')}>
          ×
        </Button>

        <Button variant="outline" onClick={() => handleNumber('4')}>
          4
        </Button>
        <Button variant="outline" onClick={() => handleNumber('5')}>
          5
        </Button>
        <Button variant="outline" onClick={() => handleNumber('6')}>
          6
        </Button>
        <Button variant="outline" onClick={() => handleOperation('-')}>
          -
        </Button>

        <Button variant="outline" onClick={() => handleNumber('1')}>
          1
        </Button>
        <Button variant="outline" onClick={() => handleNumber('2')}>
          2
        </Button>
        <Button variant="outline" onClick={() => handleNumber('3')}>
          3
        </Button>
        <Button variant="outline" onClick={() => handleOperation('+')}>
          +
        </Button>

        <Button variant="outline" onClick={() => handleNumber('0')} className="col-span-2">
          0
        </Button>
        <Button variant="outline" onClick={() => handleNumber('.')}>
          .
        </Button>
        <Button variant="default" onClick={handleEquals}>
          =
        </Button>
      </div>

      {/* Potência */}
      <div className="grid grid-cols-1">
        <Button variant="outline" onClick={() => handleOperation('^')}>
          x^y (Potência)
        </Button>
      </div>
    </div>
  )

  // Se justOpen=true, renderiza apenas o conteúdo sem botão e modal
  if (justOpen) {
    return (
      <div className="w-full h-full overflow-y-auto p-4">
        <CalculatorContent />
      </div>
    )
  }

  // Renderização padrão com botão flutuante e modal
  return (
    <>
      {/* Botão flutuante */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-primary/20 hover:bg-primary text-primary-foreground p-4 rounded-full transition-all shadow-lg hover:shadow-xl z-50"
        aria-label="Abrir calculadora"
      >
        <CalculatorIcon className="w-5 h-5" />
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-card rounded-[var(--radius)] p-6 max-w-lg w-full mx-4 max-h-[calc(100vh-48px)] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-card-foreground">Calculadora Científica</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-card-foreground"
              >
                ✕
              </button>
            </div>

            <CalculatorContent />
          </div>
        </div>
      )}
    </>
  )
}
