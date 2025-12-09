/**
 * ============================================================================
 * GUIA COMPLETO: CRIAÇÃO DE EXERCÍCIOS INTERATIVOS COM CANVAS
 * ============================================================================
 *
 * OBJETIVO: Este guia ensina como criar exercícios interativos com visualização
 * gráfica (Canvas), seguindo a arquitetura de modularização correta.
 *
 * ✨ CARACTERÍSTICAS DO LAYOUT MEIOAMEIO:
 * - 📊 Questões à esquerda + Canvas à direita (desktop)
 * - 📱 Tabs para alternar questões/canvas (mobile)
 * - 📈 Barra de progresso compacta no painel de questões
 * - 📜 ScrollCard com scroll suave para as questões
 * - 🔓 Sem bloqueio (todas as questões desbloqueadas por padrão)
 * - 🎨 Canvas responsivo e interativo
 * - 🔄 Painéis redimensionáveis (desktop)
 *
 * ============================================================================
 * ETAPA 1: ESTRUTURA DE ARQUIVOS (OBRIGATÓRIO)
 * ============================================================================
 *
 * 🎯 PADRÃO RECOMENDADO: SEMPRE modularize o código em 3 arquivos separados.
 * Nunca escreva toda a lógica diretamente no page.tsx.
 *
 * Crie OBRIGATORIAMENTE esta estrutura:
 *
 * src/app/meu-exercicio/
 * ├── page.tsx              ← Orquestrador: JSX, estados, callbacks
 * └── modulos/
 *     ├── dados.ts         ← Tipos, interfaces, geração de dados, utilitários
 *     ├── strings.ts       ← Textos dinâmicos (enunciados, dicas, resoluções)
 *     └── canvas.tsx       ← Funções de desenho no Canvas
 *
 * Layouts já existem em:
 * └── layouts/
 *     └── MeioAMeio.tsx    ← Este arquivo (NÃO MODIFICAR)
 *
 * ⚠️ IMPORTANTE: Modularização não é opcional!
 * - **dados.ts**: Tipos, geração de dados aleatórios, cálculos, validações
 * - **strings.ts**: Funções que retornam textos dinâmicos (markdown/latex)
 * - **canvas.tsx**: Funções de desenho no Canvas (só para MeioAMeio)
 * - **page.tsx**: Orquestrador que importa e usa os 3 módulos
 *
 * ============================================================================
 * ETAPA 2A: CRIAR MÓDULO dados.ts (OBRIGATÓRIO)
 * ============================================================================
 *
 * Este arquivo contém tipos, geração de dados e utilitários.
 * NÃO contém React, NÃO contém textos longos, NÃO contém desenho Canvas.
 *
 * TEMPLATE COMPLETO DO ARQUIVO modulos/dados.ts:
 *
 * ```typescript
 * // ============================================================================
 * // MÓDULO DE DADOS - [NOME DO EXERCÍCIO]
 * // Contém: tipos, interfaces, funções de geração de dados e utilitários
 * // ============================================================================
 *
 * // ============================================================================
 * // 1. TIPOS E INTERFACES
 * // ============================================================================
 *
 * export interface DadosExercicio {
 *   numero1: number
 *   numero2: number
 *   resultado: number
 * }
 *
 * export type TipoQuestao = 'facil' | 'medio' | 'dificil'
 *
 * // ============================================================================
 * // 2. FUNÇÕES DE GERAÇÃO DE DADOS
 * // ============================================================================
 *
 * export function gerarDadosAleatorios(): DadosExercicio {
 *   const num1 = Math.floor(Math.random() * 10) + 1
 *   const num2 = Math.floor(Math.random() * 10) + 1
 *   return {
 *     numero1: num1,
 *     numero2: num2,
 *     resultado: num1 + num2
 *   }
 * }
 *
 * export function escolherOpcaoAleatoria(): TipoQuestao {
 *   const opcoes: TipoQuestao[] = ['facil', 'medio', 'dificil']
 *   return opcoes[Math.floor(Math.random() * opcoes.length)]
 * }
 *
 * // ============================================================================
 * // 3. FUNÇÕES UTILITÁRIAS E CÁLCULOS
 * // ============================================================================
 *
 * export function calcularResposta(dados: DadosExercicio): number {
 *   return dados.resultado
 * }
 *
 * export function validarResposta(resposta: number, esperada: number): boolean {
 *   return Math.abs(resposta - esperada) < 0.01
 * }
 * ```
 *
 * ============================================================================
 * ETAPA 2B: CRIAR MÓDULO strings.ts (OBRIGATÓRIO)
 * ============================================================================
 *
 * Este arquivo contém APENAS funções que retornam strings dinâmicas.
 * Enunciados, dicas, resoluções com Markdown e LaTeX.
 *
 * TEMPLATE COMPLETO DO ARQUIVO modulos/strings.ts:
 *
 * ```typescript
 * // ============================================================================
 * // MÓDULO DE STRINGS - [NOME DO EXERCÍCIO]
 * // Contém: funções de geração de textos dinâmicos
 * // ============================================================================
 *
 * import { DadosExercicio } from './dados'
 *
 * // ============================================================================
 * // QUESTÃO 1: [NOME DA QUESTÃO]
 * // ============================================================================
 *
 * export function gerarEnunciado(dados: DadosExercicio): string {
 *   return `Calcule a soma de **${dados.numero1}** e **${dados.numero2}**.
 *
 * Use a fórmula: $resultado = a + b$`
 * }
 *
 * export function gerarDica(dados: DadosExercicio): string {
 *   return `Lembre-se: ${dados.numero1} + ${dados.numero2} = ?
 *
 * Tente somar os números mentalmente.`
 * }
 *
 * export function gerarResolucao(dados: DadosExercicio): string {
 *   return `## Resolução:
 *
 * $$resultado = ${dados.numero1} + ${dados.numero2}$$
 *
 * $$resultado = ${dados.resultado}$$
 *
 * Portanto, a resposta é **${dados.resultado}**.`
 * }
 * ```
 *
 * ============================================================================
 * ETAPA 2C: CRIAR MÓDULO canvas.tsx (OBRIGATÓRIO PARA MEIOAMEIO)
 * ============================================================================
 *
 * Este arquivo contém APENAS funções de desenho no Canvas.
 * Use o hook useCanvasResponsive e módulos canvas reutilizáveis.
 *
 * 🛠️ FERRAMENTAS DISPONÍVEIS:
 *
 * 1. **Hook useCanvasResponsive** (@/components/custom/interativos/tools/Canvas)
 *    - Sistema completo de desenho responsivo (30+ funções utilitárias)
 *    - Todos os elementos se adaptam automaticamente ao tamanho do canvas
 *    - Funções: size(), radius(), spacing(), margin(), fontSize(), lineWidth()
 *    - Posicionamento: x(), y(), percentX(), percentY(), centerX, centerY
 *    - Desenho: circle(), rect(), line(), text(), arc(), roundedRect()
 *    - Cores: label() (contraste automático), labelLight(), labelDark()
 *    - Grid: grid(), relative(), transform(), gradient(), hatchPattern()
 *    - Matemática: distance(), deg2rad(), clamp(), lerp(), map()
 *
 * 2. **Módulos Canvas Reutilizáveis** (@/components/custom/interativos/modulos-canvas/)
 *    - **background.ts**: Desenha fundo, chão, estrelas piscando (tema escuro)
 *    - **eixos.ts**: Desenha eixos cartesianos com setas e labels
 *    - **astros.ts**: Desenha sol/lua e nuvens (detecta tema automaticamente)
 *    - **foguete.ts**: Desenha foguetes, trajetórias e efeitos visuais
 *    - **todos.ts**: Orquestrador que combina todos os módulos acima
 *
 * TEMPLATE COMPLETO DO ARQUIVO modulos/canvas.tsx:
 *
 * ```typescript
 * // ============================================================================
 * // MÓDULO DE CANVAS - [NOME DO EXERCÍCIO]
 * // Contém: funções de desenho no canvas
 * // ============================================================================
 *
 * import { DadosExercicio } from './dados'
 *
 * // Desenha visualização do exercício
 * export function desenharVisualizacao(
 *   ctx: CanvasRenderingContext2D,
 *   r: any, // CanvasResponsive do useCanvasResponsive
 *   dados: DadosExercicio
 * ) {
 *   // Use funções responsivas para todos os desenhos
 *   // Cores com contraste automático
 *   ctx.fillStyle = r.label()
 *
 *   // Elementos responsivos (escalam com o canvas)
 *   r.circle(ctx, r.centerX, r.centerY, r.radius(50), true)
 *   r.text(ctx, 'Título', r.centerX, r.percentY(10), r.fontSize(20), {
 *     align: 'center'
 *   })
 *
 *   // Opcional: Use módulos reutilizáveis para elementos comuns
 *   // import { drawBackground } from '@/components/custom/interativos/modulos-canvas/background'
 *   // const bg = drawBackground(ctx, canvas, r)
 * }
 * ```
 *
 * 📖 EXEMPLO COMPLETO: Ver src/app/pitagoras-canvas/modulos/canvas.tsx
 *
 * ============================================================================
 * ETAPA 3: CRIAR O PAGE.TSX
 * ============================================================================
 *
 * Este é o arquivo PRINCIPAL do exercício. Ele compõe os componentes.
 *
 * TEMPLATE COMPLETO DO ARQUIVO page.tsx:
 *
 * ```tsx
 * /**
 *  * Exercício Interativo - [NOME DO EXERCÍCIO]
 *  *\/
 *
 * "use client"
 *
 * // ============================================================================
 * // IMPORTS OBRIGATÓRIOS
 * // ============================================================================
 * import { useState, useEffect } from "react"
 * import { MeioAMeio, Questoes, Canvas } from "../layouts/MeioAMeio"
 * import { useCanvasResponsive } from "@/components/custom/interativos/tools/Canvas"
 * import MultiplaEscolha from "@/components/custom/interativos/exercicios/MultiplaEscolha"
 * import Passo from "@/components/custom/interativos/tools/Passo"
 * import * as dados from "./modulos/dados"
 * import * as strings from "./modulos/strings"
 * import * as canvas from "./modulos/canvas"
 *
 * // ============================================================================
 * // COMPONENTE PRINCIPAL
 * // ============================================================================
 * export default function Page() {
 *   // ESTADO: Controle de montagem (evita erro de hidratação)
 *   const [mounted, setMounted] = useState(false)
 *
 *   // ESTADO: Armazena os dados do exercício
 *   const [dadosExercicio, setDadosExercicio] = useState<dados.DadosExercicio>({
 *     numero1: 0,
 *     numero2: 0,
 *     resultado: 0
 *   })
 *
 *   // 🎯 ESTADO: Bloqueio sequencial de questões (RECOMENDADO)
 *   const [q1Complete, setQ1Complete] = useState(false)
 *   const [q2Complete, setQ2Complete] = useState(false)
 *
 *   // EFEITO: Guard de montagem
 *   useEffect(() => {
 *     setMounted(true)
 *   }, [])
 *
 *   // EFEITO: Gera dados aleatórios ao carregar a página
 *   useEffect(() => {
 *     setDadosExercicio(dados.gerarDadosAleatorios())
 *   }, [])
 *
 *   // Guard de montagem (se usar valores aleatórios)
 *   if (!mounted) return null
 *
 *   // Calcular valores derivados (se necessário)
 *   const respostaCorreta = dados.calcularResposta(dadosExercicio)
 *
 *   // ============================================================================
 *   // RENDERIZAÇÃO
 *   // ============================================================================
 *   return (
 *     <MeioAMeio
 *       titulo="Nome do Exercício"     // Título exibido no topo
 *       larguraInicial={40}            // 40% para questões, 60% para canvas
 *     >
 *       // LADO ESQUERDO: QUESTÕES
 *       <Questoes onComplete={() => alert('Parabéns! Você completou o exercício!')}>
 *
 *         // 🎯 PADRÃO RECOMENDADO: Bloqueio sequencial de questões
 *         // Questão 1 - sempre desbloqueada
 *         <MultiplaEscolha
 *           enunciado="Qual operação matemática realiza a soma?"
 *           alternativas={[
 *             { alternativa: 'Subtração', isCorreta: false },
 *             { alternativa: 'Adição', isCorreta: true },
 *             { alternativa: 'Multiplicação', isCorreta: false },
 *             { alternativa: 'Divisão', isCorreta: false }
 *           ]}
 *           resposta="B"
 *           textoresposta="Correto! A **adição** é a operação que soma dois números."
 *           mdview
 *           onRespostaCorreta={() => setQ1Complete(true)}
 *         />
 *
 *         // Questão 2 - bloqueada até Q1
 *         <Passo
 *           tipo="numerico"
 *           enunciado={strings.gerarEnunciado(dadosExercicio)}
 *           resposta={respostaCorreta.toString()}
 *           textoresposta={strings.gerarResolucao(dadosExercicio)}
 *           dica={strings.gerarDica(dadosExercicio)}
 *           faixaerro={0.1}
 *           mdview
 *           bloqueado={!q1Complete}
 *           onRespostaCorreta={() => setQ2Complete(true)}
 *         />
 *
 *         // Questão 3 - bloqueada até Q2
 *         <Passo
 *           tipo="numerico"
 *           enunciado="Quanto é 10 + 5?"
 *           resposta="15"
 *           textoresposta="Correto! **10 + 5 = 15**"
 *           faixaerro={0.1}
 *           mdview
 *           bloqueado={!q2Complete}
 *           onRespostaCorreta={() => {}}
 *         />
 *
 *       </Questoes>
 *
 *       // LADO DIREITO: CANVAS (VISUALIZAÇÃO)
 *       <Canvas
 *         aspectRatio="square"
 *         bgLight="#f0f9ff"
 *         bgDark="#1e3a8a"
 *         onDraw={(ctx, canvasElement) => {
 *           const r = useCanvasResponsive(canvasElement, 400, '#f0f9ff', '#1e3a8a')
 *           canvas.desenharVisualizacao(ctx, r, dadosExercicio)
 *         }}
 *       />
 *     </MeioAMeio>
 *   )
 * }
 * ```
 *
 * ============================================================================
 * REFERÊNCIA: COMPONENTES DE QUESTÃO
 * ============================================================================
 *
 * 1. MULTIPLAESCOLHA (Questões de múltipla escolha)
 * --------------------------------------------------
 *
 * Props obrigatórias:
 * - enunciado: string          // Texto da pergunta (Markdown/LaTeX suportado)
 * - alternativas: Array<{      // Array de opções
 *     alternativa: string,
 *     isCorreta: boolean
 *   }>
 * - resposta: string           // Letra da resposta correta (A, B, C, D...)
 * - textoresposta: string      // Explicação da resposta (Markdown/LaTeX)
 * - onRespostaCorreta: () => void  // SEMPRE adicionar: () => {}
 *
 * Props opcionais:
 * - dica?: string              // Dica mostrada após erro
 * - mdview?: boolean           // true = renderiza como Markdown
 * - randomizarAlternativas?: boolean
 *
 * Exemplo:
 * ```tsx
 * <MultiplaEscolha
 *   enunciado="O que é 2 + 2?"
 *   alternativas={[
 *     { alternativa: '3', isCorreta: false },
 *     { alternativa: '4', isCorreta: true },
 *     { alternativa: '5', isCorreta: false }
 *   ]}
 *   resposta="B"
 *   textoresposta="Correto! **2 + 2 = 4**"
 *   mdview
 *   onRespostaCorreta={() => {}}
 * />
 * ```
 *
 * 2. PASSO (Questões numéricas ou de texto)
 * ------------------------------------------
 *
 * Props obrigatórias:
 * - tipo: "numerico" | "texto"
 * - enunciado: string          // Texto da pergunta (Markdown/LaTeX)
 * - resposta: string           // Resposta correta (converter número para string)
 * - textoresposta: string      // Resolução completa (Markdown/LaTeX)
 * - onRespostaCorreta: () => void  // SEMPRE adicionar: () => {}
 *
 * Props opcionais:
 * - dica?: string              // Dica mostrada após 1º erro
 * - faixaerro?: number         // Margem de erro para numérico (padrão: 0)
 * - mdview?: boolean           // true = renderiza como Markdown
 * - placeholder?: string       // Texto do input
 * - bloqueado?: boolean        // true = desabilita o componente
 *
 * Props de normalização (tipo="texto"):
 * - normalizarCaps?: boolean         // Ignora maiúsculas/minúsculas
 * - normalizarEspaco?: boolean       // Ignora espaços
 * - normalizarAcentos?: boolean      // Ignora acentos
 * - normalizarPontoVirgula?: boolean // Aceita ponto ou vírgula
 *
 * Exemplo numérico:
 * ```tsx
 * <Passo
 *   tipo="numerico"
 *   enunciado="Quanto é 5 + 3?"
 *   resposta="8"
 *   textoresposta="**5 + 3 = 8**"
 *   dica="Some os números: 5 + 3"
 *   faixaerro={0.1}
 *   mdview
 *   onRespostaCorreta={() => {}}
 * />
 * ```
 *
 * Exemplo texto:
 * ```tsx
 * <Passo
 *   tipo="texto"
 *   enunciado="Qual é a capital do Brasil?"
 *   resposta="Brasília"
 *   textoresposta="Correto! A capital do Brasil é **Brasília**."
 *   normalizarCaps={true}
 *   normalizarAcentos={true}
 *   mdview
 *   onRespostaCorreta={() => {}}
 * />
 * ```
 *
 * ============================================================================
 * REFERÊNCIA: CANVAS RESPONSIVO
 * ============================================================================
 *
 * Props do <Canvas>:
 * - aspectRatio: 'horizontal' | 'square' | 'vertical' | 'vertical-large'
 * - bgLight: string          // Cor fundo tema claro (ex: "#f0f9ff")
 * - bgDark: string           // Cor fundo tema escuro (ex: "#1e3a8a")
 * - animate?: boolean        // true = redesenha continuamente
 * - onDraw: (ctx, canvas) => void
 *
 * Helpers do useCanvasResponsive(canvas, tamanhoBase, bgLight, bgDark):
 *
 * Propriedades:
 * - r.centerX          // Centro horizontal do canvas
 * - r.centerY          // Centro vertical do canvas
 * - r.scale            // Fator de escala atual (para cálculos)
 *
 * Métodos:
 * - r.percentX(n)      // n% da largura (0-100)
 * - r.percentY(n)      // n% da altura (0-100)
 * - r.size(n)          // Tamanho responsivo baseado em escala
 * - r.lineWidth(n)     // Largura de linha responsiva
 * - r.fontSize(desk, mob)  // Tamanho de fonte (desktop, mobile)
 * - r.label()          // Cor de texto tema-aware (#000 ou #fff)
 * - r.text(ctx, texto, x, y, fontSize, options)  // Desenha texto
 *
 * Exemplo de desenho:
 * ```tsx
 * <Canvas
 *   aspectRatio="square"
 *   bgLight="#f0f9ff"
 *   bgDark="#1e3a8a"
 *   onDraw={(ctx, canvas) => {
 *     const r = useCanvasResponsive(canvas, 400, '#f0f9ff', '#1e3a8a')
 *
 *     // Desenhar círculo
 *     ctx.fillStyle = 'rgba(59, 130, 246, 0.5)'
 *     ctx.beginPath()
 *     ctx.arc(r.centerX, r.centerY, r.size(50), 0, Math.PI * 2)
 *     ctx.fill()
 *
 *     // Desenhar texto
 *     ctx.fillStyle = r.label()
 *     r.text(ctx, 'Meu Texto', r.centerX, r.centerY, r.fontSize(20, 16), {
 *       align: 'center',
 *       baseline: 'middle'
 *     })
 *   }}
 * />
 * ```
 *
 * ============================================================================
 * SISTEMA DE PROGRESSO
 * ============================================================================
 *
 * 📊 FUNCIONAMENTO AUTOMÁTICO:
 * 1. Usuário responde questão corretamente
 * 2. Componente (Passo/MultiplaEscolha) executa onRespostaCorreta()
 * 3. Layout intercepta automaticamente e incrementa contador
 * 4. Barra de progresso atualiza em tempo real
 * 5. Ao completar todas questões, onComplete() é executado
 *
 * 🎯 BARRA DE PROGRESSO (Painel de Questões):
 * - Localização: Topo do painel esquerdo
 * - Exibe: "X/Y" e "Z%"
 * - Largura: Mesma do painel (não usa largura total)
 * - Estilo: Compacto (text-xs, h-1.5)
 * - Cor: primary com transição suave
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
 * 💡 Para lógica adicional (opcional):
 * ```tsx
 * onRespostaCorreta={() => {
 *   console.log('Acertou!')
 *   setValorNoCanvas(novoValor) // Atualiza canvas
 *   // Sua lógica aqui
 * }}
 * ```
 *
 * 📜 SISTEMA DE SCROLL:
 * - Não há navegação por steps (sem botões próximo/anterior)
 * - Todas as questões visíveis simultaneamente
 * - ScrollCard detecta scroll e mostra indicador quando há mais conteúdo
 * - Usuário pode responder em qualquer ordem (a menos que você bloqueie manualmente)
 *
 * ============================================================================
 * BLOQUEIO DE QUESTÕES (OPCIONAL)
 * ============================================================================
 *
 * Por padrão, TODAS as questões ficam desbloqueadas. Para bloquear:
 *
 * ```tsx
 * export default function Page() {
 *   const [q1Complete, setQ1Complete] = useState(false)
 *
 *   return (
 *     <MeioAMeio titulo="..." larguraInicial={40}>
 *       <Questoes onComplete={() => {}}>
 *         // Questão 1 - sempre desbloqueada
 *         <Passo
 *           enunciado="Q1"
 *           resposta="5"
 *           textoresposta="OK"
 *           onRespostaCorreta={() => setQ1Complete(true)}
 *         />
 *
 *         // Questão 2 - bloqueada até Q1
 *         <Passo
 *           enunciado="Q2"
 *           resposta="10"
 *           textoresposta="OK"
 *           bloqueado={!q1Complete}
 *           onRespostaCorreta={() => {}}
 *         />
 *       </Questoes>
 *
 *       <Canvas ... />
 *     </MeioAMeio>
 *   )
 * }
 * ```
 *
 * ============================================================================
 * MARKDOWN E LATEX
 * ============================================================================
 *
 * Todos os textos suportam Markdown e LaTeX quando mdview={true}:
 *
 * Markdown:
 * - **negrito**
 * - *itálico*
 * - # Título
 * - ## Subtítulo
 * - Lista com -
 *
 * LaTeX (entre $$):
 * - Inline: $x = 5$
 * - Bloco: $$x^2 + y^2 = z^2$$
 *
 * Exemplo:
 * ```
 * enunciado="Calcule usando a fórmula: $E = mc^2$
 *
 * Onde:
 * - **m** = massa
 * - **c** = velocidade da luz"
 * ```
 *
 * ============================================================================
 * CHECKLIST DE CRIAÇÃO
 * ============================================================================
 *
 * ✅ 1. Criar modulos/dados.ts com:
 *    - [ ] Interfaces de tipos
 *    - [ ] Função de gerar dados aleatórios
 *    - [ ] Funções de cálculo
 *    - [ ] Funções de geração de texto (enunciado, dica, resolução)
 *    - [ ] Função de desenho no Canvas
 *
 * ✅ 2. Criar page.tsx com:
 *    - [ ] Imports corretos
 *    - [ ] useState para dados do exercício
 *    - [ ] useEffect para gerar dados aleatórios
 *    - [ ] <MeioAMeio> com titulo e larguraInicial
 *    - [ ] <Questoes> com onComplete
 *    - [ ] <MultiplaEscolha> ou <Passo> com onRespostaCorreta={() => {}}
 *    - [ ] <Canvas> com onDraw
 *
 * ✅ 3. Testar:
 *    - [ ] Valores aleatórios geram corretamente
 *    - [ ] Questões aceitam resposta correta
 *    - [ ] Barra de progresso atualiza corretamente
 *    - [ ] Canvas desenha corretamente
 *    - [ ] Responsivo (mobile e desktop)
 *    - [ ] ScrollCard funciona em listas longas
 *
 * ============================================================================
 */

"use client"

import React, { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import TemplateExercicio from "@/components/custom/interativos/custom-ui/TemplateExercicio"
import CanvasComponent from "@/components/custom/interativos/tools/Canvas"
import ScrollCard from "@/components/custom/interativos/custom-ui/ScrollCard"

interface QuestoesProps {
  children: React.ReactNode
  title?: string
  onComplete?: () => void
}

interface CanvasProps {
  onDraw: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void
  title?: string
  aspectRatio?: 'horizontal' | 'square' | 'vertical' | 'vertical-large'
  bgLight?: string
  bgDark?: string
  animate?: boolean
}

interface MeioAMeioProps {
  children: React.ReactNode // Deve conter <Questoes> e <Canvas>
  larguraInicial?: number // Porcentagem (0-100) para o lado esquerdo
  titulo: string // Título do exercício/aula interativa
}

/**
 * Layout MeioAMeio - Divide a tela em duas partes: Questões (esquerda) e Canvas (direita)
 *
 * Desktop: Usa ResizablePanelGroup com handle arrastável
 * Mobile: Usa tabs para alternar entre os lados
 *
 * Já inclui o TemplateExercicio internamente
 *
 * @example
 * ```tsx
 * <MeioAMeio titulo="Teorema de Pitágoras" larguraInicial={40}>
 *   <Questoes
 *     title="Questões"
 *     onComplete={() => alert('Completo!')}
 *   >
 *     <MultiplaEscolha ... onRespostaCorreta={() => {}} />
 *     <Passo ... onRespostaCorreta={() => {}} />
 *   </Questoes>
 *
 *   <Canvas
 *     title="Visualização"
 *     aspectRatio="square"
 *     bgLight="#f0f9ff"
 *     bgDark="#1e3a8a"
 *     onDraw={(ctx, canvas) => {
 *       const r = useCanvasResponsive(canvas, 400, '#f0f9ff', '#1e3a8a')
 *       // Seu código de desenho aqui
 *     }}
 *   />
 * </MeioAMeio>
 * ```
 */
export function MeioAMeio({ children, larguraInicial = 40, titulo }: MeioAMeioProps) {
  const [tituloQuestoes, setTituloQuestoes] = useState('Questões')
  const [tituloCanvas, setTituloCanvas] = useState('Visualização')

  // Filtra os filhos para pegar Questoes e Canvas
  const childrenArray = React.Children.toArray(children)
  const questoesElement = childrenArray.find(
    (child) => React.isValidElement(child) && child.type === Questoes
  )
  const canvasElement = childrenArray.find(
    (child) => React.isValidElement(child) && child.type === Canvas
  )

  // Registra os títulos quando os componentes montam
  React.useEffect(() => {
    if (React.isValidElement(questoesElement) && questoesElement.props && typeof questoesElement.props === 'object' && 'title' in questoesElement.props) {
      setTituloQuestoes((questoesElement.props as QuestoesProps).title || 'Questões')
    }
    if (React.isValidElement(canvasElement) && canvasElement.props && typeof canvasElement.props === 'object' && 'title' in canvasElement.props) {
      setTituloCanvas((canvasElement.props as CanvasProps).title || 'Visualização')
    }
  }, [questoesElement, canvasElement])

  const layoutContent = (
    <>
      {/* Desktop: Layout com ResizablePanelGroup */}
      <div className="hidden md:block h-full w-full">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Painel Esquerdo - Questões */}
          <ResizablePanel defaultSize={larguraInicial} minSize={20} maxSize={80}>
            <div className="h-full overflow-auto p-4">
              {questoesElement}
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Painel Direito - Canvas */}
          <ResizablePanel defaultSize={100 - larguraInicial} minSize={20} maxSize={80}>
            <div className="h-full w-full flex items-center justify-center p-4">
              {canvasElement}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Mobile: Layout com Tabs */}
      <div className="md:hidden h-full w-full">
        <Tabs defaultValue="questoes" className="h-full flex flex-col">
          <TabsList className="w-full grid grid-cols-2 rounded-none">
            <TabsTrigger value="questoes" className="rounded-none">{tituloQuestoes}</TabsTrigger>
            <TabsTrigger value="canvas" className="rounded-none">{tituloCanvas}</TabsTrigger>
          </TabsList>

          <TabsContent value="questoes" className="flex-1 overflow-auto mt-0 px-4 pt-4">
            {questoesElement}
          </TabsContent>

          <TabsContent value="canvas" className="flex-1 mt-0 px-4 pt-4">
            <div className="h-full w-full flex items-center justify-center">
              {canvasElement}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )

  return (
    <TemplateExercicio titulo={titulo} auto={true}>
      {layoutContent}
    </TemplateExercicio>
  )
}

/**
 * Componente Questoes - Lado esquerdo do layout MeioAMeio
 * Usa ScrollCard e rastreamento de progresso
 */
export function Questoes({ children, onComplete }: QuestoesProps) {
  const [completedCount, setCompletedCount] = React.useState(0)
  const childrenArray = React.Children.toArray(children)
  const totalQuestions = childrenArray.length

  // Injeta callback de progresso nos filhos
  const injectProgressTracking = (element: React.ReactNode, index: number): React.ReactNode => {
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
          setCompletedCount(prev => {
            const newCount = prev + 1
            if (newCount === totalQuestions) {
              onComplete?.()
            }
            return newCount
          })
          originalCallback()
        }
      })
    }

    // Processa filhos recursivamente
    if (props.children) {
      return React.cloneElement(element as React.ReactElement<{ children: React.ReactNode }>, {
        children: React.Children.map(props.children, (child, i) => injectProgressTracking(child, i))
      })
    }

    return element
  }

  const processedChildren = React.Children.map(childrenArray, (child, index) =>
    injectProgressTracking(child, index)
  )

  const progressPercentage = totalQuestions > 0 ? (completedCount / totalQuestions) * 100 : 0

  return (
    <div className="h-full flex flex-col">
      {/* Barra de progresso fixa no topo */}
      <div className="px-2 pt-2 pb-3">
        <div className="flex items-center justify-between mb-2 text-xs">
          <span className="font-medium text-muted-foreground">
            {completedCount}/{totalQuestions}
          </span>
          <span className="font-medium text-muted-foreground">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Questões em ScrollCard */}
      <div className="flex-1 overflow-hidden px-2 pb-2">
        <ScrollCard variant="transparent" watch={completedCount}>
          {processedChildren}
        </ScrollCard>
      </div>
    </div>
  )
}

/**
 * Componente Canvas - Lado direito do layout MeioAMeio
 * Renderiza o Canvas com todas as props responsivas
 */
export function Canvas({
  onDraw,
  aspectRatio = 'square',
  bgLight = '#f0f9ff',
  bgDark = '#1e3a8a',
  animate = false
}: CanvasProps) {
  return (
    <CanvasComponent
      aspectRatio={aspectRatio}
      bgLight={bgLight}
      bgDark={bgDark}
      onDraw={onDraw}
      animate={animate}
    />
  )
}

