// ========================================
// 게임 상수
// ========================================

// 캔버스 크기
export const CANVAS = {
    WIDTH: 800,
    HEIGHT: 600
};

// 색상 정의
export const COLORS = {
    // 배경 색상
    BACKGROUND: '#1a1a2e',

    // 공 색상
    BALL: '#f59e0b',  // 주황색

    // 패들 그라디언트
    PADDLE_START: '#6366f1',  // 인디고
    PADDLE_END: '#8b5cf6',    // 보라 인디고

    // 벽돌 색상 (다양함)
    BRICK_COLORS: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6']
    // 빨강, 주황, 초록, 파랑, 보라
};

// 공 관련 상수
export const BALL = {
    RADIUS: 8,
    SPEED: 5
};

// 패들 관련 상수
export const PADDLE = {
    WIDTH: 100,
    HEIGHT: 15,
    SPEED: 7
};

// 벽돌 관련 상수
export const BRICK = {
    ROWS: 5,
    COLS: 9,
    WIDTH: 75,
    HEIGHT: 20,
    PADDING: 10,
    OFFSET_TOP: 60,
    OFFSET_LEFT: 35
};

// 게임 관련 상수
export const GAME = {
    INITIAL_LIVES: 3,  // 초기 생명
    MAX_LIVES: 5       // 최대 생명
};

// 아이템 시스템
export const ITEM = {
    SIZE: 20,           // 아이템 크기
    SPEED: 2,           // 아이템 낙하 속도
    DROP_CHANCE: 0.3    // 아이템 드롭 확률 (30%)
};

// 아이템 종류
export const ITEM_TYPES = {
    PADDLE_EXPAND: {
        id: 'paddle_expand',
        color: '#3b82f6',      // 파랑
        emoji: '➕',
        duration: 10000        // 10초
    },
    BALL_SLOW: {
        id: 'ball_slow',
        color: '#10b981',      // 초록
        emoji: '🐌',
        duration: 10000        // 10초
    },
    EXTRA_LIFE: {
        id: 'extra_life',
        color: '#ef4444',      // 빨강
        emoji: '❤️',
        duration: null         // 즉시 효과
    },
    PADDLE_SHRINK: {
        id: 'paddle_shrink',
        color: '#f59e0b',      // 주황
        emoji: '➖',
        duration: 10000        // 10초
    }
};

// 파티클 시스템
export const PARTICLE = {
    COUNT: 8,           // 벽돌당 생성될 파티클 수
    SIZE: 4,            // 파티클 크기
    SPEED: 3,           // 초기 속도
    GRAVITY: 0.2,       // 중력 효과
    LIFETIME: 60        // 생명 주기 (프레임)
};

// 애니메이션 시스템
export const ANIMATION = {
    // 이징 관련 상수
    EASING: {
        OVERSHOOT_STRENGTH: 1.70158  // 오버슈트 강도 (easeOutBack용 상수)
    },
    // 벽돌 파괴 애니메이션
    BRICK_DESTROY: {
        FRAGMENT_COUNT: 6,      // 조각 수
        FRAGMENT_SIZE: 8,       // 조각 크기
        SPREAD_SPEED: 4,        // 퍼짐 속도
        ROTATION_SPEED: 0.2,    // 회전 속도
        LIFETIME: 40            // 생명 주기
    },
    // 공 궤적
    BALL_TRAIL: {
        MAX_LENGTH: 10,         // 최대 궤적 길이
        FADE_SPEED: 0.1         // 페이드 속도
    },
    // 점수 팝업
    SCORE_POPUP: {
        FLOAT_SPEED: 2,         // 위로 떠오르는 속도
        LIFETIME: 60,           // 생명 주기
        FONT_SIZE: 20           // 글자 크기
    },
    // 패들 충돌 파동
    PADDLE_HIT: {
        WAVE_COUNT: 3,          // 파동 수
        WAVE_SPEED: 3,          // 파동 속도
        MAX_RADIUS: 40,         // 최대 반경
        LIFETIME: 20            // 생명 주기
    },
    // 패들 크기 변화
    PADDLE_RESIZE: {
        DURATION: 300,          // 애니메이션 지속 시간 (ms)
        EASING: 'easeOutElastic' // 이징 함수
    },
    // 생명력 변화
    LIFE_CHANGE: {
        SCALE_DURATION: 300,    // 크기 변화 지속 시간
        PULSE_COUNT: 3,         // 펄스 횟수
        SHAKE_INTENSITY: 5      // 흔들림 강도
    },
    // UI 팝업
    UI_POPUP: {
        FADE_DURATION: 200,     // 페이드 지속 시간
        SCALE_DURATION: 300,    // 크기 변화 지속 시간
        OVERSHOOT: 1.1          // 오버슈트 비율
    },
    // 레벨 전환
    LEVEL_TRANSITION: {
        FADE_DURATION: 500,     // 페이드 지속 시간
        ZOOM_SCALE: 1.5,        // 줌 비율
        TEXT_DISPLAY: 2000      // 텍스트 표시 시간
    }
};

// 난이도 설정
export const DIFFICULTY_SETTINGS = {
    easy: {
        ballSpeed: 4,
        paddleWidth: 120,
        brickRows: 3
    },
    normal: {
        ballSpeed: 5,
        paddleWidth: 100,
        brickRows: 5
    },
    hard: {
        ballSpeed: 7,
        paddleWidth: 80,
        brickRows: 7
    }
};
