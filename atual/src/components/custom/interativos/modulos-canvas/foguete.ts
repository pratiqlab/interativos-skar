
import type { CanvasResponsive } from '../tools/Canvas';

export interface VectorStyle {
	color?: string; // cor única (padrão para ambos os modos)
	lightColor?: string; // cor específica para modo claro
	darkColor?: string; // cor específica para modo escuro
}

export interface RocketVector {
	enabled: boolean; // se o vetor está ativo
	length: number; // comprimento do vetor em unidades de referência
	angleDegRelative: number; // ângulo em relação à ponta do foguete (0 = mesma direção da ponta)
	label?: string; // texto opcional na ponta do vetor
	style: VectorStyle; // cores do vetor
	labelFontSize?: number; // tamanho da fonte do label (opcional, padrão 16)
}

export interface RocketState {
	// absolute canvas coordinates for the center of the base (pivot)
	baseX: number;
	baseY: number;

	// angle in degrees measured relative to the ground (0 = pointing right along ground,
	// 90 = pointing straight up). Changing this value will rotate the rocket around the base center.
	angleDeg: number;

	// logical sizes in "reference units" (to be converted with r.size when drawing)
	widthRef: number; // width at the widest point (reference units)
	heightRef: number; // total height from base to tip (reference units)

	// appearance
	color?: string;
	outlineColor?: string;

	// effects
	ignicaoBase?: boolean; // mostra foguinho animado na base
	esquentarPonta?: boolean; // ponta piscando (skeleton) para simular calor
	showAngleIndicator?: boolean; // mostra indicador de ângulo
	angleIndicatorStyle?: VectorStyle; // estilo do indicador de ângulo

	// vectors from tip
	vectors: [RocketVector, RocketVector, RocketVector]; // exatamente 3 vetores
}

/**
 * Cria um estado de foguete que pode ser usado dinamicamente. O foguete não é desenhado
 * automaticamente — chame `drawRocket` passando o contexto sempre que quiser renderizá-lo.
 *
 * @param baseX x absoluto do centro da base (pivot)
 * @param baseY y absoluto da base (pivot) — normalmente o chão (chaoY)
 * @param widthRef largura de referência (unidade lógica, será aplicada via r.size no draw)
 * @param heightRef altura de referência (unidade lógica)
 * @param angleDeg ângulo inicial em graus relativo ao solo (90 = vertical / apontando para cima)
 */
export function createRocket(
	baseX: number,
	baseY: number,
	widthRef: number = 36,
	heightRef: number = 110,
	angleDeg: number = 90,
	color: string = '#ef4444',
	outlineColor: string = '#1f2937'
): RocketState {
	return {
		baseX,
		baseY,
		angleDeg,
		widthRef,
		heightRef,
		color,
		outlineColor,
		vectors: [
			// Vetor 1: direção oposta (180°)
			{
				enabled: false,
				length: 50,
				angleDegRelative: 180,
				style: { color: '#3b82f6' }
			},
			// Vetor 2: direção perpendicular (90°)
			{
				enabled: false,
				length: 40,
				angleDegRelative: 90,
				style: { color: '#10b981' }
			},
			// Vetor 3: mesma direção da ponta (0°)
			{
				enabled: false,
				length: 45,
				angleDegRelative: 0,
				style: { color: '#f59e0b' }
			}
		]
	};
}

/**
 * Ajusta o ângulo absoluto do foguete (graus).
 * Mantém o ponto de pivot (centro da base) fixo.
 */
export function setRocketAngle(rocket: RocketState, angleDeg: number) {
	rocket.angleDeg = angleDeg;
}

/**
 * Rotaciona o foguete relativo ao ângulo atual (delta em graus).
 */
export function rotateRocket(rocket: RocketState, deltaDeg: number) {
	rocket.angleDeg += deltaDeg;
}

/**
 * Ativa/desativa um vetor específico.
 */
export function setVectorEnabled(rocket: RocketState, vectorIndex: 0 | 1 | 2, enabled: boolean) {
	rocket.vectors[vectorIndex].enabled = enabled;
}

/**
 * Define o comprimento de um vetor específico.
 */
export function setVectorLength(rocket: RocketState, vectorIndex: 0 | 1 | 2, length: number) {
	rocket.vectors[vectorIndex].length = length;
}

/**
 * Define o ângulo relativo de um vetor específico em relação à ponta do foguete.
 */
export function setVectorAngle(rocket: RocketState, vectorIndex: 0 | 1 | 2, angleDegRelative: number) {
	rocket.vectors[vectorIndex].angleDegRelative = angleDegRelative;
}

/**
 * Define o label de um vetor específico.
 */
export function setVectorLabel(rocket: RocketState, vectorIndex: 0 | 1 | 2, label?: string) {
	rocket.vectors[vectorIndex].label = label;
}

/**
 * Define o estilo/cor de um vetor específico.
 */
export function setVectorStyle(rocket: RocketState, vectorIndex: 0 | 1 | 2, style: VectorStyle) {
	rocket.vectors[vectorIndex].style = style;
}

/**
 * Define o estilo do indicador de ângulo.
 */
export function setAngleIndicatorStyle(rocket: RocketState, style: VectorStyle) {
	rocket.angleIndicatorStyle = style;
}

/**
 * Configura rapidamente um vetor com todas as propriedades.
 */
export function configureVector(
	rocket: RocketState, 
	vectorIndex: 0 | 1 | 2, 
	options: {
		enabled?: boolean;
		length?: number;
		angleDegRelative?: number;
		label?: string;
		style?: VectorStyle;
		labelFontSize?: number;
	}
) {
	const vector = rocket.vectors[vectorIndex];
	if (options.enabled !== undefined) vector.enabled = options.enabled;
	if (options.length !== undefined) vector.length = options.length;
	if (options.angleDegRelative !== undefined) vector.angleDegRelative = options.angleDegRelative;
	if (options.label !== undefined) vector.label = options.label;
	if (options.style !== undefined) vector.style = options.style;
	if (options.labelFontSize !== undefined) vector.labelFontSize = options.labelFontSize;
}

/**
 * Ativa todos os vetores com configuração padrão de tridente.
 */
export function enableTridentVectors(rocket: RocketState) {
	// Vetor 1: direção oposta (180°) - azul
	configureVector(rocket, 0, {
		enabled: true,
		length: 50,
		angleDegRelative: 180,
		label: 'F₁',
		style: { color: '#3b82f6' }
	});
	
	// Vetor 2: direção perpendicular (90°) - verde
	configureVector(rocket, 1, {
		enabled: true,
		length: 40,
		angleDegRelative: 90,
		label: 'F₂',
		style: { color: '#10b981' }
	});
	
	// Vetor 3: mesma direção da ponta (0°) - amarelo
	configureVector(rocket, 2, {
		enabled: true,
		length: 45,
		angleDegRelative: 0,
		label: 'F₃',
		style: { color: '#f59e0b' }
	});
}

/**
 * Resolve a cor correta baseada no tema e no estilo fornecido.
 */
function resolveColor(style: VectorStyle, isDarkMode: boolean, defaultColor: string = '#3b82f6'): string {
	if (isDarkMode && style.darkColor) {
		return style.darkColor;
	}
	if (!isDarkMode && style.lightColor) {
		return style.lightColor;
	}
	return style.color || defaultColor;
}

/**
 * Retorna a posição do bico (ponta) do foguete em coordenadas de canvas, usando `r` para
 * conversão de unidades responsivas.
 */
export function getRocketTipPosition(rocket: RocketState, r: CanvasResponsive) {
	// Calcular as dimensões corretas baseadas no mesmo sistema usado no drawRocket
	const corpoAltura = Math.max(4, r.size(rocket.heightRef * 0.39));
	const pontaAltura = Math.max(r.size(2), r.size(rocket.heightRef * 0.12));
	const totalHeight = corpoAltura + pontaAltura; // altura total real do foguete

	// ângulo de rotação em radianos para canvas: positiva gira para a direita (clockwise)
	const rot = (90 - rocket.angleDeg) * (Math.PI / 180);

	// bico está em (0, -totalHeight) no sistema local (base no 0,0)
	const tipLocalX = 0;
	const tipLocalY = -totalHeight;
	const cos = Math.cos(rot);
	const sin = Math.sin(rot);
	const tipX = rocket.baseX + tipLocalX * cos - tipLocalY * sin;
	const tipY = rocket.baseY + tipLocalX * sin + tipLocalY * cos;
	return { x: tipX, y: tipY };
}

/**
 * Retorna a posição da base do foguete (pivot) em coordenadas de canvas.
 */
export function getRocketBasePosition(rocket: RocketState) {
	return { x: rocket.baseX, y: rocket.baseY };
}

/**
 * Retorna a posição do centro do foguete em coordenadas de canvas.
 */
export function getRocketCenterPosition(rocket: RocketState, r: CanvasResponsive) {
	const h = Math.max(4, r.size(rocket.heightRef));
	const rot = (90 - rocket.angleDeg) * (Math.PI / 180);

	// centro está em (0, -h/2) no sistema local
	const centerLocalX = 0;
	const centerLocalY = -h / 2;
	const cos = Math.cos(rot);
	const sin = Math.sin(rot);
	const centerX = rocket.baseX + centerLocalX * cos - centerLocalY * sin;
	const centerY = rocket.baseY + centerLocalX * sin + centerLocalY * cos;
	return { x: centerX, y: centerY };
}

/**
 * Desenha o foguete no canvas no estado atual. O pivot (centro da base) permanece em
 * `rocket.baseX, rocket.baseY` enquanto o resto do foguete é rotacionado em torno dele.
 *
 * O desenho é responsivo: `widthRef` e `heightRef` são convertidos com `r.size()`.
 */
export function drawRocket(ctx: CanvasRenderingContext2D, rocket: RocketState, r: CanvasResponsive) {
	// SSR-safe tema
	const isDarkMode = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
	
	// Dimensões do foguete (responsivas) - baseadas no widthRef e heightRef
	const corpoLargura = Math.max(2, r.size(rocket.widthRef * 0.45)); // ~16.2 quando widthRef=36
	const corpoAltura = Math.max(4, r.size(rocket.heightRef * 0.39)); // ~43.2 quando heightRef=110
	const pontaAltura = Math.max(r.size(2), r.size(rocket.heightRef * 0.12)); // ~13.5 quando heightRef=110
	const abaLargura = Math.max(r.size(2), r.size(rocket.widthRef * 0.225)); // ~8.1 quando widthRef=36
	const abaAltura = Math.max(r.size(2), r.size(rocket.heightRef * 0.098)); // ~10.8 quando heightRef=110

	// Cores do foguete baseadas no tema
	const corCorpo = isDarkMode ? '#f97316' : '#f97316';
	const corPonta = isDarkMode ? '#dc2626' : '#ef4444';
	const corAbas = isDarkMode ? '#71717a' : '#6b7280';
	const corDetalhes1 = isDarkMode ? '#fbbf24' : '#f59e0b';
	const corDetalhes2 = isDarkMode ? '#fed7aa' : '#fdba74';

	const rot = (90 - rocket.angleDeg) * (Math.PI / 180);

	ctx.save();
	// pivot para o centro da base
	ctx.translate(rocket.baseX, rocket.baseY);
	ctx.rotate(rot);

	// 1. Desenha o corpo retangular do foguete
	ctx.fillStyle = corCorpo;
	r.rect(ctx, -corpoLargura/2, -corpoAltura, corpoLargura, corpoAltura, true);

	// 2. Desenha a ponta triangular
	ctx.fillStyle = corPonta;
	
	// Se esquentarPonta está ativo, aplica efeito piscante
	if (rocket.esquentarPonta) {
		const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
		const pulseIntensity = 0.5 + 0.5 * Math.sin((now / 1000) * 1.5); // pisca lentamente
		
		// Interpola entre vermelho padrão e vermelho mais brilhante
		const baseRed = isDarkMode ? 220 : 239; // cor base (#dc2626 = 220,38,38 | #ef4444 = 239,68,68)
		const baseGreen = isDarkMode ? 38 : 68;
		const baseBlue = isDarkMode ? 38 : 68;
		
		// Adiciona brilho (aumenta todos os componentes proporcionalmente)
		const brightnessFactor = 1 + pulseIntensity * 1.0; // varia de 1.0 a 2.0 (mais brilho)
		const brightRed = Math.min(255, Math.floor(baseRed * brightnessFactor));
		const brightGreen = Math.min(255, Math.floor(baseGreen * brightnessFactor));
		const brightBlue = Math.min(255, Math.floor(baseBlue * brightnessFactor));
		
		const heatColor = `rgb(${brightRed}, ${brightGreen}, ${brightBlue})`;
		ctx.fillStyle = heatColor;
	}
	
	ctx.beginPath();
	ctx.moveTo(0, -corpoAltura - pontaAltura); // Ponta do triângulo
	ctx.lineTo(-corpoLargura/2, -corpoAltura); // Canto esquerdo da base
	ctx.lineTo(corpoLargura/2, -corpoAltura); // Canto direito da base
	ctx.closePath();
	ctx.fill();

	// 3. Desenha as abas triangulares na parte inferior
	ctx.fillStyle = corAbas;

	// Aba esquerda
	ctx.beginPath();
	ctx.moveTo(-corpoLargura/2, 0); // Base da aba (canto esquerdo do corpo)
	ctx.lineTo(-corpoLargura/2 - abaLargura, 0); // Ponto externo da aba
	ctx.lineTo(-corpoLargura/2, -abaAltura); // Ponto superior da aba
	ctx.closePath();
	ctx.fill();

	// Aba direita
	ctx.beginPath();
	ctx.moveTo(corpoLargura/2, 0); // Base da aba (canto direito do corpo)
	ctx.lineTo(corpoLargura/2 + abaLargura, 0); // Ponto externo da aba
	ctx.lineTo(corpoLargura/2, -abaAltura); // Ponto superior da aba
	ctx.closePath();
	ctx.fill();

	// 4. Adiciona detalhes decorativos no corpo do foguete
	ctx.fillStyle = corDetalhes1;

	// Janela circular do foguete
	const janelaRaio = Math.max(r.size(2), corpoLargura * 0.31);
	const janelaY = -corpoAltura * 0.7;
	r.circle(ctx, 0, janelaY, janelaRaio, true);

	// Listras decorativas
	ctx.fillStyle = corDetalhes2;
	const listraAltura = Math.max(r.size(1), corpoAltura * 0.046);
	for (let i = 0; i < 3; i++) {
		const listraY = -corpoAltura * 0.3 - i * Math.max(r.size(3), corpoAltura * 0.116);
		r.rect(ctx, -corpoLargura/2 + Math.max(r.size(1), corpoLargura * 0.125), listraY, 
		       corpoLargura - Math.max(r.size(2), corpoLargura * 0.25), listraAltura, true);
	}

	ctx.restore();

	// Efeitos adicionais (desenhar fora da rotação)
	
	// Ignição na base
	if (rocket.ignicaoBase) {
		drawRocketIgnition(ctx, rocket, r);
	}

	// Indicador de ângulo
	if (rocket.showAngleIndicator) {
		drawAngleIndicator(ctx, rocket, r, isDarkMode);
	}

	// Vetores da ponta
	drawRocketVectors(ctx, rocket, r, isDarkMode);
}

/**
 * Desenha os vetores saindo da ponta do foguete
 */
function drawRocketVectors(ctx: CanvasRenderingContext2D, rocket: RocketState, r: CanvasResponsive, isDarkMode: boolean) {
	const tipPosition = getRocketTipPosition(rocket, r);
	
	for (let i = 0; i < rocket.vectors.length; i++) {
		const vector = rocket.vectors[i];
		if (!vector.enabled) continue;
		
		const vectorColor = resolveColor(vector.style, isDarkMode, '#3b82f6');
		const vectorLength = r.size(vector.length);
		
		// Calcular o ângulo absoluto do vetor
		// rocket.angleDeg é o ângulo do foguete, vector.angleDegRelative é relativo à ponta
		const absoluteAngle = rocket.angleDeg + vector.angleDegRelative;
		const angleRad = (absoluteAngle * Math.PI) / 180;
		
		// Calcular a posição final do vetor
		const endX = tipPosition.x + vectorLength * Math.cos(angleRad);
		const endY = tipPosition.y - vectorLength * Math.sin(angleRad); // negativo pois Y cresce para baixo no canvas
		
		ctx.save();
		
		// Desenhar a linha do vetor
		ctx.strokeStyle = vectorColor;
		ctx.lineWidth = r.size(2);
		ctx.beginPath();
		ctx.moveTo(tipPosition.x, tipPosition.y);
		ctx.lineTo(endX, endY);
		ctx.stroke();
		
		// Desenhar a seta na ponta do vetor
		drawArrowHead(ctx, tipPosition.x, tipPosition.y, endX, endY, r.size(8), vectorColor);
		
		// Desenhar o label se existir
		if (vector.label) {
			const labelOffset = r.size(18);
			const labelX = endX + labelOffset * Math.cos(angleRad);
			const labelY = endY - labelOffset * Math.sin(angleRad);
			
			// Usar tamanho da fonte configurado ou padrão (16)
			const fontSize = vector.labelFontSize || 16;
			ctx.font = `${r.fontSize(fontSize)}px Arial`;
			ctx.fillStyle = vectorColor;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText(vector.label, labelX, labelY);
		}
		
		ctx.restore();
	}
}

/**
 * Desenha uma seta na ponta do vetor
 */
function drawArrowHead(ctx: CanvasRenderingContext2D, startX: number, startY: number, endX: number, endY: number, size: number, color: string) {
	const angle = Math.atan2(endY - startY, endX - startX);
	const arrowAngle = Math.PI / 6; // 30 graus para as "asas" da seta
	
	ctx.fillStyle = color;
	ctx.beginPath();
	
	// Ponta da seta
	ctx.moveTo(endX, endY);
	
	// Asa esquerda
	ctx.lineTo(
		endX - size * Math.cos(angle - arrowAngle),
		endY - size * Math.sin(angle - arrowAngle)
	);
	
	// Asa direita
	ctx.lineTo(
		endX - size * Math.cos(angle + arrowAngle),
		endY - size * Math.sin(angle + arrowAngle)
	);
	
	ctx.closePath();
	ctx.fill();
}

/**
 * Desenha o efeito de ignição na base do foguete (fogo minimalista com 5 chamas alternadas)
 */
function drawRocketIgnition(ctx: CanvasRenderingContext2D, rocket: RocketState, r: CanvasResponsive) {
	const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
	const t = now / 1000;

	const rot = (90 - rocket.angleDeg) * (Math.PI / 180);
	const corpoLargura = Math.max(2, r.size(rocket.widthRef * 0.45));
	
	// Fogo bem pequeno e próximo da base
	const baseFlameHeight = r.size(8);
	const flameWidth = corpoLargura * 0.6;
	const sideOffset = corpoLargura * 0.25; // distância das chamas laterais
	const middleOffset = corpoLargura * 0.125; // posição das chamas intermediárias

	ctx.save();
	ctx.translate(rocket.baseX, rocket.baseY);
	ctx.rotate(rot);

	// Desenha as fumacinhas primeiro (atrás das chamas)
	drawSmokeTrail(ctx, r, t, baseFlameHeight, corpoLargura);

	// Chama central
	const centerHeight = baseFlameHeight + r.size(2) * Math.sin(t * 12);
	drawSingleFlame(ctx, 0, flameWidth, centerHeight);

	// Chama esquerda (alternada com offset de fase)
	const leftHeight = baseFlameHeight + r.size(2) * Math.sin(t * 12 + Math.PI * 0.8);
	drawSingleFlame(ctx, -sideOffset, flameWidth * 0.8, leftHeight);

	// Chama direita (alternada com offset diferente)
	const rightHeight = baseFlameHeight + r.size(2) * Math.sin(t * 12 + Math.PI * 1.6);
	drawSingleFlame(ctx, sideOffset, flameWidth * 0.8, rightHeight);

	// Chama meio-esquerda (entre esquerda e centro, mais alta)
	const midLeftHeight = baseFlameHeight * 1.2 + r.size(2) * Math.sin(t * 12 + Math.PI * 0.4);
	drawSingleFlame(ctx, -middleOffset, flameWidth * 0.7, midLeftHeight);

	// Chama meio-direita (entre centro e direita, mais alta)
	const midRightHeight = baseFlameHeight * 1.2 + r.size(2) * Math.sin(t * 12 + Math.PI * 1.2);
	drawSingleFlame(ctx, middleOffset, flameWidth * 0.7, midRightHeight);

	ctx.restore();
}

/**
 * Desenha uma única chama nas coordenadas especificadas
 */
function drawSingleFlame(ctx: CanvasRenderingContext2D, offsetX: number, width: number, height: number) {
	// Chama vermelha (externa)
	ctx.fillStyle = '#dc2626';
	ctx.beginPath();
	ctx.moveTo(offsetX - width * 0.3, 0);
	ctx.lineTo(offsetX + width * 0.3, 0);
	ctx.lineTo(offsetX, height);
	ctx.closePath();
	ctx.fill();

	// Chama laranja (menor)
	ctx.fillStyle = '#ea580c';
	ctx.beginPath();
	ctx.moveTo(offsetX - width * 0.2, 0);
	ctx.lineTo(offsetX + width * 0.2, 0);
	ctx.lineTo(offsetX, height * 0.8);
	ctx.closePath();
	ctx.fill();

	// Núcleo amarelo (bem pequeno)
	ctx.fillStyle = '#fbbf24';
	ctx.beginPath();
	ctx.moveTo(offsetX - width * 0.1, 0);
	ctx.lineTo(offsetX + width * 0.1, 0);
	ctx.lineTo(offsetX, height * 0.6);
	ctx.closePath();
	ctx.fill();
}

/**
 * Desenha o rastro de fumacinhas que surge das chamas e se afasta diminuindo
 */
function drawSmokeTrail(ctx: CanvasRenderingContext2D, r: CanvasResponsive, t: number, baseFlameHeight: number, corpoLargura: number) {
	// Configurações da fumaça
	const smokeCount = 8; // número de partículas de fumaça
	const maxDistance = r.size(20); // distância máxima que a fumaça percorre
	const smokeCycleTime = 1.5; // tempo em segundos para um ciclo completo
	const baseRadius = r.size(1.5); // raio base das partículas de fumaça
	
	// Cores da fumaça (cinza escuro para cinza claro transparente)
	const smokeColors = [
		'rgba(60, 60, 60, 0.8)', // mais escura e opaca
		'rgba(90, 90, 90, 0.6)',
		'rgba(120, 120, 120, 0.4)',
		'rgba(150, 150, 150, 0.2)', // mais clara e transparente
	];

	for (let i = 0; i < smokeCount; i++) {
		// Calcular o progresso do ciclo para cada partícula (0 a 1)
		const particleOffset = (i / smokeCount) * smokeCycleTime;
		const cycleProgress = ((t + particleOffset) % smokeCycleTime) / smokeCycleTime;
		
		// Se a partícula ainda não "nasceu", pula para a próxima
		if (cycleProgress < 0.1) continue;
		
		// Posição X aleatória mas consistente baseada no índice
		const xVariation = (Math.sin(i * 2.5) * 0.5 + Math.cos(i * 1.8) * 0.3) * corpoLargura * 0.3;
		const smokeX = xVariation;
		
		// Posição Y: começa dentro da chama e vai subindo
		const startY = baseFlameHeight * 0.3; // começa dentro da chama
		const smokeY = startY + cycleProgress * maxDistance;
		
		// Tamanho: começa pequeno, cresce um pouco, depois diminui
		let sizeMultiplier;
		if (cycleProgress < 0.3) {
			sizeMultiplier = cycleProgress / 0.3; // cresce de 0 a 1
		} else {
			sizeMultiplier = 1 - ((cycleProgress - 0.3) / 0.7); // diminui de 1 a 0
		}
		const smokeRadius = baseRadius * sizeMultiplier;
		
		// Cor baseada no progresso (escura no início, clara no final)
		const colorIndex = Math.min(smokeColors.length - 1, Math.floor(cycleProgress * smokeColors.length));
		const smokeColor = smokeColors[colorIndex];
		
		// Movimento lateral sutil (deriva)
		const drift = Math.sin(t * 2 + i) * r.size(2) * cycleProgress;
		
		// Desenha a partícula de fumaça
		if (smokeRadius > 0.5) {
			ctx.save();
			ctx.globalAlpha = 1 - cycleProgress; // fica mais transparente conforme se afasta
			ctx.fillStyle = smokeColor;
			ctx.beginPath();
			ctx.arc(smokeX + drift, smokeY, smokeRadius, 0, Math.PI * 2);
			ctx.fill();
			ctx.restore();
		}
	}
}

/**
 * Desenha o indicador de ângulo em relação à base do foguete
 */
function drawAngleIndicator(ctx: CanvasRenderingContext2D, rocket: RocketState, r: CanvasResponsive, isDarkMode: boolean) {
	const radius = r.size(40);
	const baseX = rocket.baseX;
	const baseY = rocket.baseY;
	
	// Usar cor customizada se definida, senão usar a padrão
	const defaultIndicatorStyle = { 
		lightColor: '#f59e0b', 
		darkColor: '#fbbf24' 
	};
	const style = rocket.angleIndicatorStyle || defaultIndicatorStyle;
	const corIndicador = resolveColor(style, isDarkMode, isDarkMode ? '#fbbf24' : '#f59e0b');

	// Ângulo inicial: horizontal (0 radianos)
	const startAngle = 0;
	// Ângulo final: ângulo do foguete convertido para radianos, mas invertendo Y para canvas
	const endAngle = (-rocket.angleDeg * Math.PI) / 180; // negativo para corrigir orientação

	ctx.save();
	
	// Desenha o preenchimento do arco com transparência
	ctx.globalAlpha = 0.3;
	ctx.beginPath();
	ctx.fillStyle = corIndicador;
	ctx.arc(baseX, baseY, radius, startAngle, endAngle, endAngle < 0); // clockwise se negativo
	ctx.lineTo(baseX, baseY);
	ctx.closePath();
	ctx.fill();
	
	ctx.globalAlpha = 1;
	
	// Desenha a borda do arco
	ctx.beginPath();
	ctx.strokeStyle = corIndicador;
	ctx.lineWidth = r.size(2);
	ctx.arc(baseX, baseY, radius, startAngle, endAngle, endAngle < 0);
	ctx.stroke();
	
	// Linha da base (horizontal)
	ctx.beginPath();
	ctx.moveTo(baseX, baseY);
	ctx.lineTo(baseX + radius, baseY);
	ctx.stroke();
	
	// Linha do ângulo atual - corrigida para canvas Y
	ctx.beginPath();
	ctx.moveTo(baseX, baseY);
	ctx.lineTo(baseX + radius * Math.cos(endAngle), baseY + radius * Math.sin(endAngle)); // + para canvas Y
	ctx.stroke();

	// Texto do ângulo
	const midAngle = (startAngle + endAngle) / 2;
	const textRadius = radius + r.size(15);
	const textX = baseX + textRadius * Math.cos(midAngle);
	const textY = baseY + textRadius * Math.sin(midAngle); // + para canvas Y

	ctx.font = `${r.fontSize(12)}px Arial`;
	ctx.fillStyle = corIndicador;
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText(`${Math.round(rocket.angleDeg)}°`, textX, textY);

	ctx.restore();
}

/**
 * Interface para configurar uma sombra do foguete
 */
export interface RocketShadowOptions {
	x: number; // posição X absoluta da sombra
	y: number; // posição Y absoluta da sombra
	angleDeg?: number; // ângulo da sombra (opcional, usa o ângulo do foguete original se não especificado)
	alpha?: number; // transparência (0-1, padrão 0.3)
	showVectors?: boolean; // se deve mostrar os vetores (padrão false)
	showAngleIndicator?: boolean; // se deve mostrar o indicador de ângulo (padrão false)
	label?: string; // label da sombra exibido acima lateral
	labelColor?: string; // cor do label (padrão baseado no tema)
	labelPosition?: 'auto' | 'left' | 'right' | { x: number; y: number }; // posição do label: auto (baseado no ângulo), left, right, ou coordenadas absolutas
}

/**
 * Desenha uma sombra/carimbo semitransparente do foguete em qualquer posição
 */
export function drawRocketShadow(
	ctx: CanvasRenderingContext2D, 
	rocket: RocketState, 
	r: CanvasResponsive, 
	options: RocketShadowOptions
) {
	// Salva o estado original do foguete
	const originalBaseX = rocket.baseX;
	const originalBaseY = rocket.baseY;
	const originalAngle = rocket.angleDeg;
	const originalIgnicao = rocket.ignicaoBase;
	const originalEsquentar = rocket.esquentarPonta;
	const originalIndicador = rocket.showAngleIndicator;
	
	// Configura temporariamente a posição, ângulo e efeitos da sombra
	rocket.baseX = options.x;
	rocket.baseY = options.y;
	if (options.angleDeg !== undefined) {
		rocket.angleDeg = options.angleDeg;
	}
	
	// Desabilita efeitos especiais para a sombra (a menos que explicitamente habilitados)
	rocket.ignicaoBase = false;
	rocket.esquentarPonta = false;
	rocket.showAngleIndicator = options.showAngleIndicator || false;
	
	// Aplica transparência para efeito de sombra
	const alpha = options.alpha ?? 0.3;
	ctx.save();
	ctx.globalAlpha = alpha;
	
	// 🎯 DRY: Reutiliza a função original drawRocket!
	drawRocket(ctx, rocket, r);
	
	ctx.restore(); // restaura alpha
	
	// Label da sombra (se especificado)
	if (options.label) {
		// SSR-safe tema
		const isDarkMode = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
		
		const labelColor = options.labelColor || (isDarkMode ? '#e5e7eb' : '#374151');
		const labelPosition = options.labelPosition || 'auto';
		
		let labelX: number;
		let labelY: number;
		let textAlign: CanvasTextAlign = 'left';
		
		if (typeof labelPosition === 'object') {
			// Posição manual com coordenadas absolutas
			labelX = labelPosition.x;
			labelY = labelPosition.y;
			textAlign = 'left'; // padrão para posição manual
		} else {
			// Posição automática ou forçada (left/right)
			const shadowAngle = options.angleDeg ?? rocket.angleDeg;
			const normalizedAngle = ((shadowAngle % 360) + 360) % 360;
			
			let labelOnLeft: boolean;
			
			if (labelPosition === 'left') {
				labelOnLeft = true;
			} else if (labelPosition === 'right') {
				labelOnLeft = false;
			} else { // 'auto'
				// Se ângulo entre 0-90 ou 270-360, foguete aponta para direita, então label na ESQUERDA
				// Se ângulo entre 90-270, foguete aponta para esquerda, então label na DIREITA
				labelOnLeft = (normalizedAngle >= 0 && normalizedAngle <= 90) || (normalizedAngle >= 270 && normalizedAngle <= 360);
			}
			
			const labelOffset = r.size(25);
			labelX = labelOnLeft ? rocket.baseX - labelOffset : rocket.baseX + labelOffset;
			labelY = rocket.baseY; // alinhado com a base
			textAlign = labelOnLeft ? 'right' : 'left';
		}
		
		ctx.save();
		ctx.font = `${r.fontSize(11)}px Arial`;
		ctx.fillStyle = labelColor;
		ctx.textAlign = textAlign;
		ctx.textBaseline = 'middle';
		
		// Fundo do label (opcional, para melhor legibilidade)
		const metrics = ctx.measureText(options.label);
		const padding = r.size(4);
		const bgWidth = metrics.width + padding * 2;
		const bgHeight = r.fontSize(11) + padding;
		
		// Ajusta posição do fundo baseado no alinhamento
		let bgX: number;
		if (textAlign === 'right') {
			bgX = labelX - bgWidth + padding;
		} else { // 'left' ou outros
			bgX = labelX - padding;
		}
		
		ctx.fillStyle = isDarkMode ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.8)';
		r.rect(ctx, bgX, labelY - bgHeight/2, bgWidth, bgHeight, true);
		
		ctx.fillStyle = labelColor;
		ctx.fillText(options.label, labelX, labelY);
		ctx.restore();
	}
	
	// Restaura o estado original do foguete
	rocket.baseX = originalBaseX;
	rocket.baseY = originalBaseY;
	rocket.angleDeg = originalAngle;
	rocket.ignicaoBase = originalIgnicao;
	rocket.esquentarPonta = originalEsquentar;
	rocket.showAngleIndicator = originalIndicador;
}

// o módulo não desenha nada por si só — o rocket deve ser criado e passado para drawRocket dinamicamente.
