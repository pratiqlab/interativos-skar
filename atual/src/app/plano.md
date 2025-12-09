Escolha um layout

[ ] Perguntas: Centraliza todas as questões em uma tela, com uma barra de progresso.
    - titulo: título do exercício/aula interativa

[x] MeioAMeio: Divide a tela em duas partes: Questões (esquerda) e Canvas (direita)
    - larguraInicial: 80
    - titulo: Lançamento de Projétil

    - Canvas:
        - aspectRatio: 
            - [x] "horizontal" 
            - [ ] "vertical" 
            - [ ] "vertical-large"
            - [ ] "square"
        - vazio inicialmente? sim // sempre inicia vazio, para focar na lógica do desenho depois
        - módulos canvas:
            [x] Background: chão verde + céu
            [x] Astros: sol (dia) ou lua (noite) + nuvens animadas
            [x] Eixos cartesianos: eixos X e Y com setas e labels
                - [ ] alturaMaxima: 
                - ou (faz a proporção)
                - [x] alcanceMaximo (largura): calculado automaticamente

[ ] TemplateBase: Template base para o exercício/simulado, sem nada pré-definido.
    - titulo: título do exercício/aula interativa

--------------------------------------------------------------------------------

# Descrição do exercício/aula interativa

Pergunta 1:

Enunciado:

Dado um projétil lançado com velocidade inicial $v_0$ e ângulo de lançamento $\theta$, determine o tempo de voo do projétil.

v0 = valor aleatório entre 10 e 20 m/s
theta = valor aleatório entre 0 e 90 graus

Resposta: $t = \frac{2v_0 \sin(\theta)}{g}$

Dica: escreva a dica usando sempre markdown com formula block

textoresposta: O tempo de voo do projétil é dado pela fórmula $t = \frac{2v_0 \sin(\theta)}{g}$ -> mesma coisa só que com os valores substituídos

Quando acertar, mostra o foguete se movendo durante esse mesmo tempo.