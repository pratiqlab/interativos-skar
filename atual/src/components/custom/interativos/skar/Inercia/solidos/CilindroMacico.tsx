"use client"

import { SolidView } from "@/components/custom/interativos/3d/SolidView"
import { Solido, Solid3D, SolidText } from "@/components/custom/interativos/skar/Inercia"
import { Text, Line } from "@react-three/drei"

// ============================================================================
// CORES
// ============================================================================

const CORES = {
  // Cores distintas para as superfícies
  lateral: "#e8a0a0",   // rosa lateral
  tampas: "#f0c0c0",    // rosa claro para tampas
  cota: "#10b981",      // verde esmeralda para linhas de cota
  eixo: "#3b82f6",      // azul para eixo
}

// ============================================================================
// COMPONENTE 3D DO CILINDRO MACIÇO
// ============================================================================

/** Cilindro maciço com eixo passando pelo centro */
function CilindroMacicoMesh() {
  const raio = 1.0
  const comprimento = 2.5
  const segmentos = 64
  
  return (
    <SolidView size={380}>
      {/* Cilindro maciço */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[raio, raio, comprimento, segmentos]} />
        {/* Materiais: 0=lateral, 1=tampa superior, 2=tampa inferior */}
        <meshStandardMaterial attach="material-0" color={CORES.lateral} roughness={0.4} />
        <meshStandardMaterial attach="material-1" color={CORES.tampas} roughness={0.4} />
        <meshStandardMaterial attach="material-2" color={CORES.tampas} roughness={0.4} />
      </mesh>
      
      {/* Eixo de rotação (linha pelo centro no eixo X) */}
      <Line
        points={[[-2, 0, 0], [2, 0, 0]]}
        color={CORES.eixo}
        lineWidth={2}
      />
      
      {/* Grupo de cota na tampa frontal */}
      <group position={[comprimento / 2 + 0.02, 0, 0]}>
        {/* Linha de raio R - do eixo até a borda externa */}
        <Line
          points={[[0, 0, 0], [0, -raio, 0]]}
          color={CORES.cota}
          lineWidth={2}
        />
        
        {/* Seta R */}
        <mesh position={[0, -raio + 0.08, 0]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.05, 0.12, 8]} />
          <meshBasicMaterial color={CORES.cota} />
        </mesh>
        
        {/* Label R */}
        <Text
          position={[0.15, -raio / 2, 0]}
          fontSize={0.25}
          color={CORES.cota}
          anchorX="left"
          anchorY="middle"
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

const TEXTO_CILINDRO_MACICO = `# Cilindro Maciço

## Eixo pelo Centro (longitudinal)

Momento de inércia de um cilindro maciço de massa $M$ e raio $R$, com o eixo de rotação passando pelo **centro** ao longo do comprimento:

$$I = \\frac{1}{2}MR^2$$

### Onde:
- $M$ = massa do cilindro (kg)
- $R$ = raio do cilindro (m)

### Exemplos do dia a dia:
- Rolo de massa de pão
- Lata de refrigerante cheia
- Tronco de árvore
- Roda de carro (aproximação)
`

// ============================================================================
// SÓLIDO EXPORTADO
// ============================================================================

export function SolidoCilindroMacico() {
  return (
    <Solido
      previewUrl="https://i.postimg.cc/5NLK8Gr6/Chat-GPT-Image-29-de-nov-de-2025-21-46-25.png"
      name="Cilindro Maciço"
      description="Cilindro sólido com eixo de rotação pelo centro. Ex: rolo de massa, lata."
    >
      <Solid3D><CilindroMacicoMesh /></Solid3D>
      <SolidText>{TEXTO_CILINDRO_MACICO}</SolidText>
    </Solido>
  )
}

