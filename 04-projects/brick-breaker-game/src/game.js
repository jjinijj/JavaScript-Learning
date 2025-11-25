// ========================================
// Import modules
// ========================================
import {
    CANVAS,
    COLORS,
    BALL,
    GAME,
    ITEM,
    ANIMATION,
    DIFFICULTY_SETTINGS
} from './constants.js';

import {
    initAudio,
    playClickSound,
    playBrickBreakSound,
    playPaddleHitSound,
    playWallHitSound,
    playLifeLostSound,
    playGameOverSound,
    playWinSound,
    stopBGM,
    playMenuBGM,
    playGameBGM,
    toggleMute,
    getMuted,
    setMuted,
    setBGMVolume,
    setSFXVolume,
    getVolume,
    loadVolume
} from './audio.js';

import {
    t,
    setLanguage,
    getCurrentLanguage
} from './i18n.js';

import {
    setTheme,
    getCurrentTheme
} from './theme.js';

import {
    loadStats,
    updateStats,
    getStats
} from './stats.js';

import {
    isRightPressed,
    isLeftPressed,
    setupInputHandlers
} from './input.js';

import {
    resetAnimations,
    createParticles,
    updateParticles,
    drawParticles,
    createBrickFragments,
    updateBrickFragments,
    drawBrickFragments,
    updateBallTrail,
    drawBallTrail,
    createScorePopup,
    updateScorePopups,
    drawScorePopups,
    createPaddleHitWave,
    updatePaddleHitWaves,
    drawPaddleHitWaves
} from './animations.js';

import {
    items,
    createItem,
    updateItems as updateItemsModule,
    updateItemAnimations,
    drawAnimatedItems,
    resetItems as resetItemsModule
} from './items.js';

import {
    checkRectCircleCollision
} from './physics.js';

import { BrickManager } from './bricks.js';

import { Ball } from './ball.js';
import { Paddle } from './paddle.js';
import { gameState } from './gameState.js';
import { EffectManager } from './effectManager.js';
import { AnimationManager } from './animationManager.js';
import { UIManager } from './uiManager.js';
import { SceneManager } from './sceneManager.js';

// ========================================
// 1단계: 캔버스 설정 및 기본 구조
// ========================================

// 캔버스 관련 변수
let canvas;
let ctx;

// 게임 객체 인스턴스
let ball;
let paddle;
let brickManager;
let effectManager;
let animationManager;
let uiManager;
let sceneManager;

// ========================================
// 6단계: 게임 상태 (gameState.js에서 import)
// ========================================
// gameState는 별도 파일에서 관리
// effectManager는 EffectManager 인스턴스로 관리


// ========================================
// 사운드 시스템 함수
// ========================================

// AudioContext 초기화 (저지연 모드)
// ========================================
// 아이템 시스템 함수
// ========================================

// 아이템 생성
// 아이템 관련 함수 (items.js에서 import)

// 아이템 효과 적용
function applyItemEffect(itemType) {
    console.log('✨ 아이템 획득:', itemType.emoji);

    switch (itemType.id) {
        case 'paddle_expand':
            // 현재 실제 패들 너비 저장 (애니메이션 적용 전)
            const currentWidthBeforeExpand = getAnimatedPaddleWidth();

            // 패들 축소 효과가 활성화되어 있으면 취소
            if (effectManager.isActive('paddleShrink')) {
                effectManager.deactivate('paddleShrink');
            }
            effectManager.activate('paddleExpanded', itemType.duration, currentWidthBeforeExpand);
            break;

        case 'ball_slow':
            effectManager.activate('ballSlow', itemType.duration);
            // 현재 공 속도 감소
            ball.adjustSpeed(0.7);
            break;

        case 'extra_life':
            if (gameState.lives < GAME.MAX_LIVES) {
                gameState.lives++;
                uiManager.updateDisplay(gameState.score, gameState.lives);
                animationManager.startLifeAnimation(true, uiManager.getLivesElement());  // 생명 획득 애니메이션
                console.log('❤️ 생명 +1');
            } else {
                console.log('❤️ 생명이 이미 최대입니다 (최대 ' + GAME.MAX_LIVES + '개)');
            }
            break;

        case 'paddle_shrink':
            // 현재 실제 패들 너비 저장 (애니메이션 적용 전)
            const currentWidthBeforeShrink = getAnimatedPaddleWidth();

            // 패들 확대 효과가 활성화되어 있으면 취소
            if (effectManager.isActive('paddleExpanded')) {
                effectManager.deactivate('paddleExpanded');
            }
            effectManager.activate('paddleShrink', itemType.duration, currentWidthBeforeShrink);
            break;
    }
}


// ========================================
// 입자 효과 함수
// ========================================

// 입자 생성 (벽돌 파괴 시)
// ========================================
// 애니메이션 함수 (animations.js에서 import)
// ========================================

// 공 트레일 효과 (animations.js에서 import)

// 아이템 애니메이션 함수 (items.js에서 import)

// 점수 팝업 애니메이션 (animations.js에서 import)

// 패들 히트 효과 (animations.js에서 import)

// ========================================
// 애니메이션 함수 - 6. 패들 크기 변경 애니메이션
// ========================================

// 패들 크기 변경 애니메이션 시작 (paddle 메서드로 위임)
function startPaddleResizeAnimation(fromWidth, toWidth) {
    paddle.startResizeAnimation(fromWidth, toWidth);
}

// 애니메이션이 적용된 패들 너비 가져오기 (paddle 메서드로 위임)
function getAnimatedPaddleWidth() {
    return paddle.getAnimatedWidth(effectManager.getActiveEffects());
}

// ========================================
// 애니메이션 함수 - AnimationManager로 통합됨
// ========================================
// - 생명력 회복/소실 애니메이션 → animationManager.startLifeAnimation()
// - 레벨 전환 애니메이션 → animationManager.startLevelTransition()
// - UI 팝업 애니메이션 → animationManager.startUIPopupAnimation()

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
    canvas = document.querySelector('#gameCanvas');
    ctx = canvas.getContext('2d');

    // 캔버스 크기 설정
    canvas.width = CANVAS.WIDTH;
    canvas.height = CANVAS.HEIGHT;

    console.log('캔버스 설정 완료:', CANVAS.WIDTH, 'x', CANVAS.HEIGHT);


    // 게임 객체 초기화
    ball = new Ball();
    ball.reset(gameState.difficulty);

    paddle = new Paddle();
    paddle.reset(gameState.difficulty);

    // 벽돌 초기화
    brickManager = new BrickManager();
    brickManager.init(gameState.difficulty);

    // 효과 매니저 초기화
    effectManager = new EffectManager();
    effectManager.setCallbacks({
        getPaddleWidth: () => paddle.getWidth(effectManager.getActiveEffects()),
        getAnimatedPaddleWidth: () => paddle.getAnimatedWidth(effectManager.getActiveEffects()),
        startPaddleAnimation: (fromWidth, toWidth) => paddle.startResizeAnimation(fromWidth, toWidth),
        restoreBallSpeed: () => {
            const settings = DIFFICULTY_SETTINGS[gameState.difficulty];
            ball.restoreSpeed(settings.ballSpeed);
        }
    });

    // 애니메이션 매니저 초기화
    animationManager = new AnimationManager();

    // UI 매니저 초기화
    uiManager = new UIManager();

    // 씬 매니저 초기화
    sceneManager = new SceneManager(animationManager);

    // 게임 상태 초기화
    gameState.reset();
    uiManager.updateDisplay(gameState.score, gameState.lives);

    // 입력 이벤트 핸들러 설정
    setupInputHandlers(canvas, {
        onSpacePress: () => {
            ball.launch();
        },
        onPausePress: () => {
            if (gameState.running) {
                togglePause();
            }
        },
        onMouseMove: (e) => {
            const paddleWidth = getAnimatedPaddleWidth();
            const relativeX = e.clientX - canvas.offsetLeft;
            paddle.moveTo(relativeX, paddleWidth);
        },
        onMouseClick: () => {
            ball.launch();
        }
    });

    // 통계 로드
    loadStats();
    uiManager.updateStats(getStats());

    // 볼륨 로드
    loadVolume();
    uiManager.updateVolume(getVolume());

    // 음소거 상태 로드
    const savedMuted = localStorage.getItem('brickBreakerMuted');
    if (savedMuted !== null) {
        setMuted(savedMuted === 'true');
        uiManager.updateMuteButton(getMuted(), t('muteBtn'));
    }

    // UI 버튼 이벤트 등록
    document.querySelector('#startBtn').addEventListener('click', startGame);
    document.querySelector('#pauseBtn').addEventListener('click', togglePause);
    document.querySelector('#resumeBtn').addEventListener('click', togglePause);
    document.querySelector('#restartBtn').addEventListener('click', restartGame);
    document.querySelector('#menuBtn').addEventListener('click', showMenu);
    document.querySelector('#quitBtn').addEventListener('click', showMenu);
    document.querySelector('#playAgainBtn').addEventListener('click', restartGame);
    document.querySelector('#winMenuBtn').addEventListener('click', showMenu);
    document.querySelector('#muteBtn').addEventListener('click', handleMuteToggle);
    document.querySelector('#fullscreenBtn').addEventListener('click', toggleFullscreen);

    // 언어 선택 이벤트 등록
    const languageSelect = document.querySelector('#languageSelect');
    languageSelect.value = getCurrentLanguage(); // 현재 언어로 설정
    languageSelect.addEventListener('change', (e) => {
        playClickSound();
        setLanguage(e.target.value, () => uiManager.updateMuteButton(getMuted(), t('muteBtn')));
    });

    // 테마 선택 이벤트 등록
    const themeSelect = document.querySelector('#themeSelect');
    themeSelect.value = getCurrentTheme(); // 현재 테마로 설정
    themeSelect.addEventListener('change', (e) => {
        playClickSound();
        setTheme(e.target.value);
    });

    // 난이도 선택 이벤트 등록
    document.querySelector('#difficultySelect').addEventListener('change', () => {
        playClickSound();
    });

    // 볼륨 슬라이더 이벤트 등록
    document.querySelector('#bgmVolume').addEventListener('input', (e) => {
        handleBGMVolumeChange(e.target.value);
    });

    document.querySelector('#sfxVolume').addEventListener('input', (e) => {
        handleSFXVolumeChange(e.target.value);
    });

    // AudioContext 초기화 (메뉴에서 첫 클릭 시)
    document.body.addEventListener('click', function initAudioOnce() {
        initAudio();
        playMenuBGM();
        // 한 번만 실행
        document.body.removeEventListener('click', initAudioOnce);
    }, { once: true });

    // 게임 루프 시작
    gameLoop();
}

// 통계 저장
// 통계 표시 업데이트
// 음소거 토글 (게임 상태에 따른 BGM 처리 포함)
function handleMuteToggle() {
    const muted = toggleMute();
    uiManager.updateMuteButton(muted, t('muteBtn'));

    // 음소거 해제 시 게임 상태에 따라 적절한 BGM 재생
    if (!muted) {
        if (gameState.running) {
            playGameBGM();
        } else {
            playMenuBGM();
        }
    }
}

// BGM 볼륨 변경 (UI 업데이트 포함)
function handleBGMVolumeChange(value) {
    setBGMVolume(value);
    uiManager.updateVolume(getVolume());
}

// 효과음 볼륨 변경 (UI 업데이트 및 테스트 사운드 포함)
function handleSFXVolumeChange(value) {
    setSFXVolume(value);
    uiManager.updateVolume(getVolume());
    playClickSound(); // 테스트 사운드
}

// 전체화면 토글
function toggleFullscreen() {
    playClickSound();

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
    resetItemsModule();  // 아이템 배열 초기화
    resetAnimations();  // 애니메이션 배열 초기화
    paddle.animation = null;  // 패들 애니메이션 초기화

    // 애니메이션 매니저 초기화
    animationManager.reset();

    // 생명력 애니메이션 CSS 클래스 제거
    uiManager.resetLifeAnimation();

    // 효과 초기화 (effectManager로 위임)
    effectManager.reset();
}

// 게임 시작
function startGame() {
    // AudioContext 초기화 (사용자 상호작용 후 초기화)
    initAudio();

    // UI 클릭 사운드
    playClickSound();

    // 난이도 가져오기
    gameState.difficulty = document.querySelector('#difficultySelect').value;

    // 게임 상태 초기화
    gameState.reset();
    uiManager.updateDisplay(gameState.score, gameState.lives);

    // 난이도에 따라 초기화
    brickManager.init(gameState.difficulty);
    resetBall();
    resetPaddle();
    resetItems();

    gameState.start();

    // 시작 화면 페이드 아웃
    sceneManager.hideScreen('start', true);

    // 게임 BGM 재생
    playGameBGM();

    console.log('게임 시작! 난이도:', gameState.difficulty);
}

// 일시정지 토글
function togglePause() {
    if (!gameState.running) return;

    gameState.togglePause();

    if (gameState.paused) {
        sceneManager.showScreen('pause');
        console.log('일시정지');
    } else {
        sceneManager.hideScreen('pause', true);
        console.log('재개');
    }
}

// 게임 재시작
function restartGame() {
    // UI 클릭 사운드
    playClickSound();

    sceneManager.hideScreens(['gameOver', 'win']);

    // 게임 요소 먼저 리셋 (애니메이션 클래스 제거 포함)
    resetItems();

    // 게임 상태 초기화
    gameState.reset();
    uiManager.updateDisplay(gameState.score, gameState.lives);

    // 게임 요소 리셋
    resetBall();
    resetPaddle();
    brickManager.init(gameState.difficulty);

    // 게임 시작
    gameState.start();

    // 게임 BGM 재생
    playGameBGM();

    console.log('게임 재시작');
}

// 메뉴로 돌아가기
function showMenu() {
    // UI 클릭 사운드
    playClickSound();

    gameState.stop();

    // 다른 화면들 즉시 숨김
    sceneManager.hideScreens(['pause', 'gameOver', 'win']);

    // 시작 화면 애니메이션과 함께 표시
    sceneManager.showScreen('start');

    // 기존 BGM 정지 후 메뉴 BGM 재생
    stopBGM();
    playMenuBGM();

    console.log('메뉴로 이동');
}

// 게임 승리 (모든 벽돌 파괴)
function gameWin() {
    // 게임 일시정지 (running은 유지하여 애니메이션 계속 실행)
    gameState.pause();

    // BGM 정지
    stopBGM();

    // 게임 승리 사운드
    playWinSound();

    // 레벨 전환 애니메이션 시작 (VICTORY!)
    animationManager.startLevelTransition('VICTORY!', () => {
        // 애니메이션 완료 후 게임 완전히 중지
        gameState.stop();

        // UI 표시
        uiManager.updateWinScore(gameState.score);
        sceneManager.showScreen('win');
    });

    // 통계 업데이트
    updateStats({
        gameCompleted: true,
        score: gameState.score,
        bricksDestroyed: 0
    });
    uiManager.updateStats(getStats());

    console.log('게임 승리! 최종 점수:', gameState.score);
}

// 공 위치 초기화
function resetBall() {
    ball.reset(gameState.difficulty);
}

// 패들 위치 초기화
function resetPaddle() {
    paddle.reset(gameState.difficulty);
}

// 벽돌 관련 함수 (bricks.js에서 import)

// ========================================
// 5단계: 충돌 감지 (physics.js에서 import)
// ========================================

function checkCollisions(wallCollision) {
    const ballPos = ball.getPosition();
    updateBallTrail(ballPos.x, ballPos.y);

    // 1. 벽돌 충돌 (최우선)
    const brick = brickManager.checkBallBrickCollision(
        ballPos.x,
        ballPos.y,
        ball.radius,
        checkRectCircleCollision
    );
    if (brick) {
        onBrickHit(brick);
        return;
    }

    // 2. 벽 충돌 (독립적으로 처리)
    if (wallCollision) {
        playWallHitSound();
    }

    // 3. 패들 충돌 vs 하단 충돌 (배타적)
    const paddleWidth = getAnimatedPaddleWidth();
    if (ball.checkPaddleCollision(paddle.x, paddle.y, paddleWidth, paddle.height)) {
        onPaddleHit();
    } else if (ball.checkBottomCollision()) {
        onLifeLost();
    }
}

function onPaddleHit(){
    // 패들 충돌 사운드
    playPaddleHitSound();

    // 패들 히트 충격파 생성 (충돌 위치에서)
    const ballPos = ball.getPosition();
    createPaddleHitWave(ballPos.x, ballPos.y);

}

function onLifeLost(){
    gameState.lives--;
    uiManager.updateDisplay(gameState.score, gameState.lives);
    animationManager.startLifeAnimation(false, uiManager.getLivesElement());  // 생명 소실 애니메이션

    if (gameState.lives <= 0) {
        // 게임 일시정지 (running은 유지하여 애니메이션 계속 실행)
        gameState.pause();

        // BGM 정지
        stopBGM();

        // 게임 오버 사운드
        playGameOverSound();

        // 레벨 전환 애니메이션 시작 (GAME OVER)
        animationManager.startLevelTransition('GAME OVER', () => {
            // 애니메이션 완료 후 게임 완전히 중지
            gameState.stop();

            // UI 표시
            uiManager.updateGameOverScore(gameState.score, getStats().bestScore);
            sceneManager.showScreen('gameOver');
        });

        // 통계 업데이트
        updateStats({
            gameCompleted: true,
            score: gameState.score,
            bricksDestroyed: 0
        });
        uiManager.updateStats(getStats());

        console.log('게임 오버! 최종 점수:', gameState.score, '총 게임 수:', getStats().totalGames);
    } else {
        // 생명 손실 사운드
        playLifeLostSound();

        // 공, 패들, 아이템 리셋
        resetBall();
        resetPaddle();
        resetItems();  // 아이템 및 효과 초기화
        console.log('생명 감소. 남은 생명:', gameState.lives);
    }
}


// 벽돌-공 충돌 처리
function onBrickHit(brick) {
    // 공 방향 반전
    ball.speedY = -ball.speedY;

    // 벽돌 파괴 (BrickManager를 통해 관리)
    brickManager.destroyBrick(brick);

    // 사운드 재생
    playBrickBreakSound();

    // 입자 효과 생성 (벽돌 중앙에서)
    const brickCenterX = brick.x + brick.width / 2;
    const brickCenterY = brick.y + brick.height / 2;
    createParticles(brickCenterX, brickCenterY, brick.color);

    // 벽돌 조각 애니메이션 생성
    createBrickFragments(brick.x, brick.y, brick.width, brick.height, brick.color);

    // 점수 증가
    gameState.score += 10;
    uiManager.updateDisplay(gameState.score, gameState.lives);

    // 점수 팝업 생성
    createScorePopup(brickCenterX, brickCenterY, 10);

    // 통계 업데이트 (파괴한 벽돌 총 개수)
    updateStats({
        gameCompleted: false,
        score: 0,
        bricksDestroyed: 1
    });
    uiManager.updateStats(getStats());

    console.log('벽돌 파괴:', brick.col, brick.row, '점수:', gameState.score);

    // 아이템 드롭 (확률적)
    if (Math.random() < ITEM.DROP_CHANCE) {
        createItem(brick.x + brick.width / 2, brick.y);
    }

    // 게임 승리 확인 (모든 벽돌 파괴)
    if (brickManager.checkAllCleared()) {
        gameWin();
    }
}

// checkAllBricksCleared (bricks.js에서 import)


// 입력 처리
function updateInput() {
    const paddleWidth = getAnimatedPaddleWidth();

    // 패들 이동 (키보드)
    if (isRightPressed()) {
        paddle.move('right', paddleWidth);
    } else if (isLeftPressed()) {
        paddle.move('left', paddleWidth);
    }
}

// 게임 로직 업데이트
function updateGameplay() {
    // 공 위치 업데이트 (발사 전: 패들 위 고정, 발사 후: 이동)
    const paddleWidth = getAnimatedPaddleWidth();
    ball.update(paddle.x, paddleWidth);

    // 공-벽 충돌 감지
    const wallCollision = ball.checkWallCollision();

    // 충돌 처리
    checkCollisions(wallCollision);

    // 아이템 업데이트
    updateItemsModule(paddle.x, () => paddle.getWidth(effectManager.getActiveEffects()), applyItemEffect);
}

// 애니메이션 업데이트
function updateAnimations() {
    // 애니메이션 매니저 업데이트 (활성화된 애니메이션만 업데이트)
    animationManager.update();

    // 아이템 애니메이션 업데이트
    updateItemAnimations();

    // 입자 업데이트
    updateParticles();

    // 벽돌 조각 업데이트
    updateBrickFragments();

    // 공 트레일 업데이트
    if (ball.launched) {
        const ballPos = ball.getPosition();
        updateBallTrail(ballPos.x, ballPos.y);
    }

    // 점수 팝업 업데이트
    updateScorePopups();

    // 패들 히트 충격파 업데이트
    updatePaddleHitWaves();

    // 패들 애니메이션 업데이트
    paddle.update();
}

// 게임 업데이트 함수 (메인)
function update() {
    // 애니메이션은 항상 업데이트 (일시정지 화면 등에서도 표시)
    updateAnimations();

    // 게임이 진행 중이 아니면 게임 로직 업데이트 안 함
    if (!gameState.isPlaying()) return;

    // 입력 처리
    updateInput();

    // 게임 로직 업데이트
    updateGameplay();
}

// 게임 그리기 함수
function draw() {
    // 캔버스 클리어 (검은 배경)
    ctx.fillStyle = COLORS.BACKGROUND;
    ctx.fillRect(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);

    // 벽돌 그리기
    brickManager.draw(ctx);

    // 아이템 그리기 (애니메이션 적용)
    drawAnimatedItems(ctx);

    // 입자 그리기
    drawParticles(ctx);

    // 벽돌 조각 그리기
    drawBrickFragments(ctx);

    // 공 트레일 그리기 (공보다 먼저 그려야 뒤에 나옴)
    drawBallTrail(ctx, BALL.RADIUS, COLORS.BALL);

    // 공 그리기
    drawBall();

    // 패들 그리기
    drawPaddle();

    // 패들 히트 충격파 그리기
    drawPaddleHitWaves(ctx);

    // 점수 팝업 그리기 (맨 위에 표시)
    drawScorePopups(ctx);

    // 애니메이션 매니저 그리기 (레벨 전환 애니메이션 - 최상위 레이어)
    animationManager.draw(ctx);

    // 공 발사 대기 중일 때 안내 문구 표시
    if (!ball.launched) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(t('launchInstruction'), CANVAS.WIDTH / 2, CANVAS.HEIGHT / 2);
    }
}

// 공 그리기
function drawBall() {
    ball.draw(ctx);
}

// 패들 그리기
function drawPaddle() {
    const paddleWidth = getAnimatedPaddleWidth(); // 애니메이션 적용된 패들 너비
    paddle.draw(ctx, paddleWidth);
}

// 벽돌 그리기
// drawBricks (bricks.js에서 import)

// 게임 루프
function gameLoop() {
    update();  // 게임 로직 업데이트
    draw();    // 화면 그리기

    // 다음 프레임 요청
    requestAnimationFrame(gameLoop);
}

// 페이지 로드 시 초기화
window.addEventListener('load', init);
