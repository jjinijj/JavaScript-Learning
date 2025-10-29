// ========================================
// 입력 처리 시스템 (키보드, 마우스)
// ========================================

// 입력 상태
let rightPressed = false;
let leftPressed = false;

// 입력 상태 가져오기
export function isRightPressed() {
    return rightPressed;
}

export function isLeftPressed() {
    return leftPressed;
}

// 입력 상태 초기화
export function resetInputState() {
    rightPressed = false;
    leftPressed = false;
}

// 입력 이벤트 핸들러 설정
export function setupInputHandlers(canvas, callbacks) {
    // 키보드 눌림 이벤트
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Right' || e.key === 'ArrowRight') {
            rightPressed = true;
        } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
            leftPressed = true;
        } else if (e.key === ' ' || e.key === 'Spacebar') {
            // 스페이스바로 공 발사
            if (callbacks.onSpacePress) {
                callbacks.onSpacePress();
            }
        } else if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
            // ESC 또는 P 키로 일시정지/재개
            if (callbacks.onPausePress) {
                callbacks.onPausePress();
            }
        }
    });

    // 키보드 뗌 이벤트
    document.addEventListener('keyup', (e) => {
        if (e.key === 'Right' || e.key === 'ArrowRight') {
            rightPressed = false;
        } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
            leftPressed = false;
        }
    });

    // 마우스 이동 이벤트
    canvas.addEventListener('mousemove', (e) => {
        if (callbacks.onMouseMove) {
            callbacks.onMouseMove(e);
        }
    });

    // 마우스 클릭 이벤트
    canvas.addEventListener('click', () => {
        if (callbacks.onMouseClick) {
            callbacks.onMouseClick();
        }
    });
}
