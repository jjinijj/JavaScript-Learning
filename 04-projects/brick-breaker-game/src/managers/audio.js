// ========================================
// 오디오 시스템
// ========================================

// 오디오 컨텍스트
let audioContext = null;
let isMuted = false;

// BGM 관련 변수
let bgmOscillator = null;
let bgmGainNode = null;
let currentBGM = null;  // 'menu', 'game', 'gameover'
let isBGMPlaying = false;

// 볼륨 설정 (0.0 ~ 1.0)
let VOLUME = {
    BGM: 0.1,      // 배경음악 볼륨 (조용한 설정)
    SFX: 0.2       // 효과음 볼륨
};

// 볼륨 저장/로드 키
const VOLUME_STORAGE_KEY = 'brickBreakerVolume';

// ========================================
// 초기화 함수
// ========================================

export function initAudio() {
    if (!audioContext) {
        // latencyHint를 'interactive'로 설정하여 낮은 지연시간
        audioContext = new (window.AudioContext || window.webkitAudioContext)({
            latencyHint: 'interactive',  // 'interactive' = 낮은 지연 (게임용)
            sampleRate: 44100            // 샘플링 레이트
        });
        console.log('새로운 AudioContext 초기화 (낮은 지연)');
        console.log('   - 기본 지연:', audioContext.baseLatency);
        console.log('   - 출력 지연:', audioContext.outputLatency);
    }
}

// 기본 비프음 재생 (낮은 지연시간)
function playBeep(frequency, duration, volume = VOLUME.SFX) {
    if (isMuted || !audioContext) return;

    try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'square';

        const now = audioContext.currentTime;

        // 즉시 시작, 페이드 아웃 효과
        gainNode.gain.setValueAtTime(volume, now);
        gainNode.gain.linearRampToValueAtTime(0, now + duration);

        oscillator.start(now);
        oscillator.stop(now + duration);
    } catch (error) {
        console.warn('오디오 재생 실패:', error);
    }
}

// ========================================
// 효과음 함수
// ========================================

export function playClickSound() {
    playBeep(600, 0.03, VOLUME.SFX * 0.8);
}

export function playBrickBreakSound() {
    playBeep(800, 0.05, VOLUME.SFX);
}

export function playPaddleHitSound() {
    playBeep(300, 0.05, VOLUME.SFX);
}

export function playWallHitSound() {
    playBeep(200, 0.03, VOLUME.SFX * 0.75);
}

export function playLifeLostSound() {
    playBeep(150, 0.3, VOLUME.SFX);
}

export function playGameOverSound() {
    if (isMuted || !audioContext) return;
    playBeep(400, 0.15, VOLUME.SFX);
    setTimeout(() => playBeep(300, 0.15, VOLUME.SFX), 150);
    setTimeout(() => playBeep(200, 0.3, VOLUME.SFX), 300);
}

export function playWinSound() {
    if (isMuted || !audioContext) return;
    playBeep(400, 0.1, VOLUME.SFX);
    setTimeout(() => playBeep(500, 0.1, VOLUME.SFX), 100);
    setTimeout(() => playBeep(600, 0.2, VOLUME.SFX), 200);
}

// ========================================
// BGM 시스템 함수
// ========================================

export function stopBGM() {
    if (bgmOscillator) {
        bgmOscillator.stop();
        bgmOscillator = null;
        bgmGainNode = null;
    }

    isBGMPlaying = false;
    currentBGM = null;
    console.log('새로운 BGM 중지');
}

// BGM 재생 공통 함수
function playBGM(type, notes, waveType, noteDuration, interval) {
    if (isMuted || !audioContext || currentBGM === type) return;

    stopBGM();
    currentBGM = type;

    console.log("play bgm : " + type);

    let noteIndex = 0;

    function playNextNote() {
        // 음소거 또는 BGM 변경 확인
        if (!isBGMPlaying || currentBGM !== type || isMuted) return;

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = notes[noteIndex];
        oscillator.type = waveType;

        gainNode.gain.setValueAtTime(VOLUME.BGM, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + noteDuration);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + noteDuration);

        noteIndex = (noteIndex + 1) % notes.length;

        setTimeout(playNextNote, interval);
    }

    isBGMPlaying = true;
    playNextNote();
    console.log(`새로운 ${type} BGM 시작`);
}

export function playMenuBGM() {
    const notes = [262, 330, 392, 330]; // C4, E4, G4, E4
    playBGM('menu', notes, 'sine', 0.4, 500);
}

export function playGameBGM() {
    const notes = [294, 440, 294, 440]; // D4, A4, D4, A4
    playBGM('game', notes, 'square', 0.2, 300);
}

// ========================================
// 볼륨 및 음소거 제어
// ========================================

export function toggleMute() {
    isMuted = !isMuted;
    localStorage.setItem('brickBreakerMuted', isMuted);

    if (isMuted) {
        stopBGM();
    }

    return isMuted;
}

export function getMuted() {
    return isMuted;
}

export function setMuted(muted) {
    isMuted = muted;
    if (isMuted) {
        stopBGM();
    }
}

export function setBGMVolume(value) {
    VOLUME.BGM = value / 100;
    saveVolume();
    console.log('BGM 볼륨:', VOLUME.BGM);
}

export function setSFXVolume(value) {
    VOLUME.SFX = value / 100;
    saveVolume();
    console.log('효과음 볼륨:', VOLUME.SFX);
}

export function getVolume() {
    return VOLUME;
}

// 볼륨 저장
function saveVolume() {
    localStorage.setItem(VOLUME_STORAGE_KEY, JSON.stringify(VOLUME));
}

// 볼륨 로드
export function loadVolume() {
    const saved = localStorage.getItem(VOLUME_STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            VOLUME.BGM = parsed.BGM || 0.1;
            VOLUME.SFX = parsed.SFX || 0.2;
            console.log('볼륨 로드됨:', VOLUME);
        } catch (error) {
            console.error('볼륨 로드 실패:', error);
        }
    }
}
