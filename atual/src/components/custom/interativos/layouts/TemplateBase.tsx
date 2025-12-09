/**
 * ============================================================================
 * LAYOUT TEMPLATEBASE - GUIA COMPLETO
 * ============================================================================
 *
 * Layout minimalista para criação de exercícios totalmente customizados.
 * Fornece apenas a estrutura básica (navbar + título), dando liberdade total
 * para o desenvolvedor criar o conteúdo do exercício.
 *
 * ✨ CARACTERÍSTICAS:
 * - 📋 Apenas navbar + título + conteúdo livre
 * - 🎨 Total liberdade para criar layout customizado
 * - ⚙️ Controle de scroll automático ou manual
 * - 📱 Totalmente responsivo
 * - 🔧 Sem sistema de progresso ou estruturas pré-definidas
 *
 * ============================================================================
 * QUANDO USAR
 * ============================================================================
 *
 * ✅ Use este layout quando:
 * - Você quer criar um exercício totalmente customizado
 * - Os layouts Perguntas ou MeioAMeio são muito estruturados para sua necessidade
 * - Precisa de controle total sobre o layout e comportamento
 * - Vai criar um exercício com interações únicas ou não-convencionais
 * - Quer combinar múltiplos componentes de forma personalizada
 * - Está prototipando um novo tipo de exercício
 *
 * ❌ NÃO use quando:
 * - Seu exercício se encaixa nos layouts Perguntas ou MeioAMeio
 * - Precisa de barra de progresso automática (use Perguntas)
 * - Precisa de Canvas ao lado de questões (use MeioAMeio)
 *
 * ============================================================================
 * DIFERENÇAS COM OUTROS LAYOUTS
 * ============================================================================
 *
 * | Aspecto           | TemplateBase      | Perguntas         | MeioAMeio          |
 * |-------------------|-------------------|-------------------|--------------------|
 * | Estrutura         | Livre             | Questões + barra  | Questões + Canvas  |
 * | Progresso         | ❌ Não tem        | ✅ Automático     | ✅ Automático      |
 * | Canvas            | ❌ Não tem        | ❌ Não tem        | ✅ Integrado       |
 * | Flexibilidade     | 🔓 Total          | 🔒 Estruturado    | 🔒 Estruturado     |
 * | Complexidade      | Muito simples     | Simples           | Moderada           |
 * | Uso ideal         | Protótipos/Custom | Questionários     | Visualizações      |
 *
 * ============================================================================
 * PROPS DO COMPONENTE
 * ============================================================================
 *
 * titulo: string (OBRIGATÓRIO)
 *   - Título exibido no header da página
 *   - Aparece na navbar com botão voltar
 *   - Exemplo: "Exercício Customizado"
 *
 * auto?: boolean (OPCIONAL, padrão: false)
 *   - true = conteúdo ajusta altura automaticamente (usa flex-1)
 *   - false = conteúdo tem scroll se necessário
 *   - Use true quando o conteúdo deve ocupar toda a altura disponível
 *   - Use false quando o conteúdo pode ser maior que a tela
 *
 * children: React.ReactNode (OBRIGATÓRIO)
 *   - Conteúdo totalmente livre
 *   - Pode ser qualquer combinação de componentes React
 *   - Você tem controle total sobre layout, estilos e lógica
 *
 * ============================================================================
 * COMO USAR - EXEMPLO BÁSICO
 * ============================================================================
 *
 * ```tsx
 * "use client"
 *
 * import { TemplateBase } from "@/components/custom/interativos/layouts/TemplateBase"
 *
 * export default function Page() {
 *   return (
 *     <TemplateBase titulo="Meu Exercício Customizado">
 *       <div className="p-6">
 *         <h2 className="text-2xl font-bold mb-4">Bem-vindo!</h2>
 *         <p>Aqui você pode criar qualquer coisa que quiser.</p>
 *       </div>
 *     </TemplateBase>
 *   )
 * }
 * ```
 *
 * ============================================================================
 * EXEMPLOS DE USO
 * ============================================================================
 *
 * 1. EXERCÍCIO COM LAYOUT CUSTOMIZADO
 * ------------------------------------
 * ```tsx
 * <TemplateBase titulo="Calculadora Física">
 *   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
 *     <div className="border rounded p-4">
 *       <h3>Inputs</h3>
 *       <input type="number" placeholder="Velocidade" />
 *       <input type="number" placeholder="Tempo" />
 *     </div>
 *     <div className="border rounded p-4">
 *       <h3>Resultados</h3>
 *       <p>Distância: {resultado} m</p>
 *     </div>
 *   </div>
 * </TemplateBase>
 * ```
 *
 * 2. EXERCÍCIO COM TABS CUSTOMIZADAS
 * -----------------------------------
 * ```tsx
 * <TemplateBase titulo="Simulador">
 *   <Tabs defaultValue="teoria" className="p-6">
 *     <TabsList>
 *       <TabsTrigger value="teoria">Teoria</TabsTrigger>
 *       <TabsTrigger value="pratica">Prática</TabsTrigger>
 *       <TabsTrigger value="exercicios">Exercícios</TabsTrigger>
 *     </TabsList>
 *     <TabsContent value="teoria">
 *       <div>Conteúdo teórico...</div>
 *     </TabsContent>
 *     <TabsContent value="pratica">
 *       <Canvas ... />
 *     </TabsContent>
 *     <TabsContent value="exercicios">
 *       <Passo ... />
 *     </TabsContent>
 *   </Tabs>
 * </TemplateBase>
 * ```
 *
 * 3. EXERCÍCIO COM WIZARD CUSTOMIZADO
 * ------------------------------------
 * ```tsx
 * <TemplateBase titulo="Tutorial Interativo" auto>
 *   <div className="h-full flex flex-col p-6">
 *     <div className="flex-1">
 *       {passo === 1 && <Etapa1 />}
 *       {passo === 2 && <Etapa2 />}
 *       {passo === 3 && <Etapa3 />}
 *     </div>
 *     <div className="flex justify-between mt-4">
 *       <Button onClick={() => setPasso(p => p - 1)}>Anterior</Button>
 *       <Button onClick={() => setPasso(p => p + 1)}>Próximo</Button>
 *     </div>
 *   </div>
 * </TemplateBase>
 * ```
 *
 * 4. EXERCÍCIO COM CANVAS E CONTROLES
 * ------------------------------------
 * ```tsx
 * <TemplateBase titulo="Simulação Física" auto>
 *   <div className="h-full grid grid-rows-[1fr_auto] p-6 gap-4">
 *     <Canvas
 *       aspectRatio="horizontal"
 *       bgLight="#fff"
 *       bgDark="#000"
 *       onDraw={(ctx, canvas) => {
 *         // Seu código de desenho
 *       }}
 *     />
 *     <div className="flex gap-2">
 *       <Button onClick={iniciar}>Iniciar</Button>
 *       <Button onClick={pausar}>Pausar</Button>
 *       <Button onClick={resetar}>Resetar</Button>
 *     </div>
 *   </div>
 * </TemplateBase>
 * ```
 *
 * ============================================================================
 * COMPONENTES QUE VOCÊ PODE USAR
 * ============================================================================
 *
 * Você pode usar TODOS os componentes disponíveis:
 *
 * Questões:
 * - Passo (numerico/texto)
 * - MultiplaEscolha
 *
 * Visualização:
 * - Canvas
 * - SolidView
 *
 * Auxiliares:
 * - FloatDica
 * - FloatVars
 * - FloatTools
 * - VarFlashCard
 * - Wizard (se quiser navegação step-by-step)
 * - ScrollCard (se quiser área com scroll controlado)
 * - CompletionDialog (se quiser modal de parabéns)
 *
 * UI Shadcn:
 * - Button, Input, Card, Tabs, Dialog, Sheet, etc.
 *
 * ============================================================================
 * DICAS E BOAS PRÁTICAS
 * ============================================================================
 *
 * 1. **Controle de Altura**
 *    - Use auto={true} quando quer que o conteúdo ocupe toda altura
 *    - Use auto={false} (padrão) quando o conteúdo pode ter scroll
 *
 * 2. **Responsividade**
 *    - Use classes do Tailwind: grid-cols-1 md:grid-cols-2
 *    - Teste sempre em mobile e desktop
 *
 * 3. **Estados**
 *    - Gerencie seus próprios estados com useState
 *    - Sem sistema de progresso automático - faça o seu se precisar
 *
 * 4. **Estilo**
 *    - Use padding (p-4, p-6) para espaçamento
 *    - Use gap-4 para espaçamento entre elementos grid/flex
 *    - Mantenha consistência com os outros exercícios
 *
 * 5. **Performance**
 *    - Use useCallback/useMemo se necessário
 *    - Evite re-renders desnecessários
 *
 * ============================================================================
 * CHECKLIST DE CRIAÇÃO
 * ============================================================================
 *
 * ✅ Estrutura:
 *    - [ ] Importar TemplateBase
 *    - [ ] Definir título do exercício
 *    - [ ] Escolher auto=true ou auto=false
 *    - [ ] Criar estrutura do conteúdo (divs, grid, flex)
 *
 * ✅ Funcionalidade:
 *    - [ ] Implementar lógica do exercício
 *    - [ ] Gerenciar estados necessários
 *    - [ ] Adicionar handlers de eventos
 *
 * ✅ UI/UX:
 *    - [ ] Testar responsividade (mobile e desktop)
 *    - [ ] Verificar espaçamentos e alinhamentos
 *    - [ ] Testar scroll (se aplicável)
 *
 * ✅ Integração:
 *    - [ ] Testar todos os componentes usados
 *    - [ ] Verificar tema claro/escuro
 *    - [ ] Garantir botão voltar funciona
 *
 * ============================================================================
 */

"use client"

import React from 'react'
import TemplateExercicio from "@/components/custom/interativos/custom-ui/TemplateExercicio"

interface TemplateBaseProps {
  children: React.ReactNode
  titulo: string
  auto?: boolean
}

/**
 * Layout TemplateBase - Template minimalista para exercícios customizados
 *
 * Fornece apenas a estrutura básica (navbar + título), dando liberdade total
 * para criar o conteúdo do exercício.
 *
 * @example
 * ```tsx
 * <TemplateBase titulo="Meu Exercício">
 *   <div className="p-6">
 *     {/* Seu conteúdo totalmente customizado aqui *\/}
 *   </div>
 * </TemplateBase>
 * ```
 */
export function TemplateBase({ children, titulo, auto = false }: TemplateBaseProps) {
  return (
    <TemplateExercicio titulo={titulo} auto={auto}>
      {children}
    </TemplateExercicio>
  )
}
