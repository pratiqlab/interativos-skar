/* eslint-disable */
/* Nunca altere esse arquivo, use apenas as classes existentes */
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import MarkdownView from '@/components/custom/markdown/MarkdownView';
import MarkdownText from '@/components/custom/markdown/MarkdownText';
import { CardWithHeader, CardHeader, CardContent } from '@/components/custom/ui/CardWithHeader';
import { Send, X, Check } from 'lucide-react';

interface PassoProps {
  tipo: 'texto' | 'numerico';
  enunciado: string;
  resposta: string | number;
  respostaAlternativa?: string[];
  textoresposta: string;
  faixaerro?: number;
  dica?: string;
  onRespostaCorreta?: () => void;
  normalizarCaps?: boolean;
  normalizarEspaco?: boolean;
  normalizarAcentos?: boolean;
  normalizarPontoVirgula?: boolean;
  normalizarSinais?: boolean;
  normalizarParenteses?: boolean;
  bloqueado?: boolean;
  mdview?: boolean;
  placeholder?: string;
}

interface PassoRef {
  setRespostaUsuario: (resposta: string) => void;
  setRespostaCorreta: (correta: boolean) => void;
  setMensagemErro: (mensagem: string) => void;
  setTentativas: (tentativas: number) => void;
  setMostrarDica: (mostrar: boolean) => void;
  setMostrarSolucao: (mostrar: boolean) => void;
  setMostrarRevisao: (mostrar: boolean) => void;
}

const Passo = forwardRef<PassoRef, PassoProps>(({
  tipo,
  enunciado,
  resposta,
  respostaAlternativa,
  textoresposta,
  faixaerro = 0,
  dica,
  onRespostaCorreta,
  normalizarCaps = true,
  normalizarEspaco = true,
  normalizarAcentos = true,
  normalizarPontoVirgula = true,
  normalizarSinais = true,
  normalizarParenteses = true,
  bloqueado = false,
  mdview = false,
  placeholder = "Digite sua resposta..."
}, ref) => {
  const [respostaUsuario, setRespostaUsuario] = useState('');
  const [respostaCorreta, setRespostaCorreta] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');
  const [tentativas, setTentativas] = useState(0);
  const [mostrarDica, setMostrarDica] = useState(false);
  const [mostrarSolucao, setMostrarSolucao] = useState(false);
  const [mostrarRevisao, setMostrarRevisao] = useState(false);
  const [erroRecente, setErroRecente] = useState(false);

  useImperativeHandle(ref, () => ({
    setRespostaUsuario,
    setRespostaCorreta,
    setMensagemErro,
    setTentativas,
    setMostrarDica,
    setMostrarSolucao,
    setMostrarRevisao
  }));

  // Função para normalizar texto
  const normalizarTexto = (texto: string): string => {
    let textoNormalizado = texto;

    if (normalizarCaps) {
      textoNormalizado = textoNormalizado.toLowerCase();
    }

    if (normalizarEspaco) {
      textoNormalizado = textoNormalizado.trim().replace(/\s+/g, '');
    }

    if (normalizarAcentos) {
      textoNormalizado = textoNormalizado
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    }

    if (normalizarPontoVirgula) {
      // Substitui vírgulas por pontos para números decimais
      textoNormalizado = textoNormalizado.replace(/,/g, '.');
    }

    if (normalizarSinais) {
      // Normaliza sinais de menos especiais para o sinal comum
      textoNormalizado = textoNormalizado
        .replace(/[\u2212\u2013\u2014]/g, '-') // minus sign, en dash, em dash → hyphen-minus
        .replace(/[\u2212]/g, '-'); // minus sign específico → hyphen-minus
    }

    if (normalizarParenteses) {
      // Remove parênteses, colchetes e chaves desnecessários
      textoNormalizado = textoNormalizado
        .replace(/[()[\]{}]/g, ''); // Remove ( ) [ ] { }
    }

    return textoNormalizado;
  };

  // Função para normalizar números
  const normalizarNumero = (numero: string): string => {
    let numeroNormalizado = numero;

    if (normalizarPontoVirgula) {
      // Substitui vírgulas por pontos para números decimais
      numeroNormalizado = numeroNormalizado.replace(/,/g, '.');
    }

    if (normalizarSinais) {
      // Normaliza sinais de menos especiais para o sinal comum
      numeroNormalizado = numeroNormalizado
        .replace(/[\u2212\u2013\u2014]/g, '-'); // minus sign, en dash, em dash → hyphen-minus
    }

    if (normalizarParenteses) {
      // Remove parênteses, colchetes e chaves desnecessários
      numeroNormalizado = numeroNormalizado
        .replace(/[()[\]{}]/g, ''); // Remove ( ) [ ] { }
    }

    return numeroNormalizado;
  };

  const verificarResposta = () => {
    const novaTentativa = tentativas + 1;
    setTentativas(novaTentativa);

    if (tipo === 'numerico') {
      const respostaNumeroNormalizada = normalizarNumero(respostaUsuario);
      const respostaNum = parseFloat(respostaNumeroNormalizada);
      const respostaCorretaNum = parseFloat(resposta.toString());

      if (isNaN(respostaNum)) {
        setMensagemErro('Digite um número válido');
        setErroRecente(true);
        return;
      }

      const diferenca = Math.abs(respostaNum - respostaCorretaNum);
      if (diferenca <= faixaerro) {
        setRespostaCorreta(true);
        setMensagemErro('');
        setErroRecente(false);
        onRespostaCorreta?.();
      } else {
        setMensagemErro(`Resposta incorreta. Tente novamente.`);
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
    } else {
      const respostaUsuarioNormalizada = normalizarTexto(respostaUsuario);
      const respostaPrincipalNormalizada = normalizarTexto(resposta.toString());

      if (respostaUsuarioNormalizada === respostaPrincipalNormalizada) {
        setRespostaCorreta(true);
        setMensagemErro('');
        setErroRecente(false);
        onRespostaCorreta?.();
        return;
      }

      // Verifica respostas alternativas se existirem
      if (respostaAlternativa && respostaAlternativa.length > 0) {
        const respostaCorretaEncontrada = respostaAlternativa.some(
          alt => normalizarTexto(alt) === respostaUsuarioNormalizada
        );

        if (respostaCorretaEncontrada) {
          setRespostaCorreta(true);
          setMensagemErro('');
          setErroRecente(false);
          onRespostaCorreta?.();
          return;
        }
      }

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !respostaCorreta && !bloqueado) {
      verificarResposta();
    }
  };

  const handleFocus = () => {
    if (erroRecente && !respostaCorreta) {
      // Limpa o input e fecha as dicas ao focar novamente
      setRespostaUsuario('');
      setMensagemErro('');
      setErroRecente(false);
      setMostrarDica(false);
      setMostrarSolucao(false);
    }
  };

  return (
    <div
      className={`p-4 border border-border bg-card rounded-lg shadow-md transition-all duration-300 text-justify ${
        bloqueado ? 'opacity-75' : ''
      }`}
    >
      <div className="text-foreground mb-6 font-bold text-justify">
        {mdview ? (
          <MarkdownView content={enunciado} />
        ) : (
          <MarkdownText content={enunciado} />
        )}
      </div>

      {bloqueado && (
        <div className="text-muted-foreground text-sm mb-4 italic">
          Complete o passo anterior para desbloquear este passo.
        </div>
      )}

      <div className="flex flex-col gap-3">
        {/* Input com botão ao lado */}
        <div className="flex gap-2">
          <input
            type={tipo === 'numerico' ? 'number' : 'text'}
            value={respostaUsuario}
            onChange={(e) => setRespostaUsuario(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            disabled={respostaCorreta || bloqueado}
            className={`flex-1 p-2 border rounded-md transition-all ${
              respostaCorreta
                ? 'border-success bg-success/10'
                : bloqueado
                  ? 'border-muted bg-muted cursor-not-allowed opacity-50'
                  : erroRecente
                    ? 'border-destructive bg-destructive/10'
                    : 'border-input bg-background'
            } ${tipo === 'numerico' ? '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' : ''}`}
            placeholder={placeholder}
          />
          
          {/* Botão quadrado responsivo */}
          <button
            onClick={respostaCorreta ? () => setMostrarRevisao(!mostrarRevisao) : verificarResposta}
            disabled={bloqueado}
            className={`w-10 h-10 flex items-center justify-center rounded-md transition-all ${
              respostaCorreta
                ? 'bg-success text-success-foreground hover:bg-success/90'
                : erroRecente
                  ? 'bg-destructive text-destructive-foreground'
                  : bloqueado
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
            title={respostaCorreta ? 'Ver revisão' : erroRecente ? 'Incorreto' : 'Verificar resposta'}
          >
            {respostaCorreta ? (
              <Check size={20} />
            ) : erroRecente ? (
              <X size={20} />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>

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
  );
});

Passo.displayName = 'Passo';

export default Passo; 