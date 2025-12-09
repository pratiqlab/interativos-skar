import { useState } from 'react'
import { Card } from '@/components/ui/card'

interface VarData {
    titulo: string
    valor: number
    casas: number
    unidade: string
}

interface VarFlashCardProps {
    front: VarData | VarData[]
    back: VarData | VarData[]
    qnt?: 1 | 2
}

export function VarFlashCard({ front, back, qnt = 1 }: VarFlashCardProps) {
    const [isFlipped, setIsFlipped] = useState(false)

    // Função para renderizar um lado do card
    const renderCardSide = (data: VarData) => (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="text-sm text-gray-500 dark:text-gray-400">{data.titulo}</div>
            <div className="text-lg font-semibold dark:text-white">
                {data.valor.toFixed(data.casas)}
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-500">{data.unidade}</div>
        </div>
    )

    // Função para renderizar dois valores em um lado do card
    const renderDualCardSide = (data: VarData[]) => (
        <div className="flex flex-col items-center justify-center h-full w-full gap-2">
            {/* Valor Máximo (data[1]) na parte superior */}
            <div className="text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400">{data[1].titulo}</div>
                <div className="flex items-baseline justify-center gap-1">
                    <div className="text-sm font-semibold dark:text-white">
                        {data[1].valor.toFixed(data[1].casas)}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">{data[1].unidade}</div>
                </div>
            </div>

            <div className="w-full border-t border-gray-200 dark:border-gray-700" />

            {/* Valor Atual (data[0]) na parte inferior */}
            <div className="text-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">{data[0].titulo}</div>
                <div className="flex items-baseline justify-center gap-1">
                    <div className="text-lg font-semibold dark:text-white">
                        {data[0].valor.toFixed(data[0].casas)}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">{data[0].unidade}</div>
                </div>
            </div>
        </div>
    )

    // Função para determinar como renderizar o conteúdo
    const renderContent = (content: VarData | VarData[]) => {
        if (Array.isArray(content) && qnt === 2) {
            return renderDualCardSide(content);
        }
        return renderCardSide(content as VarData);
    }

    return (
        <div
            className="relative w-full h-32 max-w-sm mx-auto group [perspective:1000px]"
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => setIsFlipped(false)}
        >
            {/* Container com perspectiva */}
            <div className={`
        relative w-full h-full transition-all duration-500
        [transform-style:preserve-3d] hover:cursor-pointer
        ${isFlipped ? '[transform:rotateY(180deg)]' : ''}
      `}>
                {/* Frente do Card */}
                <Card className="absolute inset-0 w-full h-full p-4 [backface-visibility:hidden] bg-white dark:bg-gray-800 border-2 hover:border-gray-300">
                    {renderContent(front)}
                </Card>

                {/* Verso do Card */}
                <Card className="absolute inset-0 w-full h-full p-3 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-green-50 dark:bg-green-950 border-2 border-green-200 dark:border-green-800">
                    {renderContent(back)}
                </Card>
            </div>
        </div>
    )
} 