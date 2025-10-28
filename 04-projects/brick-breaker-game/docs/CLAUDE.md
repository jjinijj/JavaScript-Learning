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

## 아키텍처

### 파일 구조

- [index.html](index.html) - 게임 UI, 오버레이, 통계를 포함한 메인 HTML 구조
- [style.css](style.css) - CSS 커스텀 속성과 반응형 디자인을 포함한 완전한 스타일링
- `game.js` - **미구현**: 게임 로직이 여기에 구현되어야 함 (index.html:124에서 참조됨)

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

### 예상되는 게임 로직 (game.js)

HTML은 다음 ID들을 참조하며 해당하는 JavaScript 기능을 기대합니다:

**제어해야 할 DOM 요소들**:
- `#gameCanvas` - 렌더링을 위한 캔버스 요소
- `#score`, `#level`, `#lives` - 게임 상태 표시
- `#finalScore`, `#highScore`, `#clearedLevel`, `#levelScore` - 오버레이 데이터
- `#totalGames`, `#bestScore`, `#bestLevel`, `#totalBricks` - 통계
- `#difficultySelect` - 난이도 설정

**토글해야 할 오버레이 화면들** (`.hidden` 클래스 사용):
- `#startScreen`, `#pauseScreen`, `#gameOverScreen`, `#levelClearScreen`

**버튼 이벤트 핸들러**:
- `#startBtn`, `#restartBtn`, `#menuBtn`, `#nextLevelBtn` - 게임 흐름
- `#pauseBtn`, `#resumeBtn`, `#quitBtn` - 일시정지 컨트롤
- `#muteBtn`, `#fullscreenBtn` - 오디오 및 디스플레이 설정

**구현해야 할 기능들**:
- 캔버스 기반 렌더링 (벽돌 그리드, 패들, 공)
- 충돌 감지 (공-벽돌, 공-패들, 공-벽)
- 입력 처리 (키보드 방향키, 스페이스바, 마우스 이동)
- 난이도 스케일링 (공 속도, 벽돌 수, 패들 크기 조정)
- 통계 지속성을 위한 LocalStorage 사용
- 사운드 효과를 위한 Web Audio API (120줄에 오디오 요소 준비됨)

## 주요 참고사항

- 모든 사용자 대면 텍스트는 **한글**입니다 - UI 추가 시 이 언어를 유지하세요
- 게임은 UI에 이모지를 광범위하게 사용합니다 (🧱, ❤️, 🎮 등) - 이 스타일을 유지하세요
- 게임 플레이 중 캔버스 커서는 숨김 처리됩니다 ([style.css:345](style.css#L345))
- 반응형 디자인은 480px 너비까지 모바일 기기를 지원해야 합니다
- 생명은 하트 이모지(❤️)로 표시됩니다 - [index.html:25](index.html#L25) 참조
