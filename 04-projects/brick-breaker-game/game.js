// ========================================
// 1단계: 캔버스 설정 및 기본 구조
// ========================================

// 캔버스 상수
const CANVAS = {
    WIDTH: 800,
    HEIGHT: 600
};

// ========================================
// 색상 상수
// ========================================
const COLORS = {
    // 게임 배경
    BACKGROUND: '#1a1a2e',

    // 공 색상
    BALL: '#f59e0b',  // 주황색

    // 패들 그라디언트
    PADDLE_START: '#6366f1',  // 보라색
    PADDLE_END: '#8b5cf6',    // 진한 보라색

    // 벽돌 색상 (행별)
    BRICK_COLORS: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6']
    // 빨강, 주황, 초록, 파랑, 보라
};

// ========================================
// 2단계: 공 관련 상수 및 변수
// ========================================
const BALL = {
    RADIUS: 8,
    SPEED: 5
};

// ========================================
// 3단계: 패들 관련 상수 및 변수
// ========================================
const PADDLE = {
    WIDTH: 100,
    HEIGHT: 15,
    SPEED: 7
};

// ========================================
// 4단계: 벽돌 관련 상수 및 변수
// ========================================
const BRICK = {
    ROWS: 5,
    COLS: 9,
    WIDTH: 75,
    HEIGHT: 20,
    PADDING: 10,
    OFFSET_TOP: 60,
    OFFSET_LEFT: 35
};

// 캔버스 관련 변수
let canvas;
let ctx;

// 공 관련 변수
let ballX;
let ballY;
let ballSpeedX;
let ballSpeedY;

// 패들 관련 변수
let paddleX;
let rightPressed = false;
let leftPressed = false;

// 벽돌 관련 변수
let bricks = [];

// ========================================
// 6단계: 점수 및 생명 시스템
// ========================================
const GAME = {
    MAX_LIVES: 5  // 최대 생명 수
};

// ========================================
// 11단계: 아이템 시스템
// ========================================
const ITEM = {
    SIZE: 20,           // 아이템 크기
    SPEED: 2,           // 아이템 낙하 속도
    DROP_CHANCE: 0.3    // 아이템 드롭 확률 (30%)
};

// ========================================
// 입자 효과 시스템
// ========================================
const PARTICLE = {
    COUNT: 8,           // 벽돌당 생성되는 입자 개수
    SIZE: 4,            // 입자 크기
    SPEED: 3,           // 초기 속도
    GRAVITY: 0.2,       // 중력 가속도
    LIFETIME: 60        // 생명 주기 (프레임 수)
};

// 아이템 타입
const ITEM_TYPES = {
    PADDLE_EXPAND: {
        id: 'paddle_expand',
        color: '#3b82f6',      // 파란색
        emoji: '🟦',
        duration: 10000        // 10초
    },
    BALL_SLOW: {
        id: 'ball_slow',
        color: '#10b981',      // 초록색
        emoji: '🟩',
        duration: 10000        // 10초
    },
    EXTRA_LIFE: {
        id: 'extra_life',
        color: '#ef4444',      // 빨간색
        emoji: '❤️',
        duration: null         // 즉시 효과
    },
    PADDLE_SHRINK: {
        id: 'paddle_shrink',
        color: '#f59e0b',      // 주황색
        emoji: '🟥',
        duration: 10000        // 10초
    }
};

// 아이템 배열
let items = [];

// 입자 배열
let particles = [];

// 활성화된 효과들
let activeEffects = {
    paddleExpanded: false,
    ballSlow: false,
    paddleShrink: false
};

// 효과 타이머 ID 저장
let effectTimers = {
    paddleExpanded: null,
    ballSlow: null,
    paddleShrink: null
};

// ========================================
// 6단계: 점수 및 생명 시스템
// ========================================
let score = 0;
let lives = 3;
let ballLaunched = false; // 공 발사 여부

// ========================================
// 7단계: 게임 상태 관리
// ========================================
let gameRunning = false;  // 게임 진행 중
let gamePaused = false;   // 일시정지

// ========================================
// 8단계: 난이도 및 통계 시스템
// ========================================
let difficulty = 'normal'; // 난이도

// ========================================
// 언어 시스템 (i18n)
// ========================================
let currentLanguage = 'ko'; // 현재 언어
let translations = {};      // 로드된 번역 데이터

// ========================================
// 테마 시스템
// ========================================
let currentTheme = 'classic'; // 현재 테마

// 난이도별 설정
const DIFFICULTY_SETTINGS = {
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

// 게임 통계
let stats = {
    totalGames: 0,
    bestScore: 0,
    totalBricks: 0
};

// ========================================
// 사운드 시스템
// ========================================
let audioContext = null;
let isMuted = false;

// DOM 요소 캐싱
const UI = {};

// ========================================
// 언어 시스템 함수
// ========================================

// 번역 텍스트 가져오기 (translate의 약자)
function t(key) {
    return translations[key] || key;
}

// JSON 파일에서 언어 로드
async function loadLanguage(lang) {
    try {
        const response = await fetch(`lang/${lang}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load language: ${lang}`);
        }
        translations = await response.json();
        console.log(`✅ 언어 로드 완료: ${lang}`);
        return true;
    } catch (error) {
        console.error(`❌ 언어 로드 실패: ${lang}`, error);
        return false;
    }
}

// 언어 설정 및 UI 업데이트
async function setLanguage(lang) {
    currentLanguage = lang;
    const success = await loadLanguage(lang);

    if (success) {
        updateLanguageUI();
        localStorage.setItem('language', lang);

        // HTML lang 속성 업데이트
        document.documentElement.lang = lang;

        // 페이지 제목 업데이트
        document.title = t('pageTitle');

        console.log(`🌐 언어 변경: ${lang}`);
    }
}

// 모든 UI 요소의 언어 업데이트
function updateLanguageUI() {
    // data-i18n 속성을 가진 모든 요소 찾기
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = t(key);

        // innerHTML로 설정 (br 태그 지원)
        if (translation.includes('<br>')) {
            element.innerHTML = translation;
        } else {
            element.textContent = translation;
        }
    });

    // 특수한 경우: "레벨 X 완료!" 같은 동적 텍스트
    updateDynamicTexts();
}

// 동적 텍스트 업데이트 (숫자가 포함된 텍스트)
function updateDynamicTexts() {
    // "레벨 X 완료!" 패턴 - 나중에 필요시 구현
}

// ========================================
// 테마 시스템 함수
// ========================================

// 테마 설정
function setTheme(theme) {
    currentTheme = theme;

    // HTML body에 data-theme 속성 설정
    if (theme === 'classic') {
        document.body.removeAttribute('data-theme');
    } else {
        document.body.setAttribute('data-theme', theme);
    }

    // LocalStorage에 저장
    localStorage.setItem('theme', theme);

    console.log('🎨 테마 변경:', theme);
}

// ========================================
// 사운드 시스템 함수
// ========================================

// AudioContext 초기화
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// 비프 사운드 재생
function playBeep(frequency, duration, volume = 0.3) {
    if (isMuted || !audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'square';

    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

// 벽돌 파괴 사운드
function playBrickBreakSound() {
    playBeep(800, 0.1, 0.2);
}

// 패들 충돌 사운드
function playPaddleHitSound() {
    playBeep(300, 0.1, 0.2);
}

// 벽 충돌 사운드
function playWallHitSound() {
    playBeep(200, 0.05, 0.15);
}

// 생명 손실 사운드
function playLifeLostSound() {
    playBeep(150, 0.3, 0.25);
}

// 게임 오버 사운드
function playGameOverSound() {
    if (isMuted || !audioContext) return;
    playBeep(400, 0.15, 0.2);
    setTimeout(() => playBeep(300, 0.15, 0.2), 150);
    setTimeout(() => playBeep(200, 0.3, 0.2), 300);
}

// 게임 승리 사운드
function playWinSound() {
    if (isMuted || !audioContext) return;
    playBeep(400, 0.1, 0.2);
    setTimeout(() => playBeep(500, 0.1, 0.2), 100);
    setTimeout(() => playBeep(600, 0.2, 0.2), 200);
}

// ========================================
// 아이템 시스템 함수
// ========================================

// 아이템 생성
function createItem(x, y) {
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

// 아이템 업데이트 (이동)
function updateItems() {
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
        const paddleWidth = getPaddleWidth();
        const paddleY = CANVAS.HEIGHT - PADDLE.HEIGHT - 10;

        if (checkRectCollision(
            item.x, item.y, item.width, item.height,
            paddleX, paddleY, paddleWidth, PADDLE.HEIGHT
        )) {
            // 아이템 효과 적용
            applyItemEffect(item.type);
            items.splice(i, 1);
        }
    }
}

// 사각형-사각형 충돌 검사
function checkRectCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 < x2 + w2 &&
           x1 + w1 > x2 &&
           y1 < y2 + h2 &&
           y1 + h1 > y2;
}

// 아이템 효과 적용
function applyItemEffect(itemType) {
    console.log('✨ 아이템 획득:', itemType.emoji);

    switch (itemType.id) {
        case 'paddle_expand':
            // 패들 축소 효과가 활성화되어 있으면 취소
            if (activeEffects.paddleShrink) {
                deactivateEffect('paddleShrink');
            }
            activateEffect('paddleExpanded', itemType.duration);
            break;

        case 'ball_slow':
            activateEffect('ballSlow', itemType.duration);
            // 현재 공 속도 감소
            ballSpeedX *= 0.7;
            ballSpeedY *= 0.7;
            break;

        case 'extra_life':
            if (lives < GAME.MAX_LIVES) {
                lives++;
                updateDisplay();
                console.log('❤️ 생명 +1');
            } else {
                console.log('❤️ 생명이 이미 최대입니다 (최대 ' + GAME.MAX_LIVES + '개)');
            }
            break;

        case 'paddle_shrink':
            // 패들 확대 효과가 활성화되어 있으면 취소
            if (activeEffects.paddleExpanded) {
                deactivateEffect('paddleExpanded');
            }
            activateEffect('paddleShrink', itemType.duration);
            break;
    }
}

// 공 속도 복원
function restoreBallSpeed() {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    const speed = Math.sqrt(ballSpeedX * ballSpeedX + ballSpeedY * ballSpeedY);
    const normalSpeed = settings.ballSpeed;
    ballSpeedX = (ballSpeedX / speed) * normalSpeed;
    ballSpeedY = (ballSpeedY / speed) * normalSpeed;
}

// 효과 비활성화
function deactivateEffect(effectName) {
    // 타이머 취소
    if (effectTimers[effectName]) {
        clearTimeout(effectTimers[effectName]);
        effectTimers[effectName] = null;
    }

    // 효과 플래그 false
    activeEffects[effectName] = false;

    // 공 속도 복원 (ballSlow인 경우)
    if (effectName === 'ballSlow') {
        restoreBallSpeed();
    }

    console.log(`⏰ ${effectName} 비활성화됨`);
}

// 효과 활성화
function activateEffect(effectName, duration) {
    // 이미 활성화된 효과는 타이머만 갱신
    if (effectTimers[effectName]) {
        clearTimeout(effectTimers[effectName]);
    }

    activeEffects[effectName] = true;
    console.log(`⏰ ${effectName} 활성화 (${duration}ms)`);

    // duration 후 효과 제거
    if (duration) {
        effectTimers[effectName] = setTimeout(() => {
            activeEffects[effectName] = false;
            effectTimers[effectName] = null;

            // 공 속도 복원 (ballSlow인 경우)
            if (effectName === 'ballSlow') {
                restoreBallSpeed();
            }

            console.log(`⏰ ${effectName} 종료`);
        }, duration);
    }
}

// 현재 패들 너비 계산 (효과 반영)
function getPaddleWidth() {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    let width = settings.paddleWidth;

    if (activeEffects.paddleExpanded) {
        width *= 1.5;
    }
    if (activeEffects.paddleShrink) {
        width *= 0.7;
    }

    return width;
}

// ========================================
// 입자 효과 함수
// ========================================

// 입자 생성 (벽돌 파괴 시)
function createParticles(x, y, color) {
    for (let i = 0; i < PARTICLE.COUNT; i++) {
        // 랜덤한 방향으로 튀어나가는 속도
        const angle = (Math.PI * 2 * i) / PARTICLE.COUNT + (Math.random() - 0.5) * 0.5;
        const speed = PARTICLE.SPEED * (0.5 + Math.random() * 0.5);

        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: PARTICLE.SIZE * (0.5 + Math.random() * 0.5),
            color: color,
            life: PARTICLE.LIFETIME,
            maxLife: PARTICLE.LIFETIME
        });
    }
}

// 입자 업데이트
function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // 위치 업데이트
        p.x += p.vx;
        p.y += p.vy;

        // 중력 적용
        p.vy += PARTICLE.GRAVITY;

        // 생명 감소
        p.life--;

        // 수명이 다한 입자 제거
        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

// 입자 그리기
function drawParticles() {
    particles.forEach(p => {
        const alpha = p.life / p.maxLife; // 투명도 (점점 투명해짐)

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        ctx.restore();
    });
}

// 아이템 그리기
function drawItems() {
    items.forEach(item => {
        // 사각형 배경
        ctx.fillStyle = item.type.color;
        ctx.fillRect(item.x, item.y, item.width, item.height);

        // 이모지
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.type.emoji, item.x + item.width / 2, item.y + item.height / 2);
    });
}

// 초기화 함수
async function init() {
    console.log('게임 초기화 시작...');

    // 언어 설정 로드
    const savedLanguage = localStorage.getItem('language') || 'ko';
    await setLanguage(savedLanguage);

    // 테마 설정 로드
    const savedTheme = localStorage.getItem('theme') || 'classic';
    setTheme(savedTheme);

    // 캔버스 요소 가져오기
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    // 캔버스 크기 설정
    canvas.width = CANVAS.WIDTH;
    canvas.height = CANVAS.HEIGHT;

    console.log('캔버스 설정 완료:', CANVAS.WIDTH, 'x', CANVAS.HEIGHT);

    // DOM 요소 캐싱 (에러 체크 포함)
    const uiElements = [
        'score', 'lives',
        'finalScore', 'highScore', 'winFinalScore',
        'totalGames', 'bestScore', 'totalBricks',
        'startScreen', 'pauseScreen', 'gameOverScreen', 'winScreen',
        'difficultySelect', 'languageSelect', 'themeSelect', 'muteBtn', 'fullscreenBtn'
    ];

    uiElements.forEach(id => {
        const element = document.getElementById(id);
        if (!element) {
            console.error(`❌ UI 요소를 찾을 수 없음: ${id}`);
        } else {
            UI[id] = element;
        }
    });

    console.log('✅ UI 요소 캐싱 완료:', Object.keys(UI).length, '개');

    // 공 초기화
    resetBall();

    // 패들 초기화
    resetPaddle();

    // 벽돌 초기화
    initBricks();

    // 점수 및 생명 초기화
    score = 0;
    lives = 3;
    updateDisplay();

    // 이벤트 리스너 등록
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);
    canvas.addEventListener('mousemove', mouseMoveHandler);
    canvas.addEventListener('click', mouseClickHandler);

    // 통계 로드
    loadStats();
    updateStatsDisplay();

    // UI 버튼 이벤트 등록
    document.getElementById('startBtn').addEventListener('click', startGame);
    document.getElementById('pauseBtn').addEventListener('click', togglePause);
    document.getElementById('resumeBtn').addEventListener('click', togglePause);
    document.getElementById('restartBtn').addEventListener('click', restartGame);
    document.getElementById('menuBtn').addEventListener('click', showMenu);
    document.getElementById('quitBtn').addEventListener('click', showMenu);
    document.getElementById('playAgainBtn').addEventListener('click', restartGame);
    document.getElementById('winMenuBtn').addEventListener('click', showMenu);
    UI.muteBtn.addEventListener('click', toggleMute);
    UI.fullscreenBtn.addEventListener('click', toggleFullscreen);

    // 언어 선택 이벤트 등록
    UI.languageSelect.value = currentLanguage; // 현재 언어로 설정
    UI.languageSelect.addEventListener('change', (e) => {
        setLanguage(e.target.value);
    });

    // 테마 선택 이벤트 등록
    UI.themeSelect.value = currentTheme; // 현재 테마로 설정
    UI.themeSelect.addEventListener('change', (e) => {
        setTheme(e.target.value);
    });

    // 게임 루프 시작
    gameLoop();
}

// 통계 저장
function saveStats() {
    localStorage.setItem('brickBreakerStats', JSON.stringify(stats));
    console.log('통계 저장됨:', stats);
}

// 통계 로드
function loadStats() {
    const saved = localStorage.getItem('brickBreakerStats');
    if (saved) {
        stats = JSON.parse(saved);
        console.log('통계 로드됨:', stats);
    }
}

// 통계 표시 업데이트
function updateStatsDisplay() {
    UI.totalGames.textContent = stats.totalGames;
    UI.bestScore.textContent = stats.bestScore;
    UI.totalBricks.textContent = stats.totalBricks;
}

// 음소거 토글
function toggleMute() {
    isMuted = !isMuted;
    UI.muteBtn.textContent = isMuted ? '🔇 소리' : '🔊 소리';
    console.log('음소거:', isMuted);
}

// 전체화면 토글
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        console.log('전체화면 진입');
    } else {
        document.exitFullscreen();
        console.log('전체화면 종료');
    }
}

// 아이템 및 효과 초기화
function resetItems() {
    items = [];
    particles = [];  // 입자도 초기화

    // 모든 타이머 취소
    Object.keys(effectTimers).forEach(key => {
        if (effectTimers[key]) {
            clearTimeout(effectTimers[key]);
            effectTimers[key] = null;
        }
    });

    // 효과 플래그 초기화
    activeEffects = {
        paddleExpanded: false,
        ballSlow: false,
        paddleShrink: false
    };
}

// 게임 시작
function startGame() {
    // AudioContext 초기화 (사용자 상호작용 후 초기화)
    initAudio();

    // 난이도 가져오기
    difficulty = UI.difficultySelect.value;

    // 난이도에 따라 초기화
    initBricks();
    resetBall();
    resetPaddle();
    resetItems();

    gameRunning = true;
    gamePaused = false;
    UI.startScreen.classList.add('hidden');
    console.log('게임 시작! 난이도:', difficulty);
}

// 일시정지 토글
function togglePause() {
    if (!gameRunning) return;

    gamePaused = !gamePaused;

    if (gamePaused) {
        UI.pauseScreen.classList.remove('hidden');
        console.log('일시정지');
    } else {
        UI.pauseScreen.classList.add('hidden');
        console.log('재개');
    }
}

// 게임 재시작
function restartGame() {
    UI.gameOverScreen.classList.add('hidden');

    // 게임 상태 초기화
    score = 0;
    lives = 3;
    updateDisplay();

    // 게임 요소 리셋
    resetBall();
    resetPaddle();
    initBricks();
    resetItems();

    // 게임 시작
    gameRunning = true;
    gamePaused = false;
    console.log('게임 재시작');
}

// 메뉴로 돌아가기
function showMenu() {
    gameRunning = false;
    gamePaused = false;

    UI.pauseScreen.classList.add('hidden');
    UI.gameOverScreen.classList.add('hidden');
    UI.winScreen.classList.add('hidden');
    UI.startScreen.classList.remove('hidden');

    console.log('메뉴로 이동');
}

// 게임 승리 (모든 벽돌 파괴)
function gameWin() {
    gameRunning = false;
    gamePaused = true;

    // 게임 승리 사운드
    playWinSound();

    UI.winFinalScore.textContent = score;
    UI.winScreen.classList.remove('hidden');

    // 통계 업데이트
    stats.totalGames++;
    if (score > stats.bestScore) {
        stats.bestScore = score;
    }
    saveStats();
    updateStatsDisplay();

    console.log('게임 승리! 최종 점수:', score);
}

// 키보드 누름 이벤트
function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    } else if (e.key === ' ' || e.key === 'Spacebar') {
        // 스페이스바로 공 발사
        if (!ballLaunched) {
            ballLaunched = true;
            console.log('공 발사!');
        }
    } else if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        // ESC 또는 P 키로 일시정지/재개
        if (gameRunning) {
            togglePause();
        }
    }
}

// 키보드 뗌 이벤트
function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    }
}

// 마우스 이동 이벤트
function mouseMoveHandler(e) {
    const paddleWidth = getPaddleWidth(); // 아이템 효과 반영
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > paddleWidth / 2 && relativeX < CANVAS.WIDTH - paddleWidth / 2) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

// 마우스 클릭 이벤트
function mouseClickHandler() {
    // 클릭으로 공 발사
    if (!ballLaunched) {
        ballLaunched = true;
        console.log('공 발사!');
    }
}

// 공 위치 초기화
function resetBall() {
    const settings = DIFFICULTY_SETTINGS[difficulty];

    ballX = CANVAS.WIDTH / 2;
    ballY = CANVAS.HEIGHT - 30;
    ballSpeedX = settings.ballSpeed;
    ballSpeedY = -settings.ballSpeed;
    ballLaunched = false; // 공 발사 대기 상태로
    console.log('공 초기화:', ballX, ballY, '속도:', settings.ballSpeed);
}

// 패들 위치 초기화
function resetPaddle() {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    paddleX = (CANVAS.WIDTH - settings.paddleWidth) / 2;
    console.log('패들 초기화:', paddleX, '너비:', settings.paddleWidth);
}

// 벽돌 배열 초기화
function initBricks() {
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
// 5단계: 충돌 감지 유틸리티 함수
// ========================================

// 사각형과 원의 충돌 감지 (AABB - Axis-Aligned Bounding Box)
function checkRectCircleCollision(rectX, rectY, rectWidth, rectHeight, circleX, circleY, circleRadius) {
    return (
        circleX + circleRadius > rectX &&
        circleX - circleRadius < rectX + rectWidth &&
        circleY + circleRadius > rectY &&
        circleY - circleRadius < rectY + rectHeight
    );
}

// 벽돌-공 충돌 감지
function collisionDetection() {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    for (let c = 0; c < BRICK.COLS; c++) {
        for (let r = 0; r < settings.brickRows; r++) {
            const brick = bricks[c][r];

            // 벽돌이 존재하는 경우만 체크
            if (brick.status === 1) {
                // 공이 벽돌과 충돌했는지 체크
                if (checkRectCircleCollision(brick.x, brick.y, BRICK.WIDTH, BRICK.HEIGHT, ballX, ballY, BALL.RADIUS)) {
                    // 공 방향 반전
                    ballSpeedY = -ballSpeedY;

                    // 벽돌 파괴
                    brick.status = 0;

                    // 사운드 재생
                    playBrickBreakSound();

                    // 입자 효과 생성 (벽돌 중앙에서)
                    const brickCenterX = brick.x + BRICK.WIDTH / 2;
                    const brickCenterY = brick.y + BRICK.HEIGHT / 2;
                    createParticles(brickCenterX, brickCenterY, COLORS.BRICK_COLORS[r]);

                    // 점수 증가
                    score += 10;
                    updateDisplay();

                    // 통계 업데이트 (파괴한 벽돌 총 개수)
                    stats.totalBricks++;
                    updateStatsDisplay();

                    console.log('벽돌 파괴:', c, r, '점수:', score);

                    // 아이템 드롭 (확률적)
                    if (Math.random() < ITEM.DROP_CHANCE) {
                        createItem(brick.x + BRICK.WIDTH / 2, brick.y);
                    }

                    // 게임 승리 확인 (모든 벽돌 파괴)
                    if (checkAllBricksCleared()) {
                        gameWin();
                    }
                }
            }
        }
    }
}

// 모든 벽돌 파괴 확인
function checkAllBricksCleared() {
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


// 화면 표시 업데이트
function updateDisplay() {
    // 점수 표시
    UI.score.textContent = score;

    // 생명 표시 (하트 이모지)
    let livesText = '';
    for (let i = 0; i < lives; i++) {
        livesText += '❤️';
    }
    UI.lives.textContent = livesText;
}

// 게임 업데이트 함수
function update() {
    // 게임이 실행 중이 아니거나 일시정지 상태면 업데이트 안 함
    if (!gameRunning || gamePaused) return;

    // 공이 발사되지 않았으면 패들 위에 고정
    if (!ballLaunched) {
        const settings = DIFFICULTY_SETTINGS[difficulty];
        ballX = paddleX + settings.paddleWidth / 2;
        ballY = CANVAS.HEIGHT - PADDLE.HEIGHT - 10 - BALL.RADIUS - 1;
        return; // 다른 로직 실행 안 함
    }

    // 공 이동
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // 좌우 벽 충돌
    if (ballX + BALL.RADIUS > CANVAS.WIDTH || ballX - BALL.RADIUS < 0) {
        ballSpeedX = -ballSpeedX;
        playWallHitSound();
    }

    // 상단 벽 충돌
    if (ballY - BALL.RADIUS < 0) {
        ballSpeedY = -ballSpeedY;
        playWallHitSound();
    }

    // 하단 벽 충돌 (생명 감소)
    if (ballY + BALL.RADIUS > CANVAS.HEIGHT) {
        lives--;
        updateDisplay();

        if (lives <= 0) {
            // 게임 오버
            gameRunning = false;
            gamePaused = true;

            // 게임 오버 사운드
            playGameOverSound();

            // 통계 업데이트
            stats.totalGames++;
            if (score > stats.bestScore) {
                stats.bestScore = score;
            }
            saveStats();
            updateStatsDisplay();

            UI.finalScore.textContent = score;
            UI.highScore.textContent = stats.bestScore;
            UI.gameOverScreen.classList.remove('hidden');

            console.log('게임 오버! 최종 점수:', score, '총 게임 수:', stats.totalGames);
        } else {
            // 생명 손실 사운드
            playLifeLostSound();

            // 공, 패들, 아이템 리셋
            resetBall();
            resetPaddle();
            resetItems();  // 아이템 및 효과 초기화
            console.log('생명 감소. 남은 생명:', lives);
        }
    }

    // 패들-공 충돌 감지
    const paddleWidth = getPaddleWidth(); // 아이템 효과 반영
    const paddleY = CANVAS.HEIGHT - PADDLE.HEIGHT - 10;
    if (checkRectCircleCollision(paddleX, paddleY, paddleWidth, PADDLE.HEIGHT, ballX, ballY, BALL.RADIUS)) {
        // 패들 충돌 사운드
        playPaddleHitSound();

        // 패들의 어느 부분에 맞았는지에 따라 반사각 조정
        const hitPos = (ballX - paddleX) / paddleWidth;
        ballSpeedX = (hitPos - 0.5) * 10;
        ballSpeedY = -Math.abs(ballSpeedY); // 항상 위로
    }

    // 패들 이동 (키보드)
    if (rightPressed && paddleX < CANVAS.WIDTH - paddleWidth) {
        paddleX += PADDLE.SPEED;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= PADDLE.SPEED;
    }

    // 벽돌-공 충돌 감지
    collisionDetection();

    // 아이템 업데이트
    updateItems();

    // 입자 업데이트
    updateParticles();
}

// 게임 그리기 함수
function draw() {
    // 캔버스 클리어 (검은 배경)
    ctx.fillStyle = COLORS.BACKGROUND;
    ctx.fillRect(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);

    // 벽돌 그리기
    drawBricks();

    // 아이템 그리기
    drawItems();

    // 입자 그리기
    drawParticles();

    // 공 그리기
    drawBall();

    // 패들 그리기
    drawPaddle();

    // 공 발사 대기 중일 때 안내 문구 표시
    if (!ballLaunched) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(t('launchInstruction'), CANVAS.WIDTH / 2, CANVAS.HEIGHT / 2);
    }
}

// 공 그리기
function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, BALL.RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.BALL;
    ctx.fill();
    ctx.closePath();
}

// 패들 그리기
function drawPaddle() {
    const paddleWidth = getPaddleWidth(); // 아이템 효과 반영
    const paddleY = CANVAS.HEIGHT - PADDLE.HEIGHT - 10;

    // 그라디언트 생성
    const gradient = ctx.createLinearGradient(paddleX, 0, paddleX + paddleWidth, 0);
    gradient.addColorStop(0, COLORS.PADDLE_START);
    gradient.addColorStop(1, COLORS.PADDLE_END);

    // 둥근 모서리 패들
    ctx.beginPath();
    ctx.roundRect(paddleX, paddleY, paddleWidth, PADDLE.HEIGHT, 5);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.closePath();
}

// 벽돌 그리기
function drawBricks() {
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

// 게임 루프
function gameLoop() {
    update();  // 게임 로직 업데이트
    draw();    // 화면 그리기

    // 다음 프레임 요청
    requestAnimationFrame(gameLoop);
}

// 페이지 로드 시 초기화
window.addEventListener('load', init);
