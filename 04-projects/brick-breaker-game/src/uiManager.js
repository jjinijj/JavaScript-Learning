// ========================================
// UIManager 클래스
// ========================================

/**
 * UI 표시 업데이트를 담당하는 클래스
 *
 * 책임:
 * - 점수, 생명, 통계 등 게임 정보 표시
 * - 볼륨 슬라이더 UI 업데이트
 * - 음소거 버튼 상태 표시
 *
 * 책임 범위 외:
 * - 화면 전환 (game.js 함수로 처리)
 * - 이벤트 핸들러 등록 (game.js에서 처리)
 * - 애니메이션 (AnimationManager가 담당)
 */
export class UIManager {
    constructor() {
        // DOM 요소 캐싱 (표시 관련만)
        this.score = document.querySelector('#score');
        this.lives = document.querySelector('#lives');

        // 통계 관련 요소
        this.stats = {
            totalGames: document.querySelector('#totalGames'),
            bestScore: document.querySelector('#bestScore'),
            totalBricks: document.querySelector('#totalBricks')
        };

        // 볼륨 관련 요소
        this.volume = {
            bgmSlider: document.querySelector('#bgmVolume'),
            bgmValue: document.querySelector('#bgmVolumeValue'),
            sfxSlider: document.querySelector('#sfxVolume'),
            sfxValue: document.querySelector('#sfxVolumeValue')
        };

        // 음소거 버튼
        this.muteBtn = document.querySelector('#muteBtn');

        // 게임 오버/승리 화면 점수 표시
        this.finalScore = document.querySelector('#finalScore');
        this.highScore = document.querySelector('#highScore');
        this.winFinalScore = document.querySelector('#winFinalScore');
    }

    /**
     * 점수 표시 업데이트
     * @param {number} score - 현재 점수
     */
    updateScore(score) {
        if (this.score) {
            this.score.textContent = score;
        }
    }

    /**
     * 생명 표시 업데이트
     * @param {number} lives - 현재 생명 수
     */
    updateLives(lives) {
        if (!this.lives) return;

        let text = '';
        for (let i = 0; i < lives; i++) {
            text += '❤️';
        }
        this.lives.textContent = text;
    }

    /**
     * 점수와 생명을 한 번에 업데이트 (편의 메서드)
     * @param {number} score - 현재 점수
     * @param {number} lives - 현재 생명 수
     */
    updateDisplay(score, lives) {
        this.updateScore(score);
        this.updateLives(lives);
    }

    /**
     * 통계 표시 업데이트
     * @param {Object} stats - 통계 객체
     * @param {number} stats.totalGames - 총 게임 수
     * @param {number} stats.bestScore - 최고 점수
     * @param {number} stats.totalBricks - 총 파괴한 벽돌 수
     */
    updateStats(stats) {
        if (this.stats.totalGames) {
            this.stats.totalGames.textContent = stats.totalGames;
        }
        if (this.stats.bestScore) {
            this.stats.bestScore.textContent = stats.bestScore;
        }
        if (this.stats.totalBricks) {
            this.stats.totalBricks.textContent = stats.totalBricks;
        }
    }

    /**
     * 볼륨 슬라이더 UI 업데이트
     * @param {Object} volume - 볼륨 객체
     * @param {number} volume.BGM - BGM 볼륨 (0.0 ~ 1.0)
     * @param {number} volume.SFX - SFX 볼륨 (0.0 ~ 1.0)
     */
    updateVolume(volume) {
        // BGM 볼륨
        if (this.volume.bgmSlider) {
            const bgmPercent = Math.round(volume.BGM * 100);
            this.volume.bgmSlider.value = bgmPercent;
            this.volume.bgmValue.textContent = bgmPercent + '%';
        }

        // SFX 볼륨
        if (this.volume.sfxSlider) {
            const sfxPercent = Math.round(volume.SFX * 100);
            this.volume.sfxSlider.value = sfxPercent;
            this.volume.sfxValue.textContent = sfxPercent + '%';
        }
    }

    /**
     * 음소거 버튼 표시 업데이트
     * @param {boolean} muted - 음소거 상태
     * @param {string} text - 버튼 텍스트 (다국어)
     */
    updateMuteButton(muted, text) {
        if (!this.muteBtn) return;

        const icon = muted ? '🔇' : '🔊';
        this.muteBtn.textContent = `${icon} ${text}`;
    }

    /**
     * 게임 오버 화면 점수 표시 업데이트
     * @param {number} score - 최종 점수
     * @param {number} bestScore - 최고 점수
     */
    updateGameOverScore(score, bestScore) {
        if (this.finalScore) {
            this.finalScore.textContent = score;
        }
        if (this.highScore) {
            this.highScore.textContent = bestScore;
        }
    }

    /**
     * 승리 화면 점수 표시 업데이트
     * @param {number} score - 최종 점수
     */
    updateWinScore(score) {
        if (this.winFinalScore) {
            this.winFinalScore.textContent = score;
        }
    }

    /**
     * Lives 애니메이션 CSS 클래스 제거
     */
    resetLifeAnimation() {
        if (this.lives) {
            this.lives.classList.remove('life-gain', 'life-loss');
        }
    }

    /**
     * Lives 요소 반환 (AnimationManager에서 사용)
     * @returns {HTMLElement} lives 요소
     */
    getLivesElement() {
        return this.lives;
    }
}
