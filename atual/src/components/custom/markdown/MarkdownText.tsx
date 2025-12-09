import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';

interface MarkdownViewProps {
    content: string;
}

/**
 * Componente simples para renderizar conteúdo Markdown, LaTeX e HTML
 * 
 * @param content O conteúdo em Markdown/LaTeX/HTML que será renderizado
 */
const MarkdownText: React.FC<MarkdownViewProps> = ({ content }) => (
    <div>
        <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex, rehypeRaw]}
        >
            {content}
        </ReactMarkdown>
    </div>
);

export default MarkdownText;
