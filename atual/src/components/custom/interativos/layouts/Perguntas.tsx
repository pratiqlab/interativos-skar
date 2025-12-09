/**
 * ============================================================================
 * LAYOUT PERGUNTAS - GUIA COMPLETO
 * ============================================================================
 *
 * Layout simplificado com questões centralizadas e barra de progresso.
 * Ideal para exercícios teóricos, questionários e avaliações sem visualização.
 *
 * ✨ CARACTERÍSTICAS:
 * - 📊 Barra de progresso automática no topo
 * - 📜 ScrollCard para scroll suave (todas as questões visíveis)
 * - 🔓 Sem bloqueio (todas as questões desbloqueadas por padrão)
 * - ✅ Rastreamento automático via onRespostaCorreta
 * - 📱 Totalmente responsivo
 * - 🎯 Largura máxima 4xl para melhor legibilidade
 *
 * ============================================================================
 * QUANDO USAR
 * ============================================================================
 *
 * ✅ Use este layout quando:
 * - O exercício não precisa de visualização gráfica (Canvas)
 * - São apenas questões teóricas ou numéricas
 * - É um questionário, prova ou lista de exercícios
 * - Você quer que o aluno veja todas as questões de uma vez
 * - Não há dados para visualizar graficamente
 *
 * ❌ NÃO use quando:
 * - Precisa de visualização gráfica (use MeioAMeio)
 * - Quer navegação step-by-step obrigatória (use Wizard customizado)
 *
 * ============================================================================
 * ESTRUTURA DE ARQUIVOS RECOMENDADA (MODULARIZAÇÃO)
 * ============================================================================
 *
 * 🎯 PADRÃO RECOMENDADO: Modularize exercícios com dados dinâmicos.
 *
 * Para exercícios simples (questões estáticas):
 * src/app/meu-exercicio/
 * └── page.tsx              ← Tudo pode ficar aqui
 *
 * Para exercícios com dados dinâmicos (RECOMENDADO):
 * src/app/meu-exercicio/
 * ├── page.tsx              ← Orquestrador: JSX, estados, callbacks
 * └── modulos/
 *     ├── dados.ts         ← Tipos, geração de dados, utilitários
 *     └── strings.ts       ← Textos dinâmicos (enunciados, dicas, resoluções)
 *
 * ⚠️ QUANDO MODULARIZAR:
 * - ✅ Valores aleatórios ou calculados
 * - ✅ Textos dinâmicos (enunciados, resoluções)
 * - ✅ Lógica de validação customizada
 * - ✅ Exercícios que podem ser reutilizados
 *
 * 📁 ESTRUTURA DOS MÓDULOS:
 * - **dados.ts**: Tipos, interfaces, funções de geração e cálculos
 * - **strings.ts**: Funções que retornam textos com markdown/latex
 * - **page.tsx**: Importa dados e strings, orquestra o exercício
 *
 * ============================================================================
 * COMO USAR - PADRÃO RECOMENDADO (COM MODULARIZAÇÃO)
 * ============================================================================
 *
 * 🎯 SEMPRE siga este padrão para criar exercícios organizados e reutilizáveis.
 *
 * Veja exemplos completos implementados:
 * - src/app/pitagoras/ (layout Perguntas com dados dinâmicos)
 *   - page.tsx: Orquestrador
 *   - modulos/dados.ts: Tipos e geração de dados
 *   - modulos/strings.ts: Textos dinâmicos
 *
 * - src/app/pitagoras-canvas/ (layout MeioAMeio com Canvas)
 *   - page.tsx: Orquestrador
 *   - modulos/dados.ts: Tipos e geração de dados
 *   - modulos/strings.ts: Textos dinâmicos
 *   - modulos/canvas.tsx: Funções de desenho
 *
 * ============================================================================
 * PROPS DO COMPONENTE <Perguntas>
 * ============================================================================
 *
 * titulo: string (OBRIGATÓRIO)
 *   - Título exibido no topo da página
 *   - Exemplo: "Exercícios de Física - Cinemática"
 *
 * children: React.ReactNode (OBRIGATÓRIO)
 *   - Componentes de questão (Passo ou MultiplaEscolha)
 *   - IMPORTANTE: Sem wrapper <Step>, questões são filhos diretos
 *   - Todas as questões ficam visíveis simultaneamente (scroll livre)
 *
 * onComplete?: () => void (OPCIONAL)
 *   - Callback executado quando TODAS as questões são respondidas corretamente
 *   - Útil para: alert, navegação, salvar progresso, etc.
 *   - Exemplo: onComplete={() => router.push('/proxima-aula')}
 *
 * ============================================================================
 * SISTEMA DE PROGRESSO
 * ============================================================================
 *
 * 📊 FUNCIONAMENTO AUTOMÁTICO:
 *
 * 1. Layout intercepta onRespostaCorreta de todos os filhos
 * 2. Incrementa contador automaticamente ao acertar
 * 3. Atualiza barra de progresso em tempo real
 * 4. Executa onComplete() ao completar 100%
 *
 * 🎯 BARRA DE PROGRESSO:
 * - Exibe: "X de Y questões" e "Z% completo"
 * - Largura: mesma das questões (max-w-4xl centralizado)
 * - Cor: primary (se adapta ao tema)
 * - Animação: transição suave de 500ms
 *
 * ⚠️ REGRA IMPORTANTE:
 * SEMPRE adicione onRespostaCorreta={() => {}} em TODOS os componentes,
 * mesmo que vazio. Sem isso, o progresso não será rastreado!
 *
 * ✅ CORRETO:
 * <Passo ... onRespostaCorreta={() => {}} />
 *
 * ❌ ERRADO (progresso não funciona):
 * <Passo ... />
 *
 * ============================================================================
 * SISTEMA DE BLOQUEIO DE QUESTÕES (RECOMENDADO)
 * ============================================================================
 *
 * 🎯 RECOMENDAÇÃO: Por padrão, SEMPRE bloqueie questões sequencialmente para
 * garantir que o aluno progrida de forma ordenada e consolide o aprendizado.
 *
 * ✅ PADRÃO RECOMENDADO (bloqueio sequencial):
 *
 * ```tsx
 * export default function Page() {
 *   const [mounted, setMounted] = useState(false)
 *   const [q1Complete, setQ1Complete] = useState(false)
 *   const [q2Complete, setQ2Complete] = useState(false)
 *   const [q3Complete, setQ3Complete] = useState(false)
 *
 *   // Guard para evitar erro de hidratação (se usar valores aleatórios)
 *   useEffect(() => {
 *     setMounted(true)
 *   }, [])
 *
 *   if (!mounted) return null
 *
 *   return (
 *     <Perguntas titulo="..." onComplete={() => {}}>
 *       // Questão 1 - sempre desbloqueada
 *       <MultiplaEscolha
 *         enunciado="Questão 1"
 *         alternativas={[...]}
 *         resposta="A"
 *         textoresposta="OK"
 *         onRespostaCorreta={() => setQ1Complete(true)}
 *       />
 *
 *       // Questão 2 - bloqueada até Q1
 *       <Passo
 *         tipo="numerico"
 *         enunciado="Questão 2"
 *         resposta="10"
 *         textoresposta="OK"
 *         bloqueado={!q1Complete}
 *         onRespostaCorreta={() => setQ2Complete(true)}
 *       />
 *
 *       // Questão 3 - bloqueada até Q2
 *       <Passo
 *         tipo="numerico"
 *         enunciado="Questão 3"
 *         resposta="15"
 *         textoresposta="OK"
 *         bloqueado={!q2Complete}
 *         onRespostaCorreta={() => setQ3Complete(true)}
 *       />
 *
 *       // Questão 4 - bloqueada até Q3
 *       <Passo
 *         tipo="texto"
 *         enunciado="Questão 4"
 *         resposta="resposta"
 *         textoresposta="OK"
 *         bloqueado={!q3Complete}
 *         onRespostaCorreta={() => {}}
 *       />
 *     </Perguntas>
 *   )
 * }
 * ```
 *
 * 🔓 PADRÃO ALTERNATIVO (todas desbloqueadas):
 * Use apenas para questionários de revisão ou quando a ordem não importa.
 * Simplesmente não use a prop `bloqueado` em nenhuma questão.
 *
 * ============================================================================
 * DIFERENÇAS COM MEIOAMEIO
 * ============================================================================
 *
 * | Aspecto           | Perguntas            | MeioAMeio                    |
 * |-------------------|----------------------|------------------------------|
 * | Canvas            | ❌ Não tem           | ✅ Canvas à direita          |
 * | Layout            | Centralizado         | Split (Questões + Canvas)    |
 * | Largura questões  | max-w-4xl            | Painel redimensionável       |
 * | Mobile            | Scroll direto        | Tabs (Questões/Canvas)       |
 * | Uso ideal         | Questionários puros  | Exercícios com visualização  |
 * | Complexidade      | Simples              | Moderada                     |
 *
 * ============================================================================
 * SUPORTE A MARKDOWN E LATEX
 * ============================================================================
 *
 * Todos os textos suportam Markdown e LaTeX quando mdview={true}:
 *
 * Markdown:
 * - **negrito**, *itálico*
 * - # Título, ## Subtítulo
 * - Lista: - item
 *
 * LaTeX:
 * - Inline: $x = 5$
 * - Bloco: $$x^2 + y^2 = z^2$$
 *
 * Exemplo:
 * ```tsx
 * enunciado="Calcule usando: $E = mc^2$
 *
 * Onde:
 * - **m** = massa (kg)
 * - **c** = velocidade da luz"
 * ```
 *
 * ============================================================================
 * EVITAR ERRO DE HIDRATAÇÃO
 * ============================================================================
 *
 * Se usar valores aleatórios (Math.random), use mounted guard:
 *
 * ```tsx
 * "use client"
 * import { useState, useEffect } from "react"
 *
 * export default function Page() {
 *   const [mounted, setMounted] = useState(false)
 *   const [valor] = useState(() => Math.floor(Math.random() * 10))
 *
 *   useEffect(() => {
 *     setMounted(true)
 *   }, [])
 *
 *   if (!mounted) return null
 *
 *   return <Perguntas ...>...</Perguntas>
 * }
 * ```
 *
 * ============================================================================
 */

"use client"

import React, { useState, useEffect } from 'react'
import TemplateExercicio from "@/components/custom/interativos/custom-ui/TemplateExercicio"
import ScrollCard from "@/components/custom/interativos/custom-ui/ScrollCard"
import CompletionDialog from "@/components/custom/interativos/custom-ui/CompletionDialog"

interface PerguntasProps {
  children: React.ReactNode
  titulo: string
  onComplete?: () => void
}

/**
 * Layout Perguntas - Questões centralizadas sem Canvas
 *
 * @example
 * ```tsx
 * <Perguntas titulo="Questionário" onComplete={() => alert('Fim!')}>
 *   <MultiplaEscolha ... onRespostaCorreta={() => {}} />
 *   <Passo ... onRespostaCorreta={() => {}} />
 * </Perguntas>
 * ```
 */
export function Perguntas({ children, titulo, onComplete }: PerguntasProps) {
  const [completedCount, setCompletedCount] = useState(0)
  const [showDialog, setShowDialog] = useState(false)
  const [hasShownDialog, setHasShownDialog] = useState(false)
  const childrenArray = React.Children.toArray(children)
  const totalQuestions = childrenArray.length

  // Monitora quando todas as questões são completadas
  useEffect(() => {
    if (completedCount === totalQuestions && totalQuestions > 0 && !hasShownDialog) {
      setHasShownDialog(true)
      setShowDialog(true)
      setTimeout(() => {
        onComplete?.()
      }, 100)
    }
  }, [completedCount, totalQuestions, hasShownDialog, onComplete])

  // Injeta callback de progresso nos filhos
  const injectProgressTracking = (element: React.ReactNode): React.ReactNode => {
    if (!React.isValidElement(element)) {
      return element
    }

    // Type assertion para acessar props de forma segura
    const props = element.props as { onRespostaCorreta?: () => void; children?: React.ReactNode }

    // Se tem onRespostaCorreta, injeta tracking
    if (props.onRespostaCorreta) {
      const originalCallback = props.onRespostaCorreta

      return React.cloneElement(element as React.ReactElement<{ onRespostaCorreta: () => void }>, {
        onRespostaCorreta: () => {
          originalCallback()
          setCompletedCount(prev => {
            const newCount = prev + 1
            return newCount
          })
        }
      })
    }

    // Processa filhos recursivamente
    if (props.children) {
      return React.cloneElement(element as React.ReactElement<{ children: React.ReactNode }>, {
        children: React.Children.map(props.children, (child) => injectProgressTracking(child))
      })
    }

    return element
  }

  const processedChildren = React.Children.map(childrenArray, (child) =>
    injectProgressTracking(child)
  )

  const progressPercentage = totalQuestions > 0 ? (completedCount / totalQuestions) * 100 : 0

  return (
    <>
      <CompletionDialog isOpen={showDialog} onOpenChange={setShowDialog} />

      <TemplateExercicio titulo={titulo} auto={true}>
        <div className="h-full w-full flex justify-center px-6">
          <div className="max-w-4xl w-full flex flex-col h-full">
            {/* Barra de progresso fixa no topo */}
            <div className="pt-4 pb-2 pr-2 shrink-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  {completedCount} de {totalQuestions} questões
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  {Math.round(progressPercentage)}% completo
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Questões em ScrollCard */}
            <div className="flex-1 pb-6 min-h-0">
              <ScrollCard variant="transparent" watch={completedCount}>
                {processedChildren}
              </ScrollCard>
            </div>
          </div>
        </div>
      </TemplateExercicio>
    </>
  )
}
