// ========================================
// Paddle 클래스
// ========================================

import { CANVAS, COLORS, PADDLE, ANIMATION, DIFFICULTY_SETTINGS } from './constants.js';

// easeOutElastic 함수 (애니메이션용)
function easeOutElastic(x) {
    const c4 = (2 * Math.PI) / 3;
    return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}

export class Paddle {
    constructor() {
        this.height = PADDLE.HEIGHT;
        this.speed = PADDLE.SPEED;
        this.y = CANVAS.HEIGHT - PADDLE.HEIGHT - 10; // 고정된 Y 위치

        // 애니메이션 상태
        this.animation = null;

        // 효과 상태 (game.js에서 관리하는 activeEffects를 참조해야 함)
        // 여기서는 기본 너비만 저장
        this.baseWidth = PADDLE.WIDTH;
        this.x = 0;
    }

    /**
     * 패들을 초기 상태로 리셋
     * @param {string} difficulty - 난이도 ('easy', 'normal', 'hard')
     */
    reset(difficulty) {
        const settings = DIFFICULTY_SETTINGS[difficulty];
        this.baseWidth = settings.paddleWidth;
        this.x = (CANVAS.WIDTH - settings.paddleWidth) / 2;
        this.animation = null;

        console.log('패들 초기화:', this.x, '너비:', settings.paddleWidth);
    }

    /**
     * 패들 이동
     * @param {string} direction - 이동 방향 ('left', 'right')
     * @param {number} currentWidth - 현재 패들 너비 (애니메이션 적용된)
     */
    move(direction, currentWidth) {
        if (direction === 'right' && this.x < CANVAS.WIDTH - currentWidth) {
            this.x += this.speed;
        } else if (direction === 'left' && this.x > 0) {
            this.x -= this.speed;
        }
    }

    /**
     * 마우스 위치로 패들 이동
     * @param {number} mouseX - 마우스 X 좌표
     * @param {number} currentWidth - 현재 패들 너비
     */
    moveTo(mouseX, currentWidth) {
        const halfWidth = currentWidth / 2;
        if (mouseX > halfWidth && mouseX < CANVAS.WIDTH - halfWidth) {
            this.x = mouseX - halfWidth;
        }
    }

    /**
     * 패들 애니메이션 업데이트
     */
    update() {
        if (!this.animation) return;

        const elapsed = Date.now() - this.animation.startTime;
        const progress = Math.min(elapsed / this.animation.duration, 1);

        // 이징 적용
        const easedProgress = easeOutElastic(progress);
        this.animation.currentScale = easedProgress;

        // 현재 패들 너비 계산
        const currentWidth = this.animation.startWidth +
                            (this.animation.targetWidth - this.animation.startWidth) * easedProgress;

        // 중심점을 유지하면서 패들 위치 조정
        this.x = this.animation.centerX - currentWidth / 2;

        // 애니메이션 완료
        if (progress >= 1) {
            const finalWidth = this.animation.targetWidth;
            this.x = this.animation.centerX - finalWidth / 2;
            this.animation = null;
            console.log(`✅ 패들 크기 애니메이션 완료 (위치: ${this.x.toFixed(1)})`);
        }
    }

    /**
     * 크기 변경 애니메이션 시작
     * @param {number} fromWidth - 시작 너비
     * @param {number} toWidth - 목표 너비
     */
    startResizeAnimation(fromWidth, toWidth) {
        // 패들 중심점 계산 (크기 변경 전)
        const centerX = this.x + fromWidth / 2;

        this.animation = {
            startWidth: fromWidth,
            targetWidth: toWidth,
            centerX: centerX,
            startTime: Date.now(),
            duration: ANIMATION.PADDLE_RESIZE.DURATION,
            currentScale: 0
        };

        console.log(`🎬 패들 크기 애니메이션 시작: ${fromWidth.toFixed(1)} → ${toWidth.toFixed(1)} (중심: ${centerX.toFixed(1)})`);
    }

    /**
     * 현재 패들 너비 (효과 적용, 애니메이션 제외)
     * @param {Object} activeEffects - 활성화된 효과 객체
     * @returns {number} 패들 너비
     */
    getWidth(activeEffects) {
        let width = this.baseWidth;

        if (activeEffects.paddleExpanded) {
            width *= 1.5;
        }
        if (activeEffects.paddleShrink) {
            width *= 0.7;
        }

        return width;
    }

    /**
     * 애니메이션이 적용된 패들 너비
     * @param {Object} activeEffects - 활성화된 효과 객체
     * @returns {number} 애니메이션 적용된 패들 너비
     */
    getAnimatedWidth(activeEffects) {
        const baseWidth = this.getWidth(activeEffects);

        if (!this.animation) {
            return baseWidth;
        }

        // 애니메이션 중: 시작 너비에서 목표 너비로 보간
        const currentWidth = this.animation.startWidth +
                            (this.animation.targetWidth - this.animation.startWidth) * this.animation.currentScale;
        return currentWidth;
    }

    /**
     * 패들 그리기
     * @param {CanvasRenderingContext2D} ctx - 캔버스 컨텍스트
     * @param {number} width - 패들 너비 (애니메이션 적용된)
     */
    draw(ctx, width) {
        // 그라디언트 생성
        const gradient = ctx.createLinearGradient(this.x, 0, this.x + width, 0);
        gradient.addColorStop(0, COLORS.PADDLE_START);
        gradient.addColorStop(1, COLORS.PADDLE_END);

        // 둥근 모서리 패들
        ctx.beginPath();
        ctx.roundRect(this.x, this.y, width, this.height, 5);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.closePath();
    }

    /**
     * 현재 위치와 크기 반환
     * @returns {{x: number, y: number, width: number, height: number}}
     */
    getBounds(width) {
        return {
            x: this.x,
            y: this.y,
            width: width,
            height: this.height
        };
    }
}
