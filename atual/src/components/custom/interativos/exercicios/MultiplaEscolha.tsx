/* eslint-disable */
/* Nunca altere esse arquivo, use apenas as classes existentes */
import React, { useState, forwardRef, useImperativeHandle, useMemo } from 'react';
import MarkdownView from '@/components/custom/markdown/MarkdownView';
import MarkdownText from '@/components/custom/markdown/MarkdownText';
import { CardWithHeader, CardHeader, CardContent } from '@/components/custom/ui/CardWithHeader';
import { X } from 'lucide-react';

interface Alternativa {
  alternativa: React.ReactNode;
  isCorreta: boolean;
}

interface MultiplaEscolhaProps {
  enunciado: React.ReactNode;
  randomizarAlternativas?: boolean;
  alternativas: Alternativa[];
  resposta: string;
  textoresposta: string;
  dica?: string;
  bloqueado?: boolean;
  onRespostaCorreta?: () => void;
  mdview?: boolean;
}

interface MultiplaEscolhaRef {
  setAlternativaSelecionada: (alternativa: number | null) => void;
  setRespostaCorreta: (correta: boolean) => void;
  setMensagemErro: (mensagem: string) => void;
  setTentativas: (tentativas: number) => void;
  setMostrarDica: (mostrar: boolean) => void;
  setMostrarSolucao: (mostrar: boolean) => void;
  setMostrarRevisao: (mostrar: boolean) => void;
}

const MultiplaEscolha = forwardRef<MultiplaEscolhaRef, MultiplaEscolhaProps>(({
  enunciado,
  randomizarAlternativas = false,
  alternativas,
  resposta,
  textoresposta,
  dica,
  bloqueado = false,
  onRespostaCorreta,
  mdview = false
}, ref) => {
  // Randomizar alternativas se necessário
  const alternativasOrdenadas = useMemo(() => {
    if (randomizarAlternativas) {
      const alternativasComIndice = alternativas.map((alt, index) => ({ ...alt, indiceOriginal: index }));
      return alternativasComIndice.sort(() => Math.random() - 0.5);
    }
    return alternativas.map((alt, index) => ({ ...alt, indiceOriginal: index }));
  }, [alternativas, randomizarAlternativas]);

  const [alternativaSelecionada, setAlternativaSelecionada] = useState<number | null>(null);
  const [respostaCorreta, setRespostaCorreta] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');
  const [tentativas, setTentativas] = useState(0);
  const [mostrarDica, setMostrarDica] = useState(false);
  const [mostrarSolucao, setMostrarSolucao] = useState(false);
  const [mostrarRevisao, setMostrarRevisao] = useState(false);
  const [erroRecente, setErroRecente] = useState(false);

  useImperativeHandle(ref, () => ({
    setAlternativaSelecionada,
    setRespostaCorreta,
    setMensagemErro,
    setTentativas,
    setMostrarDica,
    setMostrarSolucao,
    setMostrarRevisao
  }));

  const verificarResposta = () => {
    if (alternativaSelecionada === null) {
      setMensagemErro('Selecione uma alternativa antes de verificar.');
      return;
    }

    const novaTentativa = tentativas + 1;
    setTentativas(novaTentativa);

    const alternativaEscolhida = alternativasOrdenadas[alternativaSelecionada];
    
    if (alternativaEscolhida.isCorreta) {
      setRespostaCorreta(true);
      setMensagemErro('');
      setErroRecente(false);
      onRespostaCorreta?.();
    } else {
      setMensagemErro('Resposta incorreta. Tente novamente.');
      setErroRecente(true);
      // Abre automaticamente a dica apenas na primeira tentativa
      if (novaTentativa === 1 && dica) {
        setMostrarDica(true);
        setMostrarSolucao(false);
      }
      // Abre automaticamente apenas a solução na segunda tentativa ou mais
      if (novaTentativa >= 2) {
        setMostrarDica(false);
        setMostrarSolucao(true);
      }
    }
  };

  const getLetraAlternativa = (index: number): string => {
    return String.fromCharCode(65 + index); // A, B, C, D...
  };

  return (
    <div
      className={`p-4 border border-border bg-card rounded-lg shadow-md transition-all duration-300 text-justify ${
        bloqueado ? 'opacity-75' : ''
      }`}
    >
      <div className="font-bold mb-6">
        {typeof enunciado === 'string' ? (
          mdview ? (
            <MarkdownView content={enunciado} />
          ) : (
            <MarkdownText content={enunciado} />
          )
        ) : (
          enunciado
        )}
      </div>

      {bloqueado && (
        <div className="text-muted-foreground text-sm mb-4 italic">
          Complete o passo anterior para desbloquear este passo.
        </div>
      )}

      <div className="flex flex-col gap-2">
        {/* Alternativas */}
        <div className="space-y-3 mb-4">
          {alternativasOrdenadas.map((alt, index) => {
            const isSelected = alternativaSelecionada === index;
            const isCorrectAnswer = respostaCorreta && isSelected;
            const isWrongAnswer = !respostaCorreta && isSelected && mensagemErro;

            return (
              <button
                key={index}
                onClick={() => !respostaCorreta && !bloqueado && setAlternativaSelecionada(index)}
                disabled={respostaCorreta || bloqueado}
                className={`w-full p-4 border rounded-md text-left transition-all duration-200 ${
                  isCorrectAnswer
                    ? 'border-success bg-success/10'
                    : isWrongAnswer
                      ? 'border-destructive bg-destructive/10'
                      : isSelected
                        ? 'border-primary bg-primary/10'
                        : bloqueado
                          ? 'border-muted bg-muted cursor-not-allowed opacity-50'
                          : 'border-input bg-background hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${
                    isCorrectAnswer
                      ? 'border-success bg-success text-success-foreground'
                      : isWrongAnswer
                        ? 'border-destructive bg-destructive text-destructive-foreground'
                        : isSelected
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-muted-foreground/30'
                  }`}>
                    {getLetraAlternativa(index)}
                  </div>
                  <div className="flex-1 text-foreground">
                    {typeof alt.alternativa === 'string' ? (
                      <MarkdownText content={alt.alternativa} />
                    ) : (
                      alt.alternativa
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Botão de verificar */}
        <button
          onClick={respostaCorreta ? () => setMostrarRevisao(!mostrarRevisao) : verificarResposta}
          disabled={bloqueado}
          className={`px-4 py-2 rounded-md transition-colors ${
            respostaCorreta
              ? 'bg-success text-success-foreground hover:bg-success/90'
              : bloqueado
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
        >
          {respostaCorreta ? 'Ver Revisão' : 'Verificar'}
        </button>

        {/* Dica e Solução */}
        <div className="mt-4 space-y-3">
          {/* Dica - apenas quando não concluído */}
          {mostrarDica && dica && !respostaCorreta && (
            <CardWithHeader className="bg-secondary/20">
              <CardHeader variant="secondary" className="relative flex items-center gap-3">
                <button
                  onClick={() => setMostrarDica(false)}
                  className="flex-shrink-0 p-1.5 rounded-md bg-card hover:bg-muted text-foreground hover:text-destructive transition-all shadow-sm hover:shadow-md"
                  title="Fechar dica"
                >
                  <X size={18} />
                </button>
                <h4 className="font-semibold flex-1">Resposta incorreta, leia a dica a seguir e tente novamente:</h4>
              </CardHeader>
              <CardContent className="text-justify">
                <MarkdownView content={dica} />
              </CardContent>
            </CardWithHeader>
          )}

          {/* Solução - apenas quando não concluído */}
          {mostrarSolucao && !respostaCorreta && (
            <CardWithHeader className="bg-accent/20">
              <CardHeader variant="accent" className="relative flex items-center gap-3">
                <button
                  onClick={() => setMostrarSolucao(false)}
                  className="flex-shrink-0 p-1.5 rounded-md bg-card hover:bg-muted text-foreground hover:text-destructive transition-all shadow-sm hover:shadow-md"
                  title="Fechar solução"
                >
                  <X size={18} />
                </button>
                <h4 className="font-semibold flex-1">Solução:</h4>
              </CardHeader>
              <CardContent className="text-justify">
                <MarkdownView content={textoresposta} />
              </CardContent>
            </CardWithHeader>
          )}

          {/* Revisão - apenas quando concluído */}
          {mostrarRevisao && respostaCorreta && (
            <CardWithHeader className="bg-success/20">
              <CardHeader variant="accent" className="relative flex items-center gap-3 !bg-success !text-success-foreground">
                <button
                  onClick={() => setMostrarRevisao(false)}
                  className="flex-shrink-0 p-1.5 rounded-md bg-card hover:bg-muted text-foreground hover:text-destructive transition-all shadow-sm hover:shadow-md"
                  title="Fechar revisão"
                >
                  <X size={18} />
                </button>
                <h4 className="font-semibold flex-1">Revisão - Solução:</h4>
              </CardHeader>
              <CardContent className="text-justify">
                <MarkdownView content={textoresposta} />
              </CardContent>
            </CardWithHeader>
          )}
        </div>
      </div>
    </div>
  );
});

MultiplaEscolha.displayName = 'MultiplaEscolha';

export default MultiplaEscolha;
