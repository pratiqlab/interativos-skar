import React, { useEffect, useRef, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';



// Tipos
export interface MarkdownViewProps {
    content: string;
}

export interface MarkdownLinkProps {
    href?: string;
    children?: React.ReactNode;
    target?: string;
    rel?: string;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
    className?: string;
}

// Utilitários

/**
 * Gera um ID válido para âncoras a partir de um texto
 * Remove tudo que não for letra ou número, mantendo apenas caracteres alfanuméricos
 * @param text Texto do cabeçalho
 * @returns ID formatado para uso em âncoras
 */
export const generateId = (text: string): string => {
    return text
        .toLowerCase()
        // Normaliza caracteres acentuados para suas versões básicas
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos (acentos)
        // Remove TUDO que não for letra ou número (inclui emojis, pontuação, símbolos)
        .replace(/[^a-z0-9\s]/g, '')
        // Substitui espaços por hífens
        .replace(/\s+/g, '-')
        // Remove hífens duplicados
        .replace(/-+/g, '-')
        // Remove hífens do início e fim
        .replace(/^-+|-+$/g, '')
        .trim();
};

/**
 * Faz scroll suave até um elemento com o ID especificado
 * @param id ID do elemento de destino
 */
export const scrollToElement = (id: string): void => {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
};

/**
 * Adiciona IDs automáticos aos cabeçalhos de um container
 * @param container Elemento container que contém os cabeçalhos
 */
export const addHeadingIds = (container: HTMLElement): void => {
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((heading) => {
        if (!heading.id) {
            const text = heading.textContent || '';
            const id = generateId(text);
            heading.id = id;
        }
    });
};

/**
 * Processa macros LINKINTERNO no conteúdo markdown
 * Converte LINKINTERNO:[Texto] em [Texto](#id-gerado)
 * @param content Conteúdo markdown com macros
 * @returns Conteúdo com macros processados
 */
export const processLinkInternoMacros = (content: string): string => {
    return content.replace(/LINKINTERNO:\s*\[([^\]]+)\]/g, (match, linkText) => {
        const id = generateId(linkText);
        return `[${linkText}](#${id})`;
    });
};

/**
 * Exemplos de conversão de títulos para IDs (simplificado):
 * 
 * "📋 Índice" → "indice"
 * "🎯 Recursos Suportados" → "recursos-suportados"
 * "✍️ Formatação de Texto" → "formatacao-de-texto"
 * "💡 Dicas de Uso" → "dicas-de-uso"
 * "📐 Exemplo 123 Áãô:..." → "exemplo-123-aao"
 * "🔗 Links para Títulos" → "links-para-titulos"
 * "FAQ's & Dúvidas ~^:" → "faqs-duvidas"
 * "Seção Especial!" → "secao-especial"
 */

// Hooks
export const useMarkdownHeadings = (content: string) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            addHeadingIds(containerRef.current);
        }
    }, [content]);

    return containerRef;
};

// Componentes
export const MarkdownLink: React.FC<MarkdownLinkProps> = ({
    href,
    children,
    ...props
}) => {
    const isInternalLink = href?.startsWith('#');

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (isInternalLink && href) {
            e.preventDefault();
            const id = href.substring(1);
            scrollToElement(id);
            window.history.pushState(null, '', href);
        }
    };

    return (
        <a
            href={href}
            target={isInternalLink ? undefined : "_blank"}
            rel={isInternalLink ? undefined : "noopener noreferrer"}
            onClick={handleClick}
            {...props}
        >
            {children}
        </a>
    );
};

// Componente Principal
const MarkdownView: React.FC<MarkdownViewProps> = ({ content }) => {
    // A função processLinkInternoMacros só será chamada novamente
    // se a prop `content` mudar. Em outras renderizações,
    // o valor memorizado (em cache) será retornado instantaneamente.
    const processedContent = useMemo(() => processLinkInternoMacros(content), [content]);
    const containerRef = useMarkdownHeadings(processedContent);

    return (
        <div ref={containerRef} className="markdown-theme">
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[
                    [rehypeKatex, {
                        strict: false,
                        throwOnError: false,
                        errorColor: '#cc0000',
                        macros: {
                            "\\RR": "\\mathbb{R}"
                        }
                    }],
                    rehypeRaw
                ]}
                components={{
                    a: MarkdownLink
                }}
            >
                {processedContent}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownView;