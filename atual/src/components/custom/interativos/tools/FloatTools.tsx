'use client'

import { useState, useEffect } from 'react'
import { WrenchIcon, XIcon } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { BetterSheet } from "@/components/custom/ui/BetterSheet"
import { Rnd } from 'react-rnd'

interface Tool {
    nome: string
    icone: React.ReactNode
    tool: React.ReactNode
    view: "modal" | "sheet" | "window"
    windowSize?: {
        width?: number
        height?: number
        minWidth?: number
        minHeight?: number
    }
}

interface FloatToolsProps {
    tools: Tool[]
}

export function FloatTools({ tools }: FloatToolsProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [activeTool, setActiveTool] = useState<Tool | null>(null)
    const [windowOpen, setWindowOpen] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const handleToolClick = (tool: Tool) => {
        setActiveTool(tool)
        if (tool.view === 'window') {
            setWindowOpen(true)
        }
        setIsOpen(false)
    }

    const handleClose = () => {
        setActiveTool(null)
        setWindowOpen(false)
    }

    return (
        <>
            {/* Botão principal flutuante */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-primary/20 hover:bg-primary text-primary-foreground p-4 rounded-full transition-all shadow-lg hover:shadow-xl z-50"
                aria-label={isOpen ? "Fechar ferramentas" : "Abrir ferramentas"}
            >
                {isOpen ? (
                    <XIcon className="w-5 h-5 transition-transform" />
                ) : (
                    <WrenchIcon className="w-5 h-5 transition-transform" />
                )}
            </button>

            {/* Ícones das ferramentas */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 flex flex-col gap-3 z-50">
                    {tools.map((tool, index) => (
                        <button
                            key={index}
                            onClick={() => handleToolClick(tool)}
                            className="bg-primary/20 hover:bg-primary text-primary-foreground p-3 rounded-full transition-all shadow-lg hover:shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200"
                            style={{ animationDelay: `${index * 50}ms` }}
                            aria-label={tool.nome}
                            title={tool.nome}
                        >
                            {tool.icone}
                        </button>
                    ))}
                </div>
            )}

            {/* Modal */}
            {activeTool?.view === 'modal' && (
                <Dialog open={!!activeTool} onOpenChange={(open) => !open && handleClose()}>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{activeTool.nome}</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">
                            {activeTool.tool}
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {/* Sheet */}
            {activeTool?.view === 'sheet' && (
                <Sheet open={!!activeTool} onOpenChange={(open) => !open && handleClose()}>
                    <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-0 flex flex-col">
                        <SheetHeader className="px-6 pt-6 pb-3">
                            <SheetTitle>{activeTool.nome}</SheetTitle>
                        </SheetHeader>
                        <div className="flex-1 min-h-0">
                            {activeTool.tool}
                        </div>
                    </SheetContent>
                </Sheet>
            )}

            {/* Window (janela resizable) */}
            {activeTool?.view === 'window' && windowOpen && isMounted && (() => {
                const width = activeTool.windowSize?.width || 400
                const height = activeTool.windowSize?.height || 750
                const minWidth = activeTool.windowSize?.minWidth || 320
                const minHeight = activeTool.windowSize?.minHeight || 550

                return (
                    <Rnd
                        default={{
                            x: typeof window !== 'undefined' ? window.innerWidth / 2 - width / 2 : 100,
                            y: typeof window !== 'undefined' ? window.innerHeight / 2 - height / 2 : 50,
                            width: width,
                            height: height,
                        }}
                        minWidth={minWidth}
                        minHeight={minHeight}
                        bounds="window"
                        className="z-50"
                        dragHandleClassName="drag-handle"
                    >
                    <div className="w-full h-full bg-card rounded-[var(--radius)] shadow-2xl border border-border flex flex-col overflow-hidden">
                        <div className="drag-handle flex items-center justify-between p-4 bg-muted border-b border-border cursor-move">
                            <h3 className="font-semibold text-card-foreground">{activeTool.nome}</h3>
                            <button
                                onClick={handleClose}
                                className="text-muted-foreground hover:text-card-foreground transition-colors"
                                aria-label="Fechar"
                            >
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto flex items-center justify-center">
                            {activeTool.tool}
                        </div>
                    </div>
                </Rnd>
                )
            })()}
        </>
    )
}