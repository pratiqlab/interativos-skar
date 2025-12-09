/* 

Vamos criar um componente chamado Inercia, que vai fornecer dados interativos de equações para sólidos.


Ele vai ter 2 views: 'lista' e 'detalhes'.

e ambos contém o mesmo layout:
    - Topo:
        - row 1:
            - canto esquerdo:
                - paginação: 1 de 10
                - botão: 2d ou 3d, dependendo da view atual
            - canto direito:
                - botão de proximo (se houver)
                - botão de anterior (se houver)
        - row 2:
            - barra de busca
    - Corpo:
        - lista ou detalhes
    - Final:
        - preview cards

vai ser usado da seguinte maneira:

    <Inercia justOpen={false}>

        <solido
                previewUrl="https://www.google.com"
                name="Cubo"
                description="Cubo de lado 10"
                >
            <3d>
                <3jsCodeComponent1>
            </3d>
            
            <Text>
                markdown text here
            </Text>
        </solido>

        <solido
        previewUrl="https://www.google.com"
        name="Cubo"
        description="Cubo de lado 10"
        >
            <3d>
                <3jsCodeComponent2>
            </3d>
            <Text>
                markdown text here
            </Text>
        </solido>

    </Inercia>

Explicação do componente:

    - justOpen: leia FloatDica para entender

    - ordemInsercao: boolean, false por padrão
        - se true, os solidos serão exibidos na ordem de inserção
        - se false, os solidos serão exibidos em ordem alfabética

    - Inercia:
        - assim como no Perguntas, poderá receber infinitos solidos, e para cada, poderá:
            - contar
            - ler as props: previewUrl, name, description
            - e conseguir exibi-los de forma organizada (ordem alfabética ou ordem de inserção)

    - Solido:
        - recebe as props: previewUrl, name, description
        - e tem os seguintes filhos:
            - 3d:
                - recebe o componente 3d
            - Text:
                - recebe o texto, renderizando-o usando o MarkdownText

    - 3d:
        - recebe o componente 3d que vai ser um canvas do three.js


---------------------------------

Explicando as views:

- View 2d:

    - card com:
        - coluna esquerda:
            - imagem do solido (previewUrl)
        - coluna direita:
            - nome do solido (name)
            - descrição do solido (description)
            - botão de selecionar (seleciona o solido)

- View 3d:
    - card com:
        - coluna esquerda:
            - canvas 3d do solido
        - coluna direita:
            - texto markdown


Explicando os componentes do layout fixo:

- Paginação:
    - conta quantos solidos foram passados e mostra: atual/total

- Botão: 2d ou 3d, dependendo da view atual:
    - se 2d, vai mostrar a view 2d do solido atual
    - se 3d, vai mostrar a view 3d do solido atual

- Botão de proximo:
    - só aparece se houver um solido posterior
    - vai para a view 2d ou 3d do solido posterior

- Botão de anterior:
    - só aparece se houver um solido anterior
    - vai para a view 2d ou 3d do solido anterior

- Barra de busca:
    - filtra os solidos por nome, normalizando maiusculos, minusculos e acentos
    - ao buscar, usa debounce e filtra nos cards de preview, só os que correspondem ao texto buscado
    - se não encontrar nada, o preview fica vazio (sem cards)

- Preview cards:
    - são quadradinhos com as imagens dos solidos (previewUrl)
    - igual num carrossel de imagens:
        - tem a imagem atual grande (corpo do card)
        - embaixo tem preview pequenos das proximas imagens (previewUrl de cada solido seguinte)
    - mas respeitando a responsividade:
        - no mobile, mostra 3 cards
        - no desktop, mostra 5 cards

---------------------------------

Explicação do código 3d:

cada componente 3d vai ser um canvas do three.js com uma axis xyz e o sólido atual representado, podendo ser rotacionado.

*/