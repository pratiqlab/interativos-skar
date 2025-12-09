"use client"

import { SolidView } from "@/components/custom/interativos/3d/SolidView"
import { Solido, Solid3D, SolidText } from "@/components/custom/interativos/skar/Inercia"
import { Text, Line } from "@react-three/drei"

// ============================================================================
// CORES
// ============================================================================

const CORES = {
  cota: "#3b82f6",  // azul para linhas de cota
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
// COMPONENTE 3D DA PLACA FINA
// ============================================================================

/** Placa retangular fina (papel) com eixo pela borda */
function PlacaRetangularFinaBordaMesh() {
  const largura = 1.5    // a (eixo X)
  const comprimento = 3  // b (eixo Z)
  const espessura = 0.02 // bem fina como papel
  
  // Cores bem distintas para cada par de lados opostos
  // Ordem das faces no BoxGeometry: +X, -X, +Y, -Y, +Z, -Z
  const corLateral = "#e07b39"    // laterais (X) - laranja
  const corTopo = "#f5e6d3"       // topo/fundo (Y) - bege claro (papel)
  const corFrente = "#8b5a2b"     // frente/trás (Z) - marrom escuro
  
  return (
    <SolidView size={380}>
      {/* Placa retangular fina deslocada para eixo na borda */}
      <mesh position={[largura / 2, 0, 0]}>
        <boxGeometry args={[largura, espessura, comprimento]} />
        {/* Materiais para cada face: +X, -X, +Y, -Y, +Z, -Z */}
        <meshStandardMaterial attach="material-0" color={corLateral} roughness={0.7} />
        <meshStandardMaterial attach="material-1" color={corLateral} roughness={0.7} />
        <meshStandardMaterial attach="material-2" color={corTopo} roughness={0.7} />
        <meshStandardMaterial attach="material-3" color={corTopo} roughness={0.7} />
        <meshStandardMaterial attach="material-4" color={corFrente} roughness={0.7} />
        <meshStandardMaterial attach="material-5" color={corFrente} roughness={0.7} />
      </mesh>
      
      {/* Eixo de rotação (linha vertical pela borda esquerda) */}
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
        start={[0, -espessura / 2, -comprimento / 2]}
        end={[largura, -espessura / 2, -comprimento / 2]}
        label="a"
        offset={0.4}
      />
      
      {/* Linha de cota b (comprimento - eixo Z) */}
      <LinhaCotaZ
        start={[largura, -espessura / 2, -comprimento / 2]}
        end={[largura, -espessura / 2, comprimento / 2]}
        label="b"
        offset={0.4}
      />
    </SolidView>
  )
}

// ============================================================================
// TEXTO MARKDOWN
// ============================================================================

const TEXTO_PLACA_FINA_BORDA = `# Placa Retangular Fina

## Eixo ao Longo da Borda

Momento de inércia de uma placa retangular fina de massa $M$ e largura $a$, com o eixo de rotação passando **ao longo de uma borda** (paralelo ao lado $b$):

$$I = \\frac{1}{3}Ma^2$$

### Onde:
- $M$ = massa da placa (kg)
- $a$ = distância perpendicular ao eixo (m)

### Exemplos do dia a dia:
- Porta girando nas dobradiças
- Folha de papel girando pela borda
- Aba de notebook abrindo
`

// ============================================================================
// SÓLIDO EXPORTADO
// ============================================================================

export function SolidoPlacaRetangularFinaBorda() {
  return (
    <Solido
      previewUrl="https://i.postimg.cc/5NLK8Gr6/Chat-GPT-Image-29-de-nov-de-2025-21-46-25.png"
      name="Placa Retangular Fina (borda)"
      description="Placa fina como papel com eixo pela borda. Ex: porta, folha de papel."
    >
      <Solid3D><PlacaRetangularFinaBordaMesh /></Solid3D>
      <SolidText>{TEXTO_PLACA_FINA_BORDA}</SolidText>
    </Solido>
  )
}

