/*

Template para exercícios - Versão Simplificada

Simula o parent do exercício quando publicado (navbar + menu de titulo)
Fornece estrutura consistente com ScrollPage, TitleHeader e botão voltar
Ideal para criar exercícios interativos standalone

*/

'use client'

import React from 'react'
import { TitleHeader } from '@/components/custom/ui/TitleHeader'
import { ScrollPage, ScrollPageHeader, ScrollPageContent } from '@/components/custom/ui/ScrollPage'

interface TemplateExercicioProps {
    children?: React.ReactNode
    titulo: string
    auto?: boolean
}

export default function TemplateExercicio({ children, titulo, auto = false }: TemplateExercicioProps) {
    // Template simplificado - botão voltar sempre retorna para home
    const backRoute = '/'

    return (
        <ScrollPage>
            <ScrollPageHeader>
                <TitleHeader title={titulo} backbutton={true} route={backRoute}>
                    {/* Espaço para botões adicionais se necessário */}
                </TitleHeader>
            </ScrollPageHeader>

            <ScrollPageContent auto={auto}>
                {children}
            </ScrollPageContent>
        </ScrollPage>
    )
}
