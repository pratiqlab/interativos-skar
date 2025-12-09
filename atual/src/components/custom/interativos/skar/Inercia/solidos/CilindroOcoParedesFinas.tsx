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
  cota: "#10b981",      // verde esmeralda para linhas de cota
  eixo: "#3b82f6",      // azul para eixo
}

// ============================================================================
// COMPONENTE 3D DO CILINDRO OCO PAREDES FINAS
// ============================================================================

/** Cilindro oco com paredes finas (aro/tubo fino) com eixo passando pelo centro */
function CilindroOcoParedesFinasMesh() {
  const raio = 1.0
  const espessura = 0.03  // Parede muito fina
  const comprimento = 2.5
  const segmentos = 64
  
  return (
    <SolidView size={380}>
      {/* Cilindro externo (parede fina - só a casca) */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[raio, raio, comprimento, segmentos, 1, true]} />
        <meshStandardMaterial color={CORES.externa} roughness={0.4} side={2} />
      </mesh>
      
      {/* Cilindro interno (para dar espessura visual mínima) */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[raio - espessura, raio - espessura, comprimento, segmentos, 1, true]} />
        <meshStandardMaterial color={CORES.interna} roughness={0.4} side={1} />
      </mesh>
      
      {/* Borda frontal (anel fino) */}
      <mesh position={[comprimento / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <ringGeometry args={[raio - espessura, raio, segmentos]} />
        <meshStandardMaterial color={CORES.externa} roughness={0.4} side={2} />
      </mesh>
      
      {/* Borda traseira (anel fino) */}
      <mesh position={[-comprimento / 2, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <ringGeometry args={[raio - espessura, raio, segmentos]} />
        <meshStandardMaterial color={CORES.externa} roughness={0.4} side={2} />
      </mesh>
      
      {/* Eixo de rotação (linha pelo centro no eixo X) */}
      <Line
        points={[[-2, 0, 0], [2, 0, 0]]}
        color={CORES.eixo}
        lineWidth={2}
      />
      
      {/* Grupo de cota na tampa frontal */}
      <group position={[comprimento / 2 + 0.02, 0, 0]}>
        {/* Linha de raio R - do eixo até a parede */}
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

const TEXTO_CILINDRO_PAREDES_FINAS = `# Cilindro Oco com Paredes Finas

## Eixo pelo Centro (longitudinal)

Momento de inércia de um cilindro oco de paredes finas (aro/casca cilíndrica) de massa $M$ e raio $R$, com o eixo de rotação passando pelo **centro** ao longo do comprimento:

$$I = MR^2$$

### Onde:
- $M$ = massa do cilindro (kg)
- $R$ = raio do cilindro (m)

### Observação:
Este caso é uma aproximação para quando a espessura da parede é desprezível em relação ao raio.

### Exemplos do dia a dia:
- Tubo de caneta
- Aro de bicicleta
- Lata de refrigerante vazia
- Tubo de papel toalha
`

// ============================================================================
// SÓLIDO EXPORTADO
// ============================================================================

export function SolidoCilindroOcoParedesFinas() {
  return (
    <Solido
      previewUrl="https://i.postimg.cc/5NLK8Gr6/Chat-GPT-Image-29-de-nov-de-2025-21-46-25.png"
      name="Cilindro Oco (paredes finas)"
      description="Tubo de paredes finas com eixo pelo centro. Ex: aro de bicicleta, lata vazia."
    >
      <Solid3D><CilindroOcoParedesFinasMesh /></Solid3D>
      <SolidText>{TEXTO_CILINDRO_PAREDES_FINAS}</SolidText>
    </Solido>
  )
}

