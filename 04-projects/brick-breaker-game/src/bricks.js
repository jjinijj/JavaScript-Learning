// ========================================
// 벽돌 시스템
// ========================================

import { BRICK, COLORS, DIFFICULTY_SETTINGS } from './constants.js';

// ========================================
// 벽돌 배열
// ========================================

export let bricks = [];

// ========================================
// 벽돌 초기화
// ========================================

export function initBricks(difficulty) {
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
// 벽돌 그리기
// ========================================

export function drawBricks(ctx, difficulty) {
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

// ========================================
// 모든 벽돌 파괴 확인
// ========================================

export function checkAllBricksCleared(difficulty) {
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

// ========================================
// 벽돌 파괴
// ========================================

export function destroyBrick(c, r) {
    if (bricks[c] && bricks[c][r]) {
        bricks[c][r].status = 0;
        return true;
    }
    return false;
}

// ========================================
// 벽돌 가져오기
// ========================================

export function getBrick(c, r) {
    if (bricks[c] && bricks[c][r]) {
        return bricks[c][r];
    }
    return null;
}
