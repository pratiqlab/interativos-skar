'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

// Função para calcular o excesso de poro pressão (Teoria de Terzaghi)
const calcularExcessoPoroPressao = (zOverHd: number, Tv: number, deltaSigma: number = 1): number => {
  if (Tv <= 0 || zOverHd < 0 || zOverHd > 2) return 0;

  let u = 0;
  const maxTerms = 10; // Número suficiente de termos para convergência

  // Fórmula correta: u(z,t) = (4/π) Δσ Σ[1/(2m+1) * sin((2m+1)/2 π z/H_d) * exp(-(2m+1)² π² T_v / 4)]
  const z = zOverHd; // Como z/h_d é dado diretamente

  for (let m = 0; m < maxTerms; m++) {
    const term1 = 1 / (2 * m + 1);
    const term2 = Math.sin((2 * m + 1)/2 * Math.PI * z);
    const term3 = Math.exp(-Math.pow(2 * m + 1, 2) * Math.PI * Math.PI * Tv / 4);
    u += term1 * term2 * term3;
  }

  u = (4/Math.PI) * deltaSigma * u;
  return Math.max(0, u); // Garante que u seja não negativo
};

export default function Uzt() {
  const [Tv, setTv] = useState<number>(0.1)
  const [zOverHd, setZOverHd] = useState<number>(0.5)
  const [resultadoCalculado, setResultadoCalculado] = useState<boolean>(false)
  const [dissipacaoAdimensional, setDissipacaoAdimensional] = useState<number>(0)
  const [calculando, setCalculando] = useState<boolean>(false)

  // Limpar resultado quando parâmetros forem alterados
  const handleTvChange = (value: number) => {
    setTv(value)
    setResultadoCalculado(false) // Limpa resultado
  }

  const handleZOverHdChange = (value: number) => {
    setZOverHd(value)
    setResultadoCalculado(false) // Limpa resultado
  }

  const handleCalcular = async () => {
    // Iniciar cálculo
    setCalculando(true)
    setResultadoCalculado(false)

    // Simular processamento (para feedback visual)
    await new Promise(resolve => setTimeout(resolve, 100))

    // Recalcular com os novos parâmetros
    const excessoPoro = calcularExcessoPoroPressao(zOverHd, Tv, 1) // Δσ = 1
    const dissipacaoAdimensional = 1 - excessoPoro // Valor adimensional U(z,t)

    // Atualizar estados com os novos valores
    setDissipacaoAdimensional(dissipacaoAdimensional)
    setResultadoCalculado(true)
    setCalculando(false)
  }

  return (
    <div className="space-y-4 max-w-md">
      <p className="text-base font-semibold text-foreground">
        Digite os valores de T<sub>v</sub> e z/H<sub>d</sub>
      </p>
      <div className="space-y-2">
        <strong>T<sub>v</sub> :</strong> <br />
        <Input
          id="tv"
          type="number"
          step="0.01"
          value={Tv}
          onChange={(e) => handleTvChange(Number(e.target.value))}
          placeholder="Tempo adimensional"
        />
      </div>

      <div className="space-y-2">
        <strong>z/H<sub>d</sub> :</strong> <br />
        <Input
          id="zhd"
          type="number"
          step="0.05"
          min="0"
          max="2"
          value={zOverHd}
          onChange={(e) => handleZOverHdChange(Number(e.target.value))}
          placeholder="Razão z/h_d"
        />
      </div>

      <div className="pt-4 border-t space-y-3">
        <Button
          onClick={handleCalcular}
          className="w-full"
          variant="default"
          disabled={calculando}
        >
          {calculando ? "Calculando..." : "Calcular Dissipação"}
        </Button>

        {resultadoCalculado && (
          <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Dissipação de Poro Pressão (Terzaghi)
            </h4>
            <p className="text-lg font-mono text-blue-800 dark:text-blue-200">
              <strong>U<sub>(z,t)</sub> = {dissipacaoAdimensional.toFixed(4)}</strong>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              T<sub>v</sub> = {Tv}, <br />z/H<sub>d</sub> = {zOverHd}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

