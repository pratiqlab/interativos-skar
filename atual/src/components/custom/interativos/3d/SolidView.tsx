"use client"

import { Canvas, useThree } from "@react-three/fiber"
import { OrbitControls, Text } from "@react-three/drei"
import * as THREE from "three"
import { useRef, useState, useEffect, ReactNode } from "react"
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"

// Cores padrão
const DEFAULT_BACKGROUND = "#e8e8e8"

// Distância padrão da câmera
const CAMERA_DISTANCE = 6

// Posições das views (referencial padrão: Y para cima, Z para frente)
const ISO_DIST = CAMERA_DISTANCE / Math.sqrt(3)
const VIEW_POSITIONS = {
  top:    { position: [0, CAMERA_DISTANCE, 0] as [number, number, number], up: [0, 0, -1] as [number, number, number] },
  bottom: { position: [0, -CAMERA_DISTANCE, 0] as [number, number, number], up: [0, 0, 1] as [number, number, number] },
  front:  { position: [0, 0, CAMERA_DISTANCE] as [number, number, number], up: [0, 1, 0] as [number, number, number] },
  back:   { position: [0, 0, -CAMERA_DISTANCE] as [number, number, number], up: [0, 1, 0] as [number, number, number] },
  left:   { position: [-CAMERA_DISTANCE, 0, 0] as [number, number, number], up: [0, 1, 0] as [number, number, number] },
  right:  { position: [CAMERA_DISTANCE, 0, 0] as [number, number, number], up: [0, 1, 0] as [number, number, number] },
  iso:    { position: [ISO_DIST, ISO_DIST, ISO_DIST] as [number, number, number], up: [0, 1, 0] as [number, number, number] },
  isoAlt: { position: [-ISO_DIST, ISO_DIST, -ISO_DIST] as [number, number, number], up: [0, 1, 0] as [number, number, number] },
}

type ViewType = keyof typeof VIEW_POSITIONS

function Axes() {
  const axisLength = 3
  const axisThickness = 0.03

  return (
    <group>
      {/* Eixo X - Magenta */}
      <mesh position={[axisLength / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[axisThickness, axisThickness, axisLength, 16]} />
        <meshStandardMaterial color="#d946ef" />
      </mesh>
      
      {/* Eixo Y - Verde */}
      <mesh position={[0, axisLength / 2, 0]}>
        <cylinderGeometry args={[axisThickness, axisThickness, axisLength, 16]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>
      
      {/* Eixo Z - Azul */}
      <mesh position={[0, 0, axisLength / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[axisThickness, axisThickness, axisLength, 16]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>

      {/* Pontas dos eixos (cones) */}
      <mesh position={[axisLength, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.08, 0.2, 16]} />
        <meshStandardMaterial color="#d946ef" />
      </mesh>
      
      <mesh position={[0, axisLength, 0]}>
        <coneGeometry args={[0.08, 0.2, 16]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>
      
      <mesh position={[0, 0, axisLength]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.08, 0.2, 16]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>

      {/* Labels dos eixos */}
      <AxisLabel text="X" position={[axisLength + 0.3, 0, 0]} color="#d946ef" />
      <AxisLabel text="Y" position={[0, axisLength + 0.3, 0]} color="#22c55e" />
      <AxisLabel text="Z" position={[0, 0, axisLength + 0.3]} color="#3b82f6" />
    </group>
  )
}

function AxisLabel({ text, position, color }: { text: string; position: [number, number, number]; color: string }) {
  return (
    <Text
      position={position}
      fontSize={0.35}
      color={color}
      anchorX="center"
      anchorY="middle"
      font="/fonts/UlmGroteskExtrabold.ttf"
    >
      {text}
    </Text>
  )
}

interface SceneProps {
  controlsRef: React.RefObject<OrbitControlsImpl | null>
  targetView: ViewType | null
  onAnimationComplete: () => void
  children?: ReactNode
  showAxes?: boolean
}

function Scene({ controlsRef, targetView, onAnimationComplete, children, showAxes = true }: SceneProps) {
  const { camera } = useThree()
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    if (!targetView || !controlsRef.current) return

    const target = VIEW_POSITIONS[targetView]
    const startPos = camera.position.clone()
    const endPos = new THREE.Vector3(...target.position)
    const startUp = camera.up.clone()
    const endUp = new THREE.Vector3(...target.up)
    
    const duration = 500
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)

      camera.position.lerpVectors(startPos, endPos, eased)
      camera.up.lerpVectors(startUp, endUp, eased)
      camera.lookAt(0, 0, 0)
      
      if (controlsRef.current) {
        controlsRef.current.update()
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        onAnimationComplete()
      }
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [targetView, camera, controlsRef, onAnimationComplete])

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <directionalLight position={[-5, -5, -5]} intensity={0.3} />
      <pointLight position={[0, 5, 0]} intensity={0.5} />
      
      {showAxes && <Axes />}
      {children}
      
      <OrbitControls 
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={15}
        target={[0, 0, 0]}
      />
    </>
  )
}

export interface SolidViewProps {
  /** Tamanho do canvas (número em px ou string CSS) */
  size?: number | string
  /** Classes CSS adicionais */
  className?: string
  /** Cor de fundo do canvas */
  background?: string
  /** Mostrar eixos XYZ */
  showAxes?: boolean
  /** Mostrar botões de visualização */
  showViewButtons?: boolean
  /** Mostrar legenda dos eixos */
  showLegend?: boolean
  /** Sólido/mesh Three.js */
  children: ReactNode
}

export function SolidView({ 
  size = "min(85vw, 85vh, 450px)", 
  className = "",
  background = DEFAULT_BACKGROUND,
  showAxes = true,
  showViewButtons = true,
  showLegend = true,
  children
}: SolidViewProps) {
  const sizeStyle = typeof size === "number" ? `${size}px` : size
  const controlsRef = useRef<OrbitControlsImpl | null>(null)
  const [targetView, setTargetView] = useState<ViewType | null>(null)

  const handleViewClick = (view: ViewType) => {
    setTargetView(view)
  }

  const handleAnimationComplete = () => {
    setTargetView(null)
  }

  const viewButtons: { key: ViewType; label: string; icon: string }[] = [
    { key: "top", label: "Topo", icon: "↑" },
    { key: "bottom", label: "Fundo", icon: "↓" },
    { key: "front", label: "Frente", icon: "●" },
    { key: "back", label: "Trás", icon: "○" },
    { key: "left", label: "Esquerda", icon: "←" },
    { key: "right", label: "Direita", icon: "→" },
    { key: "iso", label: "Isométrica", icon: "◢" },
    { key: "isoAlt", label: "Iso Inversa", icon: "◣" },
  ]

  return (
    <div 
      className={`relative rounded-xl overflow-hidden shadow-lg border border-border/20 ${className}`}
      style={{ 
        width: sizeStyle, 
        height: sizeStyle,
        aspectRatio: "1 / 1"
      }}
    >
      <Canvas
        camera={{ 
          position: [4, 3, 4], 
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        gl={{ 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
        style={{ background }}
      >
        <Scene 
          controlsRef={controlsRef} 
          targetView={targetView}
          onAnimationComplete={handleAnimationComplete}
          showAxes={showAxes}
        >
          {children}
        </Scene>
      </Canvas>
      
      {/* Botões de visualização */}
      {showViewButtons && (
        <TooltipProvider delayDuration={200}>
          <div className="absolute top-2 right-2 grid grid-cols-2 gap-1">
            {viewButtons.map(({ key, label, icon }, index) => (
              <Tooltip key={key}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleViewClick(key)}
                    className="flex items-center justify-center bg-black/50 hover:bg-black/70 backdrop-blur-sm w-8 h-8 rounded-md text-sm text-white transition-all duration-200 hover:scale-110 active:scale-95"
                  >
                    {icon}
                  </button>
                </TooltipTrigger>
                <TooltipContent side={index % 2 === 0 ? "left" : "right"} sideOffset={8}>
                  {label}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      )}

      {/* Legenda dos eixos */}
      {showLegend && showAxes && (
        <div className="absolute bottom-2 left-2 flex gap-2 bg-black/40 backdrop-blur-sm px-2 py-1.5 rounded-md text-[10px] font-mono">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d946ef]" />
            <span className="text-white">X</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
            <span className="text-white">Y</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" />
            <span className="text-white">Z</span>
          </span>
        </div>
      )}
    </div>
  )
}

export default SolidView
