import { LightbulbIcon } from 'lucide-react'
import { useState } from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import MarkdownView from '@/components/custom/markdown/MarkdownView'

interface FloatDicaProps {
    dica?: Record<string, string>;
    tipoDica?: 'text' | 'acord';
    justOpen?: boolean;
}

export function FloatDica({ dica, tipoDica = 'text', justOpen = false }: FloatDicaProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!dica) return null;

    // Se justOpen=true, renderiza apenas o conteúdo sem botão e modal
    if (justOpen) {
        return (
            <div className="w-full h-full overflow-y-auto">
                {tipoDica === 'text' ? (
                    <div className="text-card-foreground p-4">
                        <MarkdownView content={dica?.['Dica'] || ''} />
                    </div>
                ) : (
                    <div className="p-4">
                        <Accordion type="single" collapsible className="w-full space-y-3">
                            {Object.entries(dica || {}).map(([titulo, texto], index) => (
                                <AccordionItem
                                    key={index}
                                    value={`item-${index}`}
                                    className="bg-card rounded-xl shadow-md border border-border transition-all overflow-hidden"
                                >
                                    <AccordionTrigger
                                        className="
                                        text-left 
                                        text-card-foreground 
                                        px-5 py-4 
                                        font-semibold 
                                        text-base 
                                        flex items-center 
                                        gap-2 
                                        transition-all duration-200 
                                        rounded-xl 
                                        group border-none 
                                        bg-muted/50 dark:bg-primary/50 hover:bg-primary/20 dark:hover:bg-muted/40 
                                        data-[state=open]:bg-muted/50 dark:data-[state=open]:bg-primary/60 
                                        data-[state=open]:shadow-lg 
                                        dark:data-[state=open]:text-primary-foreground 
                                        no-underline hover:no-underline focus:no-underline"
                                    >
                                        <span className="transition-colors duration-200">{titulo}</span>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-card-foreground bg-card px-5 pb-5 pt-5 text-[15px] rounded-b-xl transition-all duration-200 text-justify max-h-[50vh] overflow-y-auto">
                                        <MarkdownView content={texto} />
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                )}
            </div>
        );
    }

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-6 right-6 bg-primary/20 hover:bg-primary text-primary-foreground p-4 rounded-full transition-all shadow-lg hover:shadow-xl z-50"
                aria-label="Mostrar dica"
            >
                <LightbulbIcon className="w-5 h-5" />
            </button>

            {/* Modal de Dicas */}
            {isModalOpen && (
                <div 
                    className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div 
                        className="bg-card rounded-[var(--radius)] p-6 max-w-lg w-full mx-4 max-h-[calc(100vh-48px)] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-card-foreground">
                                {tipoDica === 'text' ? 'Dica' : 'Dicas'}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-muted-foreground hover:text-card-foreground"
                            >
                                ✕
                            </button>
                        </div>

                        {tipoDica === 'text' ? (
                            <div className="text-card-foreground">
                                <MarkdownView content={dica?.['Dica'] || ''} />
                            </div>
                        ) : (
                            <Accordion type="single" collapsible className="w-full space-y-3">
                                {Object.entries(dica || {}).map(([titulo, texto], index) => (
                                    <AccordionItem
                                        key={index}
                                        value={`item-${index}`}
                                        className="bg-card rounded-xl shadow-md border border-border transition-all overflow-hidden"
                                    >
                                        <AccordionTrigger
                                            className="
                                            text-left 
                                            text-card-foreground 
                                            px-5 py-4 
                                            font-semibold 
                                            text-base 
                                            flex items-center 
                                            gap-2 
                                            transition-all duration-200 
                                            rounded-xl 
                                            group border-none 
                                            bg-muted/50 dark:bg-primary/50 hover:bg-primary/20 dark:hover:bg-muted/40 
                                            data-[state=open]:bg-muted/50 dark:data-[state=open]:bg-primary/60 
                                            data-[state=open]:shadow-lg 
                                            dark:data-[state=open]:text-primary-foreground 
                                            no-underline hover:no-underline focus:no-underline"
                                        >
                                            <span className="transition-colors duration-200">{titulo}</span>
                                        </AccordionTrigger>
                                        <AccordionContent className="text-card-foreground bg-card px-5 pb-5 pt-5 text-[15px] rounded-b-xl transition-all duration-200 text-justify max-h-[50vh] overflow-y-auto">
                                            <MarkdownView content={texto} />
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}