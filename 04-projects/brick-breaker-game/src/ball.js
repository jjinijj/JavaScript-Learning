// ========================================
// Ball 클래스
// ========================================

import { CANVAS, COLORS, BALL, PADDLE, DIFFICULTY_SETTINGS } from './constants.js';
import { checkRectCircleCollision } from './physics.js';

export class Ball {
    constructor() {
        this.radius = BALL.RADIUS;
        this.launched = false;

        // 초기 위치와 속도는 reset에서 설정
        this.x = 0;
        this.y = 0;
        this.speedX = 0;
        this.speedY = 0;
        this.baseSpeed = 0; // 난이도 기준 속도 (효과 무시)
    }

    /**
     * 공을 초기 상태로 리셋
     * @param {string} difficulty - 난이도 ('easy', 'normal', 'hard')
     */
    reset(difficulty) {
        const settings = DIFFICULTY_SETTINGS[difficulty];

        this.x = CANVAS.WIDTH / 2;
        // 패들 위 정확한 위치: PADDLE.HEIGHT(15) + 10(여백) + BALL.RADIUS + 1(간격)
        this.y = CANVAS.HEIGHT - PADDLE.HEIGHT - 10 - this.radius - 1;
        this.speedX = settings.ballSpeed;
        this.speedY = -settings.ballSpeed;
        this.baseSpeed = settings.ballSpeed; // 기준 속도 저장
        this.launched = false;

        console.log('공 초기화:', this.x, this.y, '속도:', settings.ballSpeed);
    }

    /**
     * 공 발사
     */
    launch() {
        if (!this.launched) {
            this.launched = true;
            console.log('공 발사!');
        }
    }

    /**
     * 공 위치 업데이트
     * @param {number} paddleX - 패들 X 좌표 (발사 전 패들 위에 고정용)
     * @param {number} paddleWidth - 패들 너비 (발사 전 패들 위에 고정용)
     * @returns {string|null} 벽 충돌 정보 ('left', 'right', 'top', null)
     */
    update(paddleX, paddleWidth) {
        // 공이 발사되지 않았으면 패들 위에 고정
        if (!this.launched) {
            this.x = paddleX + paddleWidth / 2;
            // 패들 위 정확한 위치: PADDLE.HEIGHT(15) + 10(여백) + BALL.RADIUS + 1(간격)
            this.y = CANVAS.HEIGHT - PADDLE.HEIGHT - 10 - this.radius - 1;
            return null;
        }

        // 공 이동
        this.x += this.speedX;
        this.y += this.speedY;

        // 벽 충돌 처리 및 결과 반환
        return this.checkWallCollision();
    }

    /**
     * 벽 충돌 감지 및 처리
     * @returns {string|null} 충돌한 벽 ('left', 'right', 'top', null)
     */
    checkWallCollision() {
        let collision = null;

        // 오른쪽 벽 충돌
        if (this.x + this.radius > CANVAS.WIDTH) {
            this.x = CANVAS.WIDTH - this.radius;
            this.speedX = -Math.abs(this.speedX); // 항상 왼쪽으로
            collision = 'right';
        }
        // 왼쪽 벽 충돌
        else if (this.x - this.radius < 0) {
            this.x = this.radius;
            this.speedX = Math.abs(this.speedX); // 항상 오른쪽으로
            collision = 'left';
        }

        // 상단 벽 충돌
        if (this.y - this.radius < 0) {
            this.y = this.radius;
            this.speedY = Math.abs(this.speedY); // 항상 아래로
            collision = 'top';
        }

        return collision;
    }

    /**
     * 하단 충돌 체크 (생명 감소용)
     * @returns {boolean} 하단에 닿았으면 true
     */
    checkBottomCollision() {
        return this.y + this.radius > CANVAS.HEIGHT;
    }

    /**
     * 패들 충돌 감지 및 처리
     * @param {number} paddleX - 패들 X 좌표
     * @param {number} paddleY - 패들 Y 좌표
     * @param {number} paddleWidth - 패들 너비
     * @param {number} paddleHeight - 패들 높이
     * @returns {boolean} 충돌했으면 true
     */
    checkPaddleCollision(paddleX, paddleY, paddleWidth, paddleHeight) {
        if (!this.launched) return false;

        const isColliding = checkRectCircleCollision(
            paddleX, paddleY, paddleWidth, paddleHeight,
            this.x, this.y, this.radius
        );

        if (isColliding) {
            // 패들의 어느 부분에 맞았는지에 따라 반사각 조정
            // hitPos: 0 (왼쪽 끝) ~ 0.5 (중앙) ~ 1 (오른쪽 끝)
            const hitPos = (this.x - paddleX) / paddleWidth;

            // 반사각 계산: -60도 ~ 0도 ~ +60도
            const maxAngle = 60; // 최대 반사각 (도)
            const angleInDegrees = (hitPos - 0.5) * 2 * maxAngle; // -60 ~ +60
            const angleInRadians = angleInDegrees * Math.PI / 180;

            // 현재 속도 크기 계산 (아이템 효과 적용된 상태)
            const currentSpeed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);

            // 속도 벡터를 각도로 변환 (현재 속도 크기 유지)
            // baseSpeed가 아닌 currentSpeed 사용 → 아이템 효과 유지
            this.speedX = currentSpeed * Math.sin(angleInRadians);
            this.speedY = -currentSpeed * Math.cos(angleInRadians); // 위쪽 방향 (음수)

            return true;
        }

        return false;
    }

    /**
     * 공 속도 조정 (아이템 효과용)
     * @param {number} multiplier - 속도 배율
     */
    adjustSpeed(multiplier) {
        this.speedX *= multiplier;
        this.speedY *= multiplier;
    }

    /**
     * 공 속도 복원 (정규화)
     * 아이템 효과 해제 시 난이도 기준 속도로 복원
     * @param {number} targetSpeed - 목표 속도 (난이도 설정값)
     */
    restoreSpeed(targetSpeed) {
        const currentSpeed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
        if (currentSpeed === 0) return; // 0으로 나누기 방지

        // 현재 방향 유지하면서 속도 크기만 targetSpeed로 변경
        this.speedX = (this.speedX / currentSpeed) * targetSpeed;
        this.speedY = (this.speedY / currentSpeed) * targetSpeed;
    }

    /**
     * 공 그리기
     * @param {CanvasRenderingContext2D} ctx - 캔버스 컨텍스트
     */
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.BALL;
        ctx.fill();
        ctx.closePath();
    }

    /**
     * 현재 위치 반환 (애니메이션용)
     * @returns {{x: number, y: number}}
     */
    getPosition() {
        return { x: this.x, y: this.y };
    }
}
