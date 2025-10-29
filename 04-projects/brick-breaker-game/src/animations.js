// ========================================
// 애니메이션 시스템
// ========================================

import { PARTICLE, ANIMATION } from './constants.js';

// ========================================
// 애니메이션 상태 관리
// ========================================

// 입자 배열
export let particles = [];

// 벽돌 조각 배열
export let brickFragments = [];

// 공 궤적 배열
export let ballTrail = [];

// 점수 팝업 배열
export let scorePopups = [];

// 패들 히트 파동 배열
export let paddleHitWaves = [];

// 패들 애니메이션 상태
export let paddleAnimation = null;

// 생명력 애니메이션 상태
export let lifeAnimation = null;

// UI 팝업 애니메이션 상태
export let uiPopupAnimation = null;

// 레벨 전환 애니메이션 상태
export let levelTransition = null;

// ========================================
// 입자 시스템
// ========================================

export function createParticles(x, y, color) {
    for (let i = 0; i < PARTICLE.COUNT; i++) {
        const angle = (Math.PI * 2 * i) / PARTICLE.COUNT + (Math.random() - 0.5) * 0.5;
        const speed = PARTICLE.SPEED * (0.5 + Math.random() * 0.5);

        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: PARTICLE.SIZE * (0.5 + Math.random() * 0.5),
            color: color,
            life: PARTICLE.LIFETIME,
            maxLife: PARTICLE.LIFETIME
        });
    }
}

export function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += PARTICLE.GRAVITY;
        p.life--;

        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

export function drawParticles(ctx) {
    particles.forEach(p => {
        const alpha = p.life / p.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        ctx.restore();
    });
}

// ========================================
// 벽돌 조각 애니메이션
// ========================================

export function createBrickFragments(x, y, width, height, color) {
    const centerX = x + width / 2;
    const centerY = y + height / 2;

    for (let i = 0; i < ANIMATION.BRICK_DESTROY.FRAGMENT_COUNT; i++) {
        const angle = (Math.PI * 2 * i) / ANIMATION.BRICK_DESTROY.FRAGMENT_COUNT + (Math.random() - 0.5);
        const speed = ANIMATION.BRICK_DESTROY.SPREAD_SPEED * (0.7 + Math.random() * 0.6);

        brickFragments.push({
            x: centerX,
            y: centerY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 2,
            size: ANIMATION.BRICK_DESTROY.FRAGMENT_SIZE,
            color: color,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * ANIMATION.BRICK_DESTROY.ROTATION_SPEED,
            life: ANIMATION.BRICK_DESTROY.LIFETIME,
            maxLife: ANIMATION.BRICK_DESTROY.LIFETIME
        });
    }
}

export function updateBrickFragments() {
    for (let i = brickFragments.length - 1; i >= 0; i--) {
        const f = brickFragments[i];
        f.x += f.vx;
        f.y += f.vy;
        f.vy += PARTICLE.GRAVITY;
        f.rotation += f.rotationSpeed;
        f.life--;

        if (f.life <= 0) {
            brickFragments.splice(i, 1);
        }
    }
}

export function drawBrickFragments(ctx) {
    brickFragments.forEach(f => {
        const alpha = f.life / f.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(f.x, f.y);
        ctx.rotate(f.rotation);
        ctx.fillStyle = f.color;
        ctx.fillRect(-f.size / 2, -f.size / 2, f.size, f.size);
        ctx.restore();
    });
}

// ========================================
// 공 궤적 애니메이션
// ========================================

export function updateBallTrail(ballX, ballY) {
    ballTrail.push({
        x: ballX,
        y: ballY,
        alpha: 1.0
    });

    if (ballTrail.length > ANIMATION.BALL_TRAIL.MAX_LENGTH) {
        ballTrail.shift();
    }

    ballTrail.forEach(t => {
        t.alpha -= ANIMATION.BALL_TRAIL.FADE_SPEED;
    });

    for (let i = ballTrail.length - 1; i >= 0; i--) {
        if (ballTrail[i].alpha <= 0) {
            ballTrail.splice(i, 1);
        }
    }
}

export function drawBallTrail(ctx, ballRadius, ballColor) {
    ballTrail.forEach(t => {
        ctx.save();
        ctx.globalAlpha = t.alpha * 0.3;
        ctx.fillStyle = ballColor;
        ctx.beginPath();
        ctx.arc(t.x, t.y, ballRadius * 0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });
}

// ========================================
// 점수 팝업 애니메이션
// ========================================

export function createScorePopup(x, y, score) {
    scorePopups.push({
        x: x,
        y: y,
        score: score,
        life: ANIMATION.SCORE_POPUP.LIFETIME,
        maxLife: ANIMATION.SCORE_POPUP.LIFETIME
    });
}

export function updateScorePopups() {
    for (let i = scorePopups.length - 1; i >= 0; i--) {
        const popup = scorePopups[i];
        popup.y -= ANIMATION.SCORE_POPUP.FLOAT_SPEED;
        popup.life--;

        if (popup.life <= 0) {
            scorePopups.splice(i, 1);
        }
    }
}

export function drawScorePopups(ctx) {
    scorePopups.forEach(popup => {
        const alpha = popup.life / popup.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#FFD700';
        ctx.font = `bold ${ANIMATION.SCORE_POPUP.FONT_SIZE}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(`+${popup.score}`, popup.x, popup.y);
        ctx.restore();
    });
}

// ========================================
// 패들 충돌 파동 애니메이션
// ========================================

export function createPaddleHitWave(x, y) {
    for (let i = 0; i < ANIMATION.PADDLE_HIT.WAVE_COUNT; i++) {
        paddleHitWaves.push({
            x: x,
            y: y,
            radius: 0,
            maxRadius: ANIMATION.PADDLE_HIT.MAX_RADIUS,
            life: ANIMATION.PADDLE_HIT.LIFETIME,
            maxLife: ANIMATION.PADDLE_HIT.LIFETIME,
            delay: i * 3
        });
    }
}

export function updatePaddleHitWaves() {
    for (let i = paddleHitWaves.length - 1; i >= 0; i--) {
        const wave = paddleHitWaves[i];

        if (wave.delay > 0) {
            wave.delay--;
            continue;
        }

        wave.radius += ANIMATION.PADDLE_HIT.WAVE_SPEED;
        wave.life--;

        if (wave.life <= 0) {
            paddleHitWaves.splice(i, 1);
        }
    }
}

export function drawPaddleHitWaves(ctx) {
    paddleHitWaves.forEach(wave => {
        if (wave.delay > 0) return;

        const alpha = wave.life / wave.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha * 0.5;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    });
}

// ========================================
// 애니메이션 초기화
// ========================================

export function resetAnimations() {
    particles.length = 0;
    brickFragments.length = 0;
    ballTrail.length = 0;
    scorePopups.length = 0;
    paddleHitWaves.length = 0;
    paddleAnimation = null;
    lifeAnimation = null;
    uiPopupAnimation = null;
    levelTransition = null;
}
