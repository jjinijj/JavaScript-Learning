/**
 * SceneManager - 화면 전환 관리
 *
 * 책임:
 * - 화면(Scene) DOM 요소 캐싱
 * - 화면 전환 로직 (show/hide)
 * - AnimationManager와 연동하여 화면 애니메이션 처리
 *
 * 설계 결정:
 * - 화면 전환 로직을 중앙화하여 코드 중복 제거
 * - game.js로부터 UI 화면 전환 책임 분리
 * - 단일 책임 원칙 준수
 */

export class SceneManager {
    constructor(animationManager) {
        this.animationManager = animationManager;
        this.currentScreen = null;

        // 화면 DOM 요소 캐싱
        this.screens = {
            start: document.querySelector('#startScreen'),
            pause: document.querySelector('#pauseScreen'),
            gameOver: document.querySelector('#gameOverScreen'),
            win: document.querySelector('#winScreen'),
            settings: document.querySelector('#settingsScreen'),
            stats: document.querySelector('#statsScreen')
        };

        // 요소 존재 확인
        Object.entries(this.screens).forEach(([name, element]) => {
            if (!element) {
                console.error(`❌ SceneManager: ${name} 화면을 찾을 수 없음`);
            }
        });

        console.log('✅ SceneManager 초기화 완료');
    }

    /**
     * 지정된 화면 표시
     * @param {string} screenName - 화면 이름 ('start', 'pause', 'gameOver', 'win', 'settings', 'stats')
     * @param {boolean} withAnimation - 애니메이션 적용 여부 (기본값: true)
     */
    showScreen(screenName, withAnimation = true) {
        const screen = this.screens[screenName];

        if (!screen) {
            console.error(`❌ SceneManager: 알 수 없는 화면 - ${screenName}`);
            return;
        }

        // 화면 표시
        screen.classList.remove('hidden');

        // 애니메이션 적용
        if (withAnimation && this.animationManager) {
            this.animationManager.startUIPopupAnimation(screen);
        }

        this.currentScreen = screenName;
    }

    /**
     * 지정된 화면 숨김
     * @param {string} screenName - 화면 이름
     * @param {boolean} withAnimation - 애니메이션 적용 여부 (기본값: false)
     */
    hideScreen(screenName, withAnimation = false) {
        const screen = this.screens[screenName];

        if (!screen) {
            console.error(`❌ SceneManager: 알 수 없는 화면 - ${screenName}`);
            return;
        }

        if (withAnimation && this.animationManager) {
            this.animationManager.hideUIPopupAnimation(screen);
        } else {
            screen.classList.add('hidden');
        }

        if (this.currentScreen === screenName) {
            this.currentScreen = null;
        }
    }

    /**
     * 모든 화면 숨김 (즉시)
     */
    hideAllScreens() {
        Object.values(this.screens).forEach(screen => {
            if (screen) {
                screen.classList.add('hidden');
            }
        });

        this.currentScreen = null;
    }

    /**
     * 특정 화면들만 숨김
     * @param {string[]} screenNames - 숨길 화면 이름 배열
     */
    hideScreens(screenNames) {
        screenNames.forEach(name => {
            const screen = this.screens[name];
            if (screen) {
                screen.classList.add('hidden');
            }
        });
    }

    /**
     * 현재 표시 중인 화면 반환
     * @returns {string|null} 현재 화면 이름
     */
    getCurrentScreen() {
        return this.currentScreen;
    }

    /**
     * 특정 화면 DOM 요소 반환
     * @param {string} screenName - 화면 이름
     * @returns {HTMLElement|null} 화면 DOM 요소
     */
    getScreen(screenName) {
        return this.screens[screenName] || null;
    }
}
