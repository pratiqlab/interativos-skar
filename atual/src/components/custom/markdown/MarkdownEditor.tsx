"use client"

import React, { useRef, useCallback, KeyboardEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
    Bold,
    Italic,
    Strikethrough,
    Code,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Link,
    Image,
    Table,
    Sigma,
    FunctionSquare,
    Subscript,
    Superscript,
    CheckSquare,
    Minus
} from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

interface ToolbarAction {
    icon: React.ElementType;
    label: string;
    shortcut?: string;
    action: () => void;
    separator?: boolean;
}

/**
 * Enhanced Markdown Editor with Toolbar
 * Inspired by shadcn-editor architecture but optimized for Markdown + LaTeX
 *
 * Features:
 * - Rich toolbar with formatting shortcuts
 * - LaTeX support (inline and display)
 * - Keyboard shortcuts (Ctrl+B, Ctrl+I, etc.)
 * - Accessible (ARIA labels, keyboard navigation)
 * - Responsive design with sticky toolbar
 */
const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
    value,
    onChange,
    placeholder = "Digite seu markdown aqui...",
    className = ""
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    /**
     * Insert text at cursor position or wrap selection
     */
    const insertText = useCallback((
        before: string,
        after: string = '',
        defaultText: string = ''
    ) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);
        const textToInsert = selectedText || defaultText;

        const newText =
            value.substring(0, start) +
            before +
            textToInsert +
            after +
            value.substring(end);

        onChange(newText);

        // Restore focus and selection
        setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + before.length + textToInsert.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    }, [value, onChange]);

    /**
     * Insert text at cursor (without wrapping)
     */
    const insertAtCursor = useCallback((text: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        const newText =
            value.substring(0, start) +
            text +
            value.substring(end);

        onChange(newText);

        setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + text.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    }, [value, onChange]);

    /**
     * Insert at start of line
     */
    const insertLinePrefix = useCallback((prefix: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const lineStart = value.lastIndexOf('\n', start - 1) + 1;

        const newText =
            value.substring(0, lineStart) +
            prefix +
            value.substring(lineStart);

        onChange(newText);

        setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + prefix.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    }, [value, onChange]);

    /**
     * Toolbar actions configuration
     */
    const toolbarActions: ToolbarAction[] = [
        {
            icon: Bold,
            label: 'Negrito',
            shortcut: 'Ctrl+B',
            action: () => insertText('**', '**', 'negrito')
        },
        {
            icon: Italic,
            label: 'Itálico',
            shortcut: 'Ctrl+I',
            action: () => insertText('*', '*', 'itálico')
        },
        {
            icon: Strikethrough,
            label: 'Tachado',
            action: () => insertText('~~', '~~', 'tachado')
        },
        {
            icon: Code,
            label: 'Código Inline',
            shortcut: 'Ctrl+`',
            action: () => insertText('`', '`', 'código')
        },
        { icon: Minus, label: '', action: () => {}, separator: true },
        {
            icon: Heading1,
            label: 'Título 1',
            action: () => insertLinePrefix('# ')
        },
        {
            icon: Heading2,
            label: 'Título 2',
            action: () => insertLinePrefix('## ')
        },
        {
            icon: Heading3,
            label: 'Título 3',
            action: () => insertLinePrefix('### ')
        },
        { icon: Minus, label: '', action: () => {}, separator: true },
        {
            icon: List,
            label: 'Lista',
            action: () => insertLinePrefix('- ')
        },
        {
            icon: ListOrdered,
            label: 'Lista Numerada',
            action: () => insertLinePrefix('1. ')
        },
        {
            icon: CheckSquare,
            label: 'Lista de Tarefas',
            action: () => insertLinePrefix('- [ ] ')
        },
        {
            icon: Quote,
            label: 'Citação',
            action: () => insertLinePrefix('> ')
        },
        { icon: Minus, label: '', action: () => {}, separator: true },
        {
            icon: Link,
            label: 'Link',
            action: () => insertText('[', '](url)', 'texto do link')
        },
        {
            icon: Image,
            label: 'Imagem',
            action: () => insertText('![', '](url)', 'alt text')
        },
        {
            icon: Table,
            label: 'Tabela',
            action: () => insertAtCursor('\n| Coluna 1 | Coluna 2 |\n|----------|----------|\n| Célula 1 | Célula 2 |\n')
        },
        { icon: Minus, label: '', action: () => {}, separator: true },
        {
            icon: Sigma,
            label: 'LaTeX Inline',
            shortcut: 'Ctrl+M',
            action: () => insertText('$', '$', 'fórmula')
        },
        {
            icon: FunctionSquare,
            label: 'LaTeX Display',
            shortcut: 'Ctrl+Shift+M',
            action: () => insertText('\n$$\n', '\n$$\n', 'fórmula')
        },
        {
            icon: Subscript,
            label: 'Subscrito (HTML)',
            action: () => insertText('<sub>', '</sub>', 'texto')
        },
        {
            icon: Superscript,
            label: 'Sobrescrito (HTML)',
            action: () => insertText('<sup>', '</sup>', 'texto')
        },
    ];

    /**
     * Keyboard shortcuts handler
     */
    const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
        const isMod = e.ctrlKey || e.metaKey;

        if (isMod && e.key === 'b') {
            e.preventDefault();
            insertText('**', '**', 'negrito');
        } else if (isMod && e.key === 'i') {
            e.preventDefault();
            insertText('*', '*', 'itálico');
        } else if (isMod && e.key === '`') {
            e.preventDefault();
            insertText('`', '`', 'código');
        } else if (isMod && e.key === 'm') {
            e.preventDefault();
            if (e.shiftKey) {
                insertText('\n$$\n', '\n$$\n', 'fórmula');
            } else {
                insertText('$', '$', 'fórmula');
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            insertAtCursor('  ');
        }
    }, [insertText, insertAtCursor]);

    return (
        <div className={`flex flex-col h-full overflow-hidden rounded-lg border bg-background shadow ${className}`}>
            {/* Sticky Toolbar */}
            <TooltipProvider>
                <div className="sticky top-0 z-10 flex gap-1 overflow-x-auto border-b bg-muted/50 p-2">
                    {toolbarActions.map((action, index) => {
                        if (action.separator) {
                            return <Separator key={index} orientation="vertical" className="mx-1 h-6 self-center" />;
                        }

                        const Icon = action.icon;
                        return (
                            <Tooltip key={index}>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 flex-shrink-0"
                                        onClick={action.action}
                                        type="button"
                                        aria-label={action.label}
                                    >
                                        <Icon className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">
                                    <p className="text-xs">
                                        {action.label}
                                        {action.shortcut && (
                                            <span className="ml-2 text-muted-foreground">
                                                {action.shortcut}
                                            </span>
                                        )}
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </div>
            </TooltipProvider>

            {/* Editor Area */}
            <div className="flex-1 overflow-hidden">
                <Textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="h-full w-full resize-none border-0 font-mono text-sm focus-visible:ring-0 p-4 placeholder:text-muted-foreground"
                    aria-label="Editor de Markdown"
                />
            </div>
        </div>
    );
};

export default MarkdownEditor;
