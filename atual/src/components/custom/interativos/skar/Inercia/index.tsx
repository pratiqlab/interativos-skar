"use client"

import React, { useState, useEffect, useMemo, useCallback, ReactNode } from 'react'
import { Search, ChevronLeft, ChevronRight, Box, Grid2X2, X, Boxes } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import MarkdownText from '@/components/custom/markdown/MarkdownText'
import { cn } from '@/lib/utils'

// ============================================================================
// TIPOS
// ============================================================================

interface SolidoData {
  previewUrl: string
  name: string
  description: string
  solid3d: ReactNode
  text: string
}

interface InerciaContextValue {
  registerSolido: (data: SolidoData) => void
}

const InerciaContext = React.createContext<InerciaContextValue | null>(null)

// ============================================================================
// SUBCOMPONENTES PARA USO EXTERNO
// ============================================================================

interface SolidoProps {
  previewUrl: string
  name: string
  description: string
  children: ReactNode
}

interface Solid3DProps {
  children: ReactNode
}

interface SolidTextProps {
  children: string
}

/**
 * Componente para definir um sólido dentro do Inercia
 * 
 * @example
 * ```tsx
 * <Solido previewUrl="/cubo.png" name="Cubo" description="Cubo de lado a">
 *   <Solid3D><MeuComponente3D /></Solid3D>
 *   <SolidText>{`# Cubo\n\nFórmulas...`}</SolidText>
 * </Solido>
 * ```
 */
export function Solido({ previewUrl, name, description, children }: SolidoProps) {
  const context = React.useContext(InerciaContext)
  const registeredRef = React.useRef(false)

  useEffect(() => {
    if (!context || registeredRef.current) return
    registeredRef.current = true

    // Extrai Solid3D e SolidText dos children
    let solid3d: ReactNode = null
    let text: string = ''

    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) return

      // Verifica o displayName ou name do componente
      const childType = child.type as { displayName?: string }
      
      if (childType.displayName === 'Solid3D') {
        solid3d = (child.props as Solid3DProps).children
      } else if (childType.displayName === 'SolidText') {
        text = (child.props as SolidTextProps).children
      }
    })

    context.registerSolido({
      previewUrl,
      name,
      description,
      solid3d,
      text
    })
  }, [context, previewUrl, name, description, children])

  return null // Não renderiza nada, apenas registra
}

/**
 * Container para o componente 3D (Three.js)
 */
export function Solid3D({ children }: Solid3DProps) {
  return <>{children}</>
}
Solid3D.displayName = 'Solid3D'

/**
 * Container para o texto markdown
 */
export function SolidText({ children }: SolidTextProps) {
  return <>{children}</>
}
SolidText.displayName = 'SolidText'

// ============================================================================
// COMPONENTES INTERNOS
// ============================================================================

interface View2DCardProps {
  solido: SolidoData
  onSelect: () => void
}

function View2DCard({ solido, onSelect }: View2DCardProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
      {/* Coluna Esquerda: Imagem Quadrada */}
      <div className="flex-shrink-0">
        <div className="w-32 h-32 sm:w-[150px] sm:h-[150px] rounded-xl overflow-hidden bg-muted shadow-md">
          <img
            src={solido.previewUrl}
            alt={solido.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      {/* Coluna Direita: Info - altura igual à imagem */}
      <div className="flex-1 flex flex-col h-32 sm:h-[150px]">
        <h3 className="text-lg font-bold text-card-foreground line-clamp-1">
          {solido.name}
        </h3>
        
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mt-1 flex-1">
          {solido.description}
        </p>
        
        <Button onClick={onSelect} className="w-full">
          Selecionar
        </Button>
      </div>
    </div>
  )
}

interface View3DContentProps {
  solido: SolidoData
  mobileTab: string
  onMobileTabChange: (tab: string) => void
}

function View3DContent({ solido, mobileTab, onMobileTabChange }: View3DContentProps) {
  return (
    <>
      {/* Mobile: Tabs */}
      <div className="sm:hidden">
        <Tabs value={mobileTab} onValueChange={onMobileTabChange} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="visualizacao" className="flex-1">Visualização</TabsTrigger>
            <TabsTrigger value="detalhes" className="flex-1">Detalhes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="visualizacao" className="mt-3">
            <div className="flex items-center justify-center">
              {solido.solid3d}
            </div>
          </TabsContent>
          
          <TabsContent value="detalhes" className="mt-3">
            <div className="h-[300px] overflow-hidden">
              <ScrollArea className="h-full">
                <div className="prose prose-sm dark:prose-invert max-w-none pr-3">
                  <MarkdownText content={solido.text} />
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Desktop: Side by side */}
      <div className="hidden sm:flex flex-row gap-4">
        {/* Canvas 3D - 50% */}
        <div className="w-1/2 flex items-center justify-center">
          {solido.solid3d}
        </div>
        
        {/* Markdown Text - 50% */}
        <div className="w-1/2 h-[380px] min-h-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="prose prose-sm dark:prose-invert max-w-none pr-3">
              <MarkdownText content={solido.text} />
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  )
}

interface PreviewCardsProps {
  solidos: SolidoData[]
  currentIndex: number
  onSelect: (index: number) => void
  filteredIndices: number[]
  viewMode: '2d' | '3d'
}

function PreviewCards({ solidos, currentIndex, onSelect, filteredIndices, viewMode }: PreviewCardsProps) {
  // Mostra apenas os sólidos filtrados
  const visibleSolidos = filteredIndices.map(i => ({ solido: solidos[i], originalIndex: i }))
  
  // No mobile 2D: 3 previews, senão: 5
  const mobileMax = viewMode === '2d' ? 3 : 5
  const desktopMax = 5
  
  return (
    <>
      {/* Mobile */}
      <div className="flex sm:hidden gap-2 justify-center py-2 px-1">
        {visibleSolidos.slice(0, mobileMax).map(({ solido, originalIndex }) => (
          <button
            key={originalIndex}
            onClick={() => onSelect(originalIndex)}
            className={cn(
              "flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all hover:scale-105",
              currentIndex === originalIndex
                ? "border-primary ring-2 ring-primary/30"
                : "border-border hover:border-primary/50"
            )}
          >
            <img
              src={solido.previewUrl}
              alt={solido.name}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
        
        {visibleSolidos.length > mobileMax && (
          <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-sm font-medium">
            +{visibleSolidos.length - mobileMax}
          </div>
        )}
      </div>
      
      {/* Desktop */}
      <div className="hidden sm:flex gap-2 justify-center py-2 px-1">
        {visibleSolidos.slice(0, desktopMax).map(({ solido, originalIndex }) => (
          <button
            key={originalIndex}
            onClick={() => onSelect(originalIndex)}
            className={cn(
              "flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all hover:scale-105",
              currentIndex === originalIndex
                ? "border-primary ring-2 ring-primary/30"
                : "border-border hover:border-primary/50"
            )}
          >
            <img
              src={solido.previewUrl}
              alt={solido.name}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
        
        {visibleSolidos.length > desktopMax && (
          <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-sm font-medium">
            +{visibleSolidos.length - desktopMax}
          </div>
        )}
      </div>
    </>
  )
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

interface InerciaProps {
  /** 
   * Se true, não renderiza botão flutuante. 
   * O componente deve ser acionado por trigger externo.
   */
  justOpen?: boolean
  /** 
   * Se true, mantém ordem de inserção.
   * Se false (padrão), ordena alfabeticamente.
   */
  ordemInsercao?: boolean
  /** Sólidos definidos com <Solido> */
  children: ReactNode
  /** Classes CSS adicionais */
  className?: string
  /** Callback quando o modal é fechado (só usado quando justOpen=false) */
  onClose?: () => void
  /** Controle externo de abertura (só usado quando justOpen=true) */
  isOpen?: boolean
}

// ============================================================================
// CONTEÚDO INTERNO DO MODAL
// ============================================================================

interface InerciaContentProps {
  solidos: SolidoData[]
  ordemInsercao: boolean
}

function InerciaContent({ solidos, ordemInsercao }: InerciaContentProps) {
  // Estado da navegação
  const [currentIndex, setCurrentIndex] = useState(0)
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d')
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [mobileTab, setMobileTab] = useState('visualizacao')

  // Ordena sólidos se necessário
  const sortedSolidos = useMemo(() => {
    if (ordemInsercao) return solidos
    return [...solidos].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
  }, [solidos, ordemInsercao])

  // Debounce da busca
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // Normaliza texto para busca (remove acentos, lowercase)
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
  }

  // Filtra sólidos pela busca
  const filteredIndices = useMemo(() => {
    if (!debouncedSearch.trim()) {
      return sortedSolidos.map((_, i) => i)
    }
    
    const normalized = normalizeText(debouncedSearch)
    return sortedSolidos
      .map((s, i) => ({ solido: s, index: i }))
      .filter(({ solido }) => normalizeText(solido.name).includes(normalized))
      .map(({ index }) => index)
  }, [sortedSolidos, debouncedSearch])

  // Quando a busca muda, vai para o primeiro resultado
  useEffect(() => {
    if (filteredIndices.length > 0 && !filteredIndices.includes(currentIndex)) {
      setCurrentIndex(filteredIndices[0])
    }
  }, [filteredIndices, currentIndex])

  // Navegação
  const canGoPrev = filteredIndices.indexOf(currentIndex) > 0
  const canGoNext = filteredIndices.indexOf(currentIndex) < filteredIndices.length - 1

  const goToPrev = () => {
    const currentFilteredIndex = filteredIndices.indexOf(currentIndex)
    if (currentFilteredIndex > 0) {
      setCurrentIndex(filteredIndices[currentFilteredIndex - 1])
    }
  }

  const goToNext = () => {
    const currentFilteredIndex = filteredIndices.indexOf(currentIndex)
    if (currentFilteredIndex < filteredIndices.length - 1) {
      setCurrentIndex(filteredIndices[currentFilteredIndex + 1])
    }
  }

  const selectSolido = (index: number) => {
    setCurrentIndex(index)
    // Mantém a view atual (não muda para 3D automaticamente)
  }

  const verEm3D = () => {
    setViewMode('3d')
  }

  // Sólido atual
  const currentSolido = sortedSolidos[currentIndex]
  const currentFilteredPosition = filteredIndices.indexOf(currentIndex) + 1
  const totalFiltered = filteredIndices.length

  if (sortedSolidos.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Nenhum sólido cadastrado
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* HEADER */}
      <div className="flex-shrink-0 space-y-3 pb-4">
        {/* Row 1: Paginação, botão view, navegação */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Paginação */}
            <span className="text-sm font-medium text-muted-foreground tabular-nums">
              {currentFilteredPosition}/{totalFiltered}
            </span>
            
            {/* Botão 2D/3D */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(v => v === '2d' ? '3d' : '2d')}
              className="gap-2"
            >
              {viewMode === '2d' ? (
                <>
                  <Box className="w-4 h-4" />
                  <span className="hidden sm:inline">Ver em 3D</span>
                </>
              ) : (
                <>
                  <Grid2X2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Ver em 2D</span>
                </>
              )}
            </Button>
          </div>
          
          {/* Navegação */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={goToPrev}
              disabled={!canGoPrev}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={goToNext}
              disabled={!canGoNext}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Row 2: Barra de busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Pesquise um sólido..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      {/* CORPO */}
      <div className="flex-1 min-h-0 overflow-auto">
        {filteredIndices.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Nenhum sólido encontrado para &quot;{searchTerm}&quot;
          </div>
        ) : viewMode === '2d' ? (
          <View2DCard 
            solido={currentSolido} 
            onSelect={verEm3D} 
          />
        ) : (
          <View3DContent 
            solido={currentSolido} 
            mobileTab={mobileTab}
            onMobileTabChange={setMobileTab}
          />
        )}
      </div>
      
      {/* FOOTER: Preview Cards - esconde no mobile quando tab detalhes no modo 3D */}
      <div className={cn(
        "flex-shrink-0 border-t border-border pt-3 mt-3",
        viewMode === '3d' && mobileTab === 'detalhes' && "hidden sm:block"
      )}>
        <PreviewCards
          solidos={sortedSolidos}
          currentIndex={currentIndex}
          onSelect={selectSolido}
          filteredIndices={filteredIndices}
          viewMode={viewMode}
        />
      </div>
    </div>
  )
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

/**
 * Componente Inercia - Visualizador interativo de sólidos com equações
 * 
 * @example
 * ```tsx
 * <Inercia>
 *   <Solido previewUrl="/cubo.png" name="Cubo" description="Cubo de lado a">
 *     <Solid3D><CuboComponent /></Solid3D>
 *     <SolidText>{`# Momento de Inércia\n\n$$I = \\frac{1}{6}ma^2$$`}</SolidText>
 *   </Solido>
 *   <Solido previewUrl="/esfera.png" name="Esfera" description="Esfera de raio r">
 *     <Solid3D><EsferaComponent /></Solid3D>
 *     <SolidText>{`# Momento de Inércia\n\n$$I = \\frac{2}{5}mr^2$$`}</SolidText>
 *   </Solido>
 * </Inercia>
 * ```
 */
export function Inercia({ 
  justOpen = false, 
  ordemInsercao = false, 
  children,
  className,
  onClose,
  isOpen: externalIsOpen
}: InerciaProps) {
  // Guard para evitar erro de hidratação
  const [isMounted, setIsMounted] = useState(false)
  
  // Estado do modal
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const isOpen = justOpen ? (externalIsOpen ?? false) : internalIsOpen
  
  // Estado dos sólidos registrados
  const [solidos, setSolidos] = useState<SolidoData[]>([])
  const [isReady, setIsReady] = useState(false)
  
  // Marca como montado no cliente
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Registra sólidos vindos dos children (evita duplicatas pelo nome)
  const registerSolido = useCallback((data: SolidoData) => {
    setSolidos(prev => {
      // Se já existe um sólido com esse nome, não adiciona
      if (prev.some(s => s.name === data.name)) {
        return prev
      }
      return [...prev, data]
    })
  }, [])

  // Marca como pronto após processar children
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    if (justOpen) {
      onClose?.()
    } else {
      setInternalIsOpen(false)
    }
  }

  const handleOpen = () => {
    setInternalIsOpen(true)
  }

  // Se justOpen=true, renderiza apenas o conteúdo sem botão e modal
  if (justOpen) {
    return (
      <InerciaContext.Provider value={{ registerSolido }}>
        {children}
        
        {isMounted && isOpen && (
          <div 
            className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50"
            onClick={handleClose}
          >
            <div 
              className={cn(
                "bg-card rounded-[var(--radius)] p-6 max-w-4xl w-full mx-4 max-h-[calc(100vh-48px)] overflow-hidden flex flex-col",
                className
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-card-foreground">
                  Sólidos
                </h2>
                <button
                  onClick={handleClose}
                  className="text-muted-foreground hover:text-card-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 min-h-0">
                {isReady ? (
                  <InerciaContent solidos={solidos} ordemInsercao={ordemInsercao} />
                ) : (
                  <div className="flex items-center justify-center h-64 text-muted-foreground">
                    Carregando sólidos...
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </InerciaContext.Provider>
    )
  }

  // Modo padrão: com botão flutuante
  return (
    <InerciaContext.Provider value={{ registerSolido }}>
      {children}
      
      {/* Botão flutuante - só renderiza no cliente */}
      {isMounted && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 bg-primary/20 hover:bg-primary text-primary-foreground p-4 rounded-full transition-all shadow-lg hover:shadow-xl z-50"
          aria-label="Abrir sólidos"
        >
          <Boxes className="w-5 h-5" />
        </button>
      )}

      {/* Modal - só renderiza no cliente */}
      {isMounted && isOpen && (
        <div 
          className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50"
          onClick={handleClose}
        >
          <div 
            className={cn(
              "bg-card rounded-[var(--radius)] p-6 max-w-4xl w-full mx-4 max-h-[calc(100vh-48px)] overflow-hidden flex flex-col",
              className
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-card-foreground">
                Sólidos
              </h2>
              <button
                onClick={handleClose}
                className="text-muted-foreground hover:text-card-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 min-h-0">
              {isReady ? (
                <InerciaContent solidos={solidos} ordemInsercao={ordemInsercao} />
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  Carregando sólidos...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </InerciaContext.Provider>
  )
}

/**
 * Wrapper para usar Inercia dentro de FloatTools ou outros containers externos
 * Não renderiza modal próprio, apenas o conteúdo
 */
export function InerciaContentWrapper({
  ordemInsercao = false,
  children
}: {
  ordemInsercao?: boolean
  children: ReactNode
}) {
  const [solidos, setSolidos] = useState<SolidoData[]>([])
  const [isReady, setIsReady] = useState(false)

  const registerSolido = useCallback((data: SolidoData) => {
    setSolidos(prev => {
      if (prev.some(s => s.name === data.name)) {
        return prev
      }
      return [...prev, data]
    })
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <InerciaContext.Provider value={{ registerSolido }}>
      {children}
      <div className="px-6 py-4 h-full">
        {isReady ? (
          <InerciaContent solidos={solidos} ordemInsercao={ordemInsercao} />
        ) : (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Carregando sólidos...
          </div>
        )}
      </div>
    </InerciaContext.Provider>
  )
}

export default Inercia

