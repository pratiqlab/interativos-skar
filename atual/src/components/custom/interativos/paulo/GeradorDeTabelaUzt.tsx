'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

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

export default function TabelaU() {
  const [Tv, setTv] = useState<number>(0.1)
  const [calculando, setCalculando] = useState<boolean>(false)
  const [resultadoCalculado, setResultadoCalculado] = useState<boolean>(false)

  // Valores de z/Hd para a tabela (0.0, 0.1, 0.2, ..., 2.0)
  const valoresZOverHd = useMemo(() => {
    const valores: number[] = [];
    for (let i = 0; i <= 20; i++) {
      valores.push(i * 0.1);
    }
    return valores;
  }, []);

  // Calcular tabela de valores U(z,t)
  const tabelaValores = useMemo(() => {
    if (!resultadoCalculado) return [];

    return valoresZOverHd.map(zOverHd => ({
      zOverHd,
      excessoPoro: calcularExcessoPoroPressao(zOverHd, Tv, 1),
      dissipacao: 1 - calcularExcessoPoroPressao(zOverHd, Tv, 1)
    }));
  }, [Tv, resultadoCalculado, valoresZOverHd]);

  const handleCalcular = async () => {
    setCalculando(true)
    setResultadoCalculado(false)

    // Simular processamento
    await new Promise(resolve => setTimeout(resolve, 200))

    setResultadoCalculado(true)
    setCalculando(false)
  }

  const handleTvChange = (value: number) => {
    setTv(value)
    setResultadoCalculado(false) // Limpa resultado quando parâmetro muda
  }

  return (
    <div className="w-full h-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Controles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Parâmetros da Tabela U(z,t)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Tempo adimensional T<sub>v</sub>
            </label>
            <Input
              type="number"
              step="0.01"
              min="0.01"
              max="10"
              value={Tv}
              onChange={(e) => handleTvChange(Number(e.target.value))}
              placeholder="Digite o valor de Tv"
            />
          </div>

          <Button
            onClick={handleCalcular}
            className="w-full"
            variant="default"
            disabled={calculando}
          >
            {calculando ? "Calculando..." : "Gerar Tabela"}
          </Button>
        </CardContent>
      </Card>

      {/* Tabela de Resultados */}
      {resultadoCalculado && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Tabela de Dissipação U(z,t) - Tv = {Tv}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">z/H<sub>d</sub></TableHead>
                    <TableHead className="text-center">u(z,t)/Δσ</TableHead>
                    <TableHead className="text-center">U(z,t) = 1 - u(z,t)/Δσ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tabelaValores.map((linha, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-center font-mono">
                        {linha.zOverHd.toFixed(1)}
                      </TableCell>
                      <TableCell className="text-center font-mono">
                        {linha.excessoPoro.toFixed(4)}
                      </TableCell>
                      <TableCell className="text-center font-mono font-semibold">
                        {linha.dissipacao.toFixed(4)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <h4 className="text-sm font-semibold mb-2">Legenda:</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li><strong>z/H<sub>d</sub></strong>: Razão entre profundidade e altura de drenagem</li>
                <li><strong>u(z,t)/Δσ</strong>: Excesso de poro pressão adimensional</li>
                <li><strong>U(z,t)</strong>: Grau de dissipação de poro pressão (1 = dissipação completa)</li>
                <li><strong>T<sub>v</sub></strong>: Fator tempo adimensional = {Tv}</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
