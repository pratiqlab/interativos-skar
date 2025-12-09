import type { CanvasResponsive } from '../tools/Canvas';

export interface BackgroundResult {
  chaoY: number;
  isDarkMode: boolean;
}

export function drawBackground(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, r: CanvasResponsive): BackgroundResult {
  // SSR-safe tema
  const isDarkMode = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

  const chaoAltura = r.size(50);
  const chaoY = canvas.height - chaoAltura;

  const corChao = isDarkMode ? '#16a34a' : '#22c55e';
  ctx.fillStyle = corChao;
  ctx.fillRect(0, chaoY, canvas.width, chaoAltura);

  const gradTop = ctx.createLinearGradient(0, chaoY - r.size(10), 0, chaoY + r.size(5));
  gradTop.addColorStop(0, 'rgba(0,0,0,0)');
  gradTop.addColorStop(1, 'rgba(0,0,0,0.15)');
  ctx.fillStyle = gradTop;
  ctx.fillRect(0, chaoY - r.size(10), canvas.width, r.size(15));

  // Estrelas piscando quando é noite
  if (isDarkMode) {
    // tempo em segundos (SSR-safe)
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const t = now / 1000;

    // pequena função pseudo-aleatória determinística por índice (mesmo resultado entre frames)
    const fract = (v: number) => v - Math.floor(v);
    const pseudo = (i: number, seed: number) => fract(Math.sin(i * 12.9898 + seed) * 43758.5453);

    // densidade e contagem de estrelas (limitada)
    const area = canvas.width * canvas.height;
    const density = 0.00006; // ajuste fino: estrelas por px^2
    const count = Math.max(20, Math.min(220, Math.floor(area * density)));

    // seed para posições baseado no tamanho do canvas (mantém distribuição estável)
    const seed = canvas.width * 374.1 + canvas.height * 73.7;

    for (let i = 0; i < count; i++) {
      const px = pseudo(i + 1, seed) * canvas.width;
      // limitar estrelas à área acima do chão
      const py = pseudo(i + 1001, seed) * Math.max(0, chaoY - r.size(10));

      // tamanho responsiva (entre ~0.5 e ~1.6 em unidades r.size)
      const sizeBase = r.size(0.6) * (0.6 + pseudo(i + 2001, seed) * 1.4);

      // velocidade e fase para piscada única por estrela
      const speed = 0.6 + pseudo(i + 3001, seed) * 1.6;
      const phase = pseudo(i + 4001, seed) * Math.PI * 2;

      // alfa oscilante para o efeito de piscar (0.15..1.0)
      const alpha = 0.18 + 0.82 * (0.5 + 0.5 * Math.sin(t * speed + phase));

      // desenha ponto central da estrela
      ctx.fillStyle = `rgba(255,255,255,${Math.max(0, Math.min(1, alpha))})`;
      r.circle(ctx, px, py, sizeBase, true);

      // halo suave pequeno para as estrelas maiores (camada extra com pouca opacidade)
      const halo = sizeBase * 2.5;
      ctx.fillStyle = `rgba(255,255,255,${Math.max(0, Math.min(0.25, alpha * 0.25))})`;
      r.circle(ctx, px, py, halo, true);
    }
  }

  // Pássaros voando quando é dia
  if (!isDarkMode) {
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const t = now / 1000;

    const fract = (v: number) => v - Math.floor(v);
    const pseudo = (i: number, seed: number) => fract(Math.sin(i * 12.9898 + seed) * 43758.5453);

    const area = canvas.width * canvas.height;
    const density = 0.000012; // pássaros por px^2
    const count = Math.max(6, Math.min(48, Math.floor(area * density)));

    const seed = canvas.width * 97.3 + canvas.height * 13.7 + 7.1;

    const speedBase = r.size(28);
    const wrapMargin = r.size(160);
    const loopWidth = canvas.width + wrapMargin;
    const loopX = (baseX: number, speedMultiplier: number = 1) => {
      const v = speedBase * speedMultiplier;
      return ((baseX + t * v) % loopWidth) - wrapMargin / 2;
    };

    for (let i = 0; i < count; i++) {
      const baseX = pseudo(i + 11, seed) * canvas.width;
      const baseY = pseudo(i + 22, seed) * Math.max(0, chaoY - r.size(80));

      const x = loopX(baseX, 0.7 + pseudo(i + 33, seed) * 1.6);
      // leve subida/descida para dar sensação de voo
      const bob = Math.sin(t * (0.6 + pseudo(i + 44, seed) * 1.4) + pseudo(i + 55, seed) * Math.PI * 2) * r.size(3);
      const y = Math.max(r.size(12), baseY + bob + r.size(12));

      // parâmetros do pássaro
      const bodyScale = 0.8 + pseudo(i + 66, seed) * 1.2;
      const wingLen = r.size(6) * bodyScale;
      const flapSpeed = 2.2 + pseudo(i + 77, seed) * 1.8;
      const phase = pseudo(i + 88, seed) * Math.PI * 2;
      const flap = Math.abs(Math.sin(t * flapSpeed + phase)); // 0..1
      const wingAngle = 0.55 + 0.35 * flap; // rad
      const dir = pseudo(i + 99, seed) > 0.5 ? 1 : -1;

      // cor e traço
      ctx.strokeStyle = `rgba(40,40,40,${0.9 - pseudo(i + 111, seed) * 0.4})`;
      ctx.lineWidth = Math.max(0.4, r.size(0.6) * (0.6 + pseudo(i + 121, seed) * 0.8));
      ctx.lineCap = 'round';

  // asas curvas arredondadas (duas curvas simétricas) + corpo
  // ponto das pontas das asas
  const tipLx = x - dir * Math.cos(wingAngle) * wingLen;
  const tipLy = y - Math.sin(wingAngle) * wingLen;
  const tipRx = x + dir * Math.cos(wingAngle) * wingLen;
  const tipRy = y - Math.sin(wingAngle) * wingLen;

  // controle para curvatura, depende do flap para dar sensação de batida
  const curl = r.size(2.2) * (0.6 + flap * 1.2) * bodyScale;
  const ctrlOffsetX = dir * curl;
  const ctrlOffsetY = -Math.max(r.size(1), curl * 0.4);

  // esquerda
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x - ctrlOffsetX, y + ctrlOffsetY - flap * r.size(1.6), tipLx, tipLy);
  ctx.stroke();

  // direita
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x + ctrlOffsetX, y + ctrlOffsetY - flap * r.size(1.6), tipRx, tipRy);
  ctx.stroke();

  // corpo (pequeno círculo) e cabeça (menor) para dar forma
  const bodyRadius = Math.max(r.size(0.8), r.size(0.9) * (bodyScale * 0.9));
  const headRadius = Math.max(r.size(0.45), bodyRadius * 0.5);
  const headX = x + dir * bodyRadius * 0.8;
  const headY = y - bodyRadius * 0.25;

  ctx.fillStyle = ctx.strokeStyle;
  ctx.beginPath();
  ctx.arc(x, y - bodyRadius * 0.1, bodyRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(headX, headY, headRadius, 0, Math.PI * 2);
  ctx.fill();
    }
  }

  return { chaoY, isDarkMode };
}
