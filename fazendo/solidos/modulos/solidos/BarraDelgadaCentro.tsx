"use client"

import { SolidView } from "@/components/custom/interativos/3d/SolidView"
import { Solido, Solid3D, SolidText } from "@/components/custom/interativos/skar/Inercia"
import { Text, Line } from "@react-three/drei"

// ============================================================================
// CORES
// ============================================================================

const CORES = {
  // Cores bem distintas para o cilindro
  lateral: "#c9967a",   // lateral - cor madeira/cobre
  tampas: "#e07b39",    // tampas (extremidades) - laranja
  cota: "#3b82f6",      // azul para linhas de cota
}

// ============================================================================
// COMPONENTES 3D AUXILIARES
// ============================================================================

/** Linha de cota horizontal no plano XZ (vista de cima) */
function LinhaCota({ 
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
  const midZ = start[2] - offset

  return (
    <group>
      {/* Linha principal (no eixo Z, abaixo da barra) */}
      <Line
        points={[
          [start[0], start[1], start[2] - offset],
          [end[0], end[1], end[2] - offset]
        ]}
        color={color}
        lineWidth={2}
      />
      
      {/* Linhas de extensão (verticais no eixo Z) */}
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
      
      {/* Setas (apontando no eixo X) */}
      <mesh position={[start[0] + 0.15, start[1], start[2] - offset]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.06, 0.15, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[end[0] - 0.15, end[1], end[2] - offset]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.06, 0.15, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      
      {/* Label (visível de cima, rotacionado para ficar horizontal) */}
      <Text
        position={[midX, midY, midZ - 0.3]}
        fontSize={0.35}
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
// COMPONENTE 3D DA BARRA
// ============================================================================

/** Barra delgada (cilindro fino e longo) com eixo pelo centro */
function BarraDelgadaCentroMesh() {
  const comprimento = 3
  const raio = 0.15
  
  return (
    <SolidView size={380}>
      {/* Barra cilíndrica na horizontal (eixo X) com cores distintas */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[raio, raio, comprimento, 32]} />
        {/* Materiais: 0=lateral, 1=tampa superior, 2=tampa inferior */}
        <meshStandardMaterial attach="material-0" color={CORES.lateral} roughness={0.4} metalness={0.2} />
        <meshStandardMaterial attach="material-1" color={CORES.tampas} roughness={0.4} metalness={0.2} />
        <meshStandardMaterial attach="material-2" color={CORES.tampas} roughness={0.4} metalness={0.2} />
      </mesh>
      
      {/* Eixo de rotação (linha vertical pelo centro) */}
      <Line
        points={[[0, -1.5, 0], [0, 1.5, 0]]}
        color={CORES.cota}
        lineWidth={1}
        dashed
        dashSize={0.1}
        gapSize={0.05}
      />
      
      {/* Linha de cota L */}
      <LinhaCota
        start={[-comprimento / 2, -raio, 0]}
        end={[comprimento / 2, -raio, 0]}
        label="L"
        offset={0.4}
      />
    </SolidView>
  )
}

// ============================================================================
// TEXTO MARKDOWN
// ============================================================================

const TEXTO_BARRA_CENTRO = `# Barra Delgada

## Eixo pelo Centro

Momento de inércia de uma barra delgada de massa $M$ e comprimento $L$, com o eixo de rotação passando pelo **centro** e perpendicular ao comprimento:

$$I = \\frac{1}{12}ML^2$$

### Onde:
- $M$ = massa da barra (kg)
- $L$ = comprimento da barra (m)

### Exemplos do dia a dia:
- Régua girando pelo centro
- Bastão de ginástica
- Cabo de vassoura equilibrado no meio
`

// ============================================================================
// SÓLIDO EXPORTADO
// ============================================================================

export function SolidoBarraDelgadaCentro() {
  return (
    <Solido
      previewUrl="https://i.postimg.cc/5NLK8Gr6/Chat-GPT-Image-29-de-nov-de-2025-21-46-25.png"
      name="Barra Delgada (centro)"
      description="Barra fina com eixo de rotação passando pelo centro. Ex: régua, bastão."
    >
      <Solid3D><BarraDelgadaCentroMesh /></Solid3D>
      <SolidText>{TEXTO_BARRA_CENTRO}</SolidText>
    </Solido>
  )
}

