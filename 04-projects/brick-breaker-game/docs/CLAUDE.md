# CLAUDE.md

이 파일은 Claude Code (claude.ai/code)가 이 저장소에서 작업할 때 참고할 가이드를 제공합니다.

## 프로젝트 개요

**벽돌깨기 게임** - HTML5, CSS3, 바닐라 JavaScript로 구현된 클래식 게임입니다. 다크 테마의 현대적인 UI, 그라디언트 효과, 난이도 선택, 게임 통계 추적, 다양한 게임 상태(시작, 일시정지, 레벨 클리어, 게임 오버) 기능을 포함합니다.

## 개발 환경 설정

### 게임 실행 방법

프로젝트는 Live Server를 사용합니다:
- **VS Code Live Server**: 포트 5501 (`.vscode/settings.json`에 설정됨)
- [index.html](index.html)을 열고 Live Server를 실행하거나, 브라우저에서 직접 파일을 엽니다

별도의 빌드 프로세스, 패키지 매니저, 번들러가 필요 없습니다 - 순수 클라이언트 사이드 애플리케이션입니다.

### Git Workflow (2025-11-13부터 적용)

**Stage별 브랜치 전략**:
- Stage 20까지: main 브랜치에 직접 커밋
- **Stage 21부터**: 각 Stage별로 feature 브랜치 생성 후 PR 병합

**브랜치 네이밍 규칙**:
```bash
refactor/[stage-name]
```

**예시**:
- `refactor/collision-detector` (Stage 21: CollisionDetector)
- `refactor/ui-manager` (Stage 22: UIManager)
- `refactor/remove-wrapper-functions` (Stage 23)
- `refactor/update-function-split` (Stage 24)
- `refactor/state-pattern` (Stage 25)
- `refactor/game-controller` (Stage 26)

**작업 프로세스**:
1. 새 브랜치 생성: `git checkout -b refactor/[stage-name]`
2. Stage 작업 수행 (코드 작성, 테스트, 문서 업데이트)
3. 커밋 및 푸시: `git push origin refactor/[stage-name]`
4. GitHub에서 PR 생성
5. PR 병합 후 로컬 main 업데이트: `git checkout main && git pull`

**커밋 메시지 규칙**:
- `feat:` - 새로운 기능 추가
- `refactor:` - 리팩토링
- `docs:` - 문서 업데이트
- `fix:` - 버그 수정
- `test:` - 테스트 추가/수정

## 아키텍처

### 파일 구조 (2025-11-13 기준)

**HTML/CSS**:
- [index.html](index.html) - 게임 UI, 오버레이, 통계를 포함한 메인 HTML 구조
- [style.css](style.css) - CSS 커스텀 속성과 반응형 디자인을 포함한 완전한 스타일링

**JavaScript 모듈 (src/)** - ES6 모듈로 완전히 분리됨:

**핵심 게임 파일**:
- `game.js` (885 lines) - 메인 게임 루프, 초기화, 게임 흐름 제어
- `constants.js` (175 lines) - 모든 게임 상수 (CANVAS, COLORS, BALL, PADDLE, BRICK, GAME, ITEM, ANIMATION, DIFFICULTY_SETTINGS)

**게임 객체 클래스 (OOP)**:
- `ball.js` (178 lines) - Ball 클래스: 공 물리, 이동, 충돌
- `paddle.js` (195 lines) - Paddle 클래스: 패들 제어, 애니메이션
- `bricks.js` (171 lines) - Brick 클래스 & BrickManager: 벽돌 관리 (1D 배열)

**게임 시스템**:
- `gameState.js` (76 lines) - 게임 상태 관리 (단순 객체 + 헬퍼 메서드)
- `effectManager.js` (165 lines) - EffectManager 클래스: 아이템 효과 타이머 관리
- `animationManager.js` (355 lines) - AnimationManager 클래스: 생명력/레벨전환/UI팝업 애니메이션 통합

**유틸리티 모듈**:
- `audio.js` (232 lines) - Web Audio API 기반 사운드 시스템
- `i18n.js` (79 lines) - 다국어 지원 (한국어, English)
- `theme.js` (26 lines) - 4가지 컬러 테마
- `stats.js` (59 lines) - 게임 통계 (localStorage)
- `input.js` (67 lines) - 키보드/마우스 입력 처리
- `animations.js` (268 lines) - 7가지 파티클/이펙트 애니메이션
- `items.js` (146 lines) - 4가지 아이템 시스템
- `physics.js` (127 lines) - 충돌 감지 유틸리티

**문서 (docs/)**:
- `PROGRESS.md` - Stage별 개발 진행 상황 ("무엇을" 했는지)
- `REFACTORING_TODO.md` - 리팩토링 계획 및 TODO ("어떻게" 할 것인지)
- `DESIGN_DECISIONS.md` - 설계 결정 및 기술적 논의 ("왜" 그렇게 했는지)
- `README_DOCS.md` - 문서 작성 가이드
- `CLAUDE.md` - Claude Code 작업 가이드 (이 파일)

### 주요 컴포넌트

**HTML 구조** ([index.html](index.html)):
- 점수, 레벨, 생명 표시가 있는 게임 헤더 (12-28줄)
- 게임 렌더링을 위한 캔버스 요소 (32줄)
- 여러 오버레이 화면: 시작, 일시정지, 게임 오버, 레벨 클리어 (34-85줄)
- 게임 컨트롤: 일시정지, 음소거, 전체화면 버튼 (88-93줄)
- 총 게임 수, 최고 점수, 최고 레벨, 총 벽돌 파괴 수를 추적하는 통계 패널 (95-116줄)

**UI 요소**:
- 세 가지 난이도 선택기: 쉬움, 보통(기본값), 어려움 (66-73줄)
- 인터페이스 전체에 한글 텍스트 사용
- 768px, 480px 모바일 브레이크포인트를 가진 반응형 디자인

**CSS 디자인 시스템** ([style.css](style.css)):
- `:root`의 CSS 커스텀 속성 (7-21줄)이 색상 체계와 디자인 토큰 정의
- 그라디언트 배경을 가진 다크 테마 (`--bg-dark`, `--bg-card`)
- 인디고/퍼플 그라디언트를 사용하는 주/보조 색상 (`--primary-color`, `--secondary-color`)
- 성공, 위험, 경고 상태를 위한 상태 색상들
- 모달 화면을 위한 백드롭 블러 효과가 있는 오버레이 시스템

### 게임 아키텍처 (OOP 설계)

**객체지향 설계 원칙**:
- ✅ **단일 책임 원칙**: 각 클래스가 하나의 명확한 책임
- ✅ **캡슐화**: 데이터와 메서드를 클래스 내부에 응집
- ✅ **의존성 주입**: 콜백 패턴으로 모듈 간 결합도 최소화
- ✅ **ES6 모듈**: import/export로 명확한 의존성 관리

**핵심 클래스 구조**:

1. **Ball** (ball.js)
   - 속성: x, y, speedX, speedY, radius, launched, baseSpeed
   - 메서드: update(), draw(), launch(), reset(), checkWallCollision(), checkPaddleCollision(), adjustSpeed(), restoreSpeed()

2. **Paddle** (paddle.js)
   - 속성: x, y, width, height, speed, animation, baseWidth
   - 메서드: update(), draw(), move(), moveTo(), reset(), startResizeAnimation(), getWidth(), getAnimatedWidth()

3. **BrickManager** (bricks.js)
   - 1D 배열로 벽돌 그리드 관리 (메모리 효율적)
   - 메서드: init(), draw(), checkBallBrickCollision(), destroyBrick(), checkAllCleared(), getBricks()

4. **EffectManager** (effectManager.js)
   - 아이템 효과 타이머 관리 (패들 확대/축소, 공 슬로우)
   - 콜백 패턴으로 의존성 주입
   - 메서드: activate(), deactivate(), isActive(), getActiveEffects(), reset()

5. **AnimationManager** (animationManager.js)
   - 생명력, 레벨 전환, UI 팝업 애니메이션 통합
   - 활성화된 애니메이션만 업데이트 (효율성)
   - 메서드: startLifeAnimation(), startLevelTransition(), startUIPopupAnimation(), update(), draw()

**게임 상태 관리**:
- `gameState` (gameState.js): 단순 객체 + 헬퍼 메서드 (클래스 아님)
  - 속성: score, lives, difficulty, running, paused
  - 메서드: isPlaying(), start(), stop(), pause(), resume(), togglePause(), reset()

**게임 루프**:
```javascript
function gameLoop() {
    update();  // 게임 상태 업데이트
    draw();    // 캔버스 렌더링
    requestAnimationFrame(gameLoop);
}
```

**주요 기능**:
- ✅ 캔버스 기반 렌더링 (벽돌 그리드, 패들, 공)
- ✅ 충돌 감지 (공-벽돌, 공-패들, 공-벽)
- ✅ 입력 처리 (키보드 방향키, 스페이스바, 마우스 이동)
- ✅ 난이도 스케일링 (공 속도, 벽돌 수, 패들 크기 조정)
- ✅ 4가지 아이템 시스템 (패들 확대/축소, 공 슬로우, 생명 추가)
- ✅ 9가지 애니메이션 (벽돌 파괴, 공 트레일, 점수 팝업, 패들 히트 등)
- ✅ 통계 지속성 (LocalStorage)
- ✅ 사운드 효과 (Web Audio API)
- ✅ 다국어 지원 (한국어, English)
- ✅ 4가지 테마

## 리팩토링 진행 상황 (Stage 16-20 완료)

**완료된 Stage**:
- ✅ Stage 16 (2025-10-28): 9개 애니메이션 시스템
- ✅ Stage 17 (2025-10-28 ~ 2025-11-06): 모듈 분리 (2200 lines → 850 lines, 61% 감소)
- ✅ Stage 18 (2025-11-06 ~ 2025-11-11): OOP 리팩토링 (Ball, Paddle, BrickManager 클래스)
- ✅ Stage 19 (2025-11-11 ~ 2025-11-13): 게임 시스템 분리 (gameState, EffectManager)
- ✅ Stage 20 (2025-11-13): 애니메이션 시스템 통합 (AnimationManager, game.js 1146 → 885 lines, 22.8% 감소)

**다음 Stage** (섹션 5-9):
- Stage 21: CollisionDetector 클래스 (충돌 감지 / 이벤트 처리 분리)
- Stage 22: UIManager 클래스 + 성능 최적화
- Stage 23: 불필요한 래퍼 함수 제거
- Stage 24: Update 함수 분리
- Stage 25: State Pattern 적용 (공 상태)
- Stage 26: GameController 통합 (최종)

**문서 참고**:
- 자세한 진행 상황: [PROGRESS.md](PROGRESS.md)
- 리팩토링 TODO: [REFACTORING_TODO.md](REFACTORING_TODO.md)
- 설계 결정: [DESIGN_DECISIONS.md](DESIGN_DECISIONS.md)

## 주요 참고사항

- 모든 사용자 대면 텍스트는 **한글**입니다 - UI 추가 시 이 언어를 유지하세요
- 게임은 UI에 이모지를 광범위하게 사용합니다 (🧱, ❤️, 🎮 등) - 이 스타일을 유지하세요
- 게임 플레이 중 캔버스 커서는 숨김 처리됩니다 ([style.css:345](style.css#L345))
- 반응형 디자인은 480px 너비까지 모바일 기기를 지원해야 합니다
- 생명은 하트 이모지(❤️)로 표시됩니다 - [index.html:25](index.html#L25) 참조
