'use client'

import { useState } from 'react'
import { ArrowLeftRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ConversorProps {
  justOpen?: boolean
}

// Tipos de conversão
type TipoConversao =
  | 'comprimento'
  | 'area'
  | 'volume'
  | 'velocidade'
  | 'aceleracao'
  | 'forca'
  | 'pressao'
  | 'massaEspecifica'
  | 'temperatura'
  | 'distanciaTempo'
  | 'distanciaTempoQuadrado'

// Interfaces para as configurações
interface Unidade {
  nome: string
  fator?: number
}

interface ConfigUnidade {
  nome: string
  base: string
  conversaoEspecial?: boolean
  unidades: Record<string, Unidade>
}

// Configurações de conversão (fator de conversão para unidade base)
const unidades: Record<TipoConversao, ConfigUnidade> = {
  comprimento: {
    nome: 'Comprimento',
    base: 'm',
    unidades: {
      'km': { nome: 'Quilômetro (km)', fator: 1000 },
      'm': { nome: 'Metro (m)', fator: 1 },
      'cm': { nome: 'Centímetro (cm)', fator: 0.01 },
      'mm': { nome: 'Milímetro (mm)', fator: 0.001 },
      'mi': { nome: 'Milha (mi)', fator: 1609.34 },
      'yd': { nome: 'Jarda (yd)', fator: 0.9144 },
      'ft': { nome: 'Pé (ft)', fator: 0.3048 },
      'in': { nome: 'Polegada (in)', fator: 0.0254 },
    }
  },
  area: {
    nome: 'Área',
    base: 'm²',
    unidades: {
      'km²': { nome: 'Quilômetro² (km²)', fator: 1000000 },
      'm²': { nome: 'Metro² (m²)', fator: 1 },
      'cm²': { nome: 'Centímetro² (cm²)', fator: 0.0001 },
      'mm²': { nome: 'Milímetro² (mm²)', fator: 0.000001 },
      'ha': { nome: 'Hectare (ha)', fator: 10000 },
      'ac': { nome: 'Acre (ac)', fator: 4046.86 },
      'ft²': { nome: 'Pé² (ft²)', fator: 0.092903 },
      'in²': { nome: 'Polegada² (in²)', fator: 0.00064516 },
    }
  },
  volume: {
    nome: 'Volume',
    base: 'm³',
    unidades: {
      'km³': { nome: 'Quilômetro³ (km³)', fator: 1e9 },
      'm³': { nome: 'Metro³ (m³)', fator: 1 },
      'cm³': { nome: 'Centímetro³ (cm³)', fator: 1e-6 },
      'mm³': { nome: 'Milímetro³ (mm³)', fator: 1e-9 },
      'L': { nome: 'Litro (L)', fator: 0.001 },
      'mL': { nome: 'Mililitro (mL)', fator: 1e-6 },
      'gal': { nome: 'Galão (gal)', fator: 0.00378541 },
      'ft³': { nome: 'Pé³ (ft³)', fator: 0.0283168 },
    }
  },
  velocidade: {
    nome: 'Velocidade',
    base: 'm/s',
    unidades: {
      'm/s': { nome: 'Metro/segundo (m/s)', fator: 1 },
      'km/h': { nome: 'Quilômetro/hora (km/h)', fator: 0.277778 },
      'km/s': { nome: 'Quilômetro/segundo (km/s)', fator: 1000 },
      'cm/s': { nome: 'Centímetro/segundo (cm/s)', fator: 0.01 },
      'mph': { nome: 'Milha/hora (mph)', fator: 0.44704 },
      'ft/s': { nome: 'Pé/segundo (ft/s)', fator: 0.3048 },
      'knot': { nome: 'Nó (knot)', fator: 0.514444 },
    }
  },
  aceleracao: {
    nome: 'Aceleração',
    base: 'm/s²',
    unidades: {
      'm/s²': { nome: 'Metro/segundo² (m/s²)', fator: 1 },
      'km/h²': { nome: 'Quilômetro/hora² (km/h²)', fator: 7.71605e-5 },
      'cm/s²': { nome: 'Centímetro/segundo² (cm/s²)', fator: 0.01 },
      'ft/s²': { nome: 'Pé/segundo² (ft/s²)', fator: 0.3048 },
      'g': { nome: 'Gravidade (g)', fator: 9.80665 },
      'gal': { nome: 'Gal (cm/s²)', fator: 0.01 },
    }
  },
  forca: {
    nome: 'Força',
    base: 'N',
    unidades: {
      'N': { nome: 'Newton (N)', fator: 1 },
      'kN': { nome: 'Quilonewton (kN)', fator: 1000 },
      'dyn': { nome: 'Dina (dyn)', fator: 1e-5 },
      'lbf': { nome: 'Libra-força (lbf)', fator: 4.44822 },
      'kgf': { nome: 'Quilograma-força (kgf)', fator: 9.80665 },
      'tf': { nome: 'Tonelada-força (tf)', fator: 9806.65 },
    }
  },
  pressao: {
    nome: 'Pressão',
    base: 'Pa',
    unidades: {
      'Pa': { nome: 'Pascal (Pa)', fator: 1 },
      'kPa': { nome: 'Quilopascal (kPa)', fator: 1000 },
      'MPa': { nome: 'Megapascal (MPa)', fator: 1e6 },
      'bar': { nome: 'Bar (bar)', fator: 100000 },
      'atm': { nome: 'Atmosfera (atm)', fator: 101325 },
      'psi': { nome: 'PSI (lbf/in²)', fator: 6894.76 },
      'mmHg': { nome: 'Milímetro de Mercúrio (mmHg)', fator: 133.322 },
      'kgf/cm²': { nome: 'kgf/cm²', fator: 98066.5 },
    }
  },
  massaEspecifica: {
    nome: 'Massa Específica',
    base: 'kg/m³',
    unidades: {
      'kg/m³': { nome: 'kg/m³', fator: 1 },
      'g/cm³': { nome: 'g/cm³', fator: 1000 },
      'kg/L': { nome: 'kg/L', fator: 1000 },
      'g/L': { nome: 'g/L', fator: 1 },
      'lb/ft³': { nome: 'lb/ft³', fator: 16.0185 },
      'lb/in³': { nome: 'lb/in³', fator: 27679.9 },
      't/m³': { nome: 't/m³', fator: 1000 },
    }
  },
  temperatura: {
    nome: 'Temperatura',
    base: 'C',
    conversaoEspecial: true,
    unidades: {
      'C': { nome: 'Celsius (°C)' },
      'F': { nome: 'Fahrenheit (°F)' },
      'K': { nome: 'Kelvin (K)' },
    }
  },
  distanciaTempo: {
    nome: 'Distância/Tempo (Velocidade)',
    base: 'm/s',
    unidades: {
      'm/s': { nome: 'm/s', fator: 1 },
      'km/h': { nome: 'km/h', fator: 0.277778 },
      'cm/min': { nome: 'cm/min', fator: 0.000166667 },
      'mm/s': { nome: 'mm/s', fator: 0.001 },
      'ft/min': { nome: 'ft/min', fator: 0.00508 },
    }
  },
  distanciaTempoQuadrado: {
    nome: 'Distância/Tempo² (Aceleração)',
    base: 'm/s²',
    unidades: {
      'm/s²': { nome: 'm/s²', fator: 1 },
      'cm/s²': { nome: 'cm/s²', fator: 0.01 },
      'mm/s²': { nome: 'mm/s²', fator: 0.001 },
      'ft/s²': { nome: 'ft/s²', fator: 0.3048 },
      'km/h²': { nome: 'km/h²', fator: 7.71605e-5 },
    }
  },
}

export function Conversor({ justOpen = false }: ConversorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tipoConversao, setTipoConversao] = useState<TipoConversao>('comprimento')
  const [unidadeOrigem, setUnidadeOrigem] = useState<string>('m')
  const [unidadeDestino, setUnidadeDestino] = useState<string>('km')
  const [valorOrigem, setValorOrigem] = useState<string>('')
  const [valorDestino, setValorDestino] = useState<string>('')

  // Função de conversão de temperatura
  const converterTemperatura = (valor: number, de: string, para: string): number => {
    let celsius: number

    // Converter para Celsius primeiro
    switch (de) {
      case 'C':
        celsius = valor
        break
      case 'F':
        celsius = (valor - 32) * 5 / 9
        break
      case 'K':
        celsius = valor - 273.15
        break
      default:
        celsius = valor
    }

    // Converter de Celsius para unidade de destino
    switch (para) {
      case 'C':
        return celsius
      case 'F':
        return celsius * 9 / 5 + 32
      case 'K':
        return celsius + 273.15
      default:
        return celsius
    }
  }

  // Função de conversão genérica
  const converter = (valor: string, de: string, para: string, tipo: TipoConversao): string => {
    if (!valor || isNaN(parseFloat(valor))) return ''

    const valorNum = parseFloat(valor)
    const config = unidades[tipo]

    if (config.conversaoEspecial && tipo === 'temperatura') {
      return converterTemperatura(valorNum, de, para).toFixed(6)
    }

    const fatorOrigem = config.unidades[de]?.fator || 1
    const fatorDestino = config.unidades[para]?.fator || 1

    const resultado = (valorNum * fatorOrigem) / fatorDestino
    return resultado.toFixed(6)
  }

  // Handler para mudança de valor
  const handleValorChange = (valor: string) => {
    setValorOrigem(valor)
    const resultado = converter(valor, unidadeOrigem, unidadeDestino, tipoConversao)
    setValorDestino(resultado)
  }

  // Handler para mudança de tipo de conversão
  const handleTipoChange = (tipo: TipoConversao) => {
    setTipoConversao(tipo)
    const primeiraUnidade = Object.keys(unidades[tipo].unidades)[0]
    const segundaUnidade = Object.keys(unidades[tipo].unidades)[1] || primeiraUnidade
    setUnidadeOrigem(primeiraUnidade)
    setUnidadeDestino(segundaUnidade)
    setValorOrigem('')
    setValorDestino('')
  }

  // Handler para mudança de unidade de origem
  const handleUnidadeOrigemChange = (unidade: string) => {
    setUnidadeOrigem(unidade)
    if (valorOrigem) {
      const resultado = converter(valorOrigem, unidade, unidadeDestino, tipoConversao)
      setValorDestino(resultado)
    }
  }

  // Handler para mudança de unidade de destino
  const handleUnidadeDestinoChange = (unidade: string) => {
    setUnidadeDestino(unidade)
    if (valorOrigem) {
      const resultado = converter(valorOrigem, unidadeOrigem, unidade, tipoConversao)
      setValorDestino(resultado)
    }
  }

  // Trocar unidades
  const handleTrocar = () => {
    const tempUnidade = unidadeOrigem
    const tempValor = valorOrigem

    setUnidadeOrigem(unidadeDestino)
    setUnidadeDestino(tempUnidade)
    setValorOrigem(valorDestino)
    setValorDestino(tempValor)
  }

  // Conteúdo do conversor
  const conversorContent = (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Seletor de tipo de conversão */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Tipo de Conversão</label>
        <Select value={tipoConversao} onValueChange={(v) => handleTipoChange(v as TipoConversao)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(unidades).map(([key, config]) => (
              <SelectItem key={key} value={key}>
                {config.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Unidade de origem */}
      <div className="space-y-2">
        <label className="text-sm font-medium">De:</label>
        <Select value={unidadeOrigem} onValueChange={handleUnidadeOrigemChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(unidades[tipoConversao].unidades).map(([key, unidade]) => (
              <SelectItem key={key} value={key}>
                {unidade.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="number"
          value={valorOrigem}
          onChange={(e) => handleValorChange(e.target.value)}
          placeholder="Digite o valor"
          className="text-lg"
        />
      </div>

      {/* Botão de troca */}
      <div className="flex justify-center">
        <Button variant="outline" size="icon" onClick={handleTrocar}>
          <ArrowLeftRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Unidade de destino */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Para:</label>
        <Select value={unidadeDestino} onValueChange={handleUnidadeDestinoChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(unidades[tipoConversao].unidades).map(([key, unidade]) => (
              <SelectItem key={key} value={key}>
                {unidade.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="number"
          value={valorDestino}
          readOnly
          className="text-lg bg-muted"
          placeholder="Resultado"
        />
      </div>

      {/* Informação adicional */}
      {valorOrigem && valorDestino && (
        <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border">
          <p className="text-sm text-center">
            <strong>{valorOrigem}</strong> {unidades[tipoConversao].unidades[unidadeOrigem].nome} = <strong>{valorDestino}</strong> {unidades[tipoConversao].unidades[unidadeDestino].nome}
          </p>
        </div>
      )}
    </div>
  )

  // Se justOpen=true, renderiza apenas o conteúdo sem botão e modal
  if (justOpen) {
    return (
      <div className="w-full h-full overflow-y-auto p-4">
        {conversorContent}
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
        aria-label="Abrir conversor"
      >
        <ArrowLeftRight className="w-5 h-5" />
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
              <h2 className="text-xl font-bold text-card-foreground">Conversor de Unidades</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-card-foreground"
              >
                ✕
              </button>
            </div>

            {conversorContent}
          </div>
        </div>
      )}
    </>
  )
}
