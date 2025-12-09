import type { CanvasResponsive } from '../tools/Canvas';

export interface EixosResult {
  referencialX: number;
  origemY: number;
  escalaX: number;
  escalaY: number;
}

export function drawEixos(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  r: CanvasResponsive,
  alturaMaxima: number,
  alcanceMaximo: number,
  chaoY: number
): EixosResult {
  const referencialX = r.size(30);
  const origemY = chaoY;

  const alturaMaximaComMargem = alturaMaxima * 1.1;
  const alcanceMaximoComMargem = alcanceMaximo * 1.1;

  const eixoYAltura = canvas.height * 0.8;
  const eixoXLargura = canvas.width * 0.85;

  const escalaY = eixoYAltura / alturaMaximaComMargem;
  const escalaX = eixoXLargura / alcanceMaximoComMargem;

  const isDarkMode = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  const corEixos = isDarkMode ? '#e2e8f0' : '#475569';

  ctx.strokeStyle = corEixos;
  ctx.fillStyle = corEixos;
  ctx.lineWidth = r.size(2);

  // Linhas
  r.line(ctx, referencialX, origemY, referencialX, origemY - eixoYAltura);
  r.line(ctx, referencialX, origemY, referencialX + eixoXLargura, origemY);

  // Setas
  const setaSize = r.size(8);
  ctx.beginPath();
  ctx.moveTo(referencialX, origemY - eixoYAltura);
  ctx.lineTo(referencialX - setaSize / 2, origemY - eixoYAltura + setaSize);
  ctx.lineTo(referencialX + setaSize / 2, origemY - eixoYAltura + setaSize);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(referencialX + eixoXLargura, origemY);
  ctx.lineTo(referencialX + eixoXLargura - setaSize, origemY - setaSize / 2);
  ctx.lineTo(referencialX + eixoXLargura - setaSize, origemY + setaSize / 2);
  ctx.closePath();
  ctx.fill();

  // Labels
  ctx.font = `${r.fontSize(14)}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('y', referencialX + r.size(15), origemY - eixoYAltura + r.size(5));
  ctx.fillText('x', referencialX + eixoXLargura - r.size(5), origemY + r.size(15));

  // Origem
  r.circle(ctx, referencialX, origemY, r.size(3), true);
  ctx.font = `${r.fontSize(12)}px Arial`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.fillText('0', referencialX - r.size(8), origemY + r.size(5));

  return { referencialX, origemY, escalaX, escalaY };
}
