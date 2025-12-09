# Escolha um layout

[ ] Perguntas: Centraliza todas as questões em uma tela, com uma barra de progresso.
    - titulo: título do exercício/aula interativa

[ ] MeioAMeio: Divide a tela em duas partes: Questões (esquerda) e Canvas (direita):
    - larguraInicial: porcentagem (0-100) para o lado esquerdo
    - titulo: título do exercício/aula interativa

[ ] TemplateBase: Template livre (apenas navbar + título)
    - titulo: título do exercício/aula interativa
    - auto: [ ] ajustar conteúdo automaticamente ao espaço
    - Conteúdo: total liberdade para criar o que quiser

[ ] Personalizado: Monte seu próprio layout combinando os blocos abaixo
    - titulo: título do exercício/aula interativa
    - Blocos disponíveis:
        [ ] Wizard: Navegação passo a passo (mostra uma questão por vez)
            - Botões "Anterior" e "Próximo"
            - Indicadores de progresso (bolinhas clicáveis)
            - Barra de progresso no topo
            - Só avança após acertar a questão atual
        [ ] ScrollCard: Área com scroll e indicador de "mais conteúdo"
            - Mostra seta animada quando há mais conteúdo abaixo
            - altura: altura fixa (opcional, ex: 400px)
            - transparente: [ ] remover fundo/borda do card
        [ ] CompletionDialog: Modal de "Parabéns!" ao completar
            - Aparece automaticamente ao completar todas as questões
            - Efeito de confetti colorido
        [ ] Confetti: Apenas o efeito de confetti (sem modal)
            - duracao: tempo em ms (padrão: 3000)
            - quantidade: número de partículas (padrão: 150)
    - Descreva como quer combinar os blocos:
        (ex: "Wizard com 3 passos, cada um com uma questão, 
        e CompletionDialog ao final")

--------------------------------------------------------------------------------

# Canvas

Configuração básica:
    - aspectRatio: horizontal | square | vertical | vertical-large
    - bgLight: cor de fundo claro (ex: #f0f9ff)
    - bgDark: cor de fundo escuro (ex: #1e3a8a)
    - animate: [ ] sim (para efeitos animados como estrelas piscando, nuvens, etc)

Elementos prontos (marque os que deseja usar):

    [ ] Background: chão verde + céu
        - Automático: estrelas piscando (noite) ou pássaros voando (dia)

    [ ] Eixos cartesianos: eixos X e Y com setas e labels
        - alturaMaxima: valor máximo do eixo Y
        - alcanceMaximo: valor máximo do eixo X

    [ ] Astros: sol (dia) ou lua (noite) + nuvens animadas

    [ ] Foguete: foguete interativo com efeitos
        - posicaoX: posição horizontal da base
        - posicaoY: posição vertical da base (geralmente o chão)
        - angulo: ângulo inicial em graus (90 = vertical)
        - largura: largura do foguete
        - altura: altura do foguete
        - Efeitos:
            [ ] ignicao: fogo animado na base
            [ ] esquentarPonta: ponta piscando (calor)
            [ ] indicadorAngulo: arco mostrando o ângulo
        - Vetores (até 3):
            [ ] Vetor 1:
                - ativo: sim/não
                - comprimento: tamanho do vetor
                - anguloRelativo: ângulo em relação à ponta (0=frente, 90=lado, 180=trás)
                - label: texto (ex: "F₁", "v", "a")
                - cor: cor do vetor
            [ ] Vetor 2: (mesmas opções)
            [ ] Vetor 3: (mesmas opções)
        - Sombras/Carimbos: posições fantasmas do foguete
            - posicaoX, posicaoY, angulo, transparencia, label

Desenho customizado:
    (descreva aqui o que mais precisa desenhar no canvas - círculos, retângulos, 
    textos, linhas, etc. Será implementado usando as funções responsivas do hook)

--------------------------------------------------------------------------------

# Componentes de questão

[ ] Passo: Questão com campo de resposta (numérica ou texto)
    - tipo: numerico | texto
    - enunciado: texto da pergunta (suporta Markdown e LaTeX)
    - resposta: resposta correta
    - textoresposta: explicação mostrada após acerto ou após 2 erros
    - Opcionais:
        - dica: dica mostrada após 1º erro
        - faixaerro: margem de erro aceita (apenas para numérico, ex: 0.1)
        - respostaAlternativa: lista de respostas alternativas aceitas (apenas texto)
        - placeholder: texto do campo de input
        - bloqueado: [ ] começa bloqueado (desbloqueado ao completar questão anterior)
    - Normalização (para tipo texto, todas ativas por padrão):
        [ ] ignorar maiúsculas/minúsculas
        [ ] ignorar espaços
        [ ] ignorar acentos
        [ ] aceitar ponto ou vírgula
        [ ] ignorar sinais especiais (−, –, —)
        [ ] ignorar parênteses/colchetes

[ ] MultiplaEscolha: Questão de múltipla escolha (A, B, C, D...)
    - enunciado: texto da pergunta (suporta Markdown e LaTeX)
    - alternativas: lista de alternativas
        - A: texto (correta/incorreta)
        - B: texto (correta/incorreta)
        - C: texto (correta/incorreta)
        - D: texto (correta/incorreta)
        - ... (quantas precisar)
    - textoresposta: explicação mostrada após acerto ou após 2 erros
    - Opcionais:
        - dica: dica mostrada após 1º erro
        - randomizar: [ ] embaralhar ordem das alternativas
        - bloqueado: [ ] começa bloqueado (desbloqueado ao completar questão anterior)

--------------------------------------------------------------------------------

# Componentes auxiliares

[ ] Calculadora: Calculadora científica com funções matemáticas avançadas
    - Botão flutuante que abre modal com calculadora completa
    - Operações básicas: +, -, ×, ÷, potência (x^y)
    - Funções trigonométricas: sin, cos, tan, asin, acos, atan (em graus)
    - Funções matemáticas: log (base 10), ln (logaritmo natural), √ (raiz), x²
    - Display tipo calculadora com histórico de operações
    - Botões: C (limpar), DEL (deletar último), +/- (trocar sinal)
    - Opcionais:
        - justOpen: [ ] não renderizar botão flutuante (apenas conteúdo)

[ ] Conversor: Conversor de unidades para física e engenharia
    - Botão flutuante que abre modal com conversor
    - Suporta 11 tipos de conversão diferentes
    - Conversão bidirecional (troca de unidades)
    - Resultado em tempo real com precisão de 6 casas decimais
    - Tipos disponíveis:
        - Comprimento: km, m, cm, mm, mi, yd, ft, in
        - Área: km², m², cm², mm², ha, ac, ft², in²
        - Volume: km³, m³, cm³, mm³, L, mL, gal, ft³
        - Velocidade: m/s, km/h, km/s, cm/s, mph, ft/s, knot
        - Aceleração: m/s², km/h², cm/s², ft/s², g, gal
        - Força: N, kN, dyn, lbf, kgf, tf
        - Pressão: Pa, kPa, MPa, bar, atm, psi, mmHg, kgf/cm²
        - Massa Específica: kg/m³, g/cm³, kg/L, g/L, lb/ft³, lb/in³, t/m³
        - Temperatura: °C, °F, K
        - Distância/Tempo: m/s, km/h, cm/min, mm/s, ft/min
        - Distância/Tempo²: m/s², cm/s², mm/s², ft/s², km/h²
    - Opcionais:
        - justOpen: [ ] não renderizar botão flutuante (apenas conteúdo)

[ ] FloatDica: Botão flutuante (canto inferior direito) que abre modal com dicas
    - tipo: text | accordion
        - text: uma dica única (texto simples)
        - accordion: múltiplas dicas expansíveis (clique para abrir/fechar cada uma)
    - dicas:
        - Se tipo=text:
            - Dica: "texto da dica" (suporta Markdown e LaTeX)
        - Se tipo=accordion:
            - "Título da dica 1": "texto da dica 1"
            - "Título da dica 2": "texto da dica 2"
            - ... (quantas precisar)
    - Opcionais:
        - semBotao: [ ] exibir apenas o conteúdo (sem botão flutuante e modal)

[ ] FloatVars: Barra fixa no topo mostrando variáveis/parâmetros do exercício
    - parametros: lista de variáveis a exibir
        - label: texto do parâmetro (suporta LaTeX, ex: "$h_e =$")
        - valor: valor numérico ou texto
        - unidade: unidade de medida (ex: "cm", "m/s", "°")
    - Exemplo:
        - "$v_0 =$", 10, "m/s"
        - "$\\theta =$", 45, "°"
        - "$g =$", 10, "m/s²"
    - Opcionais:
        - botaoEditar: [ ] mostrar botão "Editar" (abre modal para alterar valores)

[ ] VarFlashCard: Card que vira ao passar o mouse (frente/verso)
    - frente: dados mostrados inicialmente
        - titulo: nome da variável
        - valor: valor numérico
        - casas: casas decimais (ex: 2 para "3.14")
        - unidade: unidade de medida
    - verso: dados mostrados ao passar o mouse (mesma estrutura)
    - Opcionais:
        - duplo: [ ] mostrar 2 valores por lado (ex: atual + máximo)
    - Exemplos de uso:
        - Mostrar "Altura atual" na frente e "Altura máxima" no verso
        - Mostrar "Velocidade" na frente e "Aceleração" no verso
        - Comparar valores antes/depois de um cálculo

[ ] FloatTools: Botão flutuante que expande menu de ferramentas
    - ferramentas: lista de ferramentas disponíveis
        - nome: nome da ferramenta
        - icone: ícone (ex: Calculator, Ruler, Table)
        - exibicao: modal | sheet | window
            - modal: janela centralizada
            - sheet: painel lateral (desliza da direita)
            - window: janela flutuante (arrastável e redimensionável)
        - conteudo: o que mostrar (calculadora, tabela, gráfico, etc.)
    - Exemplos de ferramentas:
        - Calculadora científica
        - Tabela de constantes físicas
        - Conversor de unidades
        - Gráfico interativo

[ ] SolidView: Visualizador 3D interativo com eixos e controles
    - solido: descrição do sólido 3D a ser renderizado
        - Formas básicas: cubo, esfera, cilindro, cone, torus, etc.
        - Dimensões, posição, rotação, cor, transparência
        - Múltiplos sólidos combinados
    - Opcionais:
        - tamanho: tamanho do canvas (padrão: 450px)
        - corFundo: cor de fundo (padrão: #e8e8e8)
        - eixos: [ ] mostrar eixos XYZ coloridos (X=magenta, Y=verde, Z=azul)
        - botoesVista: [ ] mostrar botões de visualização
            - Topo, Fundo, Frente, Trás, Esquerda, Direita
            - Isométrica, Isométrica Inversa
        - legenda: [ ] mostrar legenda dos eixos
    - Controles automáticos:
        - Rotacionar: arrastar com mouse
        - Zoom: scroll do mouse
        - Pan: arrastar com botão direito
    - Exemplos de uso:
        - Visualizar sólidos geométricos (prismas, pirâmides, etc.)
        - Mostrar vetores em 3D
        - Demonstrar projeções ortogonais

--------------------------------------------------------------------------------

# Componentes por professor

## skar

[ ] Inercia: Visualizador de sólidos com momento de inércia
    - Botão flutuante que abre modal com galeria de sólidos
    - Modos de visualização: 2D (card com prévia) e 3D (interativo com Three.js)
    - Busca por nome do sólido (com normalização de acentos)
    - Navegação entre sólidos (setas, miniaturas clicáveis, paginação)
    - Cada sólido contém: modelo 3D interativo + fórmulas em Markdown/LaTeX

    Props:
        - justOpen: [ ] não renderizar botão flutuante (controle externo via isOpen)
        - ordemInsercao: [ ] manter ordem de inserção (padrão: ordem alfabética)
        - isOpen: boolean (só usado quando justOpen=true, para controle externo)
        - onClose: callback ao fechar (só usado quando justOpen=true)
        - className: classes CSS adicionais para o modal

    Sólidos prontos (importar de @/components/custom/interativos/skar/Inercia/solidos/):
        - SolidoBarraDelgadaCentro
        - SolidoBarraDelgadaExtremidade
        - SolidoCilindroMacico
        - SolidoCilindroOco
        - SolidoCilindroOcoParedesFinas
        - SolidoEsferaSolida
        - SolidoEsferaOcaParedesFinas
        - SolidoPlacaRetangular
        - SolidoPlacaRetangularFina

## paulo

[ ] Uzt: Calculadora de dissipação de poro pressão (Terzaghi)
    - Calcula U(z,t) para valores específicos de Tv e z/Hd
    - Inputs:
        - Tv: tempo adimensional (ex: 0.1)
        - z/Hd: razão profundidade/altura de drenagem (0 a 2)
    - Output: valor de U(z,t) = grau de dissipação

[ ] GeradorDeTabelaUzt: Gera tabela completa de U(z,t)
    - Input: valor de Tv
    - Output: tabela com z/Hd de 0.0 a 2.0 (passo 0.1)
    - Colunas: z/Hd, u(z,t)/Δσ, U(z,t)
    - Inclui legenda explicativa

[ ] TabelaU: Tabela estática pré-calculada de U(z,t)
    - Valores fixos de Tv: 0.02, 0.05, 0.08, ..., 1.00
    - Valores fixos de z/Hd: 0.0, 0.1, ..., 2.0
    - Linhas destacadas: 0, 0.5, 1.0, 1.5, 2.0
    - Útil como referência rápida (sem cálculo)

--------------------------------------------------------------------------------

# Cards e painéis

[ ] CardWithHeader: Card com header colorido
    - header: conteúdo do cabeçalho
        - variante: primary | secondary | accent | muted
    - content: conteúdo principal do card
    - section: seção com borda inferior (para dividir conteúdos)
    - Exemplo de uso:
        - Exibir dicas com header destacado
        - Mostrar resolução de questões
        - Agrupar informações relacionadas

[ ] BorderedCard: Card com borda colorida na lateral esquerda
    - variante: primary | secondary | accent
    - link: URL para navegação ao clicar (opcional)
    - header: cabeçalho com fundo sutil (10% opacidade)
    - content: conteúdo principal
    - Efeitos automáticos:
        - Hover: escala e sombra aumentam
        - Cursor pointer quando tem link
    - Exemplo de uso:
        - Cards de navegação (menu de exercícios)
        - Lista de opções clicáveis

[ ] BetterSheet: Painel lateral melhorado
    - titulo: título exibido no header
    - descricao: descrição opcional abaixo do título
    - icone: ícone no header (opcional)
    - conteudo: área principal (scrollável automaticamente)
    - footer: botões de ação (fixo no rodapé)
    - Estrutura:
        - Header fixo (cor primary)
        - Conteúdo scrollável
        - Footer fixo com botões
    - Exemplo de uso:
        - Formulários de edição
        - Configurações de parâmetros
        - Detalhes de um item

--------------------------------------------------------------------------------

# Formatação de texto (Markdown e LaTeX)

Todos os textos (enunciados, dicas, resoluções, etc.) suportam:

Markdown:
    - **negrito** ou __negrito__
    - *itálico* ou _itálico_
    - # Título 1, ## Título 2, ### Título 3
    - - item de lista
    - 1. item numerado
    - [texto do link](url)
    - `código inline`
    - > citação
    - --- (linha horizontal)
    - tabelas (sintaxe GFM)

LaTeX (fórmulas matemáticas):
    - Inline: $x = 5$ ou $E = mc^2$
    - Bloco centralizado: $$x^2 + y^2 = z^2$$
    - Frações: $\frac{a}{b}$
    - Raiz: $\sqrt{x}$ ou $\sqrt[3]{x}$
    - Índices: $x_1$ (subscrito) e $x^2$ (superescrito)
    - Letras gregas: $\alpha$, $\beta$, $\theta$, $\pi$, $\omega$
    - Setas: $\rightarrow$, $\leftarrow$, $\Rightarrow$
    - Símbolos: $\infty$, $\pm$, $\neq$, $\leq$, $\geq$, $\approx$
    - Vetores: $\vec{v}$, $\overrightarrow{AB}$
    - Somatório: $\sum_{i=1}^{n} x_i$
    - Integral: $\int_{a}^{b} f(x) dx$

Links internos (âncoras):
    - Criar link para título: [Ir para seção](#nome-da-secao)
    - Macro automática: LINKINTERNO:[Nome do Título]
