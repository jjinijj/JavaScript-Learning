# 벽돌깨기 게임 개발 진행 상황

## 프로젝트 개요
HTML5 Canvas를 사용한 벽돌깨기 게임 개발

---

## 개발 단계

### ✅ 완료된 작업
- [x] 프로젝트 초기 설정 (HTML, CSS)
- [x] CLAUDE.md 문서 작성

---

## game.js 개발 단계

### 1단계: 캔버스 설정 및 기본 구조
**상태**: ✅ 완료

**목표**:
- 캔버스 초기화
- 게임 루프 기본 틀 작성
- 필요한 상수 정의

**구현 내용**:
- [x] 캔버스 요소 가져오기 및 크기 설정
- [x] 게임 루프 함수 (draw, update) 작성
- [x] 상수 정의 (캔버스 크기, 공/패들/벽돌 크기 등)
- [x] 초기화 함수 작성

**테스트 방법**: 캔버스가 정상적으로 표시되는지 확인

---

### 2단계: 공(Ball) 그리기 및 움직임 구현
**상태**: ✅ 완료

**목표**:
- 공을 화면에 그리기
- 공의 움직임 구현
- 벽 충돌 처리

**구현 내용**:
- [x] 공 위치 변수 (x, y)
- [x] 공 속도 변수 (dx, dy)
- [x] drawBall() 함수
- [x] 공 이동 로직
- [x] 좌/우/상단 벽 충돌 감지

**테스트 방법**: 공이 화면에서 움직이고 벽에 튕기는지 확인

---

### 3단계: 패들(Paddle) 그리기 및 조작 구현
**상태**: ✅ 완료

**목표**:
- 패들을 화면에 그리기
- 키보드/마우스로 패들 조작
- 공과 패들 충돌 처리

**구현 내용**:
- [x] 패들 위치 변수 (x)
- [x] drawPaddle() 함수
- [x] 키보드 이벤트 리스너 (방향키)
- [x] 마우스 이벤트 리스너
- [x] 패들 움직임 로직
- [x] 공-패들 충돌 감지

**테스트 방법**: 방향키/마우스로 패들을 움직이고 공이 튕기는지 확인

---

### 4단계: 벽돌(Bricks) 그리기
**상태**: ✅ 완료

**목표**:
- 벽돌 배열 생성
- 벽돌을 화면에 그리기

**구현 내용**:
- [x] 벽돌 관련 상수 (행, 열, 크기, 간격 등)
- [x] 벽돌 배열 초기화
- [x] drawBricks() 함수
- [x] 벽돌 색상 설정

**테스트 방법**: 화면 상단에 벽돌들이 정렬되어 표시되는지 확인

---

### 5단계: 충돌 감지 구현
**상태**: ✅ 완료

**목표**:
- 공과 벽돌의 충돌 감지
- 벽돌 파괴 처리

**구현 내용**:
- [x] collisionDetection() 함수
- [x] 벽돌 상태 관리 (status)
- [x] 충돌 시 공 방향 전환
- [x] 충돌 시 벽돌 제거
- [x] checkRectCircleCollision() 유틸리티 함수 (공통 충돌 감지)

**테스트 방법**: 공이 벽돌에 맞으면 벽돌이 사라지는지 확인

---

### 6단계: 점수 및 생명 시스템 추가
**상태**: ✅ 완료

**목표**:
- 점수 계산 시스템
- 생명 시스템
- 게임 오버 처리

**구현 내용**:
- [x] 점수, 생명 변수
- [x] 벽돌 파괴 시 점수 증가
- [x] 공이 바닥에 떨어지면 생명 감소
- [x] 생명이 0이 되면 게임 오버
- [x] 화면에 점수/생명 표시
- [x] resetPaddle() 함수 추가 (리팩토링)

**테스트 방법**: 점수가 올라가고, 공을 놓치면 생명이 줄어드는지 확인

---

### 7단계: 게임 상태 관리 및 UI 연동
**상태**: ✅ 완료

**목표**:
- 게임 시작/일시정지/재시작 기능
- HTML UI 버튼과 연동
- 오버레이 화면 제어

**구현 내용**:
- [x] 게임 상태 변수 (running, paused, level)
- [x] 시작 버튼 이벤트
- [x] 일시정지 버튼 이벤트
- [x] 재시작 버튼 이벤트
- [x] 오버레이 화면 show/hide
- [x] 게임 오버 화면 표시 (alert 대신 UI 사용)
- [x] 레벨 클리어 화면 표시
- [x] checkLevelClear() 및 levelClear() 함수

**테스트 방법**: 모든 버튼이 정상 작동하고 화면 전환이 되는지 확인

---

### 8단계: 난이도 시스템 및 추가 기능
**상태**: ✅ 완료

**목표**:
- 난이도 선택 기능
- 레벨 시스템
- 통계 저장 (LocalStorage)
- 추가 기능들

**구현 내용**:
- [x] 난이도 설정 (쉬움/보통/어려움)
- [x] 난이도별 속도/패들 크기 조정
- [x] 레벨 클리어 감지
- [x] 다음 레벨 진행
- [x] LocalStorage 통계 저장
- [x] 음소거 기능
- [x] 전체화면 기능

**테스트 방법**: 모든 난이도에서 게임이 정상 작동하고 통계가 저장되는지 확인

---

### 9단계: 로컬라이징 (다국어 지원)
**상태**: ✅ 완료

**목표**:
- 한국어/영어 다국어 지원
- JSON 기반 번역 시스템
- 언어 선택 UI
- 번역 데이터 영구 저장

**구현 내용**:
- [x] lang/ko.json - 한국어 번역 파일 생성
- [x] lang/en.json - 영어 번역 파일 생성
- [x] 언어 시스템 변수 (currentLanguage, translations)
- [x] t(key) 함수 - 번역 텍스트 가져오기 (translate의 약자)
- [x] loadLanguage(lang) 함수 - JSON 파일 비동기 로드
- [x] setLanguage(lang) 함수 - 언어 설정 및 UI 업데이트
- [x] updateLanguageUI() 함수 - data-i18n 속성 기반 자동 번역
- [x] HTML 모든 텍스트 요소에 data-i18n 속성 추가
- [x] 언어 선택 드롭다운 UI 추가 (시작 화면)
- [x] 캔버스 내 텍스트 번역 적용
- [x] LocalStorage에 언어 설정 저장 및 자동 복원
- [x] CSS 스타일링 (.language-select)

**테스트 방법**: 언어 선택 시 모든 UI 텍스트가 변경되고, 새로고침 후에도 언어가 유지되는지 확인

---

### 10단계: UI 개선 및 테마 시스템
**상태**: ✅ 완료

**목표**:
- 키보드 단축키 추가
- 커서 표시 개선
- UI 컬러 테마 변경 기능

**구현 내용**:
- [x] 키보드 단축키 (ESC/P 키로 일시정지)
- [x] 커서 표시 개선 (게임 중 숨김, 오버레이에서 표시)
- [x] 4가지 컬러 테마 시스템
  - Classic (보라색 - 기본)
  - Ocean (파란색)
  - Sunset (주황/빨강)
  - Forest (초록색)
- [x] CSS 변수 기반 테마 시스템 (data-theme 속성)
- [x] setTheme(theme) 함수 - 테마 전환 및 저장
- [x] 테마 선택 드롭다운 UI 추가
- [x] LocalStorage에 테마 설정 저장 및 자동 복원
- [x] 시작 화면 레이아웃 개선 (.settings-row)
- [x] 난이도/언어/테마 가로 배치 (flexbox)
- [x] 시작 화면만 더 넓게 (550px)

**테스트 방법**:
- ESC/P 키로 일시정지 작동 확인
- 테마 변경 시 전체 UI 색상 변경 확인
- 새로고침 후 테마 유지 확인

---

## 개발 노트

### 2025-10-20
- 프로젝트 시작
- HTML, CSS 구조 완성
- game.js 개발 계획 수립
- **1단계 완료**: 캔버스 설정 및 기본 게임 루프 구조 작성
  - init(), update(), draw(), gameLoop() 함수 작성
  - 캔버스 크기: 800x600
  - requestAnimationFrame을 사용한 게임 루프 구현
- **2단계 완료**: 공 그리기 및 움직임 구현
  - ballX, ballY, ballSpeedX, ballSpeedY 변수 추가
  - resetBall() 함수로 공 초기 위치 설정
  - drawBall() 함수로 주황색(#f59e0b) 공 그리기
  - update() 함수에서 공 이동 및 벽 충돌 처리 구현
  - 공 반지름: 8px, 속도: 5px/frame
- **3단계 완료**: 패들 그리기 및 조작 구현
  - paddleX, rightPressed, leftPressed 변수 추가
  - 패들 크기: 100x15px, 이동 속도: 7px/frame
  - keyDownHandler, keyUpHandler로 방향키 입력 처리
  - mouseMoveHandler로 마우스 이동 입력 처리
  - drawPaddle() 함수로 그라디언트 패들 그리기
  - 공-패들 충돌 감지 및 반사각 조정 구현 (공 가장자리 포함)
  - 패들 위치에 따라 공의 수평 속도 변경 (hitPos 계산)
- **4단계 완료**: 벽돌 그리기
  - 벽돌 상수: 5행 9열, 크기 75x20px, 간격 10px
  - bricks 2차원 배열 생성 (status: 1=존재, 0=파괴)
  - initBricks() 함수로 벽돌 배열 초기화
  - drawBricks() 함수로 색상별 벽돌 렌더링
  - 행마다 다른 색상: 빨강, 주황, 초록, 파랑, 보라
  - COLORS 객체로 모든 색상 전역 상수화 (리팩토링)
- **5단계 완료**: 충돌 감지 구현
  - checkRectCircleCollision() 유틸리티 함수 작성 (AABB 충돌 감지)
  - 패들 충돌 로직을 공통 함수 사용으로 리팩토링
  - collisionDetection() 함수로 벽돌-공 충돌 감지
  - 충돌 시 벽돌 status를 0으로 변경하여 파괴 처리
  - 충돌 시 공의 Y축 방향 반전
- **6단계 완료**: 점수 및 생명 시스템 추가
  - score, lives 변수 추가 (초기값: 0점, 3생명)
  - updateDisplay() 함수로 HTML 요소 업데이트
  - 벽돌 파괴 시 점수 +10점
  - 공이 바닥에 떨어지면 생명 -1
  - 생명이 0이 되면 게임 오버 (alert 표시 후 새로고침)
  - resetPaddle() 함수 추가 (코드 중복 제거)
  - 생명 표시는 하트 이모지(❤️)로 시각화
  - **공 발사 대기 시스템 추가**:
    - ballLaunched 변수로 공 발사 상태 관리
    - 대기 중에는 공이 패들 중앙 위에 고정
    - 스페이스바 또는 마우스 클릭으로 공 발사
    - 화면에 "스페이스바 또는 클릭하여 시작" 안내 문구 표시
    - mouseClickHandler() 이벤트 리스너 추가
- **7단계 완료**: 게임 상태 관리 및 UI 연동
  - gameRunning, gamePaused, level 변수 추가
  - startGame() - 시작 화면에서 게임 시작
  - togglePause() - 일시정지/재개 기능
  - restartGame() - 게임 오버 후 재시작
  - showMenu() - 메인 메뉴로 돌아가기
  - nextLevel() - 다음 레벨 진행
  - checkLevelClear() - 모든 벽돌 파괴 확인
  - levelClear() - 레벨 클리어 화면 표시
  - 게임 오버 시 UI 화면으로 변경 (alert 제거)
  - 시작 화면 재활성화 및 모든 오버레이 연동
- **8단계 완료**: 난이도 시스템 및 추가 기능
  - DIFFICULTY_SETTINGS 객체로 난이도별 설정 관리 (easy/normal/hard)
  - 난이도별 공 속도, 패들 너비, 벽돌 행 수 조정
  - startGame()에서 UI.difficultySelect로 난이도 선택 기능
  - stats 객체로 게임 통계 관리 (총 게임 수, 최고 점수, 최고 레벨, 파괴한 벽돌 수)
  - saveStats(), loadStats()로 LocalStorage 저장/불러오기
  - updateStatsDisplay()로 통계 화면 업데이트
  - toggleMute()로 음소거 토글 (아이콘 변경)
  - toggleFullscreen()로 전체화면 토글
  - 게임 오버 시 통계 자동 저장
  - 벽돌 파괴 시 totalBricks 증가
  - 모든 난이도 관련 함수에서 DIFFICULTY_SETTINGS 사용하도록 리팩토링
  - 패들 너비 하드코딩 제거 (PADDLE_WIDTH -> settings.paddleWidth)
- **9단계 완료**: 로컬라이징 (다국어 지원)
  - **JSON 기반 번역 시스템**:
    - lang/ko.json - 한국어 번역 (40개 키)
    - lang/en.json - 영어 번역 (40개 키)
    - 모든 UI 텍스트, 버튼, 라벨, 안내문구 번역
  - **언어 시스템 함수**:
    - t(key) - 번역 텍스트 가져오기 헬퍼 함수
    - loadLanguage(lang) - fetch API로 JSON 비동기 로드
    - setLanguage(lang) - 언어 전환 및 전체 UI 업데이트
    - updateLanguageUI() - data-i18n 속성 기반 자동 번역
  - **HTML 수정**:
    - 모든 텍스트 요소에 data-i18n 속성 추가
    - 언어 선택 드롭다운 추가 (한국어/English)
    - innerHTML 지원 (br 태그 포함 텍스트)
  - **캔버스 텍스트 번역**:
    - "스페이스바 또는 클릭하여 시작" → t('launchInstruction')
  - **영구 저장**:
    - LocalStorage에 선택한 언어 저장
    - init() 함수에서 자동 복원 (기본값: ko)
    - HTML lang 속성 및 페이지 제목 업데이트
  - **성능 고려**:
    - settings 객체 반복 조회 방식 유지 (캐싱 없이)
    - 이유: 성능 차이 미미, 버그 위험 감소, 유지보수 용이
- **10단계 완료**: UI 개선 및 테마 시스템
  - **키보드 단축키**:
    - keyDownHandler에 ESC/P 키 감지 추가
    - gameRunning 상태일 때만 togglePause() 호출
    - 게임 중 마우스 없이도 일시정지 가능
  - **커서 표시 개선**:
    - .canvas-wrapper에 cursor: none (게임 중 커서 숨김)
    - .overlay와 .overlay *에 cursor: default (오버레이에서 커서 표시)
    - 일시정지/게임오버 화면에서 버튼 클릭 가능
  - **테마 시스템 구현**:
    - CSS 변수 기반 테마 시스템 (--primary-color, --bg-dark 등)
    - [data-theme="ocean/sunset/forest"] 속성으로 테마 오버라이드
    - 4가지 컬러 테마: Classic (보라), Ocean (파랑), Sunset (주황/빨강), Forest (초록)
    - currentTheme 변수 및 setTheme(theme) 함수
    - HTML body에 data-theme 속성 설정/제거
    - LocalStorage 자동 저장/복원
  - **UI 레이아웃 개선**:
    - .settings-row 컨테이너로 난이도/언어/테마 가로 배치
    - flexbox (display: flex, gap: 15px, justify-content: center)
    - flex-wrap: wrap으로 반응형 지원
    - #startScreen .overlay-content { max-width: 550px } (시작 화면만 넓게)
    - 다른 오버레이는 400px 유지
  - **번역 추가**:
    - ko.json/en.json에 테마 관련 번역 추가
    - themeSelect, themeClassic, themeOcean, themeSunset, themeForest
- **11단계 완료**: 아이템 시스템 (파워업)
  - **아이템 시스템 구현**:
    - ITEM_SIZE: 20px (아이템 크기)
    - ITEM_SPEED: 2px/frame (낙하 속도)
    - ITEM_DROP_CHANCE: 0.3 (30% 확률)
    - 4가지 아이템 타입 (ITEM_TYPES 객체):
      - PADDLE_EXPAND: 패들 1.5배 확대, 파란색, 🟦, 10초 지속
      - BALL_SLOW: 공 속도 0.7배, 초록색, 🟩, 10초 지속
      - EXTRA_LIFE: 생명 +1, 빨간색, ❤️, 즉시 효과
      - PADDLE_SHRINK: 패들 0.7배 축소, 주황색, 🟥, 10초 지속 (부정 효과)
  - **아이템 관련 함수**:
    - createItem(x, y): 랜덤 아이템 생성 및 items 배열에 추가
    - updateItems(): 아이템 낙하, 패들 충돌 감지, 화면 밖 아이템 제거
    - drawItems(): 원형 배경 + 이모지로 아이템 렌더링
    - applyItemEffect(item): 아이템 타입별 효과 적용
    - activateEffect(type, duration): setTimeout으로 지속 효과 관리
    - getPaddleWidth(): activeEffects 플래그 기반 동적 패들 너비 반환
    - checkRectCollision(): AABB 충돌 감지 (아이템-패들용)
  - **게임 로직 통합**:
    - collisionDetection()에서 벽돌 파괴 시 30% 확률로 createItem() 호출
    - update()에 updateItems() 추가
    - draw()에 drawItems() 추가
    - 모든 패들 너비 참조를 getPaddleWidth()로 변경 (동적 계산)
  - **버그 수정 및 코드 품질**:
    - resetItems() 함수 추가: items 배열 및 activeEffects 초기화
    - startGame(), restartGame(), nextLevel()에서 resetItems() 호출
    - 함수 추출로 코드 중복 제거 (DRY 원칙)
  - **아이템 효과 동작 방식**:
    - 패들 크기: getPaddleWidth()가 매 프레임 activeEffects 플래그를 확인하여 동적 계산
    - 공 속도: ballSpeedX/Y에 배율 적용, setTimeout 후 원래 속도로 명시적 복원 필요
    - 생명: 즉시 lives++ 적용

### 2025-10-29
- **Stage 17 시작**: 코드 리팩토링 (모듈 분리)
  - 목표: 2200줄 game.js를 기능별 모듈로 분리
  - ES6 모듈 시스템 도입 (`type="module"`)
- **모듈 추출 완료** (9/10):
  1. constants.js (175 lines) - 모든 게임 상수 정의
  2. audio.js (232 lines) - Web Audio API, BGM, 효과음, 볼륨 관리
  3. i18n.js (80 lines) - 다국어 지원 시스템
  4. theme.js (27 lines) - 4가지 컬러 테마 시스템
  5. stats.js (60 lines) - 게임 통계 관리
  6. input.js (68 lines) - 키보드/마우스 입력 처리 (콜백 패턴)
  7. animations.js (269 lines) - 모든 애니메이션 효과
  8. items.js (155 lines) - 아이템 시스템 (콜백 패턴)
  9. bricks.js (106 lines) - 벽돌 생성/그리기/상태 관리
- **game.js 크기 변화**: 2200 lines → 1250 lines (43% 감소)
- **해결한 기술 이슈**:
  - ES6 모듈 readonly 변수 문제 (setMuted 함수 사용)
  - UTF-8 인코딩 반복 문제 (8개 파일 재작성)
  - 애니메이션 배열 재할당 에러 (.length = 0 사용)
  - ctx 매개변수 누락 (모든 draw 함수에 전달)
- **Git 작업**: 10개 커밋 푸시 완료 (브랜치: refactor/stage-17-module-separation)
- **남은 작업**: physics.js 추출, PR 생성 및 병합

---

### 11단계: 아이템 시스템 (파워업)
**상태**: ✅ 완료

**목표**:
- 벽돌 파괴 시 아이템 드롭
- 4가지 아이템 효과 구현
- 아이템 충돌 및 효과 적용

**구현 내용**:
- [x] 아이템 관련 상수 (ITEM_SIZE, ITEM_SPEED, ITEM_DROP_CHANCE: 30%)
- [x] ITEM_TYPES 객체 (4가지 아이템 정의)
  - 🟦 Paddle Expand (패들 1.5배 확대, 10초)
  - 🟩 Ball Slow (공 속도 0.7배, 10초)
  - ❤️ Extra Life (생명 +1, 즉시 효과)
  - 🟥 Paddle Shrink (패들 0.7배 축소, 10초, 부정 효과)
- [x] items 배열 및 activeEffects 객체
- [x] createItem(x, y) - 아이템 생성 (랜덤 타입)
- [x] updateItems() - 아이템 낙하 및 충돌 감지
- [x] drawItems() - 아이템 렌더링 (이모지 + 원형 배경)
- [x] applyItemEffect(item) - 아이템 효과 적용
- [x] activateEffect(type, duration) - 타이머 기반 효과 활성화
- [x] getPaddleWidth() - activeEffects 플래그 기반 동적 패들 너비 계산
- [x] checkRectCollision(rect1, rect2) - AABB 충돌 감지 (아이템-패들용)
- [x] collisionDetection()에서 30% 확률로 아이템 드롭
- [x] 모든 패들 너비 참조를 getPaddleWidth()로 통일
- [x] resetItems() 함수 - 아이템 및 효과 초기화 (코드 재사용)
- [x] startGame(), restartGame(), nextLevel()에서 resetItems() 호출

**테스트 방법**:
- 벽돌 파괴 시 아이템이 떨어지는지 확인
- 패들로 아이템 획득 시 효과가 적용되는지 확인
- 10초 후 효과가 자동으로 해제되는지 확인
- 레벨 전환 시 아이템이 초기화되는지 확인

---

### 12단계: 입자 효과 시스템
**상태**: ✅ 완료

**목표**:
- 벽돌 파괴 시 파편 입자 효과
- 중력과 페이드 아웃 효과

**구현 내용**:
- [x] 입자 상수 정의 (PARTICLE 객체)
  - COUNT: 8개 (벽돌당)
  - SIZE: 4px
  - SPEED: 3 (초기 속도)
  - GRAVITY: 0.2 (중력 가속도)
  - LIFETIME: 60 프레임
- [x] particles 배열
- [x] createParticles(x, y, color) - 벽돌 파괴 시 8개 입자 생성
  - 360도 균등 분포로 사방으로 퍼짐
  - 랜덤 속도와 크기 변화
- [x] updateParticles() - 입자 물리 업데이트
  - 위치 이동 (속도 적용)
  - 중력 효과 (아래로 가속)
  - 생명 주기 관리
- [x] drawParticles() - 입자 렌더링
  - 시간에 따라 투명도 감소 (fade out)
  - 벽돌 색상 유지
- [x] 게임 루프 통합
  - update()에 updateParticles() 추가
  - draw()에 drawParticles() 추가
- [x] resetItems()에 particles 초기화 추가

**테스트 방법**:
- 벽돌 파괴 시 파편이 사방으로 튀어나가는지 확인
- 입자가 중력에 따라 아래로 떨어지는지 확인
- 입자가 점점 투명해지면서 사라지는지 확인

---

### 13단계: 효과음 시스템
**상태**: ✅ 완료

**목표**:
- Web Audio API를 사용한 효과음 추가
- 모든 게임 이벤트에 사운드 적용

**구현 내용**:
- [x] 사운드 시스템 변수
  - audioContext: Web Audio API 컨텍스트
  - isMuted: 음소거 상태 (기존 변수 재배치)
- [x] 사운드 생성 함수들
  - initAudio(): AudioContext 초기화
  - playBeep(frequency, duration, volume): 기본 비프 사운드 생성
    - Oscillator (발진기): square wave 사용
    - GainNode: 볼륨 조절 및 페이드 아웃
- [x] 이벤트별 사운드 함수
  - playBrickBreakSound(): 800Hz, 0.1초 - 벽돌 파괴
  - playPaddleHitSound(): 300Hz, 0.1초 - 패들 충돌
  - playWallHitSound(): 200Hz, 0.05초 - 벽 충돌
  - playLifeLostSound(): 150Hz, 0.3초 - 생명 손실
  - playGameOverSound(): 하강하는 3음 (400→300→200Hz)
  - playWinSound(): 상승하는 3음 (400→500→600Hz)
- [x] 게임 이벤트에 사운드 통합
  - 벽돌 파괴 시
  - 좌우/상단 벽 충돌 시
  - 패들 충돌 시
  - 생명 손실 시
  - 게임 오버 시
  - 게임 승리 시
- [x] 게임 시작 시 AudioContext 초기화

**테스트 방법**:
- 음소거 버튼으로 사운드 on/off 확인
- 각 이벤트마다 적절한 효과음이 재생되는지 확인
- 여러 소리가 동시에 재생될 때 정상 작동하는지 확인

---

### 14단계: 배경 음악 및 UI 사운드 시스템
**상태**: ✅ 완료

**구현 내용**:
- [x] 볼륨 상수 분리 (BGM: 0.1, SFX: 0.2)
- [x] UI 클릭 효과음 추가
  - playClickSound(): 600Hz, 0.03초
  - 버튼 클릭 시 자동 재생 (게임 시작, 재시작, 메뉴, 설정 변경)
- [x] 배경 음악 시스템 구현
  - playMenuBGM(): C-E-G-E 패턴, Sine wave, 0.5초 간격
  - playGameBGM(): D-A-D-A 패턴, Square wave, 0.3초 간격
  - stopBGM(): BGM 정지 함수
- [x] 게임 상태별 자동 BGM 전환
  - 메뉴 화면: 차분한 멜로디
  - 게임 플레이: 빠른 리듬
  - 게임 오버/승리: BGM 정지
- [x] 볼륨 조절 UI 추가
  - BGM 볼륨 슬라이더 (0-100%, 기본 10%)
  - 효과음 볼륨 슬라이더 (0-100%, 기본 20%)
  - LocalStorage에 볼륨 설정 자동 저장
- [x] 음소거 기능 개선
  - 음소거 시 BGM 자동 정지
  - 음소거 해제 시 적절한 BGM 재개

**기술 구현**:
```javascript
// AudioContext 저지연 모드 초기화
audioContext = new AudioContext({
    latencyHint: 'interactive',  // 게임용 최소 지연
    sampleRate: 44100
});

// 볼륨 설정
let VOLUME = {
    BGM: 0.1,   // 배경음악
    SFX: 0.2    // 효과음
};

// BGM 재생 (루프 방식)
function playNextNote() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    // ... 음악 재생 로직
    setTimeout(playNextNote, interval);
}
```

**이슈 및 해결**:

1. **효과음 지연 문제**
   - **문제**: 효과음 반응이 100-200ms 지연됨
   - **원인**: Web Audio API 기본 버퍼 지연
   - **해결**: AudioContext 초기화 시 `latencyHint: 'interactive'` 옵션 추가
   - **결과**: 효과음이 즉각 반응하도록 개선 (게임용 저지연 모드)

2. **BGM 음소거가 안 되는 문제**
   - **문제**: 음소거 버튼 클릭 시 BGM이 계속 재생됨
   - **원인**: `playNextNote()` 함수 내부에서 `isMuted` 체크하지 않음
   - **해결**:
     ```javascript
     function playNextNote() {
         // 음소거 체크 추가
         if (!isBGMPlaying || currentBGM !== type || isMuted) return;
         // ...
     }
     ```
   - **결과**: 음소거 시 BGM이 즉시 정지됨

3. **음소거 해제 시 BGM이 재생되지 않는 문제**
   - **문제**: 음소거 해제 시 배경음이 재생되지 않음
   - **원인**: `stopBGM()`이 `currentBGM`을 초기화하지 않아서, `playMenuBGM()`이 `currentBGM === 'menu'` 조건에 걸림
   - **해결**: `stopBGM()`에서 `currentBGM = null` 추가
   - **결과**: 음소거 해제 시 적절한 BGM이 재생됨

4. **일시정지 후 메뉴로 돌아갈 때 게임 BGM이 계속 재생**
   - **문제**: 일시정지 후 메뉴로 돌아가도 게임 BGM이 계속 재생됨
   - **원인**: `showMenu()` 함수에서 `stopBGM()`을 호출하지 않음
   - **해결**: `showMenu()`에 `stopBGM()` 호출 추가
   - **결과**: 메뉴로 돌아갈 때 메뉴 BGM으로 정상 전환

5. **일시정지 중 음소거 해제 시 BGM이 재생되지 않음**
   - **문제**: 일시정지 상태에서 음소거 해제 시 BGM이 재생되지 않음
   - **원인**: `toggleMute()`의 조건 `gameRunning && !gamePaused`가 일시정지 상태를 차단
   - **해결**: 조건을 `gameRunning`만 체크하도록 변경
   - **결과**: 일시정지 중에도 음소거 해제 시 게임 BGM이 재생됨

6. **BGM 코드 중복**
   - **문제**: `playMenuBGM()`과 `playGameBGM()`이 거의 동일한 80줄 코드 중복
   - **원인**: 리팩토링 되지 않은 초기 구현
   - **해결**: 공통 함수 `playBGM(type, notes, waveType, noteDuration, interval)` 생성
   - **결과**: 코드가 80줄에서 20줄로 감소, 유지보수성 향상

7. **볼륨 라벨 로컬라이징 누락**
   - **문제**: 볼륨 슬라이더 라벨이 하드코딩되어 언어 변경 시 업데이트되지 않음
   - **원인**: `data-i18n` 속성 누락 및 번역 파일에 키 없음
   - **해결**:
     - `ko.json`에 `"bgmVolume": "🎵 배경음악:"`, `"sfxVolume": "🔊 효과음:"` 추가
     - `en.json`에 `"bgmVolume": "🎵 BGM:"`, `"sfxVolume": "🔊 SFX:"` 추가
     - HTML에 `data-i18n` 속성 추가
   - **결과**: 언어 변경 시 볼륨 라벨도 자동 업데이트

8. **음소거 버튼 상태 유지 문제**
   - **문제**: 페이지 새로고침 후 음소거 상태가 초기화됨
   - **원인**: 음소거 상태를 LocalStorage에 저장/로드하지 않음
   - **해결**:
     - `toggleMute()`에서 `localStorage.setItem('brickBreakerMuted', isMuted)` 추가
     - `init()`에서 음소거 상태 로드 및 `updateMuteButton()` 호출
   - **결과**: 페이지 새로고침 후에도 음소거 상태 유지

**파일 변경**:
- `index.html`: 볼륨 슬라이더 UI 추가, 라벨에 `data-i18n` 속성 추가
- `style.css`: 볼륨 컨트롤 스타일 추가
- `lang/ko.json`, `lang/en.json`: 볼륨 라벨 번역 추가
- `game.js`:
  - BGM 시스템 구현 (playBGM, playMenuBGM, playGameBGM, stopBGM)
  - UI 클릭 사운드 추가 (playClickSound)
  - 볼륨 관리 함수 (saveVolume, loadVolume, setBGMVolume, setSFXVolume)
  - 음소거 관리 함수 (toggleMute, updateMuteButton)
  - AudioContext 저지연 모드 설정

**테스트 방법**:
- 메뉴 화면에서 첫 클릭 시 BGM 자동 재생 확인
- 게임 시작 시 게임 BGM으로 전환 확인
- 볼륨 슬라이더로 BGM/효과음 개별 조절 확인
- 음소거 버튼으로 BGM/효과음 on/off 확인
- 일시정지 후 메뉴로 돌아가기 시 메뉴 BGM 재생 확인
- 언어 변경 시 볼륨 라벨 및 음소거 버튼 텍스트 업데이트 확인
- 페이지 새로고침 후 음소거 상태 유지 확인

---

### 15단계: 게임플레이 버그 수정
**상태**: ✅ 완료

**구현 내용**:
- [x] 공이 벽에 끼이는 버그 수정

**이슈 및 해결**:

1. **공이 벽에 끼이는 현상**
   - **문제**: 공이 좌우 벽이나 상단 벽에 닿을 때 벽에 끼이거나 관통하는 현상 발생
   - **원인**:
     - 속도만 반전(`ballSpeedX = -ballSpeedX`)하고 공의 위치를 보정하지 않음
     - 공이 벽을 관통한 상태에서 매 프레임마다 충돌 감지되어 속도가 계속 반전됨 (진동)
     - 속도가 빠를 경우 한 프레임에 벽을 완전히 관통하여 벽 바깥에 위치하게 됨
   - **기존 코드**:
     ```javascript
     // 문제가 있는 코드
     if (ballX + BALL.RADIUS > CANVAS.WIDTH || ballX - BALL.RADIUS < 0) {
         ballSpeedX = -ballSpeedX;  // 단순 반전 → 벽 안에서 진동
     }
     ```
   - **해결**:
     ```javascript
     // 수정된 코드
     if (ballX + BALL.RADIUS > CANVAS.WIDTH) {
         // 오른쪽 벽 충돌 - 위치 보정
         ballX = CANVAS.WIDTH - BALL.RADIUS;
         ballSpeedX = -Math.abs(ballSpeedX); // 항상 왼쪽으로
         playWallHitSound();
     } else if (ballX - BALL.RADIUS < 0) {
         // 왼쪽 벽 충돌 - 위치 보정
         ballX = BALL.RADIUS;
         ballSpeedX = Math.abs(ballSpeedX); // 항상 오른쪽으로
         playWallHitSound();
     }

     // 상단 벽 충돌
     if (ballY - BALL.RADIUS < 0) {
         // 위치 보정
         ballY = BALL.RADIUS;
         ballSpeedY = Math.abs(ballSpeedY); // 항상 아래로
         playWallHitSound();
     }
     ```
   - **개선 사항**:
     1. **위치 보정**: 공이 벽을 관통했을 때 벽 경계로 위치 되돌리기
     2. **절대값 사용**: `Math.abs()`로 속도 방향을 명확하게 설정
     3. **조건 분리**: `if-else if`로 한 프레임에 한 번만 처리
   - **결과**: 공이 벽에 끼이지 않고 부드럽게 반사됨

**파일 변경**:
- `game.js`: 벽 충돌 감지 로직 개선 (1296-1315번 줄)

**테스트 방법**:
- 게임 시작 후 공이 좌우 벽에 부딪힐 때 끼이지 않는지 확인
- 공이 상단 벽에 부딪힐 때 끼이지 않는지 확인
- 난이도 '어려움'으로 공 속도가 빠를 때도 정상 작동하는지 확인

---

### 16단계: 애니메이션 시스템
**상태**: ✅ 완료

**목표**:
- 게임 내 다양한 시각적 애니메이션 효과 추가
- 사용자 경험 향상을 위한 피드백 애니메이션 구현

**구현 내용**:

#### ✅ 완료된 애니메이션

1. **벽돌 파괴 애니메이션 (조각 흩어지기)**
   - 벽돌이 파괴될 때 6개의 조각으로 분해
   - 각 조각이 방사형으로 흩어지며 회전
   - 중력 효과 적용으로 자연스러운 낙하
   - 점진적인 투명도 감소 (페이드 아웃)
   - **파일**: `game.js` (790-852번 줄)
   - **함수**: `createBrickFragments()`, `updateBrickFragments()`, `drawBrickFragments()`

2. **공 트레일 효과**
   - 공이 움직일 때 잔상 효과 (최대 10개)
   - 시간에 따라 점진적으로 투명해지고 작아짐
   - 공 발사 전에는 트레일 생성 안 함
   - **파일**: `game.js` (858-899번 줄)
   - **함수**: `updateBallTrail()`, `drawBallTrail()`

3. **파워업 아이템 애니메이션 (회전/반짝임)**
   - 아이템이 회전하면서 낙하 (0.05 라디안/프레임)
   - 펄스 효과: 사인파를 이용한 크기 변화 (0.85 ~ 1.15)
   - 발광 효과: 외곽선이 깜빡이며 주기적으로 밝아짐 (0 ~ 0.6 투명도)
   - 흰색 테두리 반짝임
   - 이모지는 회전하지 않고 항상 정면 유지
   - **파일**: `game.js` (905-969번 줄)
   - **함수**: `updateItemAnimations()`, `drawAnimatedItems()`

4. **점수 팝업 애니메이션**
   - 벽돌 파괴 시 "+10" 텍스트가 금색으로 표시
   - 위로 떠오르는 효과 (2px/프레임)
   - 점진적으로 크기 증가 (1.0 ~ 1.5배)
   - 점진적으로 투명해짐 (페이드 아웃)
   - 흰색 테두리로 가독성 향상
   - **파일**: `game.js` (975-1027번 줄)
   - **함수**: `createScorePopup()`, `updateScorePopups()`, `drawScorePopups()`

#### 🔄 작업 중인 애니메이션

5. **패들 히트 효과 (충격파)** - 예정
   - 공이 패들에 맞을 때 파동이 퍼지는 효과
   - 3개의 동심원 파동
   - 점진적으로 확대 및 페이드 아웃

6. **패들 크기 변경 애니메이션** - 예정
   - 아이템 획득 시 패들 크기가 부드럽게 변화
   - 이징 함수 적용 (easeOutElastic)
   - 목표 크기를 살짝 넘어갔다가 돌아오는 효과

7. **생명력 회복/소실 애니메이션** - 예정
   - 생명 아이콘이 펄스하며 강조
   - 화면 흔들림 효과 (소실 시)
   - 3회 반복 펄스

8. **일시정지 UI 팝업 애니메이션** - 예정
   - 페이드 인 효과
   - 오버슈트를 이용한 스케일 애니메이션
   - 부드러운 등장 효과

9. **레벨 전환 애니메이션** - 예정
   - 페이드 아웃 → 레벨 표시 → 페이드 인
   - 줌 효과로 강조
   - 2초간 레벨 텍스트 표시

10. **콤보 효과 애니메이션** - 예정
    - 연속으로 벽돌을 깰 때 (3개 이상) 콤보 표시
    - 콤보 수에 따라 크기와 색상 변화
    - 1초 이내에 추가 벽돌을 깨야 콤보 유지

**애니메이션 시스템 구조**:
```javascript
// 전역 상수
ANIMATION = {
    EASING: { OVERSHOOT_STRENGTH: 1.70158 },
    BRICK_DESTROY: { FRAGMENT_COUNT: 6, ... },
    BALL_TRAIL: { MAX_LENGTH: 10, ... },
    SCORE_POPUP: { FLOAT_SPEED: 2, ... },
    PADDLE_HIT: { WAVE_COUNT: 3, ... },
    // ... 기타 애니메이션 설정
}

// 애니메이션 배열
let brickFragments = [];
let ballTrail = [];
let scorePopups = [];
let paddleHitWaves = [];
// ... 기타 애니메이션 상태
```

**게임 루프 통합**:
- `update()` 함수에서 모든 애니메이션 업데이트
- `draw()` 함수에서 모든 애니메이션 그리기
- `resetItems()` 함수에서 애니메이션 초기화

**파일 변경**:
- `game.js`:
  - 애니메이션 상수 추가 (142-220번 줄)
  - 애니메이션 함수 추가 (785-1027번 줄)
  - 게임 루프 통합 (1641, 1714, 1663, 1745번 줄)
  - 초기화 함수 수정 (1283번 줄)

**테스트 방법**:
- 브라우저에서 게임 실행
- 벽돌 파괴 시 조각 흩어짐 효과 확인
- 공 이동 시 트레일 효과 확인
- 아이템 낙하 시 회전/반짝임 효과 확인
- 벽돌 파괴 시 점수 팝업 표시 확인

---

### 17단계: 코드 리팩토링 (모듈 분리)
**상태**: 🔄 진행 중

**목표**:
- 2200줄의 monolithic game.js를 기능별 모듈로 분리
- ES6 모듈 시스템 사용
- 코드 유지보수성 향상
- 단일 책임 원칙 적용

**구현 내용**:
- [x] **constants.js** (175 lines) - 게임 상수 정의
  - CANVAS, COLORS, BALL, PADDLE, BRICK 상수
  - GAME, ITEM, ITEM_TYPES, PARTICLE 상수
  - ANIMATION, DIFFICULTY_SETTINGS 상수
- [x] **audio.js** (232 lines) - 오디오 시스템
  - Web Audio API 관리
  - BGM 시스템 (playMenuBGM, playGameBGM, stopBGM)
  - 효과음 시스템 (playBrickBreakSound 등)
  - 볼륨 관리 (setBGMVolume, setSFXVolume, loadVolume)
  - 음소거 관리 (toggleMute, setMuted, getMuted)
- [x] **i18n.js** (80 lines) - 다국어 지원 시스템
  - 번역 파일 로드 (loadLanguage)
  - 번역 텍스트 가져오기 (t 함수)
  - 언어 전환 (setLanguage)
  - UI 자동 업데이트 (updateLanguageUI)
- [x] **theme.js** (27 lines) - 테마 시스템
  - 테마 전환 (setTheme)
  - LocalStorage 저장/로드
  - 4가지 테마: Classic, Ocean, Sunset, Forest
- [x] **stats.js** (60 lines) - 통계 관리
  - 게임 통계 저장/로드 (saveStats, loadStats)
  - 통계 업데이트 (updateStats)
  - 통계 UI 표시 (updateStatsDisplay)
- [x] **input.js** (68 lines) - 입력 처리
  - 키보드 이벤트 (방향키, 스페이스바, ESC)
  - 마우스 이벤트 (이동, 클릭)
  - 콜백 패턴으로 게임 로직 분리
- [x] **animations.js** (269 lines) - 애니메이션 시스템
  - 입자 시스템 (createParticles, updateParticles, drawParticles)
  - 벽돌 조각 (createBrickFragments, updateBrickFragments, drawBrickFragments)
  - 공 트레일 (updateBallTrail, drawBallTrail)
  - 점수 팝업 (createScorePopup, updateScorePopups, drawScorePopups)
  - 패들 히트 파동 (createPaddleHitWave, updatePaddleHitWaves, drawPaddleHitWaves)
  - 애니메이션 초기화 (resetAnimations)
- [x] **items.js** (155 lines) - 아이템 시스템
  - 아이템 생성 (createItem)
  - 아이템 업데이트 및 충돌 감지 (updateItems)
  - 아이템 애니메이션 (updateItemAnimations, drawAnimatedItems)
  - 콜백 패턴으로 패들 너비 및 효과 적용 분리
- [x] **bricks.js** (106 lines) - 벽돌 시스템
  - 벽돌 초기화 (initBricks)
  - 벽돌 그리기 (drawBricks)
  - 벽돌 상태 확인 (checkAllBricksCleared)
  - 벽돌 유틸리티 (getBrick, destroyBrick)
- [ ] **physics.js** (예정) - 물리/충돌 감지
  - 충돌 감지 함수들
  - 공-벽 충돌
  - 공-패들 충돌
  - 공-벽돌 충돌

**모듈 구조**:
```
src/
├── constants.js       # 게임 상수
├── audio.js          # 오디오 시스템
├── i18n.js           # 다국어 지원
├── theme.js          # 테마 시스템
├── stats.js          # 통계 관리
├── input.js          # 입력 처리
├── animations.js     # 애니메이션
├── items.js          # 아이템 시스템
├── bricks.js         # 벽돌 시스템
├── physics.js        # (예정) 물리/충돌
└── game.js           # 메인 게임 로직 (1250 lines)
```

**코드 크기 변화**:
- 시작: game.js ~2200 lines
- 현재: game.js ~1250 lines + 9개 모듈 (~1172 lines)
- 감소: ~950 lines (43% 감소)

**이슈 및 해결**:

1. **오디오 모듈 추출 시 isMuted 변수 접근 문제**
   - **문제**: game.js에서 audio.js의 `isMuted` 변수를 직접 재할당 시도
   - **원인**: ES6 모듈에서 export된 변수는 readonly
   - **해결**: `setMuted()` 함수 사용으로 변경
   ```javascript
   // Before
   isMuted = savedMuted === 'true';

   // After
   setMuted(savedMuted === 'true');
   ```

2. **UTF-8 인코딩 문제 (반복 발생)**
   - **문제**: macOS에서 Write 도구로 파일 생성 시 한글이 깨짐
   - **원인**: 기본 인코딩이 UTF-8이 아님
   - **해결**: 파일 생성 후 Read로 확인, 깨졌으면 다시 Write
   - **영향받은 파일**: constants.js, ui.js, i18n.js, theme.js, stats.js, input.js, animations.js, items.js
   - **프로세스**: Write → Read (확인) → Write (재작성)

3. **애니메이션 모듈 readonly 속성 에러**
   - **문제**: `resetAnimations()`에서 export된 배열 재할당 시도
   - **해결**: 배열 재할당 대신 `.length = 0` 사용
   ```javascript
   // Before
   export function resetAnimations() {
       particles = [];  // Error!
   }

   // After
   export function resetAnimations() {
       particles.length = 0;  // OK
   }
   ```

4. **ctx 매개변수 누락**
   - **문제**: animations.js의 draw 함수들이 ctx를 매개변수로 받지만 game.js에서 전달 안 함
   - **에러**: `TypeError: undefined is not an object (evaluating 'ctx.save')`
   - **해결**: 모든 draw 함수 호출 시 ctx 전달
   ```javascript
   // Before
   drawParticles();

   // After
   drawParticles(ctx);
   drawBallTrail(ctx, BALL.RADIUS, COLORS.BALL);
   ```

**Git 커밋 내역** (10개):
1. `refactor: Extract constants to constants.js module`
2. `refactor: Extract audio module from game.js`
3. `fix: Fix UTF-8 encoding issues in constants.js`
4. `refactor: Extract UI module from game.js`
5. `refactor: Split ui.js into separate modules for better organization`
6. `refactor: Extract input handling module from game.js`
7. `refactor: Extract basic animation system to animations.js`
8. `refactor: Complete animations.js module extraction`
9. `refactor: Extract items.js module`
10. `refactor: Extract bricks.js module`

**파일 변경**:
- 9개 신규 모듈 파일 생성
- game.js 리팩토링 (~950 lines 감소)
- index.html: type="module" 추가

**테스트 방법**:
- 모든 게임 기능 정상 작동 확인
- 브라우저 콘솔 에러 없는지 확인
- 모듈 로딩 순서 문제 없는지 확인

---

## 다음 할 일
- [x] 8단계: 난이도 시스템 및 추가 기능 완료
- [x] 9단계: 로컬라이징 (다국어 지원) 완료
- [x] 10단계: UI 개선 및 테마 시스템 완료
- [x] 11단계: 아이템 시스템 (파워업) 완료
- [x] 12단계: 입자 효과 시스템 완료
- [x] 13단계: 효과음 시스템 완료
- [x] 14단계: 배경 음악 및 UI 사운드 완료 (8개 이슈 해결)
- [x] 15단계: 게임플레이 버그 수정 완료 (공 벽 끼임 현상)
- [x] 16단계: 애니메이션 시스템 완료 (10/10)
- [ ] 17단계: 코드 리팩토링 (9/10 모듈 완료)
  - [x] constants.js
  - [x] audio.js
  - [x] i18n.js
  - [x] theme.js
  - [x] stats.js
  - [x] input.js
  - [x] animations.js
  - [x] items.js
  - [x] bricks.js
  - [ ] physics.js (예정)
  - [ ] PR 생성 및 main 병합
- [x] 레벨 시스템 제거 (벽돌 클리어 = 게임 승리)
- [ ] 패들 충돌 로직 검토 (공이 패들 중심에 맞을 때 속도 감소 현상)
- [ ] 선택 사항: 모바일 터치 컨트롤

## ⚠️ 프로젝트 완성 시 재검토 사항
**레벨 시스템 재도입 검토**
- 현재는 모든 벽돌을 파괴하면 게임 승리로 끝남
- 프로젝트 완성 시 레벨 시스템이 다시 추가되었는지 확인
- 만약 추가되지 않았다면, 다음 중 하나를 고려:
  1. 레벨별 난이도 증가 (공 속도 증가, 패들 크기 감소, 벽돌 행 추가)
  2. 레벨별 패턴 변화 (다양한 벽돌 배치, 특수 벽돌 추가)
  3. 현재 그대로 유지 (단순 명확한 게임플레이)
- 사용자가 "프로젝트 완성" 선언 시, 이 항목을 다시 제시할 것

---

## 참고사항
- 각 단계를 완료할 때마다 이 문서를 업데이트할 것
- 브라우저에서 테스트하면서 진행
- 문제가 발생하면 "개발 노트" 섹션에 기록
