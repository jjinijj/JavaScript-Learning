// ========================================
// 게임 상태 관리 (단순 객체 + 헬퍼 메서드)
// ========================================

import { GAME } from './constants.js';

/**
 * 게임 상태를 관리하는 객체
 * score, lives, difficulty, running, paused 상태를 포함
 */
export const gameState = {
    score: 0,
    lives: GAME.INITIAL_LIVES,
    difficulty: 'normal',
    running: false,
    paused: false,

    /**
     * 게임 진행 중인지 체크 (running && !paused)
     * @returns {boolean}
     */
    isPlaying() {
        return this.running && !this.paused;
    },

    /**
     * 게임 시작
     */
    start() {
        this.running = true;
        this.paused = false;
    },

    /**
     * 게임 정지
     */
    stop() {
        this.running = false;
        this.paused = false;
    },

    /**
     * 일시정지
     */
    pause() {
        if (this.running) {
            this.paused = true;
        }
    },

    /**
     * 재개
     */
    resume() {
        if (this.running) {
            this.paused = false;
        }
    },

    /**
     * 일시정지 토글
     */
    togglePause() {
        if (this.running) {
            this.paused = !this.paused;
        }
    },

    /**
     * 상태 초기화 (점수/생명만)
     */
    reset() {
        this.score = 0;
        this.lives = GAME.INITIAL_LIVES;
    }
};
