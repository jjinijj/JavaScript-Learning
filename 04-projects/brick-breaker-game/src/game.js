// ========================================
// Import modules
// ========================================
import {
    CANVAS,
    COLORS,
    BALL,
    PADDLE,
    BRICK,
    GAME,
    ITEM,
    ITEM_TYPES,
    PARTICLE,
    ANIMATION,
    DIFFICULTY_SETTINGS
} from './constants.js';

import {
    initAudio,
    playClickSound,
    playBrickBreakSound,
    playPaddleHitSound,
    playWallHitSound,
    playLifeLostSound,
    playGameOverSound,
    playWinSound,
    stopBGM,
    playMenuBGM,
    playGameBGM,
    toggleMute,
    getMuted,
    setMuted,
    setBGMVolume,
    setSFXVolume,
    getVolume,
    loadVolume
} from './audio.js';

import {
    t,
    setLanguage,
    getCurrentLanguage
} from './i18n.js';

import {
    setTheme,
    getCurrentTheme
} from './theme.js';

import {
    loadStats,
    updateStats,
    getStats
} from './stats.js';

// ========================================
// 1단계: 캔버스 설정 및 기본 구조
// ========================================

// 캔버스 관련 변수
let canvas;
let ctx;

// 공 관련 변수
let ballX;
let ballY;
let ballSpeedX;
let ballSpeedY;

// 패들 관련 변수
let paddleX;
let rightPressed = false;
let leftPressed = false;

// 벽돌 관련 변수
let bricks = [];

// 아이템 배열
let items = [];

// 입자 배열
let particles = [];

// 애니메이션 배열
let brickFragments = [];        // 벽돌 조각
let ballTrail = [];             // 공 트레일
let scorePopups = [];           // 점수 팝업
let paddleHitWaves = [];        // 패들 히트 파동
let paddleAnimation = null;     // 패들 애니메이션
let lifeAnimation = null;       // 생명력 애니메이션
let uiPopupAnimation = null;    // UI 팝업 애니메이션
let levelTransition = null;     // 레벨 전환 애니메이션

// 활성화된 효과들
let activeEffects = {
    paddleExpanded: false,
    ballSlow: false,
    paddleShrink: false
};

// 효과 타이머 ID 저장
let effectTimers = {
    paddleExpanded: null,
    ballSlow: null,
    paddleShrink: null
};

// ========================================
// 6단계: 점수 및 생명 시스템
// ========================================
let score = 0;
let lives = 3;
let ballLaunched = false; // 공 발사 여부

// ========================================
// 7단계: 게임 상태 관리
// ========================================
let gameRunning = false;  // 게임 진행 중
let gamePaused = false;   // 일시정지

// ========================================
// 8단계: 난이도 및 통계 시스템
// ========================================
let difficulty = 'normal'; // 난이도

// DOM 요소 캐싱
const UI = {};

// ========================================
// 사운드 시스템 함수
// ========================================

// AudioContext 초기화 (저지연 모드)
// ========================================
// 아이템 시스템 함수
// ========================================

// 아이템 생성
function createItem(x, y) {
    // 랜덤하게 아이템 타입 선택
    const typeKeys = Object.keys(ITEM_TYPES);
    const randomType = ITEM_TYPES[typeKeys[Math.floor(Math.random() * typeKeys.length)]];

    items.push({
        x: x,
        y: y,
        type: randomType,
        width: ITEM.SIZE,
        height: ITEM.SIZE
    });

    console.log('🎁 아이템 생성:', randomType.emoji, 'at', x, y);
}

// 아이템 업데이트 (이동)
function updateItems() {
    for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];

        // 아이템 낙하
        item.y += ITEM.SPEED;

        // 화면 밖으로 나가면 제거
        if (item.y > CANVAS.HEIGHT) {
            items.splice(i, 1);
            continue;
        }

        // 패들과 충돌 검사
        const paddleWidth = getPaddleWidth();
        const paddleY = CANVAS.HEIGHT - PADDLE.HEIGHT - 10;

        if (checkRectCollision(
            item.x, item.y, item.width, item.height,
            paddleX, paddleY, paddleWidth, PADDLE.HEIGHT
        )) {
            // 아이템 효과 적용
            applyItemEffect(item.type);
            items.splice(i, 1);
        }
    }
}

// 사각형-사각형 충돌 검사
function checkRectCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 < x2 + w2 &&
           x1 + w1 > x2 &&
           y1 < y2 + h2 &&
           y1 + h1 > y2;
}

// 아이템 효과 적용
function applyItemEffect(itemType) {
    console.log('✨ 아이템 획득:', itemType.emoji);

    switch (itemType.id) {
        case 'paddle_expand':
            // 현재 실제 패들 너비 저장 (애니메이션 적용 전)
            const currentWidthBeforeExpand = getAnimatedPaddleWidth();

            // 패들 축소 효과가 활성화되어 있으면 취소
            if (activeEffects.paddleShrink) {
                deactivateEffect('paddleShrink');
            }
            activateEffect('paddleExpanded', itemType.duration, currentWidthBeforeExpand);
            break;

        case 'ball_slow':
            activateEffect('ballSlow', itemType.duration);
            // 현재 공 속도 감소
            ballSpeedX *= 0.7;
            ballSpeedY *= 0.7;
            break;

        case 'extra_life':
            if (lives < GAME.MAX_LIVES) {
                lives++;
                updateDisplay();
                startLifeAnimation(true);  // 생명 획득 애니메이션
                console.log('❤️ 생명 +1');
            } else {
                console.log('❤️ 생명이 이미 최대입니다 (최대 ' + GAME.MAX_LIVES + '개)');
            }
            break;

        case 'paddle_shrink':
            // 현재 실제 패들 너비 저장 (애니메이션 적용 전)
            const currentWidthBeforeShrink = getAnimatedPaddleWidth();

            // 패들 확대 효과가 활성화되어 있으면 취소
            if (activeEffects.paddleExpanded) {
                deactivateEffect('paddleExpanded');
            }
            activateEffect('paddleShrink', itemType.duration, currentWidthBeforeShrink);
            break;
    }
}

// 공 속도 복원
function restoreBallSpeed() {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    const speed = Math.sqrt(ballSpeedX * ballSpeedX + ballSpeedY * ballSpeedY);
    const normalSpeed = settings.ballSpeed;
    ballSpeedX = (ballSpeedX / speed) * normalSpeed;
    ballSpeedY = (ballSpeedY / speed) * normalSpeed;
}

// 효과 비활성화
function deactivateEffect(effectName) {
    // 타이머 취소
    if (effectTimers[effectName]) {
        clearTimeout(effectTimers[effectName]);
        effectTimers[effectName] = null;
    }

    // 효과 플래그 false
    activeEffects[effectName] = false;

    // 공 속도 복원 (ballSlow인 경우)
    if (effectName === 'ballSlow') {
        restoreBallSpeed();
    }

    console.log(`⏰ ${effectName} 비활성화됨`);
}

// 효과 활성화
function activateEffect(effectName, duration, currentWidth = null) {
    // 패들 크기 변경 효과인 경우 애니메이션 시작
    const isPaddleEffect = (effectName === 'paddleExpanded' || effectName === 'paddleShrink');

    // 현재 너비: 전달받은 값이 있으면 사용, 없으면 현재 애니메이션 적용된 너비
    const oldWidth = isPaddleEffect ? (currentWidth !== null ? currentWidth : getAnimatedPaddleWidth()) : 0;

    // 이미 활성화된 효과는 타이머만 갱신
    if (effectTimers[effectName]) {
        clearTimeout(effectTimers[effectName]);
    }

    activeEffects[effectName] = true;
    console.log(`⏰ ${effectName} 활성화 (${duration}ms)`);

    // 패들 크기 변경 애니메이션 시작
    if (isPaddleEffect) {
        const newWidth = getPaddleWidth();  // 효과 적용 후 목표 너비
        startPaddleResizeAnimation(oldWidth, newWidth);
    }

    // duration 후 효과 제거
    if (duration) {
        effectTimers[effectName] = setTimeout(() => {
            // 패들 크기 복원 애니메이션
            if (isPaddleEffect) {
                const beforeWidth = getAnimatedPaddleWidth();  // 현재 애니메이션 적용된 너비
                activeEffects[effectName] = false;
                const afterWidth = getPaddleWidth();  // 효과 해제 후 목표 너비
                startPaddleResizeAnimation(beforeWidth, afterWidth);
            } else {
                activeEffects[effectName] = false;
            }

            effectTimers[effectName] = null;

            // 공 속도 복원 (ballSlow인 경우)
            if (effectName === 'ballSlow') {
                restoreBallSpeed();
            }

            console.log(`⏰ ${effectName} 종료`);
        }, duration);
    }
}

// 현재 패들 너비 계산 (효과 반영)
function getPaddleWidth() {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    let width = settings.paddleWidth;

    if (activeEffects.paddleExpanded) {
        width *= 1.5;
    }
    if (activeEffects.paddleShrink) {
        width *= 0.7;
    }

    return width;
}

// ========================================
// 입자 효과 함수
// ========================================

// 입자 생성 (벽돌 파괴 시)
function createParticles(x, y, color) {
    for (let i = 0; i < PARTICLE.COUNT; i++) {
        // 랜덤한 방향으로 튀어나가는 속도
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

// 입자 업데이트
function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // 위치 업데이트
        p.x += p.vx;
        p.y += p.vy;

        // 중력 적용
        p.vy += PARTICLE.GRAVITY;

        // 생명 감소
        p.life--;

        // 수명이 다한 입자 제거
        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

// 입자 그리기
function drawParticles() {
    particles.forEach(p => {
        const alpha = p.life / p.maxLife; // 투명도 (점점 투명해짐)

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        ctx.restore();
    });
}

// ========================================
// 애니메이션 함수 - 1. 벽돌 파괴 (조각 흩어지기)
// ========================================

// 벽돌 조각 생성
function createBrickFragments(x, y, width, height, color) {
    const centerX = x + width / 2;
    const centerY = y + height / 2;

    for (let i = 0; i < ANIMATION.BRICK_DESTROY.FRAGMENT_COUNT; i++) {
        // 각도를 균등하게 분배하고 약간의 랜덤 추가
        const angle = (Math.PI * 2 * i) / ANIMATION.BRICK_DESTROY.FRAGMENT_COUNT + (Math.random() - 0.5);
        const speed = ANIMATION.BRICK_DESTROY.SPREAD_SPEED * (0.7 + Math.random() * 0.6);

        brickFragments.push({
            x: centerX,
            y: centerY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 2, // 위쪽으로 튀어나감
            size: ANIMATION.BRICK_DESTROY.FRAGMENT_SIZE,
            color: color,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * ANIMATION.BRICK_DESTROY.ROTATION_SPEED,
            life: ANIMATION.BRICK_DESTROY.LIFETIME,
            maxLife: ANIMATION.BRICK_DESTROY.LIFETIME
        });
    }
}

// 벽돌 조각 업데이트
function updateBrickFragments() {
    for (let i = brickFragments.length - 1; i >= 0; i--) {
        const f = brickFragments[i];

        // 위치 업데이트
        f.x += f.vx;
        f.y += f.vy;

        // 중력 적용
        f.vy += PARTICLE.GRAVITY;

        // 회전
        f.rotation += f.rotationSpeed;

        // 생명 감소
        f.life--;

        // 수명이 다한 조각 제거
        if (f.life <= 0) {
            brickFragments.splice(i, 1);
        }
    }
}

// 벽돌 조각 그리기
function drawBrickFragments() {
    brickFragments.forEach(f => {
        const alpha = f.life / f.maxLife; // 투명도 (점점 투명해짐)

        ctx.save();                           // 현재 상태 저장
        ctx.globalAlpha = alpha;              // 투명도 설정
        ctx.translate(f.x, f.y);             // 조각 위치로 이동
        ctx.rotate(f.rotation);              // 조각 회전
        ctx.fillStyle = f.color;             // 조각 색상
        ctx.fillRect(-f.size / 2, -f.size / 2, f.size, f.size); // 중심 기준 그리기
        ctx.restore();                        // 원래 상태로 복구
    });
}

// ========================================
// 애니메이션 함수 - 2. 공 트레일 효과
// ========================================

// 공 트레일 업데이트
function updateBallTrail() {
    // 공이 발사되지 않았으면 트레일 생성 안 함
    if (!ballLaunched) {
        ballTrail = [];
        return;
    }

    // 현재 공 위치 추가
    ballTrail.push({
        x: ballX,
        y: ballY,
        life: 1.0
    });

    // 최대 길이 유지
    if (ballTrail.length > ANIMATION.BALL_TRAIL.MAX_LENGTH) {
        ballTrail.shift(); // 맨 앞 제거
    }

    // 트레일 페이드 아웃
    ballTrail.forEach(t => {
        t.life -= ANIMATION.BALL_TRAIL.FADE_SPEED;
    });

    // 투명도가 0 이하인 트레일 제거
    ballTrail = ballTrail.filter(t => t.life > 0);
}

// 공 트레일 그리기
function drawBallTrail() {
    ballTrail.forEach(t => {
        ctx.save();
        ctx.globalAlpha = t.life * 0.5; // 반투명 (0.5 곱해서 더 투명하게)
        ctx.fillStyle = COLORS.BALL;
        ctx.beginPath();
        // 크기도 점점 작아지게
        ctx.arc(t.x, t.y, BALL.RADIUS * t.life * 0.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });
}

// ========================================
// 애니메이션 함수 - 3. 파워업 아이템 애니메이션 (회전/반짝임)
// ========================================

// 아이템 애니메이션 업데이트
function updateItemAnimations() {
    const currentTime = Date.now();

    items.forEach(item => {
        // 회전 애니메이션 (시간에 따라 회전)
        if (!item.rotation) item.rotation = 0;
        item.rotation += 0.05; // 회전 속도

        // 반짝임 애니메이션 (사인파로 크기 변화)
        if (!item.spawnTime) item.spawnTime = currentTime;
        const elapsed = (currentTime - item.spawnTime) / 1000; // 초 단위
        item.pulseScale = 1 + Math.sin(elapsed * 4) * 0.15; // 0.85 ~ 1.15 크기 변화

        // 발광 효과 (사인파로 투명도 변화)
        item.glowAlpha = 0.3 + Math.sin(elapsed * 3) * 0.3; // 0 ~ 0.6
    });
}

// 아이템 그리기 (애니메이션 적용)
function drawAnimatedItems() {
    items.forEach(item => {
        const centerX = item.x + item.width / 2;
        const centerY = item.y + item.height / 2;
        const scale = item.pulseScale || 1;

        ctx.save();
        ctx.translate(centerX, centerY);

        // 발광 효과 (외곽선)
        if (item.glowAlpha) {
            ctx.globalAlpha = item.glowAlpha;
            ctx.fillStyle = item.type.color;
            const glowSize = (item.width * scale) * 1.3;
            ctx.fillRect(-glowSize / 2, -glowSize / 2, glowSize, glowSize);
        }

        // 회전 적용
        ctx.rotate(item.rotation || 0);

        // 크기 변화 적용
        ctx.scale(scale, scale);

        // 아이템 배경
        ctx.globalAlpha = 1;
        ctx.fillStyle = item.type.color;
        ctx.fillRect(-item.width / 2, -item.height / 2, item.width, item.height);

        // 테두리 (반짝임 효과)
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.globalAlpha = item.glowAlpha || 0.5;
        ctx.strokeRect(-item.width / 2, -item.height / 2, item.width, item.height);

        // 이모지 (회전 취소하고 그리기)
        ctx.rotate(-(item.rotation || 0));
        ctx.globalAlpha = 1;
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.type.emoji, 0, 0);

        ctx.restore();
    });
}

// ========================================
// 애니메이션 함수 - 4. 점수 팝업 애니메이션
// ========================================

// 점수 팝업 생성
function createScorePopup(x, y, score) {
    scorePopups.push({
        x: x,
        y: y,
        score: score,
        life: ANIMATION.SCORE_POPUP.LIFETIME,
        maxLife: ANIMATION.SCORE_POPUP.LIFETIME
    });
}

// 점수 팝업 업데이트
function updateScorePopups() {
    for (let i = scorePopups.length - 1; i >= 0; i--) {
        const popup = scorePopups[i];

        // 위로 떠오름
        popup.y -= ANIMATION.SCORE_POPUP.FLOAT_SPEED;

        // 생명 감소
        popup.life--;

        // 수명이 다한 팝업 제거
        if (popup.life <= 0) {
            scorePopups.splice(i, 1);
        }
    }
}

// 점수 팝업 그리기
function drawScorePopups() {
    scorePopups.forEach(popup => {
        const alpha = popup.life / popup.maxLife; // 투명도 (점점 투명해짐)
        const progress = 1 - alpha; // 0(시작) ~ 1(끝)
        const scale = 1 + progress * 0.5; // 점점 커짐 (1.0 ~ 1.5)

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#ffd700'; // 금색
        ctx.strokeStyle = '#ffffff'; // 흰색 테두리
        ctx.lineWidth = 2;
        ctx.font = `bold ${ANIMATION.SCORE_POPUP.FONT_SIZE * scale}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // 테두리
        ctx.strokeText(`+${popup.score}`, popup.x, popup.y);
        // 텍스트
        ctx.fillText(`+${popup.score}`, popup.x, popup.y);

        ctx.restore();
    });
}

// ========================================
// 애니메이션 함수 - 5. 패들 히트 효과 (충격파)
// ========================================

// 패들 히트 충격파 생성
function createPaddleHitWave(x, y) {
    // 여러 개의 파동을 시간차를 두고 생성
    for (let i = 0; i < ANIMATION.PADDLE_HIT.WAVE_COUNT; i++) {
        paddleHitWaves.push({
            x: x,
            y: y,
            radius: i * 10, // 시작 반지름 (시간차 효과)
            life: ANIMATION.PADDLE_HIT.LIFETIME - i * 5, // 생명 주기 (시간차)
            maxLife: ANIMATION.PADDLE_HIT.LIFETIME
        });
    }
}

// 패들 히트 충격파 업데이트
function updatePaddleHitWaves() {
    for (let i = paddleHitWaves.length - 1; i >= 0; i--) {
        const wave = paddleHitWaves[i];

        // 반지름 증가 (파동이 퍼짐)
        wave.radius += ANIMATION.PADDLE_HIT.WAVE_SPEED;

        // 생명 감소
        wave.life--;

        // 수명이 다했거나 최대 반지름을 넘으면 제거
        if (wave.life <= 0 || wave.radius > ANIMATION.PADDLE_HIT.MAX_RADIUS) {
            paddleHitWaves.splice(i, 1);
        }
    }
}

// 패들 히트 충격파 그리기
function drawPaddleHitWaves() {
    paddleHitWaves.forEach(wave => {
        const alpha = wave.life / wave.maxLife; // 투명도 (점점 투명해짐)

        ctx.save();
        ctx.globalAlpha = alpha * 0.6; // 반투명
        ctx.strokeStyle = '#ffffff'; // 흰색 파동
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    });
}

// ========================================
// 애니메이션 함수 - 6. 패들 크기 변경 애니메이션
// ========================================

// 이징 함수들
function easeOutElastic(t) {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
}

function easeOutBack(t) {
    const c1 = ANIMATION.EASING.OVERSHOOT_STRENGTH;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

// 패들 크기 변경 애니메이션 시작
function startPaddleResizeAnimation(fromWidth, toWidth) {
    // 패들 중심점 계산 (크기 변경 전)
    const centerX = paddleX + fromWidth / 2;

    paddleAnimation = {
        startWidth: fromWidth,
        targetWidth: toWidth,
        centerX: centerX,  // 중심점 유지
        startTime: Date.now(),
        duration: ANIMATION.PADDLE_RESIZE.DURATION,
        currentScale: 0  // 애니메이션 진행도 (0 시작)
    };

    console.log(`🎬 패들 크기 애니메이션 시작: ${fromWidth.toFixed(1)} → ${toWidth.toFixed(1)} (중심: ${centerX.toFixed(1)})`);
}

// 패들 애니메이션 업데이트
function updatePaddleAnimation() {
    if (!paddleAnimation) return;

    const elapsed = Date.now() - paddleAnimation.startTime;
    const progress = Math.min(elapsed / paddleAnimation.duration, 1);

    // 이징 적용 (easeOutElastic)
    const easedProgress = easeOutElastic(progress);

    // 애니메이션 스케일 계산 (목표까지의 진행도)
    paddleAnimation.currentScale = easedProgress;

    // 현재 패들 너비 계산
    const currentWidth = paddleAnimation.startWidth +
                        (paddleAnimation.targetWidth - paddleAnimation.startWidth) * easedProgress;

    // 중심점을 유지하면서 패들 위치 조정
    paddleX = paddleAnimation.centerX - currentWidth / 2;

    // 애니메이션 완료
    if (progress >= 1) {
        // 최종 위치 보정
        const finalWidth = paddleAnimation.targetWidth;
        paddleX = paddleAnimation.centerX - finalWidth / 2;
        paddleAnimation = null;
        console.log(`✅ 패들 크기 애니메이션 완료 (위치: ${paddleX.toFixed(1)})`);
    }
}

// 애니메이션이 적용된 패들 너비 가져오기
function getAnimatedPaddleWidth() {
    const baseWidth = getPaddleWidth();

    if (!paddleAnimation) {
        return baseWidth;
    }

    // 애니메이션 중: 시작 너비에서 목표 너비로 보간
    const animatedWidth = paddleAnimation.startWidth +
                          (paddleAnimation.targetWidth - paddleAnimation.startWidth) * paddleAnimation.currentScale;

    return animatedWidth;
}

// ========================================
// 애니메이션 함수 - 7. 생명력 회복/소실 애니메이션
// ========================================

// 생명력 애니메이션 시작
function startLifeAnimation(isGain) {
    lifeAnimation = {
        startTime: Date.now(),
        duration: ANIMATION.LIFE_CHANGE.SCALE_DURATION,
        isGain: isGain,  // true: 획득, false: 소실
        pulseCount: 0
    };

    // HTML 요소에 애니메이션 클래스 추가
    const livesElement = UI.lives;
    if (livesElement) {
        // 기존 클래스 제거
        livesElement.classList.remove('life-gain', 'life-loss');

        // 애니메이션 클래스 추가
        if (isGain) {
            livesElement.classList.add('life-gain');
        } else {
            livesElement.classList.add('life-loss');
        }

        // 애니메이션 종료 후 클래스 제거
        setTimeout(() => {
            livesElement.classList.remove('life-gain', 'life-loss');
        }, ANIMATION.LIFE_CHANGE.SCALE_DURATION * ANIMATION.LIFE_CHANGE.PULSE_COUNT);
    }

    console.log(`💓 생명력 애니메이션 시작: ${isGain ? '획득' : '소실'}`);
}

// 생명력 애니메이션 업데이트
function updateLifeAnimation() {
    if (!lifeAnimation) return;

    const elapsed = Date.now() - lifeAnimation.startTime;
    const progress = elapsed / lifeAnimation.duration;

    if (progress >= 1) {
        lifeAnimation.pulseCount++;

        // 펄스 반복
        if (lifeAnimation.pulseCount >= ANIMATION.LIFE_CHANGE.PULSE_COUNT) {
            lifeAnimation = null;
            console.log(`✅ 생명력 애니메이션 완료`);
        } else {
            lifeAnimation.startTime = Date.now();
        }
    }
}

// 생명력 표시 오프셋 가져오기 (흔들림 + 펄스)
function getLifeDisplayOffset() {
    if (!lifeAnimation) return { x: 0, y: 0, scale: 1 };

    const elapsed = Date.now() - lifeAnimation.startTime;
    const progress = elapsed / lifeAnimation.duration;
    const phase = Math.sin(progress * Math.PI);  // 0 → 1 → 0 (한 주기)

    // 소실 시에만 화면 흔들림
    const shake = lifeAnimation.isGain ? 0 : ANIMATION.LIFE_CHANGE.SHAKE_INTENSITY * phase;

    return {
        x: (Math.random() - 0.5) * shake,
        y: (Math.random() - 0.5) * shake,
        scale: 1 + 0.3 * phase,  // 1.0 → 1.3 → 1.0 (펄스)
        color: lifeAnimation.isGain ? '#00ff00' : '#ff0000'  // 획득: 초록, 소실: 빨강
    };
}

// ============================================================================
// 레벨 전환 애니메이션 (승리/게임오버)
// ============================================================================

// 레벨 전환 애니메이션 시작
function startLevelTransition(text, callback) {
    levelTransition = {
        startTime: Date.now(),
        fadeDuration: ANIMATION.LEVEL_TRANSITION.FADE_DURATION,
        textDisplay: ANIMATION.LEVEL_TRANSITION.TEXT_DISPLAY,
        zoomScale: ANIMATION.LEVEL_TRANSITION.ZOOM_SCALE,
        text: text,
        callback: callback,
        phase: 'fadeIn'  // fadeIn -> display -> fadeOut
    };
}

// 레벨 전환 애니메이션 업데이트
function updateLevelTransition() {
    if (!levelTransition) return;

    const elapsed = Date.now() - levelTransition.startTime;

    if (levelTransition.phase === 'fadeIn') {
        // 페이드 인 단계
        const progress = Math.min(elapsed / levelTransition.fadeDuration, 1);
        levelTransition.fadeProgress = progress;
        levelTransition.zoomProgress = progress;

        if (progress >= 1) {
            levelTransition.phase = 'display';
            levelTransition.startTime = Date.now();  // 타이머 리셋
        }
    } else if (levelTransition.phase === 'display') {
        // 텍스트 표시 단계
        levelTransition.fadeProgress = 1;
        levelTransition.zoomProgress = 1;

        if (elapsed >= levelTransition.textDisplay) {
            levelTransition.phase = 'fadeOut';
            levelTransition.startTime = Date.now();  // 타이머 리셋
        }
    } else if (levelTransition.phase === 'fadeOut') {
        // 페이드 아웃 단계
        const progress = Math.min(elapsed / levelTransition.fadeDuration, 1);
        levelTransition.fadeProgress = 1 - progress;
        levelTransition.zoomProgress = 1 + progress * 0.5;  // 줌 아웃

        if (progress >= 1) {
            const callback = levelTransition.callback;
            levelTransition = null;
            if (callback) callback();
        }
    }
}

// 레벨 전환 애니메이션 그리기
function drawLevelTransition() {
    if (!levelTransition) return;

    ctx.save();

    // 반투명 오버레이
    ctx.fillStyle = `rgba(0, 0, 0, ${levelTransition.fadeProgress * 0.7})`;
    ctx.fillRect(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);

    // 텍스트 그리기
    const fontSize = 48;
    const scale = levelTransition.zoomProgress;

    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 텍스트 그림자
    ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
    ctx.shadowBlur = 20;

    // 텍스트
    ctx.fillStyle = `rgba(255, 255, 255, ${levelTransition.fadeProgress})`;

    ctx.save();
    ctx.translate(CANVAS.WIDTH / 2, CANVAS.HEIGHT / 2);
    ctx.scale(scale, scale);
    ctx.fillText(levelTransition.text, 0, 0);
    ctx.restore();

    ctx.restore();
}

// ============================================================================
// UI 팝업 애니메이션
// ============================================================================

// UI 팝업 애니메이션 시작
function startUIPopupAnimation(element) {
    if (!element) return;

    // overlay-content 찾기
    const content = element.querySelector('.overlay-content');

    uiPopupAnimation = {
        element: element,
        content: content,
        startTime: Date.now(),
        fadeDuration: ANIMATION.UI_POPUP.FADE_DURATION,
        scaleDuration: ANIMATION.UI_POPUP.SCALE_DURATION
    };

    // 초기 상태 설정
    element.style.opacity = '0';  // 배경만 fade
    if (content) {
        content.style.transform = 'scale(0.8)';  // 컨텐츠는 scale
    }
}

// UI 팝업 애니메이션 업데이트
function updateUIPopupAnimation() {
    if (!uiPopupAnimation) return;

    const elapsed = Date.now() - uiPopupAnimation.startTime;
    const fadeProgress = Math.min(elapsed / uiPopupAnimation.fadeDuration, 1);
    const scaleProgress = Math.min(elapsed / uiPopupAnimation.scaleDuration, 1);

    // 배경 페이드 인
    uiPopupAnimation.element.style.opacity = fadeProgress.toString();

    // 컨텐츠 오버슈트 스케일 (easeOutBack)
    if (uiPopupAnimation.content) {
        const easedScale = easeOutBack(scaleProgress);
        const scale = 0.8 + (ANIMATION.UI_POPUP.OVERSHOOT - 0.8) * easedScale;
        uiPopupAnimation.content.style.transform = `scale(${scale})`;
    }

    // 애니메이션 완료
    if (scaleProgress >= 1) {
        if (uiPopupAnimation.content) {
            uiPopupAnimation.content.style.transform = 'scale(1)';
        }
        uiPopupAnimation = null;
    }
}

// UI 팝업 애니메이션 제거 (페이드 아웃)
function hideUIPopupAnimation(element, callback) {
    if (!element) {
        if (callback) callback();
        return;
    }

    const content = element.querySelector('.overlay-content');
    const startTime = Date.now();
    const duration = ANIMATION.UI_POPUP.FADE_DURATION;

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // 배경 페이드 아웃
        element.style.opacity = (1 - progress).toString();

        // 컨텐츠 스케일 다운
        if (content) {
            content.style.transform = `scale(${1 - progress * 0.2})`;
        }

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            element.classList.add('hidden');
            element.style.opacity = '1';
            if (content) {
                content.style.transform = 'scale(1)';
            }
            if (callback) callback();
        }
    }

    animate();
}

// 초기화 함수
async function init() {
    console.log('게임 초기화 시작...');

    // 언어 설정 로드
    const savedLanguage = localStorage.getItem('language') || 'ko';
    await setLanguage(savedLanguage);

    // 테마 설정 로드
    const savedTheme = localStorage.getItem('theme') || 'classic';
    setTheme(savedTheme);

    // 캔버스 요소 가져오기
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    // 캔버스 크기 설정
    canvas.width = CANVAS.WIDTH;
    canvas.height = CANVAS.HEIGHT;

    console.log('캔버스 설정 완료:', CANVAS.WIDTH, 'x', CANVAS.HEIGHT);

    // DOM 요소 캐싱 (에러 체크 포함)
    const uiElements = [
        'score', 'lives',
        'finalScore', 'highScore', 'winFinalScore',
        'totalGames', 'bestScore', 'totalBricks',
        'startScreen', 'pauseScreen', 'gameOverScreen', 'winScreen',
        'difficultySelect', 'languageSelect', 'themeSelect', 'muteBtn', 'fullscreenBtn',
        'bgmVolume', 'bgmVolumeValue', 'sfxVolume', 'sfxVolumeValue'
    ];

    uiElements.forEach(id => {
        const element = document.getElementById(id);
        if (!element) {
            console.error(`❌ UI 요소를 찾을 수 없음: ${id}`);
        } else {
            UI[id] = element;
        }
    });

    console.log('✅ UI 요소 캐싱 완료:', Object.keys(UI).length, '개');

    // 공 초기화
    resetBall();

    // 패들 초기화
    resetPaddle();

    // 벽돌 초기화
    initBricks();

    // 점수 및 생명 초기화
    score = 0;
    lives = 3;
    updateDisplay();

    // 이벤트 리스너 등록
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);
    canvas.addEventListener('mousemove', mouseMoveHandler);
    canvas.addEventListener('click', mouseClickHandler);

    // 통계 로드
    loadStats();
    updateStatsDisplay();

    // 볼륨 로드
    loadVolume();
    updateVolumeUI();

    // 음소거 상태 로드
    const savedMuted = localStorage.getItem('brickBreakerMuted');
    if (savedMuted !== null) {
        setMuted(savedMuted === 'true');
        updateMuteButton();
    }

    // UI 버튼 이벤트 등록
    document.getElementById('startBtn').addEventListener('click', startGame);
    document.getElementById('pauseBtn').addEventListener('click', togglePause);
    document.getElementById('resumeBtn').addEventListener('click', togglePause);
    document.getElementById('restartBtn').addEventListener('click', restartGame);
    document.getElementById('menuBtn').addEventListener('click', showMenu);
    document.getElementById('quitBtn').addEventListener('click', showMenu);
    document.getElementById('playAgainBtn').addEventListener('click', restartGame);
    document.getElementById('winMenuBtn').addEventListener('click', showMenu);
    UI.muteBtn.addEventListener('click', handleMuteToggle);
    UI.fullscreenBtn.addEventListener('click', toggleFullscreen);

    // 언어 선택 이벤트 등록
    UI.languageSelect.value = getCurrentLanguage(); // 현재 언어로 설정
    UI.languageSelect.addEventListener('change', (e) => {
        playClickSound();
        setLanguage(e.target.value, updateMuteButton);
    });

    // 테마 선택 이벤트 등록
    UI.themeSelect.value = getCurrentTheme(); // 현재 테마로 설정
    UI.themeSelect.addEventListener('change', (e) => {
        playClickSound();
        setTheme(e.target.value);
    });

    // 난이도 선택 이벤트 등록
    UI.difficultySelect.addEventListener('change', () => {
        playClickSound();
    });

    // 볼륨 슬라이더 이벤트 등록
    UI.bgmVolume.addEventListener('input', (e) => {
        handleBGMVolumeChange(e.target.value);
    });

    UI.sfxVolume.addEventListener('input', (e) => {
        handleSFXVolumeChange(e.target.value);
    });

    // AudioContext 초기화 (메뉴에서 첫 클릭 시)
    document.body.addEventListener('click', function initAudioOnce() {
        initAudio();
        playMenuBGM();
        // 한 번만 실행
        document.body.removeEventListener('click', initAudioOnce);
    }, { once: true });

    // 게임 루프 시작
    gameLoop();
}

// 통계 저장
// 통계 표시 업데이트
function updateStatsDisplay() {
    const stats = getStats();
    UI.totalGames.textContent = stats.totalGames;
    UI.bestScore.textContent = stats.bestScore;
    UI.totalBricks.textContent = stats.totalBricks;
}

// ========================================
// UI 업데이트 함수
// ========================================

// 볼륨 슬라이더 UI 업데이트
function updateVolumeUI() {
    const volume = getVolume();
    if (UI.bgmVolume) {
        UI.bgmVolume.value = Math.round(volume.BGM * 100);
        UI.bgmVolumeValue.textContent = Math.round(volume.BGM * 100) + '%';
    }
    if (UI.sfxVolume) {
        UI.sfxVolume.value = Math.round(volume.SFX * 100);
        UI.sfxVolumeValue.textContent = Math.round(volume.SFX * 100) + '%';
    }
}

// 음소거 버튼 텍스트 업데이트
function updateMuteButton() {
    if (!UI.muteBtn) return;

    const icon = getMuted() ? '🔇' : '🔊';
    UI.muteBtn.textContent = `${icon} ${t('muteBtn')}`;
}

// 음소거 토글 (게임 상태에 따른 BGM 처리 포함)
function handleMuteToggle() {
    const muted = toggleMute();
    updateMuteButton();

    // 음소거 해제 시 게임 상태에 따라 적절한 BGM 재생
    if (!muted) {
        if (gameRunning) {
            playGameBGM();
        } else {
            playMenuBGM();
        }
    }
}

// BGM 볼륨 변경 (UI 업데이트 포함)
function handleBGMVolumeChange(value) {
    setBGMVolume(value);
    updateVolumeUI();
}

// 효과음 볼륨 변경 (UI 업데이트 및 테스트 사운드 포함)
function handleSFXVolumeChange(value) {
    setSFXVolume(value);
    updateVolumeUI();
    playClickSound(); // 테스트 사운드
}

// 전체화면 토글
function toggleFullscreen() {
    playClickSound();

    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        console.log('전체화면 진입');
    } else {
        document.exitFullscreen();
        console.log('전체화면 종료');
    }
}

// 아이템 및 효과 초기화
function resetItems() {
    items = [];
    particles = [];  // 입자도 초기화
    brickFragments = [];  // 벽돌 조각도 초기화
    ballTrail = [];  // 공 트레일도 초기화
    scorePopups = [];  // 점수 팝업도 초기화
    paddleHitWaves = [];  // 패들 히트 충격파도 초기화
    paddleAnimation = null;  // 패들 애니메이션도 초기화
    lifeAnimation = null;  // 생명력 애니메이션도 초기화
    uiPopupAnimation = null;  // UI 팝업 애니메이션도 초기화
    levelTransition = null;  // 레벨 전환 애니메이션도 초기화

    // 생명력 애니메이션 CSS 클래스 제거
    if (UI.lives) {
        UI.lives.classList.remove('life-gain', 'life-loss');
    }

    // 모든 타이머 취소
    Object.keys(effectTimers).forEach(key => {
        if (effectTimers[key]) {
            clearTimeout(effectTimers[key]);
            effectTimers[key] = null;
        }
    });

    // 효과 플래그 초기화
    activeEffects = {
        paddleExpanded: false,
        ballSlow: false,
        paddleShrink: false
    };
}

// 게임 시작
function startGame() {
    // AudioContext 초기화 (사용자 상호작용 후 초기화)
    initAudio();

    // UI 클릭 사운드
    playClickSound();

    // 난이도 가져오기
    difficulty = UI.difficultySelect.value;

    // 게임 상태 초기화
    score = 0;
    lives = 3;
    updateDisplay();

    // 난이도에 따라 초기화
    initBricks();
    resetBall();
    resetPaddle();
    resetItems();

    gameRunning = true;
    gamePaused = false;

    // 시작 화면 페이드 아웃
    hideUIPopupAnimation(UI.startScreen);

    // 게임 BGM 재생
    playGameBGM();

    console.log('게임 시작! 난이도:', difficulty);
}

// 일시정지 토글
function togglePause() {
    if (!gameRunning) return;

    gamePaused = !gamePaused;

    if (gamePaused) {
        UI.pauseScreen.classList.remove('hidden');
        startUIPopupAnimation(UI.pauseScreen);
        console.log('일시정지');
    } else {
        hideUIPopupAnimation(UI.pauseScreen);
        console.log('재개');
    }
}

// 게임 재시작
function restartGame() {
    // UI 클릭 사운드
    playClickSound();

    UI.gameOverScreen.classList.add('hidden');
    UI.winScreen.classList.add('hidden');

    // 게임 요소 먼저 리셋 (애니메이션 클래스 제거 포함)
    resetItems();

    // 게임 상태 초기화
    score = 0;
    lives = 3;
    updateDisplay();

    // 게임 요소 리셋
    resetBall();
    resetPaddle();
    initBricks();

    // 게임 시작
    gameRunning = true;
    gamePaused = false;

    // 게임 BGM 재생
    playGameBGM();

    console.log('게임 재시작');
}

// 메뉴로 돌아가기
function showMenu() {
    // UI 클릭 사운드
    playClickSound();

    gameRunning = false;
    gamePaused = false;

    // 다른 화면들 즉시 숨김
    UI.pauseScreen.classList.add('hidden');
    UI.gameOverScreen.classList.add('hidden');
    UI.winScreen.classList.add('hidden');

    // 시작 화면 애니메이션과 함께 표시
    UI.startScreen.classList.remove('hidden');
    startUIPopupAnimation(UI.startScreen);

    // 기존 BGM 정지 후 메뉴 BGM 재생
    stopBGM();
    playMenuBGM();

    console.log('메뉴로 이동');
}

// 게임 승리 (모든 벽돌 파괴)
function gameWin() {
    // 게임 일시정지 (gameRunning은 유지하여 애니메이션 계속 실행)
    gamePaused = true;

    // BGM 정지
    stopBGM();

    // 게임 승리 사운드
    playWinSound();

    // 레벨 전환 애니메이션 시작 (VICTORY!)
    startLevelTransition('VICTORY!', () => {
        // 애니메이션 완료 후 게임 완전히 중지
        gameRunning = false;

        // UI 표시
        UI.winFinalScore.textContent = score;
        UI.winScreen.classList.remove('hidden');
        startUIPopupAnimation(UI.winScreen);
    });

    // 통계 업데이트
    updateStats({
        gameCompleted: true,
        score: score,
        bricksDestroyed: 0
    });
    updateStatsDisplay();

    console.log('게임 승리! 최종 점수:', score);
}

// 키보드 누름 이벤트
function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    } else if (e.key === ' ' || e.key === 'Spacebar') {
        // 스페이스바로 공 발사
        if (!ballLaunched) {
            ballLaunched = true;
            console.log('공 발사!');
        }
    } else if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        // ESC 또는 P 키로 일시정지/재개
        if (gameRunning) {
            togglePause();
        }
    }
}

// 키보드 뗌 이벤트
function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    }
}

// 마우스 이동 이벤트
function mouseMoveHandler(e) {
    const paddleWidth = getAnimatedPaddleWidth(); // 애니메이션 적용된 패들 너비
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > paddleWidth / 2 && relativeX < CANVAS.WIDTH - paddleWidth / 2) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

// 마우스 클릭 이벤트
function mouseClickHandler() {
    // 클릭으로 공 발사
    if (!ballLaunched) {
        ballLaunched = true;
        console.log('공 발사!');
    }
}

// 공 위치 초기화
function resetBall() {
    const settings = DIFFICULTY_SETTINGS[difficulty];

    ballX = CANVAS.WIDTH / 2;
    ballY = CANVAS.HEIGHT - 30;
    ballSpeedX = settings.ballSpeed;
    ballSpeedY = -settings.ballSpeed;
    ballLaunched = false; // 공 발사 대기 상태로
    console.log('공 초기화:', ballX, ballY, '속도:', settings.ballSpeed);
}

// 패들 위치 초기화
function resetPaddle() {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    paddleX = (CANVAS.WIDTH - settings.paddleWidth) / 2;
    console.log('패들 초기화:', paddleX, '너비:', settings.paddleWidth);
}

// 벽돌 배열 초기화
function initBricks() {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    bricks = [];
    for (let c = 0; c < BRICK.COLS; c++) {
        bricks[c] = [];
        for (let r = 0; r < settings.brickRows; r++) {
            bricks[c][r] = {
                x: 0,
                y: 0,
                status: 1  // 1: 존재, 0: 파괴됨
            };
        }
    }
    console.log('벽돌 초기화:', settings.brickRows, 'x', BRICK.COLS, '(난이도:', difficulty + ')');
}

// ========================================
// 5단계: 충돌 감지 유틸리티 함수
// ========================================

// 사각형과 원의 충돌 감지 (AABB - Axis-Aligned Bounding Box)
function checkRectCircleCollision(rectX, rectY, rectWidth, rectHeight, circleX, circleY, circleRadius) {
    return (
        circleX + circleRadius > rectX &&
        circleX - circleRadius < rectX + rectWidth &&
        circleY + circleRadius > rectY &&
        circleY - circleRadius < rectY + rectHeight
    );
}

// 벽돌-공 충돌 감지
function collisionDetection() {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    for (let c = 0; c < BRICK.COLS; c++) {
        for (let r = 0; r < settings.brickRows; r++) {
            const brick = bricks[c][r];

            // 벽돌이 존재하는 경우만 체크
            if (brick.status === 1) {
                // 공이 벽돌과 충돌했는지 체크
                if (checkRectCircleCollision(brick.x, brick.y, BRICK.WIDTH, BRICK.HEIGHT, ballX, ballY, BALL.RADIUS)) {
                    // 공 방향 반전
                    ballSpeedY = -ballSpeedY;

                    // 벽돌 파괴
                    brick.status = 0;

                    // 사운드 재생
                    playBrickBreakSound();

                    // 입자 효과 생성 (벽돌 중앙에서)
                    const brickCenterX = brick.x + BRICK.WIDTH / 2;
                    const brickCenterY = brick.y + BRICK.HEIGHT / 2;
                    createParticles(brickCenterX, brickCenterY, COLORS.BRICK_COLORS[r]);

                    // 벽돌 조각 애니메이션 생성
                    createBrickFragments(brick.x, brick.y, BRICK.WIDTH, BRICK.HEIGHT, COLORS.BRICK_COLORS[r]);

                    // 점수 증가
                    score += 10;
                    updateDisplay();

                    // 점수 팝업 생성
                    createScorePopup(brickCenterX, brickCenterY, 10);

                    // 통계 업데이트 (파괴한 벽돌 총 개수)
                    updateStats({
                        gameCompleted: false,
                        score: 0,
                        bricksDestroyed: 1
                    });
                    updateStatsDisplay();

                    console.log('벽돌 파괴:', c, r, '점수:', score);

                    // 아이템 드롭 (확률적)
                    if (Math.random() < ITEM.DROP_CHANCE) {
                        createItem(brick.x + BRICK.WIDTH / 2, brick.y);
                    }

                    // 게임 승리 확인 (모든 벽돌 파괴)
                    if (checkAllBricksCleared()) {
                        gameWin();
                    }
                }
            }
        }
    }
}

// 모든 벽돌 파괴 확인
function checkAllBricksCleared() {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    for (let c = 0; c < BRICK.COLS; c++) {
        for (let r = 0; r < settings.brickRows; r++) {
            if (bricks[c][r].status === 1) {
                return false; // 아직 벽돌이 남아있음
            }
        }
    }
    return true; // 모든 벽돌 파괴
}


// 화면 표시 업데이트
function updateDisplay() {
    // 점수 표시
    UI.score.textContent = score;

    // 생명 표시 (하트 이모지)
    let livesText = '';
    for (let i = 0; i < lives; i++) {
        livesText += '❤️';
    }
    UI.lives.textContent = livesText;
}

// 게임 업데이트 함수
function update() {
    // UI 팝업 애니메이션은 일시정지 상태에서도 업데이트
    updateUIPopupAnimation();

    // 레벨 전환 애니메이션은 항상 업데이트
    updateLevelTransition();

    // 게임이 실행 중이 아니거나 일시정지 상태면 업데이트 안 함
    if (!gameRunning || gamePaused) return;

    // 공이 발사되지 않았으면 패들 위에 고정
    if (!ballLaunched) {
        const settings = DIFFICULTY_SETTINGS[difficulty];
        ballX = paddleX + settings.paddleWidth / 2;
        ballY = CANVAS.HEIGHT - PADDLE.HEIGHT - 10 - BALL.RADIUS - 1;
        return; // 다른 로직 실행 안 함
    }

    // 공 이동
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // 좌우 벽 충돌
    if (ballX + BALL.RADIUS > CANVAS.WIDTH) {
        // 오른쪽 벽 충돌 - 위치 보정
        ballX = CANVAS.WIDTH - BALL.RADIUS;
        ballSpeedX = -Math.abs(ballSpeedX); // 항상 왼쪽으로
        playWallHitSound();
    } else if (ballX - BALL.RADIUS < 0) {
        // 왼쪽 벽 충돌 - 위치 보정
        ballX = BALL.RADIUS;
        ballSpeedX = Math.abs(ballSpeedX); // 항상 오른쪽으로
        playWallHitSound();
    }

    // 상단 벽 충돌
    if (ballY - BALL.RADIUS < 0) {
        // 위치 보정
        ballY = BALL.RADIUS;
        ballSpeedY = Math.abs(ballSpeedY); // 항상 아래로
        playWallHitSound();
    }

    // 하단 벽 충돌 (생명 감소)
    if (ballY + BALL.RADIUS > CANVAS.HEIGHT) {
        lives--;
        updateDisplay();
        startLifeAnimation(false);  // 생명 소실 애니메이션

        if (lives <= 0) {
            // 게임 일시정지 (gameRunning은 유지하여 애니메이션 계속 실행)
            gamePaused = true;

            // BGM 정지
            stopBGM();

            // 게임 오버 사운드
            playGameOverSound();

            // 레벨 전환 애니메이션 시작 (GAME OVER)
            startLevelTransition('GAME OVER', () => {
                // 애니메이션 완료 후 게임 완전히 중지
                gameRunning = false;

                // UI 표시
                UI.finalScore.textContent = score;
                UI.highScore.textContent = getStats().bestScore;
                UI.gameOverScreen.classList.remove('hidden');
                startUIPopupAnimation(UI.gameOverScreen);
            });

            // 통계 업데이트
            updateStats({
                gameCompleted: true,
                score: score,
                bricksDestroyed: 0
            });
            updateStatsDisplay();

            console.log('게임 오버! 최종 점수:', score, '총 게임 수:', getStats().totalGames);
        } else {
            // 생명 손실 사운드
            playLifeLostSound();

            // 공, 패들, 아이템 리셋
            resetBall();
            resetPaddle();
            resetItems();  // 아이템 및 효과 초기화
            console.log('생명 감소. 남은 생명:', lives);
        }
    }

    // 패들-공 충돌 감지
    const paddleWidth = getAnimatedPaddleWidth(); // 애니메이션 적용된 패들 너비
    const paddleY = CANVAS.HEIGHT - PADDLE.HEIGHT - 10;
    if (ballLaunched && checkRectCircleCollision(paddleX, paddleY, paddleWidth, PADDLE.HEIGHT, ballX, ballY, BALL.RADIUS)) {
        // 패들 충돌 사운드
        playPaddleHitSound();

        // 패들의 어느 부분에 맞았는지에 따라 반사각 조정
        const hitPos = (ballX - paddleX) / paddleWidth;
        ballSpeedX = (hitPos - 0.5) * 10;
        ballSpeedY = -Math.abs(ballSpeedY); // 항상 위로

        // 패들 히트 충격파 생성 (충돌 위치에서)
        createPaddleHitWave(ballX, ballY);
    }

    // 패들 이동 (키보드)
    if (rightPressed && paddleX < CANVAS.WIDTH - paddleWidth) {
        paddleX += PADDLE.SPEED;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= PADDLE.SPEED;
    }

    // 벽돌-공 충돌 감지
    collisionDetection();

    // 아이템 업데이트
    updateItems();

    // 아이템 애니메이션 업데이트
    updateItemAnimations();

    // 입자 업데이트
    updateParticles();

    // 벽돌 조각 업데이트
    updateBrickFragments();

    // 공 트레일 업데이트
    updateBallTrail();

    // 점수 팝업 업데이트
    updateScorePopups();

    // 패들 히트 충격파 업데이트
    updatePaddleHitWaves();

    // 패들 애니메이션 업데이트
    updatePaddleAnimation();

    // 생명력 애니메이션 업데이트
    updateLifeAnimation();
}

// 게임 그리기 함수
function draw() {
    // 캔버스 클리어 (검은 배경)
    ctx.fillStyle = COLORS.BACKGROUND;
    ctx.fillRect(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);

    // 벽돌 그리기
    drawBricks();

    // 아이템 그리기 (애니메이션 적용)
    drawAnimatedItems();

    // 입자 그리기
    drawParticles();

    // 벽돌 조각 그리기
    drawBrickFragments();

    // 공 트레일 그리기 (공보다 먼저 그려야 뒤에 나옴)
    drawBallTrail();

    // 공 그리기
    drawBall();

    // 패들 그리기
    drawPaddle();

    // 패들 히트 충격파 그리기
    drawPaddleHitWaves();

    // 점수 팝업 그리기 (맨 위에 표시)
    drawScorePopups();

    // 레벨 전환 애니메이션 그리기 (최상위 레이어)
    drawLevelTransition();

    // 공 발사 대기 중일 때 안내 문구 표시
    if (!ballLaunched) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(t('launchInstruction'), CANVAS.WIDTH / 2, CANVAS.HEIGHT / 2);
    }
}

// 공 그리기
function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, BALL.RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.BALL;
    ctx.fill();
    ctx.closePath();
}

// 패들 그리기
function drawPaddle() {
    const paddleWidth = getAnimatedPaddleWidth(); // 애니메이션 적용된 패들 너비
    const paddleY = CANVAS.HEIGHT - PADDLE.HEIGHT - 10;

    // 그라디언트 생성
    const gradient = ctx.createLinearGradient(paddleX, 0, paddleX + paddleWidth, 0);
    gradient.addColorStop(0, COLORS.PADDLE_START);
    gradient.addColorStop(1, COLORS.PADDLE_END);

    // 둥근 모서리 패들
    ctx.beginPath();
    ctx.roundRect(paddleX, paddleY, paddleWidth, PADDLE.HEIGHT, 5);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.closePath();
}

// 벽돌 그리기
function drawBricks() {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    for (let c = 0; c < BRICK.COLS; c++) {
        for (let r = 0; r < settings.brickRows; r++) {
            if (bricks[c][r].status === 1) {
                // 벽돌 위치 계산
                const brickX = c * (BRICK.WIDTH + BRICK.PADDING) + BRICK.OFFSET_LEFT;
                const brickY = r * (BRICK.HEIGHT + BRICK.PADDING) + BRICK.OFFSET_TOP;

                // 벽돌 위치 저장
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;

                // 벽돌 그리기
                ctx.beginPath();
                ctx.roundRect(brickX, brickY, BRICK.WIDTH, BRICK.HEIGHT, 4);
                ctx.fillStyle = COLORS.BRICK_COLORS[r % COLORS.BRICK_COLORS.length];
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// 게임 루프
function gameLoop() {
    update();  // 게임 로직 업데이트
    draw();    // 화면 그리기

    // 다음 프레임 요청
    requestAnimationFrame(gameLoop);
}

// 페이지 로드 시 초기화
window.addEventListener('load', init);
