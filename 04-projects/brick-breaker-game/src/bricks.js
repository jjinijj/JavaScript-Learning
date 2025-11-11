// ========================================
// Brick 클래스 및 BrickManager
// ========================================

import { BRICK, COLORS, DIFFICULTY_SETTINGS } from './constants.js';

// ========================================
// Brick 클래스
// ========================================

export class Brick {
    constructor(col, row) {
        this.col = col;
        this.row = row;
        this.width = BRICK.WIDTH;
        this.height = BRICK.HEIGHT;
        this.status = 1; // 1: 존재, 0: 파괴됨

        // 위치 계산
        this.x = col * (BRICK.WIDTH + BRICK.PADDING) + BRICK.OFFSET_LEFT;
        this.y = row * (BRICK.HEIGHT + BRICK.PADDING) + BRICK.OFFSET_TOP;

        // 색상 (행에 따라)
        this.color = COLORS.BRICK_COLORS[row % COLORS.BRICK_COLORS.length];
    }

    /**
     * 벽돌 그리기
     * @param {CanvasRenderingContext2D} ctx - 캔버스 컨텍스트
     */
    draw(ctx) {
        if (this.status !== 1) return;

        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.width, this.height, 4);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    /**
     * 벽돌 파괴
     */
    destroy() {
        this.status = 0;
    }

    /**
     * 벽돌이 살아있는지 확인
     * @returns {boolean}
     */
    isAlive() {
        return this.status === 1;
    }

    /**
     * 벽돌 경계 반환
     * @returns {{x: number, y: number, width: number, height: number}}
     */
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

// ========================================
// BrickManager 클래스
// ========================================

export class BrickManager {
    constructor() {
        this.bricks = [];
        this.cols = BRICK.COLS;
        this.rows = 0;
    }

    /**
     * 벽돌 초기화
     * @param {string} difficulty - 난이도
     */
    init(difficulty) {
        const settings = DIFFICULTY_SETTINGS[difficulty];
        this.rows = settings.brickRows;
        this.bricks = [];

        for (let c = 0; c < this.cols; c++) {
            for (let r = 0; r < this.rows; r++) {
                this.bricks.push(new Brick(c, r));
            }
        }

        console.log('벽돌 초기화:', this.rows, 'x', this.cols, '(난이도:', difficulty + ')');
    }

    /**
     * 모든 벽돌 그리기
     * @param {CanvasRenderingContext2D} ctx - 캔버스 컨텍스트
     */
    draw(ctx) {
        this.bricks.forEach(brick => brick.draw(ctx));
    }

    /**
     * 모든 벽돌이 파괴되었는지 확인
     * @returns {boolean}
     */
    checkAllCleared() {
        return this.bricks.every(brick => !brick.isAlive());
    }

    /**
     * 특정 위치의 벽돌 가져오기 (col, row 인덱스 사용)
     * @param {number} col - 열 인덱스
     * @param {number} row - 행 인덱스
     * @returns {Brick|null}
     */
    getBrickAt(col, row) {
        return this.bricks.find(brick => brick.col === col && brick.row === row) || null;
    }

    /**
     * 모든 벽돌 배열 반환
     * @returns {Brick[]}
     */
    getBricks() {
        return this.bricks;
    }

    /**
     * 살아있는 벽돌들만 반환
     * @returns {Brick[]}
     */
    getAliveBricks() {
        return this.bricks.filter(brick => brick.isAlive());
    }

    /**
     * 공과 충돌하는 벽돌 찾기
     * @param {number} ballX - 공 X 좌표
     * @param {number} ballY - 공 Y 좌표
     * @param {number} ballRadius - 공 반지름
     * @param {Function} checkCollision - 충돌 감지 함수 (rectX, rectY, rectW, rectH, circleX, circleY, circleR) => boolean
     * @returns {Brick|null} 충돌한 벽돌 또는 null
     */
    checkBallBrickCollision(ballX, ballY, ballRadius, checkCollision) {
        const aliveBricks = this.getAliveBricks();

        for (const brick of aliveBricks) {
            if (checkCollision(brick.x, brick.y, brick.width, brick.height, ballX, ballY, ballRadius)) {
                return brick;
            }
        }

        return null;
    }

    /**
     * 벽돌 파괴 (BrickManager를 통한 관리)
     * @param {Brick} brick - 파괴할 벽돌
     */
    destroyBrick(brick) {
        if (brick && brick.isAlive()) {
            brick.destroy();
            // 추후 확장 가능: 파괴 이벤트, 통계, 주변 벽돌 영향 등
        }
    }
}
