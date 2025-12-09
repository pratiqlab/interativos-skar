# MarkdownEditor - Enhanced Edition 🚀

Editor de Markdown aprimorado, inspirado na arquitetura do **shadcn-editor** mas otimizado para **Markdown + LaTeX**.

## 🎯 Features

### ✨ Toolbar Rico
- **24 ferramentas de formatação** organizadas em grupos lógicos
- **Tooltips informativos** com descrição e atalhos de teclado
- **Design responsivo** com scroll horizontal automático
- **Sticky positioning** - toolbar sempre visível durante scroll
- **Acessibilidade total** - ARIA labels e navegação por teclado

### 📝 Formatação de Texto
- **Negrito** (`**texto**`) - `Ctrl+B`
- **Itálico** (`*texto*`) - `Ctrl+I`
- **Tachado** (`~~texto~~`)
- **Código inline** (`` `código` ``) - `Ctrl+\``

### 📐 Títulos
- **H1, H2, H3** com botões dedicados
- Inserção automática no início da linha

### 📋 Listas
- **Lista com marcadores** (`- item`)
- **Lista numerada** (`1. item`)
- **Lista de tarefas** (`- [ ] tarefa`)
- **Citação** (`> texto`)

### 🔗 Mídia
- **Links** (`[texto](url)`)
- **Imagens** (`![alt](url)`)
- **Tabelas** - template completo pré-formatado

### 🧮 LaTeX (★ Destaque!)
- **Fórmula inline** (`$fórmula$`) - `Ctrl+M`
- **Fórmula display** (`$$fórmula$$`) - `Ctrl+Shift+M`
- **Subscrito HTML** (`<sub>texto</sub>`)
- **Sobrescrito HTML** (`<sup>texto</sup>`)

### ⌨️ Atalhos de Teclado
| Atalho | Ação |
|--------|------|
| `Ctrl+B` | Negrito |
| `Ctrl+I` | Itálico |
| `Ctrl+\`` | Código inline |
| `Ctrl+M` | LaTeX inline |
| `Ctrl+Shift+M` | LaTeX display |
| `Tab` | Inserir 2 espaços |

### 🎨 Comportamento Inteligente
- **Wrap de seleção** - Se houver texto selecionado, envolve com formatação
- **Texto padrão** - Se não houver seleção, insere texto de exemplo
- **Preservação de foco** - Cursor retorna ao editor após cada ação
- **Posicionamento correto** - Cursor fica na posição certa após inserção

## 📚 Aprendizados do shadcn-editor

### Arquitetura
- ✅ **Separação de concerns** - Editor, toolbar e plugins modulares
- ✅ **Render props pattern** - Exposição de estado para UI
- ✅ **Plugin system** - Extensibilidade sem modificar core
- ✅ **Theme-first** - Totalmente estilizado com Tailwind

### UX/UI
- ✅ **Sticky toolbar** - Sempre visível durante scroll
- ✅ **Overflow handling** - Scroll horizontal para toolbars grandes
- ✅ **Tooltips informativos** - Contexto para cada ação
- ✅ **Visual feedback** - Hover states e transições suaves

### Acessibilidade
- ✅ **ARIA labels** - Descrições para screen readers
- ✅ **Keyboard navigation** - Totalmente navegável por teclado
- ✅ **Focus management** - Foco preservado após ações
- ✅ **Semantic HTML** - Estrutura semântica correta

## 🆚 Comparação: Markdown vs Lexical

| Aspecto | MarkdownEditor (Nosso) | shadcn-editor (Lexical) |
|---------|------------------------|-------------------------|
| **LaTeX** | ✅ Nativo | ❌ Requer nodes customizados |
| **Formato** | ✅ Markdown puro | ❌ JSON serializado |
| **Simplicidade** | ✅ Simples e direto | ❌ Complexo |
| **Portabilidade** | ✅ Universal | ❌ Proprietário |
| **Peso** | ✅ Leve (~8KB) | ⚠️ Pesado (~100KB+) |
| **Compatibilidade** | ✅ Qualquer plataforma | ⚠️ Específico do Lexical |

## 🚀 Uso

```tsx
import MarkdownEditor from '@/components/custom/markdown/MarkdownEditor';

function MyComponent() {
  const [content, setContent] = useState('');

  return (
    <MarkdownEditor
      value={content}
      onChange={setContent}
      placeholder="Digite aqui..."
      className="h-[500px]"
    />
  );
}
```

## 🎓 Por que Markdown + LaTeX?

Para um sistema educacional com foco em **ciências exatas**, Markdown é superior porque:

1. **LaTeX é cidadão de primeira classe** - Não precisa de workarounds
2. **Formato texto puro** - Fácil versionamento com Git
3. **Portabilidade total** - Pode exportar para qualquer formato
4. **Aprendizado transferível** - Markdown é usado em GitHub, Stack Overflow, etc.
5. **Performance** - Renderização mais rápida que rich text editors pesados

## 🛠️ Próximas Melhorias Possíveis

- [ ] Syntax highlighting no editor
- [ ] Live preview inline de imagens
- [ ] Auto-complete para LaTeX
- [ ] Template de fórmulas comuns
- [ ] Drag & drop de imagens
- [ ] Histórico de undo/redo
- [ ] Busca e substituição
- [ ] Export para PDF

## 📖 Documentação Relacionada

- [MarkdownView.tsx](./MarkdownView.tsx) - Renderizador de Markdown
- [LessonText.tsx](../../../app/(auth)/professor/curso/[courseId]/[moduleId]/[lessonId]/components/LessonText.tsx) - Implementação completa com preview

---

**Desenvolvido com base nas melhores práticas do shadcn-editor** ⚡
