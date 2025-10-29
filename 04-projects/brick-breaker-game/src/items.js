// ========================================
// 아이템 시스템
// ========================================

import { ITEM, ITEM_TYPES, CANVAS, PADDLE } from './constants.js';

// ========================================
// 아이템 배열
// ========================================

export let items = [];

// ========================================
// 아이템 생성
// ========================================

export function createItem(x, y) {
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

// ========================================
// 아이템 업데이트
// ========================================

export function updateItems(paddleX, getPaddleWidthCallback, applyItemEffectCallback) {
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
        const paddleWidth = getPaddleWidthCallback();
        const paddleY = CANVAS.HEIGHT - PADDLE.HEIGHT - 10;

        if (checkRectCollision(
            item.x, item.y, item.width, item.height,
            paddleX, paddleY, paddleWidth, PADDLE.HEIGHT
        )) {
            // 아이템 효과 적용
            applyItemEffectCallback(item.type);
            items.splice(i, 1);
        }
    }
}

// ========================================
// 아이템 애니메이션 업데이트
// ========================================

export function updateItemAnimations() {
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

// ========================================
// 아이템 그리기
// ========================================

export function drawAnimatedItems(ctx) {
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
// 아이템 초기화
// ========================================

export function resetItems() {
    items.length = 0;
}

// ========================================
// 유틸리티 함수
// ========================================

function checkRectCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 < x2 + w2 &&
           x1 + w1 > x2 &&
           y1 < y2 + h2 &&
           y1 + h1 > y2;
}
