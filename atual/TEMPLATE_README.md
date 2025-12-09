# Template de Exercícios Interativos - PratiqLab

Este é um template simplificado do PratiqLab para criar exercícios interativos individuais, sem autenticação e com estrutura mínima necessária.

## 📁 Estrutura do Template

```
/src
├── app/
│   ├── layout.tsx                    # Layout root com navbar simples
│   ├── page.tsx                      # ⭐ BOILERPLATE - Comece aqui!
│   └── modulo/                       # Pasta para seus módulos
│       └── ExemploModulo.tsx         # Exemplo de módulo básico
│
└── components/
    ├── custom/
    │   ├── interativos/
    │   │   ├── custom-ui/
    │   │   │   └── TemplateExercicio.tsx  # Wrapper principal
    │   │   └── tools/                     # Componentes auxiliares
    │   │       ├── FloatDica.tsx
    │   │       ├── FloatVars.tsx
    │   │       └── ...
    │   └── ui/
    │       ├── SimpleNavbar.tsx           # Navbar simplificada
    │       ├── TitleHeader/               # Cabeçalho das páginas
    │       └── ScrollPage/                # Container de scroll
    └── ui/                                # Componentes shadcn/ui
```

## 🚀 Como Usar Este Template

### 1. Clone o Projeto Base

```bash
git clone [url-do-repositorio]
cd interativos-skar/atual
npm install
npm run dev
```

O template já vem com um **boilerplate pronto** em `/src/app/page.tsx`!

### 2. Desenvolva Seu Exercício

O arquivo `/src/app/page.tsx` já está configurado como boilerplate:

```tsx
import TemplateExercicio from "@/components/custom/interativos/custom-ui/TemplateExercicio"
import ExemploModulo from "./modulo/ExemploModulo"

export default function Page() {
  return (
    <TemplateExercicio titulo="Título do Seu Exercício">
      {/* Seu conteúdo aqui */}
      <ExemploModulo />
    </TemplateExercicio>
  )
}
```

**Passos:**
1. ✏️ Edite o **título** no TemplateExercicio
2. 📁 Crie seus módulos na pasta `/src/app/modulo/`
3. 📦 Importe e use seus módulos no page.tsx
4. 🎨 Desenvolva a lógica e visualização do exercício
5. ✅ Teste localmente com `npm run dev`

### 3. Organizando Seus Módulos

Crie arquivos na pasta `/src/app/modulo/`:

```tsx
// modulo/MeuExercicio.tsx
"use client"

export default function MeuExercicio() {
  return (
    <div>
      {/* Seu conteúdo interativo aqui */}
    </div>
  )
}
```

Depois importe no page.tsx:

```tsx
import MeuExercicio from "./modulo/MeuExercicio"
```

### 4. Componentes Disponíveis

#### TemplateExercicio
Wrapper principal que simula o ambiente do site:
- ✅ ScrollPage com header fixo
- ✅ TitleHeader com botão voltar
- ✅ Estilo consistente com a plataforma

#### Componentes Auxiliares
Localizados em `/src/components/custom/interativos/tools/`:
- `FloatDica` - Dicas flutuantes com acordeão
- `FloatVars` - Variáveis flutuantes
- E outros componentes de apoio

#### UI Base
- Todos os componentes shadcn/ui disponíveis em `/src/components/ui/`
- ThemeProvider para dark/light mode

## 📝 Exemplo Base Incluído

O template já vem com:
- ✅ `/src/app/page.tsx` - Boilerplate pronto para editar
- ✅ `/src/app/modulo/ExemploModulo.tsx` - Estrutura básica de módulo
- ✅ TemplateExercicio já configurado
- ✅ Layout com ScrollPage e TitleHeader funcionando

## 🎨 Características do Template

### O que foi REMOVIDO:
- ❌ Clerk (autenticação)
- ❌ Sidebar complexa com roles
- ❌ Sistema de rotas (auth)
- ❌ Integração com Firebase/banco de dados
- ❌ Sistema de usuários e progresso

### O que foi MANTIDO:
- ✅ Todos os componentes de UI (`/src/components/custom` e `/src/components/ui`)
- ✅ TemplateExercicio completo e funcional
- ✅ Sistema de temas (dark/light mode)
- ✅ Navbar simples para simulação
- ✅ ScrollPage e TitleHeader
- ✅ Ferramentas de exercícios (FloatDica, FloatVars, etc.)

## 🔧 Desenvolvimento

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm start
```

## 📱 Responsividade

O template mantém toda a responsividade do projeto original:
- Mobile-first design
- Layout adaptativo
- ScrollPage com altura ajustada por viewport

## 💡 Dicas

1. **Um projeto por exercício**: Clone este template para cada novo exercício
2. **Mantenha a estrutura**: O TemplateExercicio já está configurado no boilerplate
3. **Organize por módulos**: Crie arquivos separados em `/src/app/modulo/`
4. **Use componentes prontos**: Explore `/src/components/custom/interativos/tools/`
5. **Teste responsividade**: O ScrollPage já é responsivo, mas sempre teste

## 🔄 Workflow Recomendado

1. **Clone** este template para um novo projeto
2. **Edite** o título em `/src/app/page.tsx`
3. **Desenvolva** seus módulos em `/src/app/modulo/`
4. **Teste** localmente com `npm run dev`
5. **Salve** o projeto completo em outra pasta
6. **Repita** para o próximo exercício

## 📚 Referências

- Boilerplate inicial: `/src/app/page.tsx`
- Exemplo de módulo: `/src/app/modulo/ExemploModulo.tsx`
- TemplateExercicio: `/src/components/custom/interativos/custom-ui/TemplateExercicio.tsx`
- Componentes de apoio: `/src/components/custom/interativos/tools/`

---

**Criado por**: PratiqLab Team
**Versão**: Template Simplificado v1.0
