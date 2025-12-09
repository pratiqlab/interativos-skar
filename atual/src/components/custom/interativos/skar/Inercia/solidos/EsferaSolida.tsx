"use client"

import { SolidView } from "@/components/custom/interativos/3d/SolidView"
import { Solido, Solid3D, SolidText } from "@/components/custom/interativos/skar/Inercia"
import { Text, Line } from "@react-three/drei"

// ============================================================================
// CORES
// ============================================================================

const CORES = {
  esfera: "#f5a060",    // laranja/salmão
  cota: "#10b981",      // verde esmeralda para linhas de cota
  eixo: "#3b82f6",      // azul para eixo
}

// ============================================================================
// COMPONENTE 3D DA ESFERA SÓLIDA
// ============================================================================

/** Esfera sólida com eixo passando pelo centro */
function EsferaSolidaMesh() {
  const raio = 1.2
  
  return (
    <SolidView size={380}>
      {/* Esfera sólida */}
      <mesh>
        <sphereGeometry args={[raio, 64, 64]} />
        <meshStandardMaterial color={CORES.esfera} roughness={0.3} metalness={0.1} />
      </mesh>
      
      {/* Eixo de rotação (linha vertical pelo centro - eixo Y) */}
      <Line
        points={[[0, -2, 0], [0, 2, 0]]}
        color={CORES.eixo}
        lineWidth={2}
      />
      
      {/* Linha de cota R - horizontal abaixo da esfera */}
      <group position={[0, -raio - 0.3, 0]}>
        {/* Linha do centro até a borda */}
        <Line
          points={[[0, 0, 0], [raio, 0, 0]]}
          color={CORES.cota}
          lineWidth={2}
        />
        
        {/* Linha vertical de extensão (do eixo) */}
        <Line
          points={[[0, 0.15, 0], [0, -0.15, 0]]}
          color={CORES.cota}
          lineWidth={1}
        />
        
        {/* Linha vertical de extensão (da borda) */}
        <Line
          points={[[raio, 0.15, 0], [raio, -0.15, 0]]}
          color={CORES.cota}
          lineWidth={1}
        />
        
        {/* Seta R */}
        <mesh position={[raio - 0.08, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.05, 0.12, 8]} />
          <meshBasicMaterial color={CORES.cota} />
        </mesh>
        
        {/* Label R */}
        <Text
          position={[raio / 2, -0.25, 0]}
          fontSize={0.25}
          color={CORES.cota}
          anchorX="center"
          anchorY="top"
          font="/fonts/UlmGroteskExtrabold.ttf"
        >
          R
        </Text>
      </group>
    </SolidView>
  )
}

// ============================================================================
// TEXTO MARKDOWN
// ============================================================================

const TEXTO_ESFERA_SOLIDA = `# Esfera Sólida

## Eixo pelo Centro

Momento de inércia de uma esfera sólida (maciça) de massa $M$ e raio $R$, com o eixo de rotação passando pelo **centro**:

$$I = \\frac{2}{5}MR^2$$

### Onde:
- $M$ = massa da esfera (kg)
- $R$ = raio da esfera (m)

### Exemplos do dia a dia:
- Bola de boliche
- Bola de bilhar
- Planeta Terra (aproximação)
- Bola de tênis (aproximação)
`

// ============================================================================
// SÓLIDO EXPORTADO
// ============================================================================

export function SolidoEsferaSolida() {
  return (
    <Solido
      previewUrl="https://i.postimg.cc/5NLK8Gr6/Chat-GPT-Image-29-de-nov-de-2025-21-46-25.png"
      name="Esfera Sólida"
      description="Esfera maciça com eixo de rotação pelo centro. Ex: bola de boliche."
    >
      <Solid3D><EsferaSolidaMesh /></Solid3D>
      <SolidText>{TEXTO_ESFERA_SOLIDA}</SolidText>
    </Solido>
  )
}

