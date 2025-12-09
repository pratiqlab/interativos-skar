import type { CanvasResponsive } from '../tools/Canvas';
import { drawBackground } from './background';
import { drawEixos } from './eixos';
import { drawAstros } from './astros';

// Função orquestradora: usa os módulos para desenhar os elementos base
export const desenharElementosBase = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  r: CanvasResponsive,
  alturaMaxima: number,
  alcanceMaximo: number
) => {
  // Desenha fundo e chão
  const bg = drawBackground(ctx, canvas, r);

  // Desenha eixos usando a posição do chão
  const e = drawEixos(ctx, canvas, r, alturaMaxima, alcanceMaximo, bg.chaoY);

  // Desenha astros e nuvens (usa o tema detectado em background)
  drawAstros(ctx, canvas, r, bg.isDarkMode);

  // Retorna a mesma shape que a versão anterior para compatibilidade
  return {
    chaoY: bg.chaoY,
    referencialX: e.referencialX,
    origemY: e.origemY,
    escalaX: e.escalaX,
    escalaY: e.escalaY,
    isDarkMode: bg.isDarkMode
  };
};
