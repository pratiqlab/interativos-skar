import type { CanvasResponsive } from '../tools/Canvas';

export function drawAstros(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, r: CanvasResponsive, isDarkMode: boolean) {
  // Helper para nuvens
  const desenharNuvem = (centerX: number, centerY: number, largura: number, altura: number, opacity: number = 1) => {
    const corNuvemPrincipal = isDarkMode ? `rgba(75, 85, 99, ${opacity})` : `rgba(255, 255, 255, ${opacity})`;
    const corNuvemSombra = isDarkMode ? `rgba(55, 65, 81, ${opacity * 0.8})` : `rgba(229, 231, 235, ${opacity * 0.8})`;
    const corNuvemBrilho = isDarkMode ? `rgba(107, 114, 128, ${opacity * 0.6})` : `rgba(248, 250, 252, ${opacity * 0.9})`;

    const circulos = [
      { x: centerX - largura * 0.3, y: centerY, raio: altura * 0.36 },
      { x: centerX - largura * 0.15, y: centerY - altura * 0.2, raio: altura * 0.44 },
      { x: centerX, y: centerY - altura * 0.3, raio: altura * 0.48 },
      { x: centerX + largura * 0.15, y: centerY - altura * 0.2, raio: altura * 0.4 },
      { x: centerX + largura * 0.3, y: centerY, raio: altura * 0.32 },
      { x: centerX - largura * 0.1, y: centerY + altura * 0.1, raio: altura * 0.28 },
      { x: centerX + largura * 0.1, y: centerY + altura * 0.1, raio: altura * 0.24 },
      { x: centerX, y: centerY, raio: altura * 0.36 }
    ];

    ctx.fillStyle = corNuvemSombra;
    circulos.forEach(circulo => r.circle(ctx, circulo.x + r.size(2), circulo.y + r.size(2), circulo.raio, true));

    ctx.fillStyle = corNuvemPrincipal;
    circulos.forEach(circulo => r.circle(ctx, circulo.x, circulo.y, circulo.raio, true));

    ctx.fillStyle = corNuvemBrilho;
    circulos.slice(0, 4).forEach(circulo => r.circle(ctx, circulo.x - r.size(3), circulo.y - r.size(3), circulo.raio * 0.6, true));
  };

  // Astro: sol ou lua no canto superior direito (desenhar antes das nuvens)
  const astroX = canvas.width - r.size(60);
  const astroY = r.size(60);
  const astroRaio = r.size(25);

  if (isDarkMode) {
    const luaCorpoGradient = ctx.createRadialGradient(astroX - r.size(8), astroY - r.size(8), 0, astroX, astroY, astroRaio);
    luaCorpoGradient.addColorStop(0, '#ffffff');
    luaCorpoGradient.addColorStop(0.7, '#f3f4f6');
    luaCorpoGradient.addColorStop(1, '#e5e7eb');
    ctx.fillStyle = luaCorpoGradient;
    r.circle(ctx, astroX, astroY, astroRaio, true);

    ctx.fillStyle = 'rgba(156, 163, 175, 0.4)';
    r.circle(ctx, astroX - r.size(8), astroY - r.size(5), r.size(4), true);
    r.circle(ctx, astroX + r.size(6), astroY - r.size(8), r.size(2.5), true);
    r.circle(ctx, astroX - r.size(3), astroY + r.size(7), r.size(3), true);
    r.circle(ctx, astroX + r.size(10), astroY + r.size(4), r.size(2), true);

    ctx.fillStyle = 'rgba(107, 114, 128, 0.3)';
    r.circle(ctx, astroX + r.size(2), astroY - r.size(2), r.size(6), true);
    r.circle(ctx, astroX - r.size(5), astroY + r.size(3), r.size(5), true);

    const luaBrilhoGradient = ctx.createRadialGradient(astroX - r.size(8), astroY - r.size(8), 0, astroX, astroY, astroRaio * 1.5);
    luaBrilhoGradient.addColorStop(0, 'rgba(255,255,255,0.3)');
    luaBrilhoGradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = luaBrilhoGradient;
    r.circle(ctx, astroX, astroY, astroRaio * 1.3, true);
  } else {
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = r.size(3);
    ctx.lineCap = 'round';
    const numRaios = 8;
    const raioExterno = astroRaio + r.size(12);
    for (let i = 0; i < numRaios; i++) {
      const angulo = (i * 2 * Math.PI) / numRaios;
      const x1 = astroX + Math.cos(angulo) * astroRaio;
      const y1 = astroY + Math.sin(angulo) * astroRaio;
      const x2 = astroX + Math.cos(angulo) * raioExterno;
      const y2 = astroY + Math.sin(angulo) * raioExterno;
      r.line(ctx, x1, y1, x2, y2);
    }

    const solGradient = ctx.createRadialGradient(astroX, astroY, 0, astroX, astroY, astroRaio);
    solGradient.addColorStop(0, '#fef3c7');
    solGradient.addColorStop(0.7, '#fbbf24');
    solGradient.addColorStop(1, '#f59e0b');
    ctx.fillStyle = solGradient;
    r.circle(ctx, astroX, astroY, astroRaio, true);

    const brilhoSolGradient = ctx.createRadialGradient(astroX, astroY, 0, astroX, astroY, astroRaio * 1.8);
    brilhoSolGradient.addColorStop(0, 'rgba(251,191,36,0.2)');
    brilhoSolGradient.addColorStop(1, 'rgba(251,191,36,0)');
    ctx.fillStyle = brilhoSolGradient;
    r.circle(ctx, astroX, astroY, astroRaio * 1.5, true);
  }

  // Nuvens em posições variadas (desenhar depois para ficar em frente ao astro)
  // Animação horizontal contínua nativa do módulo (baseada em performance.now)
  const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const t = now / 1000; // segundos

  // velocidade base em px/s (responsiva)
  const speedBase = r.size(18);
  const wrapMargin = r.size(300); // espaço extra para o loop
  const loopWidth = canvas.width + wrapMargin;

  const loopX = (baseX: number, speedMultiplier: number = 1) => {
    const v = speedBase * speedMultiplier;
    // move para a direita e faz wrap
    return ((baseX + t * v) % loopWidth) - wrapMargin / 2;
  };

  desenharNuvem(loopX(r.size(80), 1.0), canvas.height * 0.15, r.size(100), r.size(40), 0.9);
  desenharNuvem(loopX(canvas.width - r.size(75), 0.6), canvas.height * 0.18, r.size(90), r.size(32), 0.85);
  desenharNuvem(loopX(canvas.width - r.size(120), 1.2), canvas.height * 0.25, r.size(120), r.size(35), 0.8);
  desenharNuvem(loopX(canvas.width * 0.4, 0.85), canvas.height * 0.12, r.size(80), r.size(30), 0.7);
  desenharNuvem(loopX(r.size(130), 0.9), canvas.height * 0.08, r.size(85), r.size(35), 0.75);
  desenharNuvem(loopX(canvas.width * 0.6, 0.7), canvas.height * 0.14, r.size(70), r.size(28), 0.65);
  desenharNuvem(loopX(canvas.width - r.size(180), 1.1), canvas.height * 0.32, r.size(95), r.size(38), 0.8);
  desenharNuvem(loopX(r.size(45), 0.6), canvas.height * 0.22, r.size(60), r.size(25), 0.6);
  desenharNuvem(loopX(canvas.width * 0.25, 1.05), canvas.height * 0.16, r.size(65), r.size(26), 0.7);
}
