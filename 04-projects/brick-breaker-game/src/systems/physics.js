// ========================================
// 물리 및 충돌 감지 시스템
// ========================================

// ========================================
// 충돌 감지 유틸리티
// ========================================

/**
 * 사각형과 원의 충돌 감지 (AABB - Axis-Aligned Bounding Box)
 * @param {number} rectX - 사각형 X 좌표
 * @param {number} rectY - 사각형 Y 좌표
 * @param {number} rectWidth - 사각형 너비
 * @param {number} rectHeight - 사각형 높이
 * @param {number} circleX - 원 중심 X 좌표
 * @param {number} circleY - 원 중심 Y 좌표
 * @param {number} circleRadius - 원 반지름
 * @returns {boolean} 충돌 여부
 */
export function checkRectCircleCollision(rectX, rectY, rectWidth, rectHeight, circleX, circleY, circleRadius) {
    return (
        circleX + circleRadius > rectX &&
        circleX - circleRadius < rectX + rectWidth &&
        circleY + circleRadius > rectY &&
        circleY - circleRadius < rectY + rectHeight
    );
}

/**
 * 사각형-사각형 충돌 감지 (AABB)
 * @param {number} x1 - 첫 번째 사각형 X 좌표
 * @param {number} y1 - 첫 번째 사각형 Y 좌표
 * @param {number} w1 - 첫 번째 사각형 너비
 * @param {number} h1 - 첫 번째 사각형 높이
 * @param {number} x2 - 두 번째 사각형 X 좌표
 * @param {number} y2 - 두 번째 사각형 Y 좌표
 * @param {number} w2 - 두 번째 사각형 너비
 * @param {number} h2 - 두 번째 사각형 높이
 * @returns {boolean} 충돌 여부
 */
export function checkRectCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 < x2 + w2 &&
           x1 + w1 > x2 &&
           y1 < y2 + h2 &&
           y1 + h1 > y2;
}

/**
 * 원-원 충돌 감지
 * @param {number} x1 - 첫 번째 원 중심 X 좌표
 * @param {number} y1 - 첫 번째 원 중심 Y 좌표
 * @param {number} r1 - 첫 번째 원 반지름
 * @param {number} x2 - 두 번째 원 중심 X 좌표
 * @param {number} y2 - 두 번째 원 중심 Y 좌표
 * @param {number} r2 - 두 번째 원 반지름
 * @returns {boolean} 충돌 여부
 */
export function checkCircleCollision(x1, y1, r1, x2, y2, r2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < r1 + r2;
}

/**
 * 점이 사각형 안에 있는지 확인
 * @param {number} px - 점 X 좌표
 * @param {number} py - 점 Y 좌표
 * @param {number} rectX - 사각형 X 좌표
 * @param {number} rectY - 사각형 Y 좌표
 * @param {number} rectWidth - 사각형 너비
 * @param {number} rectHeight - 사각형 높이
 * @returns {boolean} 점이 사각형 안에 있는지 여부
 */
export function pointInRect(px, py, rectX, rectY, rectWidth, rectHeight) {
    return px >= rectX &&
           px <= rectX + rectWidth &&
           py >= rectY &&
           py <= rectY + rectHeight;
}

/**
 * 두 점 사이의 거리 계산
 * @param {number} x1 - 첫 번째 점 X 좌표
 * @param {number} y1 - 첫 번째 점 Y 좌표
 * @param {number} x2 - 두 번째 점 X 좌표
 * @param {number} y2 - 두 번째 점 Y 좌표
 * @returns {number} 거리
 */
export function distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 벡터 정규화 (단위 벡터로 변환)
 * @param {number} x - X 성분
 * @param {number} y - Y 성분
 * @returns {{x: number, y: number}} 정규화된 벡터
 */
export function normalize(x, y) {
    const len = Math.sqrt(x * x + y * y);
    if (len === 0) return { x: 0, y: 0 };
    return {
        x: x / len,
        y: y / len
    };
}

/**
 * 각도를 라디안으로 변환
 * @param {number} degrees - 각도 (도)
 * @returns {number} 라디안
 */
export function toRadians(degrees) {
    return degrees * Math.PI / 180;
}

/**
 * 라디안을 각도로 변환
 * @param {number} radians - 라디안
 * @returns {number} 각도 (도)
 */
export function toDegrees(radians) {
    return radians * 180 / Math.PI;
}
