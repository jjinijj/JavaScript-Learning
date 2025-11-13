/**
 * EffectManager 클래스
 *
 * 아이템 효과 타이머 및 상태 관리
 * - 효과 활성화/비활성화
 * - 타이머 관리
 * - 상호 배타적 효과 처리 (패들 확대 ↔ 축소)
 */

export class EffectManager {
    constructor() {
        // 활성화된 효과 플래그
        this.activeEffects = {
            paddleExpanded: false,
            ballSlow: false,
            paddleShrink: false
        };

        // 효과 타이머 ID 저장
        this.timers = {
            paddleExpanded: null,
            ballSlow: null,
            paddleShrink: null
        };

        // 콜백 함수들 (외부에서 주입)
        this.callbacks = {
            getPaddleWidth: null,           // 목표 패들 너비 계산
            getAnimatedPaddleWidth: null,   // 현재 애니메이션 적용된 패들 너비
            startPaddleAnimation: null,     // 패들 크기 변경 애니메이션 시작
            restoreBallSpeed: null          // 공 속도 복원
        };
    }

    /**
     * 콜백 함수 설정
     * @param {Object} callbacks - 콜백 함수 객체
     */
    setCallbacks(callbacks) {
        this.callbacks = { ...this.callbacks, ...callbacks };
    }

    /**
     * 효과가 활성화되어 있는지 확인
     * @param {string} effectName - 효과 이름
     * @returns {boolean}
     */
    isActive(effectName) {
        return this.activeEffects[effectName] || false;
    }

    /**
     * activeEffects 객체 전체 반환 (paddle.getWidth()에서 사용)
     * @returns {Object}
     */
    getActiveEffects() {
        return this.activeEffects;
    }

    /**
     * 효과 비활성화
     * @param {string} effectName - 효과 이름
     */
    deactivate(effectName) {
        // 타이머 취소
        if (this.timers[effectName]) {
            clearTimeout(this.timers[effectName]);
            this.timers[effectName] = null;
        }

        // 효과 플래그 false
        this.activeEffects[effectName] = false;

        // 공 속도 복원 (ballSlow인 경우)
        if (effectName === 'ballSlow' && this.callbacks.restoreBallSpeed) {
            this.callbacks.restoreBallSpeed();
        }

        console.log(`⏰ ${effectName} 비활성화됨`);
    }

    /**
     * 효과 활성화
     * @param {string} effectName - 효과 이름
     * @param {number} duration - 지속 시간 (ms), null이면 영구
     * @param {number|null} currentWidth - 패들 효과인 경우 현재 너비 전달
     */
    activate(effectName, duration, currentWidth = null) {
        const isPaddleEffect = (effectName === 'paddleExpanded' || effectName === 'paddleShrink');

        // 현재 너비: 전달받은 값이 있으면 사용, 없으면 현재 애니메이션 적용된 너비
        let oldWidth = 0;
        if (isPaddleEffect && this.callbacks.getAnimatedPaddleWidth) {
            oldWidth = currentWidth !== null ? currentWidth : this.callbacks.getAnimatedPaddleWidth();
        }

        // 이미 활성화된 효과는 타이머만 갱신
        if (this.timers[effectName]) {
            clearTimeout(this.timers[effectName]);
        }

        this.activeEffects[effectName] = true;
        console.log(`⏰ ${effectName} 활성화 (${duration}ms)`);

        // 패들 크기 변경 애니메이션 시작
        if (isPaddleEffect && this.callbacks.getPaddleWidth && this.callbacks.startPaddleAnimation) {
            const newWidth = this.callbacks.getPaddleWidth();  // 효과 적용 후 목표 너비
            this.callbacks.startPaddleAnimation(oldWidth, newWidth);
        }

        // duration 후 효과 제거
        if (duration) {
            this.timers[effectName] = setTimeout(() => {
                // 패들 크기 복원 애니메이션
                if (isPaddleEffect && this.callbacks.getAnimatedPaddleWidth && this.callbacks.getPaddleWidth && this.callbacks.startPaddleAnimation) {
                    const beforeWidth = this.callbacks.getAnimatedPaddleWidth();  // 현재 애니메이션 적용된 너비
                    this.activeEffects[effectName] = false;
                    const afterWidth = this.callbacks.getPaddleWidth();  // 효과 해제 후 목표 너비
                    this.callbacks.startPaddleAnimation(beforeWidth, afterWidth);
                } else {
                    this.activeEffects[effectName] = false;
                }

                this.timers[effectName] = null;

                // 공 속도 복원 (ballSlow인 경우)
                if (effectName === 'ballSlow' && this.callbacks.restoreBallSpeed) {
                    this.callbacks.restoreBallSpeed();
                }

                console.log(`⏰ ${effectName} 종료`);
            }, duration);
        }
    }

    /**
     * 모든 효과 초기화
     */
    reset() {
        // 모든 타이머 취소
        Object.keys(this.timers).forEach(key => {
            if (this.timers[key]) {
                clearTimeout(this.timers[key]);
                this.timers[key] = null;
            }
        });

        // 효과 플래그 초기화
        this.activeEffects = {
            paddleExpanded: false,
            ballSlow: false,
            paddleShrink: false
        };
    }
}
