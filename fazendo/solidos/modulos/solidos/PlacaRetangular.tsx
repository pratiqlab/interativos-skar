"use client"

import { SolidView } from "@/components/custom/interativos/3d/SolidView"
import { Solido, Solid3D, SolidText } from "@/components/custom/interativos/skar/Inercia"
import { Text, Line } from "@react-three/drei"

// ============================================================================
// CORES
// ============================================================================

const CORES = {
  // Cores bem distintas para cada par de lados opostos
  lateral: "#e07b39",   // laterais (X) - laranja
  topo: "#e8c872",      // topo/fundo (Y) - amarelo madeira
  frente: "#8b5a2b",    // frente/trás (Z) - marrom escuro
  cota: "#3b82f6",      // azul para linhas de cota
}

// ============================================================================
// COMPONENTES 3D AUXILIARES
// ============================================================================

/** Linha de cota no plano XZ (vista de cima) */
function LinhaCotaXZ({ 
  start, 
  end, 
  label, 
  offset = 0.5,
  color = CORES.cota 
}: { 
  start: [number, number, number]
  end: [number, number, number]
  label: string
  offset?: number
  color?: string
}) {
  const midX = (start[0] + end[0]) / 2
  const midY = start[1]
  const midZ = (start[2] + end[2]) / 2 - offset

  return (
    <group>
      {/* Linha principal */}
      <Line
        points={[
          [start[0], start[1], start[2] - offset],
          [end[0], end[1], end[2] - offset]
        ]}
        color={color}
        lineWidth={2}
      />
      
      {/* Linhas de extensão */}
      <Line
        points={[
          [start[0], start[1], start[2]],
          [start[0], start[1], start[2] - offset - 0.1]
        ]}
        color={color}
        lineWidth={1}
      />
      <Line
        points={[
          [end[0], end[1], end[2]],
          [end[0], end[1], end[2] - offset - 0.1]
        ]}
        color={color}
        lineWidth={1}
      />
      
      {/* Setas */}
      <mesh position={[start[0] + 0.12, start[1], start[2] - offset]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.05, 0.12, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[end[0] - 0.12, end[1], end[2] - offset]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.05, 0.12, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      
      {/* Label */}
      <Text
        position={[midX, midY, midZ - 0.25]}
        fontSize={0.3}
        color={color}
        anchorX="center"
        anchorY="middle"
        font="/fonts/UlmGroteskExtrabold.ttf"
        rotation={[-Math.PI / 2, 0, 0]}
      >
        {label}
      </Text>
    </group>
  )
}

/** Linha de cota no eixo Z (lateral) */
function LinhaCotaZ({ 
  start, 
  end, 
  label, 
  offset = 0.5,
  color = CORES.cota 
}: { 
  start: [number, number, number]
  end: [number, number, number]
  label: string
  offset?: number
  color?: string
}) {
  const midX = start[0] + offset
  const midY = start[1]
  const midZ = (start[2] + end[2]) / 2

  return (
    <group>
      {/* Linha principal */}
      <Line
        points={[
          [start[0] + offset, start[1], start[2]],
          [end[0] + offset, end[1], end[2]]
        ]}
        color={color}
        lineWidth={2}
      />
      
      {/* Linhas de extensão */}
      <Line
        points={[
          [start[0], start[1], start[2]],
          [start[0] + offset + 0.1, start[1], start[2]]
        ]}
        color={color}
        lineWidth={1}
      />
      <Line
        points={[
          [end[0], end[1], end[2]],
          [end[0] + offset + 0.1, end[1], end[2]]
        ]}
        color={color}
        lineWidth={1}
      />
      
      {/* Setas */}
      <mesh position={[start[0] + offset, start[1], start[2] + 0.12]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.05, 0.12, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[end[0] + offset, end[1], end[2] - 0.12]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.05, 0.12, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      
      {/* Label */}
      <Text
        position={[midX + 0.25, midY, midZ]}
        fontSize={0.3}
        color={color}
        anchorX="center"
        anchorY="middle"
        font="/fonts/UlmGroteskExtrabold.ttf"
        rotation={[-Math.PI / 2, 0, 0]}
      >
        {label}
      </Text>
    </group>
  )
}

// ============================================================================
// COMPONENTE 3D DA PLACA
// ============================================================================

/** Placa retangular com eixo pelo centro */
function PlacaRetangularCentroMesh() {
  const largura = 1.5    // a (eixo X)
  const comprimento = 3  // b (eixo Z)
  const espessura = 0.15
  
  return (
    <SolidView size={380}>
      {/* Placa retangular com cores distintas por face */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[largura, espessura, comprimento]} />
        {/* Materiais para cada face: +X, -X, +Y, -Y, +Z, -Z */}
        <meshStandardMaterial attach="material-0" color={CORES.lateral} roughness={0.5} />
        <meshStandardMaterial attach="material-1" color={CORES.lateral} roughness={0.5} />
        <meshStandardMaterial attach="material-2" color={CORES.topo} roughness={0.5} />
        <meshStandardMaterial attach="material-3" color={CORES.topo} roughness={0.5} />
        <meshStandardMaterial attach="material-4" color={CORES.frente} roughness={0.5} />
        <meshStandardMaterial attach="material-5" color={CORES.frente} roughness={0.5} />
      </mesh>
      
      {/* Eixo de rotação (linha vertical pelo centro) */}
      <Line
        points={[[0, -1.8, 0], [0, 1.8, 0]]}
        color={CORES.cota}
        lineWidth={1}
        dashed
        dashSize={0.1}
        gapSize={0.05}
      />
      
      {/* Linha de cota a (largura - eixo X) */}
      <LinhaCotaXZ
        start={[-largura / 2, -espessura / 2, -comprimento / 2]}
        end={[largura / 2, -espessura / 2, -comprimento / 2]}
        label="a"
        offset={0.4}
      />
      
      {/* Linha de cota b (comprimento - eixo Z) */}
      <LinhaCotaZ
        start={[largura / 2, -espessura / 2, -comprimento / 2]}
        end={[largura / 2, -espessura / 2, comprimento / 2]}
        label="b"
        offset={0.4}
      />
    </SolidView>
  )
}

// ============================================================================
// TEXTO MARKDOWN
// ============================================================================

const TEXTO_PLACA_CENTRO = `# Placa Retangular

## Eixo pelo Centro

Momento de inércia de uma placa retangular fina de massa $M$, largura $a$ e comprimento $b$, com o eixo de rotação passando pelo **centro** e perpendicular à placa:

$$I = \\frac{1}{12}M(a^2 + b^2)$$

### Onde:
- $M$ = massa da placa (kg)
- $a$ = largura da placa (m)
- $b$ = comprimento da placa (m)

### Exemplos do dia a dia:
- Tampo de mesa girando
- Porta plana girando pelo centro
- Placa de sinalização
`

// ============================================================================
// SÓLIDO EXPORTADO
// ============================================================================

export function SolidoPlacaRetangularCentro() {
  return (
    <Solido
      previewUrl="https://i.postimg.cc/5NLK8Gr6/Chat-GPT-Image-29-de-nov-de-2025-21-46-25.png"
      name="Placa Retangular (centro)"
      description="Placa fina retangular com eixo de rotação pelo centro. Ex: tampo de mesa."
    >
      <Solid3D><PlacaRetangularCentroMesh /></Solid3D>
      <SolidText>{TEXTO_PLACA_CENTRO}</SolidText>
    </Solido>
  )
}
