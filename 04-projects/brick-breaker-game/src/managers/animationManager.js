// ========================================
// AnimationManager - 게임 내 애니메이션 통합 관리
// ========================================

import { CANVAS, ANIMATION } from '../systems/constants.js';

/**
 * AnimationManager 클래스
 *
 * 생명력, 레벨 전환, UI 팝업 애니메이션을 통합 관리
 *
 * 주요 기능:
 * - 생명력 회복/소실 애니메이션 (화면 흔들림, 펄스)
 * - 레벨 전환 애니메이션 (페이드 인/아웃, 줌)
 * - UI 팝업 애니메이션 (페이드, 스케일)
 */
export class AnimationManager {
    constructor() {
        // 애니메이션 상태
        this.lifeAnimation = null;
        this.levelTransition = null;
        this.uiPopupAnimation = null;
    }

    // ========================================
    // 생명력 애니메이션
    // ========================================

    /**
     * 생명력 애니메이션 시작
     * @param {boolean} isGain - true: 획득, false: 소실
     * @param {HTMLElement} livesElement - 생명 표시 DOM 요소
     */
    startLifeAnimation(isGain, livesElement) {
        this.lifeAnimation = {
            startTime: Date.now(),
            duration: ANIMATION.LIFE_CHANGE.SCALE_DURATION,
            isGain: isGain,
            pulseCount: 0
        };

        // HTML 요소에 애니메이션 클래스 추가
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

    /**
     * 생명력 애니메이션 업데이트
     */
    updateLifeAnimation() {
        if (!this.lifeAnimation) return;

        const elapsed = Date.now() - this.lifeAnimation.startTime;
        const progress = elapsed / this.lifeAnimation.duration;

        if (progress >= 1) {
            this.lifeAnimation.pulseCount++;

            // 펄스 반복
            if (this.lifeAnimation.pulseCount >= ANIMATION.LIFE_CHANGE.PULSE_COUNT) {
                this.lifeAnimation = null;
                console.log(`✅ 생명력 애니메이션 완료`);
            } else {
                this.lifeAnimation.startTime = Date.now();
            }
        }
    }

    /**
     * 생명력 표시 오프셋 가져오기 (흔들림 + 펄스)
     * @returns {{x: number, y: number, scale: number, color: string}}
     */
    getLifeDisplayOffset() {
        if (!this.lifeAnimation) return { x: 0, y: 0, scale: 1 };

        const elapsed = Date.now() - this.lifeAnimation.startTime;
        const progress = elapsed / this.lifeAnimation.duration;
        const phase = Math.sin(progress * Math.PI);  // 0 → 1 → 0 (한 주기)

        // 소실 시에만 화면 흔들림
        const shake = this.lifeAnimation.isGain ? 0 : ANIMATION.LIFE_CHANGE.SHAKE_INTENSITY * phase;

        return {
            x: (Math.random() - 0.5) * shake,
            y: (Math.random() - 0.5) * shake,
            scale: 1 + 0.3 * phase,  // 1.0 → 1.3 → 1.0 (펄스)
            color: this.lifeAnimation.isGain ? '#00ff00' : '#ff0000'  // 획득: 초록, 소실: 빨강
        };
    }

    // ========================================
    // 레벨 전환 애니메이션
    // ========================================

    /**
     * 레벨 전환 애니메이션 시작
     * @param {string} text - 표시할 텍스트
     * @param {Function} callback - 애니메이션 완료 후 실행할 콜백
     */
    startLevelTransition(text, callback) {
        this.levelTransition = {
            startTime: Date.now(),
            fadeDuration: ANIMATION.LEVEL_TRANSITION.FADE_DURATION,
            textDisplay: ANIMATION.LEVEL_TRANSITION.TEXT_DISPLAY,
            zoomScale: ANIMATION.LEVEL_TRANSITION.ZOOM_SCALE,
            text: text,
            callback: callback,
            phase: 'fadeIn'  // fadeIn -> display -> fadeOut
        };
    }

    /**
     * 레벨 전환 애니메이션 업데이트
     */
    updateLevelTransition() {
        if (!this.levelTransition) return;

        const elapsed = Date.now() - this.levelTransition.startTime;

        if (this.levelTransition.phase === 'fadeIn') {
            // 페이드 인 단계
            const progress = Math.min(elapsed / this.levelTransition.fadeDuration, 1);
            this.levelTransition.fadeProgress = progress;
            this.levelTransition.zoomProgress = progress;

            if (progress >= 1) {
                this.levelTransition.phase = 'display';
                this.levelTransition.startTime = Date.now();  // 타이머 리셋
            }
        } else if (this.levelTransition.phase === 'display') {
            // 텍스트 표시 단계
            this.levelTransition.fadeProgress = 1;
            this.levelTransition.zoomProgress = 1;

            if (elapsed >= this.levelTransition.textDisplay) {
                this.levelTransition.phase = 'fadeOut';
                this.levelTransition.startTime = Date.now();  // 타이머 리셋
            }
        } else if (this.levelTransition.phase === 'fadeOut') {
            // 페이드 아웃 단계
            const progress = Math.min(elapsed / this.levelTransition.fadeDuration, 1);
            this.levelTransition.fadeProgress = 1 - progress;
            this.levelTransition.zoomProgress = 1 + progress * 0.5;  // 줌 아웃

            if (progress >= 1) {
                const callback = this.levelTransition.callback;
                this.levelTransition = null;
                if (callback) callback();
            }
        }
    }

    /**
     * 레벨 전환 애니메이션 그리기
     * @param {CanvasRenderingContext2D} ctx - 캔버스 컨텍스트
     */
    drawLevelTransition(ctx) {
        if (!this.levelTransition) return;

        ctx.save();

        // 반투명 오버레이
        ctx.fillStyle = `rgba(0, 0, 0, ${this.levelTransition.fadeProgress * 0.7})`;
        ctx.fillRect(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);

        // 텍스트 그리기
        const fontSize = 48;
        const scale = this.levelTransition.zoomProgress;

        ctx.font = `bold ${fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // 텍스트 그림자
        ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
        ctx.shadowBlur = 20;

        // 텍스트
        ctx.fillStyle = `rgba(255, 255, 255, ${this.levelTransition.fadeProgress})`;

        ctx.save();
        ctx.translate(CANVAS.WIDTH / 2, CANVAS.HEIGHT / 2);
        ctx.scale(scale, scale);
        ctx.fillText(this.levelTransition.text, 0, 0);
        ctx.restore();

        ctx.restore();
    }

    // ========================================
    // UI 팝업 애니메이션
    // ========================================

    /**
     * UI 팝업 애니메이션 시작
     * @param {HTMLElement} element - 팝업 DOM 요소
     */
    startUIPopupAnimation(element) {
        if (!element) return;

        // overlay-content 찾기
        const content = element.querySelector('.overlay-content');

        this.uiPopupAnimation = {
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

    /**
     * UI 팝업 애니메이션 업데이트
     */
    updateUIPopupAnimation() {
        if (!this.uiPopupAnimation) return;

        const elapsed = Date.now() - this.uiPopupAnimation.startTime;
        const fadeProgress = Math.min(elapsed / this.uiPopupAnimation.fadeDuration, 1);
        const scaleProgress = Math.min(elapsed / this.uiPopupAnimation.scaleDuration, 1);

        // 배경 페이드 인
        this.uiPopupAnimation.element.style.opacity = fadeProgress.toString();

        // 컨텐츠 오버슈트 스케일 (easeOutBack)
        if (this.uiPopupAnimation.content) {
            const easedScale = this.easeOutBack(scaleProgress);
            const scale = 0.8 + (ANIMATION.UI_POPUP.OVERSHOOT - 0.8) * easedScale;
            this.uiPopupAnimation.content.style.transform = `scale(${scale})`;
        }

        // 애니메이션 완료
        if (scaleProgress >= 1) {
            if (this.uiPopupAnimation.content) {
                this.uiPopupAnimation.content.style.transform = 'scale(1)';
            }
            this.uiPopupAnimation = null;
        }
    }

    /**
     * UI 팝업 애니메이션 제거 (페이드 아웃)
     * @param {HTMLElement} element - 팝업 DOM 요소
     * @param {Function} callback - 애니메이션 완료 후 실행할 콜백
     */
    hideUIPopupAnimation(element, callback) {
        if (!element) {
            if (callback) callback();
            return;
        }

        const content = element.querySelector('.overlay-content');
        const startTime = Date.now();
        const duration = ANIMATION.UI_POPUP.FADE_DURATION;

        const animate = () => {
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
        };

        animate();
    }

    // ========================================
    // 유틸리티 함수
    // ========================================

    /**
     * easeOutBack 이징 함수
     * @param {number} t - 진행도 (0~1)
     * @returns {number} 이징 적용된 값
     */
    easeOutBack(t) {
        const c1 = ANIMATION.EASING.OVERSHOOT_STRENGTH;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    }

    /**
     * 모든 애니메이션 업데이트 (효율성: 활성화된 것만 업데이트)
     */
    update() {
        if (this.lifeAnimation) this.updateLifeAnimation();
        if (this.levelTransition) this.updateLevelTransition();
        if (this.uiPopupAnimation) this.updateUIPopupAnimation();
    }

    /**
     * 모든 애니메이션 그리기 (효율성: 활성화된 것만 그리기)
     * @param {CanvasRenderingContext2D} ctx - 캔버스 컨텍스트
     */
    draw(ctx) {
        // 레벨 전환 애니메이션만 캔버스에 그림 (최상위 레이어)
        if (this.levelTransition) this.drawLevelTransition(ctx);
    }

    /**
     * 레벨 전환 애니메이션이 활성화되어 있는지 확인
     * @returns {boolean}
     */
    hasLevelTransition() {
        return this.levelTransition !== null;
    }

    /**
     * 모든 애니메이션 초기화
     */
    reset() {
        this.lifeAnimation = null;
        this.levelTransition = null;
        this.uiPopupAnimation = null;
    }
}
