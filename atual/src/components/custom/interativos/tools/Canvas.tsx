'use client'

import React, { useRef, useEffect, useState, forwardRef, useCallback } from 'react';

/**
 * 🎯 HOOK RESPONSIVO PARA CANVAS - useCanvasResponsive
 * 
 * Sistema completo para criar desenhos responsivos no canvas com mais de 30 funções utilitárias.
 * Todos os desenhos se adaptam automaticamente ao tamanho do canvas, mantendo proporções perfeitas.
 * 
 * @example Uso Básico
 * ```tsx
 * onDraw={(ctx, canvas) => {
 *   const r = useCanvasResponsive(canvas)
 *   
 *   // Círculo responsivo no centro
 *   ctx.fillStyle = '#3b82f6'
 *   r.circle(ctx, r.centerX, r.centerY, r.radius(50), true)
 *   
 *   // Texto com cor automática (contrasta com fundo)
 *   ctx.fillStyle = r.label()
 *   r.text(ctx, 'Hello World', r.centerX, r.centerY + r.size(70), 
 *          r.fontSize(16), { align: 'center' })
 * }}
 * ```
 * 
 * @example Exemplo Avançado com Grid
 * ```tsx
 * onDraw={(ctx, canvas) => {
 *   const r = useCanvasResponsive(canvas, 400, '#f0f9ff', '#1e3a8a')
 *   
 *   // Grid responsivo 4x3
 *   for (let col = 0; col < 4; col++) {
 *     for (let row = 0; row < 3; row++) {
 *       const cell = r.grid(4, 3, col, row)
 *       
 *       // Célula com padding responsivo
 *       ctx.fillStyle = `hsl(${(col + row) * 45}, 70%, 60%)`
 *       r.roundedRect(ctx, 
 *         cell.x + r.margin(5), 
 *         cell.y + r.margin(5),
 *         cell.cellWidth - r.spacing(10), 
 *         cell.cellHeight - r.spacing(10),
 *         r.size(8), true)
 *       
 *       // Label centralizado
 *       ctx.fillStyle = r.label()
 *       r.text(ctx, `${col},${row}`, 
 *         cell.x + cell.cellWidth/2, 
 *         cell.y + cell.cellHeight/2, 
 *         r.fontSize(14), { align: 'center', baseline: 'middle' })
 *     }
 *   }
 * }}
 * ```
 */
export interface CanvasResponsive {
  /** ⚡ BÁSICOS - Informações fundamentais do canvas */
  
  /** Fator de escala calculado automaticamente baseado no tamanho do canvas */
  scale: number;
  /** Centro X do canvas (sempre canvas.width / 2) */
  centerX: number;
  /** Centro Y do canvas (sempre canvas.height / 2) */
  centerY: number;
  /** Largura atual do canvas */
  width: number;
  /** Altura atual do canvas */
  height: number;

  /** 📐 DIMENSÕES RESPONSIVAS - Escalem proporcionalmente */
  
  /** 
   * Converte valor para escala responsiva - USE PARA TUDO!
   * @param value Valor base (referência: 400px)
   * @returns Valor escalado para o tamanho atual do canvas
   * @example r.size(50) // Em canvas 200px = 25px, em canvas 800px = 100px
   */
  size: (value: number) => number;
  
  /** 
   * Alias semântico para size() - mais claro para raios de círculos
   * @param value Raio base
   * @returns Raio escalado
   * @example r.radius(30) // Mais claro que r.size(30) para círculos
   */
  radius: (value: number) => number;
  
  /** 
   * Espaçamento responsivo entre elementos
   * @param value Espaçamento base
   * @returns Espaçamento escalado
   * @example elementos.forEach((el, i) => desenhar(x + i * r.spacing(20), y))
   */
  spacing: (value: number) => number;
  
  /** 
   * Margem responsiva (útil para padding/espaçamentos internos)
   * @param value Margem base
   * @returns Margem escalada
   * @example r.rect(x + r.margin(10), y + r.margin(10), w - r.margin(20), h - r.margin(20))
   */
  margin: (value: number) => number;

  /** 📍 POSICIONAMENTO - Coordenadas e localização */
  
  /** 
   * Coordenada X escalada proporcionalmente
   * @param value Coordenada X base
   * @returns Coordenada X escalada
   * @example r.x(100) // Mantém proporção relativa ao canvas
   */
  x: (value: number) => number;
  
  /** 
   * Coordenada Y escalada proporcionalmente  
   * @param value Coordenada Y base
   * @returns Coordenada Y escalada
   * @example r.y(50) // Mantém proporção relativa ao canvas
   */
  y: (value: number) => number;
  
  /** 
   * Converte porcentagem da largura para pixels
   * @param percent Porcentagem (0-100)
   * @returns Posição X em pixels
   * @example r.percentX(25) // Sempre 25% da largura atual
   */
  percentX: (percent: number) => number;
  
  /** 
   * Converte porcentagem da altura para pixels
   * @param percent Porcentagem (0-100)
   * @returns Posição Y em pixels
   * @example r.percentY(75) // Sempre 75% da altura atual
   */
  percentY: (percent: number) => number;

  /** 🎨 TEXTO E LINHAS - Tipografia e traços responsivos */
  
  /** 
   * Tamanho de fonte responsivo com mínimo obrigatório
   * @param baseSize Tamanho base da fonte
   * @param minSize Tamanho mínimo (padrão: 8px)
   * @returns Tamanho da fonte escalado, nunca menor que minSize
   * @example ctx.font = `${r.fontSize(16, 10)}px Arial` // 16px escalado, mín 10px
   */
  fontSize: (baseSize: number, minSize?: number) => number;
  
  /** 
   * Espessura de linha responsiva com mínimo
   * @param baseWidth Espessura base
   * @param minWidth Espessura mínima (padrão: 1px)
   * @returns Espessura escalada, nunca menor que minWidth
   * @example ctx.lineWidth = r.lineWidth(3, 1) // 3px escalado, mín 1px
   */
  lineWidth: (baseWidth: number, minWidth?: number) => number;
  
  /** 
   * Array de tracejado responsivo (para linhas pontilhadas)
   * @param baseDash Tamanho base do traço
   * @returns Array [dash, gap] escalado
   * @example ctx.setLineDash(r.dashArray(8)) // [8*scale, 8*scale]
   */
  dashArray: (baseDash: number) => number[];

  /** 
   * Cria padrão de hachura responsivo para preenchimentos
   * @param ctx Contexto do canvas
   * @param type Tipo de hachura: 'horizontal' | 'vertical' | 'diagonal' | 'diagonal-reverse' | 'cross' | 'diagonal-cross' | 'dots' | 'earth' | 'gravel' | 'dashed-horizontal'
   * @param spacing Espaçamento entre linhas da hachura
   * @param lineWidth Espessura das linhas da hachura
   * @param color Cor das linhas (opcional, usa strokeStyle atual se não especificado)
   * @returns CanvasPattern para usar como fillStyle
   * @example 
   * ```tsx
   * // Hachura diagonal azul
   * const pattern = r.hatchPattern(ctx, 'diagonal', 8, 1, '#3b82f6')
   * ctx.fillStyle = pattern
   * r.rect(ctx, x, y, width, height, true)
   * 
   * // Hachura cruzada responsiva
   * const crossPattern = r.hatchPattern(ctx, 'cross', r.spacing(12), r.lineWidth(2))
   * ctx.fillStyle = crossPattern
   * r.circle(ctx, centerX, centerY, radius, true)
   * 
   * // Hachura de pontos (dots)
   * const dotsPattern = r.hatchPattern(ctx, 'dots', r.spacing(10), r.lineWidth(2), '#991b1b')
   * ctx.fillStyle = dotsPattern
   * r.roundedRect(ctx, x, y, width, height, r.size(8), true)
   * 
   * // Hachura de terra (earth)
   * const earthPattern = r.hatchPattern(ctx, 'earth', r.spacing(20), r.lineWidth(1), '#8B4513')
   * ctx.fillStyle = earthPattern
   * r.rect(ctx, x, y, width, height, true)
   * 
   * // Hachura de cascalho (gravel)
   * const gravelPattern = r.hatchPattern(ctx, 'gravel', r.spacing(15), r.lineWidth(2), '#808080')
   * ctx.fillStyle = gravelPattern
   * r.circle(ctx, centerX, centerY, radius, true)
   * 
   * // Hachura horizontal tracejada
   * const dashedPattern = r.hatchPattern(ctx, 'dashed-horizontal', r.spacing(12), r.lineWidth(1), '#059669')
   * ctx.fillStyle = dashedPattern
   * r.rect(ctx, x, y, width, height, true)
   * ```
   */
  hatchPattern: (ctx: CanvasRenderingContext2D, type: 'horizontal' | 'vertical' | 'diagonal' | 'diagonal-reverse' | 'cross' | 'diagonal-cross' | 'dots' | 'earth' | 'gravel' | 'dashed-horizontal', spacing: number, lineWidth: number, color?: string) => CanvasPattern | null;

  /** 🏗️ LAYOUT AVANÇADO - Sistemas de organização */
  
  /** 
   * Sistema de grid automático responsivo
   * @param cols Número de colunas
   * @param rows Número de linhas  
   * @param col Coluna atual (0-indexed)
   * @param row Linha atual (0-indexed)
   * @returns Objeto com posição e dimensões da célula
   * @example 
   * ```tsx
   * const cell = r.grid(3, 3, 1, 2) // Grid 3x3, célula na posição (1,2)
   * r.rect(ctx, cell.x, cell.y, cell.cellWidth, cell.cellHeight, true)
   * ```
   */
  grid: (cols: number, rows: number, col: number, row: number) => { 
    x: number; 
    y: number; 
    cellWidth: number; 
    cellHeight: number 
  };
  
  /** 
   * Posição relativa a um ponto de referência
   * @param fromX X do ponto de referência
   * @param fromY Y do ponto de referência
   * @param offsetX Deslocamento X (será escalado)
   * @param offsetY Deslocamento Y (será escalado)
   * @returns Nova posição { x, y }
   * @example 
   * ```tsx
   * // Ícone 15px à direita e 5px acima do botão
   * const iconPos = r.relative(buttonX, buttonY, 15, -5)
   * r.circle(ctx, iconPos.x, iconPos.y, r.radius(8), true)
   * ```
   */
  relative: (fromX: number, fromY: number, offsetX: number, offsetY: number) => { x: number; y: number };

  /** 🎨 FUNÇÕES DE DESENHO - Desenhe diretamente sem beginPath/closePath */
  
  /** 
   * Desenha círculo responsivo em uma linha
   * @param ctx Contexto do canvas
   * @param x Posição X do centro
   * @param y Posição Y do centro
   * @param radius Raio do círculo
   * @param fill true=preenchido, false=contorno
   * @example 
   * ```tsx
   * ctx.fillStyle = '#3b82f6'
   * r.circle(ctx, r.centerX, r.centerY, r.radius(30), true)
   * 
   * ctx.strokeStyle = '#ef4444'
   * ctx.lineWidth = r.lineWidth(3)
   * r.circle(ctx, x, y, r.radius(25), false)
   * ```
   */
  circle: (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, fill?: boolean) => void;
  
  /** 
   * Desenha retângulo responsivo em uma linha
   * @param ctx Contexto do canvas
   * @param x Posição X (canto superior esquerdo)
   * @param y Posição Y (canto superior esquerdo)
   * @param width Largura
   * @param height Altura
   * @param fill true=preenchido, false=contorno
   */
  rect: (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, fill?: boolean) => void;
  
  /** 
   * Desenha linha responsiva em uma chamada
   * @param ctx Contexto do canvas
   * @param x1 X inicial
   * @param y1 Y inicial
   * @param x2 X final
   * @param y2 Y final
   * @example r.line(ctx, r.percentX(10), r.centerY, r.percentX(90), r.centerY)
   */
  line: (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) => void;
  
  /** 
   * Desenha texto responsivo com opções
   * @param ctx Contexto do canvas
   * @param text Texto a ser desenhado
   * @param x Posição X
   * @param y Posição Y
   * @param fontSize Tamanho da fonte (já usar r.fontSize())
   * @param options Opções de alinhamento e largura máxima
   * @example 
   * ```tsx
   * ctx.fillStyle = r.label()
   * r.text(ctx, 'Centralizado', r.centerX, r.centerY, r.fontSize(16), {
   *   align: 'center',
   *   baseline: 'middle',
   *   maxWidth: r.size(200)
   * })
   * ```
   */
  text: (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, fontSize: number, options?: { 
    align?: CanvasTextAlign; 
    baseline?: CanvasTextBaseline; 
    maxWidth?: number 
  }) => void;
  
  /** 
   * Desenha arco responsivo
   * @param ctx Contexto do canvas
   * @param x Posição X do centro
   * @param y Posição Y do centro
   * @param radius Raio
   * @param startAngle Ângulo inicial (radianos)
   * @param endAngle Ângulo final (radianos)
   * @param fill true=preenchido, false=contorno
   */
  arc: (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, startAngle: number, endAngle: number, fill?: boolean) => void;
  
  /** 
   * Retângulo com bordas arredondadas responsivas
   * @param ctx Contexto do canvas
   * @param x Posição X
   * @param y Posição Y
   * @param width Largura
   * @param height Altura
   * @param borderRadius Raio das bordas arredondadas
   * @param fill true=preenchido, false=contorno
   * @example 
   * ```tsx
   * // Botão moderno arredondado
   * ctx.fillStyle = '#3b82f6'
   * r.roundedRect(ctx, x, y, r.size(120), r.size(40), r.size(8), true)
   * ```
   */
  roundedRect: (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, borderRadius: number, fill?: boolean) => void;

  /** 🌈 CORES AUTOMÁTICAS - Contraste inteligente com o fundo */
  
  /** 
   * Cor de texto que contrasta automaticamente com o fundo atual (RECOMENDADO)
   * Detecta se o tema atual é claro ou escuro e retorna a cor ideal
   * @returns Cor que sempre será legível sobre o fundo atual
   * @example 
   * ```tsx
   * ctx.fillStyle = r.label() // Sempre legível!
   * r.text(ctx, 'Texto visível', x, y, r.fontSize(16))
   * ```
   */
  label: () => string;
  
  /** 
   * Cor de texto para tema claro (contrasta com bgLight)
   * @returns Cor que contrasta com o fundo claro especificado
   */
  labelLight: () => string;
  
  /** 
   * Cor de texto para tema escuro (contrasta com bgDark)
   * @returns Cor que contrasta com o fundo escuro especificado
   */
  labelDark: () => string;

  /** 🎯 UTILITÁRIOS AVANÇADOS - Transformações e gradientes */
  
  /** 
   * Cria transformação responsiva com restauração automática
   * @param ctx Contexto do canvas
   * @param x X do ponto de transformação
   * @param y Y do ponto de transformação
   * @param rotation Rotação em radianos (opcional)
   * @param scaleX Escala X (opcional)
   * @param scaleY Escala Y (opcional, usa scaleX se não especificado)
   * @returns Função para restaurar transformação original
   * @example 
   * ```tsx
   * // Elemento rotacionado em 45°
   * const restore = r.transform(ctx, centerX, centerY, r.deg2rad(45))
   * r.rect(ctx, -width/2, -height/2, width, height, true) // desenha rotacionado
   * restore() // volta ao normal
   * ```
   */
  transform: (ctx: CanvasRenderingContext2D, x: number, y: number, rotation?: number, scaleX?: number, scaleY?: number) => () => void;
  
  /** 
   * Cria gradiente responsivo (linear ou radial)
   * @param ctx Contexto do canvas
   * @param type 'linear' ou 'radial'
   * @param x1 X inicial
   * @param y1 Y inicial
   * @param x2 X final
   * @param y2 Y final
   * @param colors Array de cores com posições
   * @returns CanvasGradient para usar como fillStyle
   * @example 
   * ```tsx
   * const grad = r.gradient(ctx, 'linear', 0, 0, canvas.width, 0, [
   *   { stop: 0, color: '#3b82f6' },
   *   { stop: 1, color: '#8b5cf6' }
   * ])
   * ctx.fillStyle = grad
   * r.rect(ctx, x, y, width, height, true)
   * ```
   */
  gradient: (ctx: CanvasRenderingContext2D, type: 'linear' | 'radial', x1: number, y1: number, x2: number, y2: number, colors: { stop: number; color: string }[]) => CanvasGradient;

  /** 📐 MATEMÁTICA ÚTIL - Funções para cálculos comuns */
  
  /** 
   * Verifica se um ponto está dentro dos limites do canvas
   * @param x Coordenada X
   * @param y Coordenada Y
   * @returns true se o ponto está dentro do canvas
   */
  inBounds: (x: number, y: number) => boolean;
  
  /** 
   * Calcula distância entre dois pontos
   * @param x1 X do primeiro ponto
   * @param y1 Y do primeiro ponto
   * @param x2 X do segundo ponto
   * @param y2 Y do segundo ponto
   * @returns Distância em pixels
   * @example 
   * ```tsx
   * const dist = r.distance(playerX, playerY, enemyX, enemyY)
   * if (dist < r.radius(30)) { // Colisão detectada }
   * ```
   */
  distance: (x1: number, y1: number, x2: number, y2: number) => number;
  
  /** 
   * Converte graus para radianos
   * @param degrees Ângulo em graus
   * @returns Ângulo em radianos
   * @example const rad = r.deg2rad(45) // Para usar com Math.cos/sin
   */
  deg2rad: (degrees: number) => number;
  
  /** 
   * Converte radianos para graus
   * @param radians Ângulo em radianos
   * @returns Ângulo em graus
   */
  rad2deg: (radians: number) => number;
  
  /** 
   * Limita um valor entre min e max
   * @param value Valor a ser limitado
   * @param min Valor mínimo
   * @param max Valor máximo
   * @returns Valor limitado
   */
  clamp: (value: number, min: number, max: number) => number;
  
  /** 
   * Interpolação linear para animações suaves
   * @param start Valor inicial
   * @param end Valor final
   * @param progress Progresso (0.0 a 1.0)
   * @returns Valor interpolado
   * @example 
   * ```tsx
   * // Animação suave de 0 a 100
   * const x = r.lerp(0, 100, animationProgress)
   * ```
   */
  lerp: (start: number, end: number, progress: number) => number;
  
  /** 
   * Converte valor de um range para outro
   * @param value Valor atual
   * @param fromMin Mínimo do range atual
   * @param fromMax Máximo do range atual
   * @param toMin Mínimo do range destino
   * @param toMax Máximo do range destino
   * @returns Valor convertido
   */
  map: (value: number, fromMin: number, fromMax: number, toMin: number, toMax: number) => number;
}

/**
 * 🚀 Hook para Desenhos Responsivos - useCanvasResponsive
 * 
 * Transforma qualquer canvas em um sistema de desenho completamente responsivo.
 * Todos os elementos escalam proporcionalmente, mantendo aparência perfeita em qualquer tamanho.
 * 
 * @param canvas Elemento canvas HTML
 * @param referenceSize Tamanho de referência para cálculos (padrão: 400px)
 * @param bgLight Cor de fundo para tema claro (padrão: '#87CEEB')
 * @param bgDark Cor de fundo para tema escuro (padrão: '#1a1a2e')
 * @returns Objeto CanvasResponsive com todas as funções utilitárias
 * 
 * @example Exemplo Completo
 * ```tsx
 * <Canvas
 *   aspectRatio="square"
 *   bgLight="#f0f9ff"
 *   bgDark="#1e3a8a"
 *   onDraw={(ctx, canvas) => {
 *     const r = useCanvasResponsive(canvas, 400, '#f0f9ff', '#1e3a8a')
 *     
 *     // Fundo com gradiente
 *     const grad = r.gradient(ctx, 'radial', r.centerX, r.centerY, r.centerX, r.centerY, [
 *       { stop: 0, color: 'rgba(59, 130, 246, 0.8)' },
 *       { stop: 1, color: 'rgba(59, 130, 246, 0.2)' }
 *     ])
 *     ctx.fillStyle = grad
 *     r.circle(ctx, r.centerX, r.centerY, r.radius(100), true)
 *     
 *     // Título centralizado
 *     ctx.fillStyle = r.label()
 *     r.text(ctx, 'Canvas Responsivo', r.centerX, r.percentY(15), r.fontSize(20), 
 *            { align: 'center' })
 *     
 *     // Grid de elementos
 *     for (let i = 0; i < 3; i++) {
 *       for (let j = 0; j < 3; j++) {
 *         const cell = r.grid(3, 3, i, j)
 *         
 *         ctx.fillStyle = `hsl(${(i + j) * 60}, 70%, 60%)`
 *         r.roundedRect(ctx, 
 *           cell.x + r.margin(8), 
 *           cell.y + r.margin(8),
 *           cell.cellWidth - r.spacing(16), 
 *           cell.cellHeight - r.spacing(16),
 *           r.size(6), true)
 *         
 *         ctx.fillStyle = r.label()
 *         r.text(ctx, `${i},${j}`, 
 *           cell.x + cell.cellWidth/2, 
 *           cell.y + cell.cellHeight/2, 
 *           r.fontSize(12), { align: 'center', baseline: 'middle' })
 *       }
 *     }
 *   }}
 * />
 * ```
 */
export function useCanvasResponsive(canvas: HTMLCanvasElement, referenceSize: number = 400, bgLight: string = '#87CEEB', bgDark: string = '#1a1a2e'): CanvasResponsive {
  const scale = Math.min(canvas.width, canvas.height) / referenceSize;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  
  return {
    // ⚡ Básicos
    scale,
    centerX,
    centerY,
    width: canvas.width,
    height: canvas.height,
    
    // 📐 Dimensões responsivas
    size: (value: number) => Math.max(1, value * scale),
    radius: (value: number) => Math.max(1, value * scale),
    spacing: (value: number) => Math.max(1, value * scale),
    margin: (value: number) => Math.max(2, value * scale),
    
    // 📍 Posicionamento
    x: (value: number) => value * scale,
    y: (value: number) => value * scale,
    percentX: (percent: number) => (canvas.width * percent) / 100,
    percentY: (percent: number) => (canvas.height * percent) / 100,
    
    // 🎨 Texto e linhas
    fontSize: (baseSize: number, minSize: number = 8) => Math.max(minSize, baseSize * scale),
    lineWidth: (baseWidth: number, minWidth: number = 1) => Math.max(minWidth, baseWidth * scale),
    dashArray: (baseDash: number) => {
      const dashSize = Math.max(2, baseDash * scale);
      return [dashSize, dashSize];
    },

    hatchPattern: (ctx: CanvasRenderingContext2D, type: 'horizontal' | 'vertical' | 'diagonal' | 'diagonal-reverse' | 'cross' | 'diagonal-cross' | 'dots' | 'earth' | 'gravel' | 'dashed-horizontal', spacing: number, lineWidth: number, color?: string) => {
      // Cria um canvas temporário para o padrão
      const patternCanvas = document.createElement('canvas');
      const patternCtx = patternCanvas.getContext('2d');
      if (!patternCtx) return null;

      // Calcula o tamanho do padrão baseado no tipo
      let patternSize = spacing;
      if (type === 'cross' || type === 'diagonal-cross') {
        patternSize = spacing; // Para padrões cruzados, usa o mesmo espaçamento
      }

      // Define o tamanho do canvas do padrão
      patternCanvas.width = patternSize;
      patternCanvas.height = patternSize;

      // Configura o estilo da linha
      patternCtx.strokeStyle = color || ctx.strokeStyle;
      patternCtx.lineWidth = lineWidth;
      patternCtx.lineCap = 'square';

      // Desenha o padrão baseado no tipo
      switch (type) {
        case 'horizontal':
          patternCtx.beginPath();
          patternCtx.moveTo(0, patternSize / 2);
          patternCtx.lineTo(patternSize, patternSize / 2);
          patternCtx.stroke();
          break;

        case 'vertical':
          patternCtx.beginPath();
          patternCtx.moveTo(patternSize / 2, 0);
          patternCtx.lineTo(patternSize / 2, patternSize);
          patternCtx.stroke();
          break;

        case 'diagonal':
          patternCtx.beginPath();
          patternCtx.moveTo(0, 0);
          patternCtx.lineTo(patternSize, patternSize);
          patternCtx.stroke();
          break;

        case 'diagonal-reverse':
          patternCtx.beginPath();
          patternCtx.moveTo(0, patternSize);
          patternCtx.lineTo(patternSize, 0);
          patternCtx.stroke();
          break;

        case 'cross':
          // Horizontal
          patternCtx.beginPath();
          patternCtx.moveTo(0, patternSize / 2);
          patternCtx.lineTo(patternSize, patternSize / 2);
          patternCtx.stroke();
          // Vertical
          patternCtx.beginPath();
          patternCtx.moveTo(patternSize / 2, 0);
          patternCtx.lineTo(patternSize / 2, patternSize);
          patternCtx.stroke();
          break;

        case 'diagonal-cross':
          // Diagonal principal
          patternCtx.beginPath();
          patternCtx.moveTo(0, 0);
          patternCtx.lineTo(patternSize, patternSize);
          patternCtx.stroke();
          // Diagonal reversa
          patternCtx.beginPath();
          patternCtx.moveTo(0, patternSize);
          patternCtx.lineTo(patternSize, 0);
          patternCtx.stroke();
          break;

        case 'dots':
          // Configurar para desenhar pontos
          patternCtx.fillStyle = color || ctx.fillStyle || ctx.strokeStyle;
          
          // Desenhar ponto no centro do padrão
          const dotRadius = Math.max(0.5, lineWidth / 2);
          const centerX = patternSize / 2;
          const centerY = patternSize / 2;
          
          // Adicionar offset sutil para efeito mais natural
          const offsetX = -0.3 * dotRadius;
          const offsetY = 0.2 * dotRadius;
          
          patternCtx.beginPath();
          patternCtx.arc(centerX + offsetX, centerY + offsetY, dotRadius, 0, 2 * Math.PI);
          patternCtx.fill();
          break;

        case 'earth':
          // Padrão de hachura EARTH - textura de terra
          const earthColors = ['#8B4513', '#A0522D', '#CD853F', '#D2691E', '#B8860B'];
          const baseColor = color || earthColors[0];
          
          // Linhas diagonais principais
          patternCtx.strokeStyle = baseColor;
          patternCtx.lineWidth = Math.max(0.5, lineWidth * 0.5);
          
          for (let i = 0; i < patternSize + 4; i += 4) {
            patternCtx.beginPath();
            patternCtx.moveTo(i, 0);
            patternCtx.lineTo(i + 4, patternSize);
            patternCtx.stroke();
          }
          
          // Linhas perpendiculares mais claras
          patternCtx.strokeStyle = color ? 
            `${baseColor}80` : // 50% transparência se cor personalizada
            earthColors[1];
          patternCtx.lineWidth = Math.max(0.3, lineWidth * 0.3);
          
          for (let i = 0; i < patternSize + 5; i += 5) {
            patternCtx.beginPath();
            patternCtx.moveTo(0, i);
            patternCtx.lineTo(patternSize, i + 5);
            patternCtx.stroke();
          }
          
          // Pontos para textura adicional
          patternCtx.fillStyle = color ? 
            `${baseColor}60` : // 37% transparência se cor personalizada
            earthColors[2];
          
          for (let i = 0; i < patternSize; i += 4) {
            for (let j = 0; j < patternSize; j += 4) {
              // Variação aleatória na posição dos pontos
              const offsetX = (Math.random() - 0.5) * 0.5;
              const offsetY = (Math.random() - 0.5) * 0.5;
              patternCtx.fillRect(i + offsetX, j + offsetY, 1, 1);
            }
          }
          break;

        case 'gravel':
          // Padrão de hachura GRAVEL - círculos irregulares para simular cascalho
          const gravelColor = color || '#808080'; // Cinza padrão
          patternCtx.fillStyle = gravelColor;
          
          // Círculos maiores e menos densos posicionados de forma irregular
          const gravelPositions = [
            { x: 5, y: 5, r: 2.5 },
            { x: 15, y: 10, r: 3.0 },
            { x: 8, y: 18, r: 2.2 },
            { x: 18, y: 3, r: 1.8 },
            { x: 3, y: 14, r: 2.8 }
          ];
          
          // Escalar as posições e tamanhos baseado no spacing e lineWidth
          const scaleFactor = patternSize / 20; // Normalizar para o tamanho do padrão
          
          gravelPositions.forEach(({ x, y, r }) => {
            const scaledX = x * scaleFactor;
            const scaledY = y * scaleFactor;
            const scaledRadius = Math.max(0.5, r * scaleFactor * (lineWidth / 1.5)); // Raios maiores
            
            // Adicionar pequena variação aleatória para naturalidade
            const randomOffsetX = (Math.random() - 0.5) * 0.8;
            const randomOffsetY = (Math.random() - 0.5) * 0.8;
            
            patternCtx.beginPath();
            patternCtx.arc(
              scaledX + randomOffsetX, 
              scaledY + randomOffsetY, 
              scaledRadius, 
              0, 
              2 * Math.PI
            );
            patternCtx.fill();
          });
          break;

        case 'dashed-horizontal':
          // Padrão de hachura com linhas horizontais tracejadas
          patternCtx.strokeStyle = color || ctx.strokeStyle;
          patternCtx.lineWidth = lineWidth;
          
          // Configurar linha tracejada usando escala responsiva
          const scaledDashSize = Math.max(1, lineWidth * scale * 2);
          const scaledGapSize = Math.max(1, lineWidth * scale * 2.5);
          patternCtx.setLineDash([scaledDashSize, scaledGapSize]);
          
          // Desenhar linha horizontal tracejada no centro do padrão
          patternCtx.beginPath();
          patternCtx.moveTo(0, patternSize / 2);
          patternCtx.lineTo(patternSize, patternSize / 2);
          patternCtx.stroke();
          break;
      }

      // Cria e retorna o padrão
      return ctx.createPattern(patternCanvas, 'repeat');
    },
    
    // 🏗️ Layout avançado
    grid: (cols: number, rows: number, col: number, row: number) => {
      const cellWidth = canvas.width / cols;
      const cellHeight = canvas.height / rows;
      return {
        x: col * cellWidth,
        y: row * cellHeight,
        cellWidth,
        cellHeight
      };
    },
    
    relative: (fromX: number, fromY: number, offsetX: number, offsetY: number) => ({
      x: fromX + (offsetX * scale),
      y: fromY + (offsetY * scale)
    }),

    // 🎨 Funções de desenho
    circle: (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, fill?: boolean) => {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      if (fill) ctx.fill();
      else ctx.stroke();
    },
    
    rect: (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, fill?: boolean) => {
      ctx.beginPath();
      ctx.rect(x, y, width, height);
      if (fill) ctx.fill();
      else ctx.stroke();
    },
    
    line: (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    },
    
    text: (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, fontSize: number, options?: { align?: CanvasTextAlign; baseline?: CanvasTextBaseline; maxWidth?: number }) => {
      ctx.font = `${fontSize}px Arial`;
      ctx.textAlign = options?.align || 'left';
      ctx.textBaseline = options?.baseline || 'top';
      if (options?.maxWidth) {
        ctx.fillText(text, x, y, options.maxWidth);
      } else {
        ctx.fillText(text, x, y);
      }
    },
    
    arc: (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, startAngle: number, endAngle: number, fill?: boolean) => {
      ctx.beginPath();
      ctx.arc(x, y, radius, startAngle, endAngle);
      if (fill) ctx.fill();
      else ctx.stroke();
    },
    
    roundedRect: (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, borderRadius: number, fill?: boolean) => {
      ctx.beginPath();
      ctx.moveTo(x + borderRadius, y);
      ctx.lineTo(x + width - borderRadius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + borderRadius);
      ctx.lineTo(x + width, y + height - borderRadius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - borderRadius, y + height);
      ctx.lineTo(x + borderRadius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - borderRadius);
      ctx.lineTo(x, y + borderRadius);
      ctx.quadraticCurveTo(x, y, x + borderRadius, y);
      ctx.closePath();
      if (fill) ctx.fill();
      else ctx.stroke();
    },

    // 🌈 Cores automáticas
    labelLight: () => {
      const getLuminance = (color: string) => {
        const hex = color.replace('#', '')
        const r = parseInt(hex.substr(0, 2), 16) / 255
        const g = parseInt(hex.substr(2, 2), 16) / 255
        const b = parseInt(hex.substr(4, 2), 16) / 255
        return 0.299 * r + 0.587 * g + 0.114 * b
      }
      
      try {
        const luminance = getLuminance(bgLight)
        return luminance > 0.5 ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.95)'
      } catch {
        return 'rgba(0, 0, 0, 0.85)'
      }
    },
    
    labelDark: () => {
      const getLuminance = (color: string) => {
        const hex = color.replace('#', '')
        const r = parseInt(hex.substr(0, 2), 16) / 255
        const g = parseInt(hex.substr(2, 2), 16) / 255
        const b = parseInt(hex.substr(4, 2), 16) / 255
        return 0.299 * r + 0.587 * g + 0.114 * b
      }
      
      try {
        const luminance = getLuminance(bgDark)
        return luminance < 0.5 ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.85)'
      } catch {
        return 'rgba(255, 255, 255, 0.95)'
      }
    },
    
    label: () => {
      const isDarkMode = document.documentElement.classList.contains('dark')
      
      const getLuminance = (color: string) => {
        const hex = color.replace('#', '')
        const r = parseInt(hex.substr(0, 2), 16) / 255
        const g = parseInt(hex.substr(2, 2), 16) / 255
        const b = parseInt(hex.substr(4, 2), 16) / 255
        return 0.299 * r + 0.587 * g + 0.114 * b
      }
      
      try {
        if (isDarkMode) {
          const luminance = getLuminance(bgDark)
          return luminance < 0.5 ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.85)'
        } else {
          const luminance = getLuminance(bgLight)
          return luminance > 0.5 ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.95)'
        }
      } catch {
        return isDarkMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.85)'
      }
    },

    // 🎯 Utilitários avançados
    transform: (ctx: CanvasRenderingContext2D, x: number, y: number, rotation?: number, scaleX?: number, scaleY?: number) => {
      const transform = ctx.getTransform();
      ctx.translate(x, y);
      if (rotation !== undefined) ctx.rotate(rotation);
      if (scaleX !== undefined) ctx.scale(scaleX, scaleY || scaleX);
      return () => ctx.setTransform(transform);
    },
    
    gradient: (ctx: CanvasRenderingContext2D, type: 'linear' | 'radial', x1: number, y1: number, x2: number, y2: number, colors: { stop: number; color: string }[]) => {
      let gradient: CanvasGradient;
      if (type === 'linear') {
        gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      } else {
        gradient = ctx.createRadialGradient(x1, y1, 0, x2, y2, Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2));
      }
      colors.forEach(({ stop, color }) => gradient.addColorStop(stop, color));
      return gradient;
    },
    
    // 📐 Matemática útil
    inBounds: (x: number, y: number) => x >= 0 && x < canvas.width && y >= 0 && y < canvas.height,
    distance: (x1: number, y1: number, x2: number, y2: number) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2),
    deg2rad: (degrees: number) => degrees * (Math.PI / 180),
    rad2deg: (radians: number) => radians * (180 / Math.PI),
    clamp: (value: number, min: number, max: number) => Math.min(Math.max(value, min), max),
    lerp: (start: number, end: number, progress: number) => start + (end - start) * progress,
    map: (value: number, fromMin: number, fromMax: number, toMin: number, toMax: number) => 
      toMin + (value - fromMin) * (toMax - toMin) / (fromMax - fromMin),
  };
}

/**
 * 📋 GUIA RÁPIDO DE RESPONSIVIDADE NO CANVAS
 * 
 * 🎯 REGRA DE OURO: SEMPRE USE ESCALA PROPORCIONAL
 * 
 * ⚡ Como tornar qualquer canvas responsivo:
 * 1. Use o hook: `const r = useCanvasResponsive(canvas)`
 * 2. Substitua valores fixos por funções responsivas:
 *    - Coordenadas: `r.x(100), r.y(50)` ou `r.percentX(25), r.percentY(75)`
 *    - Tamanhos: `r.size(30), r.radius(20), r.spacing(10)`
 *    - Texto: `r.fontSize(16), r.label()`
 *    - Linhas: `r.lineWidth(3), r.dashArray(8)`
 * 
 * 🚨 IMPORTANTE: A escala NÃO define o tamanho do Canvas!
 *    ✅ O Canvas continua 100% responsivo (CSS controla)
 *    ✅ A escala só ajusta os DESENHOS dentro do Canvas
 *    ✅ Canvas pode ter qualquer tamanho: 100px, 800px, 2000px, etc.
 * 
 * 🔍 COMO A ESCALA FUNCIONA:
 *    - Canvas 200px → scale = 0.5 → elementos menores (50%)
 *    - Canvas 400px → scale = 1.0 → elementos tamanho "normal" (100%)
 *    - Canvas 800px → scale = 2.0 → elementos maiores (200%)
 *    - 400 é o "tamanho de referência" para seus desenhos
 * 
 * ✅ EXEMPLO BOM (responsivo):
 * ```tsx
 * onDraw={(ctx, canvas) => {
 *   const r = useCanvasResponsive(canvas)
 *   
 *   // Círculo sempre proporcional
 *   ctx.fillStyle = '#3b82f6'
 *   r.circle(ctx, r.centerX, r.centerY, r.radius(50), true)
 *   
 *   // Texto sempre legível e contrastante
 *   ctx.fillStyle = r.label()
 *   r.text(ctx, 'Hello!', r.centerX, r.centerY + r.size(70), 
 *          r.fontSize(16), { align: 'center' })
 * }}
 * ```
 * 
 * ❌ EXEMPLO RUIM (coordenadas fixas):
 * ```tsx
 * onDraw={(ctx, canvas) => {
 *   ctx.fillStyle = '#3b82f6'
 *   ctx.arc(200, 100, 30, 0, Math.PI * 2) // Vai quebrar em tamanhos diferentes!
 *   ctx.fill()
 * }}
 * ```
 * 
 * 🎨 DICAS PRO:
 * - Use `r.label()` para textos sempre legíveis
 * - Use `r.grid()` para layouts organizados
 * - Use `r.relative()` para posicionamento relativo
 * - Use `r.margin()` e `r.spacing()` para espaçamentos
 * - Use `r.transform()` para rotações e escalas
 * - Use `r.gradient()` para efeitos visuais avançados
 * - Use `r.hatchPattern()` para preenchimentos hachurados
 */

interface CanvasProps {
    /**
     * 🎨 Função para desenhar no canvas
     * 
     * ⚠️  IMPORTANTE: SEMPRE USE FUNÇÕES RESPONSIVAS
     * 
     * Para garantir que seu desenho seja responsivo em todos os tamanhos:
     * 
     * 1. SEMPRE USE O HOOK:
     *    ```tsx
     *    onDraw={(ctx, canvas) => {
     *      const r = useCanvasResponsive(canvas, 400, bgLight, bgDark)
     *      // ... seu código responsivo aqui
     *    }}
     *    ```
     * 
     * 2. SUBSTITUA VALORES FIXOS POR RESPONSIVOS:
     *    ```tsx
     *    // ❌ Fixo (não responsivo)
     *    ctx.arc(100, 50, 20, 0, Math.PI * 2)
     *    
     *    // ✅ Responsivo (se adapta ao tamanho)
     *    r.circle(ctx, r.x(100), r.y(50), r.radius(20), true)
     *    ```
     * 
     * 3. USE CORES AUTOMÁTICAS:
     *    ```tsx
     *    // ✅ Sempre legível
     *    ctx.fillStyle = r.label()
     *    r.text(ctx, 'Texto', x, y, r.fontSize(16))
     *    ```
     * 
     * 📖 EXEMPLO COMPLETO (RECOMENDADO):
     * ```tsx
     * onDraw={(ctx, canvas) => {
     *   const r = useCanvasResponsive(canvas, 400, '#f0f9ff', '#1e3a8a')
     *   
     *   // Fundo com gradiente responsivo
     *   const grad = r.gradient(ctx, 'radial', r.centerX, r.centerY, r.centerX, r.centerY, [
     *     { stop: 0, color: 'rgba(59, 130, 246, 0.8)' },
     *     { stop: 1, color: 'rgba(59, 130, 246, 0.2)' }
     *   ])
     *   ctx.fillStyle = grad
     *   r.circle(ctx, r.centerX, r.centerY, r.radius(80), true)
     *   
     *   // Texto centralizado com cor automática
     *   ctx.fillStyle = r.label()
     *   r.text(ctx, 'Canvas Responsivo!', r.centerX, r.centerY, r.fontSize(20), 
     *          { align: 'center', baseline: 'middle' })
     *   
     *   // Grid de elementos
     *   for (let i = 0; i < 3; i++) {
     *     for (let j = 0; j < 3; j++) {
     *       const cell = r.grid(3, 3, i, j)
     *       
     *       ctx.fillStyle = `hsl(${(i + j) * 60}, 70%, 60%)`
     *       r.roundedRect(ctx, 
     *         cell.x + r.margin(5), 
     *         cell.y + r.margin(5),
     *         cell.cellWidth - r.spacing(10), 
     *         cell.cellHeight - r.spacing(10),
     *         r.size(4), true)
     *     }
     *   }
     * }}
     * ```
     */
    onDraw?: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;

    /** 🖱️ Eventos do mouse */
    onMouseMove?: React.MouseEventHandler<HTMLCanvasElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLCanvasElement>;
    onClick?: React.MouseEventHandler<HTMLCanvasElement>;
    onMouseDown?: React.MouseEventHandler<HTMLCanvasElement>;
    onMouseUp?: React.MouseEventHandler<HTMLCanvasElement>;

    /** 👶 Elementos filhos que serão renderizados sobre o canvas */
    children?: React.ReactNode;

    /** 🎨 Estilos customizados do canvas */
    style?: React.CSSProperties;

    /**
     * 🌅 Cor de fundo no tema claro
     * 
     * 🎨 SUGESTÕES DE CORES PARA TEMA CLARO:
     * - '#87CEEB' (azul céu) - padrão, neutro e agradável
     * - '#f8f9fa' (branco suave) - para conteúdo profissional
     * - '#e3f2fd' (azul bem claro) - para destaques sutis
     * - '#fff3e0' (amarelo/laranja claro) - para conteúdo energético
     * - '#f0fdf4' (verde claro) - para conteúdo natural/positivo
     * - '#fdf2f8' (rosa claro) - para conteúdo criativo/feminino
     * 
     * @default '#87CEEB'
     */
    bgLight?: string;

    /**
     * 🌙 Cor de fundo no tema escuro
     * 
     * 🌙 SUGESTÕES DE CORES PARA TEMA ESCURO:
     * - '#1a1a2e' (azul escuro) - padrão, elegante e moderno
     * - '#212121' (cinza escuro) - neutro, excelente contraste
     * - '#1a237e' (azul profundo) - para destaques visuais
     * - '#2e7d32' (verde escuro) - para dados/dashboard natural
     * - '#4a148c' (roxo escuro) - para conteúdo premium/criativo
     * - '#bf360c' (vermelho escuro) - para alertas/dados críticos
     * 
     * @default '#1a1a2e'
     */
    bgDark?: string;

    /**
     * 📐 Proporção (aspect ratio) do canvas
     * 
     * 📐 OPÇÕES DISPONÍVEIS:
     * - 'horizontal' = 2:1 - Usa 100% da largura do container pai
     *   Ideal para: gráficos, timelines, dashboards, visualizações horizontais
     * 
     * - 'square' = 1:1 - Usa 100% da altura do container pai
     *   Ideal para: jogos, diagramas, avatars, ícones, elementos simétricos
     * 
     * - 'vertical' = 9:16 - Usa 100% da altura do container pai
     *   Ideal para: formato Instagram Stories, mobile-first, conteúdo vertical
     * 
     * - 'vertical-large' = 4:5 - Usa 100% da altura do container pai
     *   Ideal para: formato Instagram Feed, retratos, conteúdo vertical moderado
     * 
     * 🎯 RESPONSIVIDADE CONTROLADA PELO PAI:
     * - Canvas sempre mantém a proporção correta
     * - Container pai define o tamanho máximo disponível
     * - Canvas se adapta perfeitamente ao espaço
     * - Nunca distorce, sempre proporcional
     * 
     * @default 'horizontal'
     */
    aspectRatio?: 'horizontal' | 'square' | 'vertical' | 'vertical-large';
  /**
   * If true, the canvas will be redrawn every animation frame (requestAnimationFrame).
   * Useful when onDraw uses time-based animations (performance.now()).
   * @default false
   */
  animate?: boolean;
}

/**
 * 🎨 CANVAS RESPONSIVO - Componente Principal
 * 
 * Canvas que se adapta automaticamente ao container pai mantendo proporção exata.
 * Inclui sistema completo de desenho responsivo e suporte automático a temas.
 * 
 * ✨ PRINCIPAIS RECURSOS:
 * - 📱 Totalmente responsivo (adapta-se ao container)
 * - 🎯 Mantém proporção exata sempre
 * - 🌗 Suporte automático a tema claro/escuro
 * - 🎨 Sistema de cores com contraste inteligente
 * - ⚡ Performance otimizada com ResizeObserver
 * - 🖱️ Eventos de mouse completos
 * - 📐 4 formatos predefinidos
 * 
 * @example Uso Básico
 * ```tsx
 * function MeuComponente() {
 *   return (
 *     <div className="h-96 w-full">
 *       <Canvas
 *         aspectRatio="square"
 *         bgLight="#f0f9ff"
 *         bgDark="#1e3a8a"
 *         onDraw={(ctx, canvas) => {
 *           const r = useCanvasResponsive(canvas, 400, '#f0f9ff', '#1e3a8a')
 *           
 *           // Círculo responsivo no centro
 *           ctx.fillStyle = r.label()
 *           r.circle(ctx, r.centerX, r.centerY, r.radius(50), true)
 *           
 *           // Texto que sempre contrasta
 *           r.text(ctx, 'Hello World!', r.centerX, r.centerY + r.size(70), 
 *                  r.fontSize(16), { align: 'center' })
 *         }}
 *         onMouseMove={(e) => console.log('Mouse:', e.clientX, e.clientY)}
 *       />
 *     </div>
 *   )
 * }
 * ```
 * 
 * @example Grid Avançado
 * ```tsx
 * <Canvas
 *   aspectRatio="horizontal"
 *   onDraw={(ctx, canvas) => {
 *     const r = useCanvasResponsive(canvas)
 *     
 *     // Grid 4x3 responsivo
 *     for (let col = 0; col < 4; col++) {
 *       for (let row = 0; row < 3; row++) {
 *         const cell = r.grid(4, 3, col, row)
 *         
 *         // Gradiente para cada célula
 *         const grad = r.gradient(ctx, 'linear',
 *           cell.x, cell.y, cell.x + cell.cellWidth, cell.y,
 *           [
 *             { stop: 0, color: `hsl(${(col + row) * 30}, 70%, 60%)` },
 *             { stop: 1, color: `hsl(${(col + row) * 30}, 70%, 40%)` }
 *           ]
 *         )
 *         ctx.fillStyle = grad
 *         r.roundedRect(ctx, 
 *           cell.x + r.margin(4), 
 *           cell.y + r.margin(4),
 *           cell.cellWidth - r.spacing(8), 
 *           cell.cellHeight - r.spacing(8),
 *           r.size(6), true)
 *         
 *         // Label centralizado
 *         ctx.fillStyle = r.label()
 *         r.text(ctx, `(${col},${row})`, 
 *           cell.x + cell.cellWidth/2, 
 *           cell.y + cell.cellHeight/2, 
 *           r.fontSize(12), { align: 'center', baseline: 'middle' })
 *       }
 *     }
 *   }}
 * />
 * ```
 * 
 * @example Exemplo com Hachuras
 * ```tsx
 * <Canvas
 *   aspectRatio="square"
 *   onDraw={(ctx, canvas) => {
 *     const r = useCanvasResponsive(canvas)
 *     
 *     // Retângulo com hachura diagonal
 *     const diagonalPattern = r.hatchPattern(ctx, 'diagonal', r.spacing(8), r.lineWidth(1), '#3b82f6')
 *     if (diagonalPattern) {
 *       ctx.fillStyle = diagonalPattern
 *       r.rect(ctx, r.percentX(10), r.percentY(10), r.size(100), r.size(60), true)
 *     }
 *     
 *     // Círculo com hachura cruzada
 *     const crossPattern = r.hatchPattern(ctx, 'cross', r.spacing(12), r.lineWidth(2), '#ef4444')
 *     if (crossPattern) {
 *       ctx.fillStyle = crossPattern
 *       r.circle(ctx, r.centerX, r.centerY, r.radius(40), true)
 *     }
 *     
 *     // Retângulo com hachura diagonal cruzada
 *     const diagonalCrossPattern = r.hatchPattern(ctx, 'diagonal-cross', r.spacing(10), r.lineWidth(1.5), '#10b981')
 *     if (diagonalCrossPattern) {
 *       ctx.fillStyle = diagonalCrossPattern
 *       r.roundedRect(ctx, r.percentX(60), r.percentY(70), r.size(80), r.size(50), r.size(8), true)
 *     }
 *     
 *     // Círculo com hachura de pontos (dots)
 *     const dotsPattern = r.hatchPattern(ctx, 'dots', r.spacing(8), r.lineWidth(3), '#f59e0b')
 *     if (dotsPattern) {
 *       ctx.fillStyle = dotsPattern
 *       r.circle(ctx, r.percentX(20), r.percentY(80), r.radius(30), true)
 *     }
 *     
 *     // Retângulo com hachura de terra (earth)
 *     const earthPattern = r.hatchPattern(ctx, 'earth', r.spacing(15), r.lineWidth(1), '#8B4513')
 *     if (earthPattern) {
 *       ctx.fillStyle = earthPattern
 *       r.roundedRect(ctx, r.percentX(70), r.percentY(20), r.size(90), r.size(40), r.size(6), true)
 *     }
 *     
 *     // Círculo com hachura de cascalho (gravel)
 *     const gravelPattern = r.hatchPattern(ctx, 'gravel', r.spacing(12), r.lineWidth(2), '#696969')
 *     if (gravelPattern) {
 *       ctx.fillStyle = gravelPattern
 *       r.circle(ctx, r.percentX(80), r.percentY(75), r.radius(25), true)
 *     }
 *     
 *     // Retângulo com hachura horizontal tracejada
 *     const dashedPattern = r.hatchPattern(ctx, 'dashed-horizontal', r.spacing(10), r.lineWidth(1), '#059669')
 *     if (dashedPattern) {
 *       ctx.fillStyle = dashedPattern
 *       r.roundedRect(ctx, r.percentX(10), r.percentY(40), r.size(70), r.size(30), r.size(4), true)
 *     }
 *   }}
 * />
 * ```
 */
const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(function Canvas({
    onDraw,
    onMouseMove,
    onMouseLeave,
    onClick,
    onMouseDown,
    onMouseUp,
    children,
    style,
    bgLight,
    bgDark,
  aspectRatio = 'horizontal',
  animate = false
}, ref) {
    const internalCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const canvasRef = (ref as React.RefObject<HTMLCanvasElement>) || internalCanvasRef;
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDarkTheme, setIsDarkTheme] = useState(false);

    // Define as proporções fixas
    const getAspectRatio = useCallback(() => {
        switch (aspectRatio) {
            case 'square':
                return { width: 1, height: 1 };
            case 'vertical':
                return { width: 9, height: 16 };
            case 'vertical-large':
                return { width: 4, height: 5 };
            case 'horizontal':
            default:
                return { width: 2, height: 1 };
        }
    }, [aspectRatio]);

    // Verifica o tema atual
    const checkTheme = () => {
        if (typeof window !== 'undefined') {
            const isDark = document.documentElement.classList.contains('dark');
            setIsDarkTheme(isDark);
        }
    };

    // Desenha o fundo do canvas
    const drawBackground = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Limpa o canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Define a cor de fundo baseada no tema
        const backgroundColor = isDarkTheme 
            ? (bgDark || '#1a1a2e') 
            : (bgLight || '#87CEEB');
        
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Chama o desenho customizado, se fornecido
        if (onDraw) {
            onDraw(ctx, canvas);
        }
    }, [isDarkTheme, bgDark, bgLight, onDraw, canvasRef]);

    // Redimensiona o canvas mantendo a proporção exata
    const resizeCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const containerRect = container.getBoundingClientRect();
        const ratio = getAspectRatio();
        const aspectRatioValue = ratio.width / ratio.height;

        let canvasWidth: number;
        let canvasHeight: number;

        if (aspectRatio === 'horizontal') {
            // Horizontal: usa 100% da largura do container
            canvasWidth = containerRect.width;
            canvasHeight = containerRect.width / aspectRatioValue;
            
            // Verifica se a altura calculada cabe no container
            if (canvasHeight > containerRect.height) {
                // Se não cabe, ajusta pela altura
                canvasHeight = containerRect.height;
                canvasWidth = containerRect.height * aspectRatioValue;
            }
        } else {
            // Square, vertical, vertical-large: usa 100% da altura do container
            canvasHeight = containerRect.height;
            canvasWidth = containerRect.height * aspectRatioValue;
            
            // Verifica se a largura calculada cabe no container
            if (canvasWidth > containerRect.width) {
                // Se não cabe, ajusta pela largura
                canvasWidth = containerRect.width;
                canvasHeight = containerRect.width / aspectRatioValue;
            }
        }

        // Define as dimensões do canvas
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        
        // Redesenha o conteúdo
        drawBackground();
    }, [aspectRatio, getAspectRatio, drawBackground, canvasRef, containerRef]);

    // Redimensiona o canvas quando o container muda de tamanho
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Redimensiona imediatamente
        resizeCanvas();

        // Observa mudanças no tamanho do container
        const resizeObserver = new ResizeObserver(() => {
            resizeCanvas();
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        // Listener para redimensionamento da janela
        window.addEventListener('resize', resizeCanvas);
        
        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [canvasRef, resizeCanvas]);

    // Observa mudanças no tema
    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    checkTheme();
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        // Verifica o tema inicial
        checkTheme();

        return () => observer.disconnect();
    }, []);

    // Redesenha quando o tema ou onDraw mudar
    useEffect(() => {
        drawBackground();
    }, [drawBackground]);

  // Animation loop: when `animate` is true, call drawBackground each animation frame.
  const animationRef = useRef<number | null>(null);
  useEffect(() => {
    if (!('requestAnimationFrame' in window)) return;

    const loop = () => {
      drawBackground();
      animationRef.current = requestAnimationFrame(loop);
    };

    if (animate) {
      // start the loop
      animationRef.current = requestAnimationFrame(loop);
    }

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [animate, drawBackground]);

        // ⚠️ IMPORTANTE: Para o Canvas ocupar toda a largura/altura disponível:
        // 1. O container pai deve ter largura e altura definidas (w-full h-full, ou flex-1, etc)
        // 2. Se usar flexbox no pai, adicione 'flex flex-col' e 'min-h-0' para permitir expansão
        // 3. Exemplo correto:
        //    <div className="flex flex-col h-full">
        //      <div className="flex-1 min-h-0 w-full">
        //        <Canvas aspectRatio="horizontal" ... />
        //      </div>
        //    </div>
        //
        // 📱 SOLUÇÃO PARA EXPANDIR LARGURA TOTAL EM TELAS PEQUENAS/MÉDIAS:
        // 
        // Problema: Em telas pequenas (sm/md), se a altura do container for limitada,
        // o Canvas horizontal (2:1) não consegue expandir para a largura total.
        // 
        // Solução: Use aspect-ratio do CSS para forçar o container a calcular a altura
        // automaticamente baseada na largura disponível:
        // 
        //    <div className="w-full aspect-[2/1] max-h-[400px] sm:max-h-[500px] md:max-h-[600px] 
        //                    lg:aspect-auto lg:flex-1 lg:min-h-0 lg:max-h-none">
        //      <Canvas aspectRatio="horizontal" ... />
        //    </div>
        //
        // Explicação:
        // - aspect-[2/1]: Força proporção 2:1 (mesma do Canvas horizontal)
        // - max-h-[...]: Limita altura máxima para não ficar muito grande
        // - lg:aspect-auto: Remove aspect-ratio em telas grandes
        // - lg:flex-1 lg:min-h-0: Volta ao comportamento flexbox normal em telas grandes


    return (
        <div 
            ref={containerRef}
            className="w-full h-full flex items-center justify-center"
        >
            <canvas
                ref={canvasRef}
                className="block"
                style={{ 
                    display: 'block',
                    ...style 
                }}
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseLeave}
                onClick={onClick}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
            />
            {children}
        </div>
    );
});

export default Canvas;
