"use client"

import { SolidView } from "@/components/custom/interativos/3d/SolidView"
import { Solido, Solid3D, SolidText } from "@/components/custom/interativos/skar/Inercia"
import { Text, Line } from "@react-three/drei"

// ============================================================================
// CORES
// ============================================================================

const CORES = {
  // Cores distintas para as superfícies
  externa: "#e8a0a0",   // rosa externo
  interna: "#d47070",   // rosa mais escuro interno
  tampas: "#f0c0c0",    // rosa claro para tampas
  cota: "#10b981",      // verde esmeralda para linhas de cota
  eixo: "#3b82f6",      // azul para eixo
}

// ============================================================================
// COMPONENTE 3D DO CILINDRO OCO
// ============================================================================

/** Cilindro oco (tubo) com eixo passando pelo centro */
function CilindroOcoMesh() {
  const raioExterno = 1.2
  const raioInterno = 0.5
  const comprimento = 2.5
  const segmentos = 64
  
  return (
    <SolidView size={380}>
      {/* Cilindro externo */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[raioExterno, raioExterno, comprimento, segmentos, 1, true]} />
        <meshStandardMaterial color={CORES.externa} roughness={0.4} side={2} />
      </mesh>
      
      {/* Cilindro interno (buraco) */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[raioInterno, raioInterno, comprimento, segmentos, 1, true]} />
        <meshStandardMaterial color={CORES.interna} roughness={0.4} side={1} />
      </mesh>
      
      {/* Tampa frontal (anel) */}
      <mesh position={[comprimento / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <ringGeometry args={[raioInterno, raioExterno, segmentos]} />
        <meshStandardMaterial color={CORES.tampas} roughness={0.4} side={2} />
      </mesh>
      
      {/* Tampa traseira (anel) */}
      <mesh position={[-comprimento / 2, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <ringGeometry args={[raioInterno, raioExterno, segmentos]} />
        <meshStandardMaterial color={CORES.tampas} roughness={0.4} side={2} />
      </mesh>
      
      {/* Eixo de rotação (linha pelo centro no eixo X) */}
      <Line
        points={[[-2, 0, 0], [2, 0, 0]]}
        color={CORES.eixo}
        lineWidth={2}
      />
      
      {/* Grupo de cotas na tampa frontal (fora do cilindro para ficar visível) */}
      <group position={[comprimento / 2 + 0.02, 0, 0]}>
        {/* Linha de raio R1 (interno) - do eixo até a borda interna */}
        <Line
          points={[[0, 0, 0], [0, -raioInterno, 0]]}
          color={CORES.cota}
          lineWidth={2}
        />
        
        {/* Seta R1 */}
        <mesh position={[0, -raioInterno + 0.08, 0]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.05, 0.12, 8]} />
          <meshBasicMaterial color={CORES.cota} />
        </mesh>
        
        {/* Label R1 */}
        <Text
          position={[0.15, -raioInterno / 2, 0]}
          fontSize={0.22}
          color={CORES.cota}
          anchorX="left"
          anchorY="middle"
          font="/fonts/UlmGroteskExtrabold.ttf"
        >
          R1
        </Text>
        
        {/* Linha de raio R2 (externo) - do eixo até a borda externa */}
        <Line
          points={[[0, 0, 0], [0, raioExterno, 0]]}
          color={CORES.cota}
          lineWidth={2}
        />
        
        {/* Seta R2 */}
        <mesh position={[0, raioExterno - 0.08, 0]} rotation={[0, 0, 0]}>
          <coneGeometry args={[0.05, 0.12, 8]} />
          <meshBasicMaterial color={CORES.cota} />
        </mesh>
        
        {/* Label R2 */}
        <Text
          position={[0.15, raioExterno / 2, 0]}
          fontSize={0.22}
          color={CORES.cota}
          anchorX="left"
          anchorY="middle"
          font="/fonts/UlmGroteskExtrabold.ttf"
        >
          R2
        </Text>
      </group>
    </SolidView>
  )
}

// ============================================================================
// TEXTO MARKDOWN
// ============================================================================

const TEXTO_CILINDRO_OCO = `# Cilindro Oco

## Eixo pelo Centro (longitudinal)

Momento de inércia de um cilindro oco (tubo) de massa $M$, raio interno $R_1$ e raio externo $R_2$, com o eixo de rotação passando pelo **centro** ao longo do comprimento:

$$I = \\frac{1}{2}M(R_1^2 + R_2^2)$$

### Onde:
- $M$ = massa do cilindro (kg)
- $R_1$ = raio interno (m)
- $R_2$ = raio externo (m)

### Exemplos do dia a dia:
- Cano de PVC girando
- Rolo de papel higiênico
- Tubo de aço
- Pneu de bicicleta
`

// ============================================================================
// SÓLIDO EXPORTADO
// ============================================================================

export function SolidoCilindroOco() {
  return (
    <Solido
      previewUrl="https://i.postimg.cc/5NLK8Gr6/Chat-GPT-Image-29-de-nov-de-2025-21-46-25.png"
      name="Cilindro Oco"
      description="Tubo com eixo de rotação passando pelo centro. Ex: cano, rolo de papel."
    >
      <Solid3D><CilindroOcoMesh /></Solid3D>
      <SolidText>{TEXTO_CILINDRO_OCO}</SolidText>
    </Solido>
  )
}

