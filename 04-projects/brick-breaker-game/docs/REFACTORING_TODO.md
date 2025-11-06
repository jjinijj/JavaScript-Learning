# 리팩토링 TODO 리스트

## 1. 파일 구조 분리
- [ ] **game.js 분리** (진행 중 - Stage 17)
  - `constants.js` - 모든 상수 정의 (파일 생성 완료)
  - `animations.js` - 모든 애니메이션 시스템 (파일 생성 완료)
  - `physics.js` - 충돌 감지, 물리 계산 (파일 생성 완료)
  - `items.js` - 아이템 시스템 (파일 생성 완료)
  - `audio.js` - 오디오 관리 (파일 생성 완료)
  - `ui.js` - UI 관련 로직 (파일 생성 완료)
  - `input.js` - 입력 처리 (파일 생성 완료)
  - `game-objects.js` - 공, 패들, 벽돌 객체 및 로직 (파일 생성 완료)
  - `game-core.js` - 게임 루프, 초기화, 상태 관리 (파일 생성 완료)

## 2. Update 함수 분리
- [ ] **update() 함수 모듈화**
  - `updateGameplay()` - 인게임 로직 (공, 패들, 충돌 등)
  - `updateAnimations()` - 모든 애니메이션 업데이트
  - `updateInput()` - 키보드/마우스 입력 처리
  - 현재: 모든 로직이 하나의 함수에 혼재

## 3. 디자인 패턴 적용
- [ ] **공 상태 패턴 사용**
  - `BallNotLaunched` - 패들에 붙어있는 상태
  - `BallMoving` - 발사되어 움직이는 상태
  - `BallSlowed` - 슬로우 아이템 효과 상태
  - 현재: if문으로 ballLaunched 체크

## 4. 애니메이션 시스템 개선
- [ ] **레벨 전환 애니메이션 리팩토링**
  - 현재: if-else로 phase 체크 (fadeIn, display, fadeOut)
  - 개선: 콜백 체인 또는 Promise 기반 시퀀스
  - 예시:
    ```javascript
    fadeIn()
      .then(() => display())
      .then(() => fadeOut())
      .then(() => callback());
    ```

## 5. 추가 개선 사항
- [ ] (여기에 추가 항목 작성)

---

## 버그 수정 목록
- [ ] **패들이 화면 밖으로 나가는 문제**
  - 화면 가장자리에서 확장 아이템 획득 시 패들이 화면 밖으로 나감
  - 패들 위치 경계 체크 로직 추가 필요

- [ ] **패들 위치에 따른 공 속도 변경 문제**
  - 현재: 패들 중앙으로 갈수록 속도가 느려지고, 바깥으로 갈수록 속도가 빨라짐 (의도하지 않은 동작)
  - 개선: 패들 위치는 각도만 변경하고, 속도는 일정하게 유지
  - 현재 코드:
    ```javascript
    const hitPos = (ballX - paddleX) / paddleWidth;
    ballSpeedX = (hitPos - 0.5) * 10;  // 문제: X속도만 변경하면 전체 속도 변함
    ballSpeedY = -Math.abs(ballSpeedY);
    ```
  - 해결: 각도로 속도 벡터 계산 후 일정한 크기로 정규화

---

## 참고
- 현재 game.js 파일 크기: ~2200 lines
- 리팩토링 우선순위: 1 → 2 → 4 → 3
- Stage 16 완료 (2025-10-28)
- Stage 17 리팩토링 진행 중 (2025-10-28)

## 진행 상황

### ✅ Stage 17 완료 (2025-10-28 ~ 2025-11-06): 모듈 분리 리팩토링

**목표**: 2200줄 game.js를 기능별 독립 모듈로 분리

**결과**:
- 10개 ES6 모듈 추출 완료
- game.js 크기: 2200 lines → ~850 lines (61% 감소)
- PR 병합 완료: refactor/stage-17-module-separation → main

#### 추출된 모듈 (10개)

1. **constants.js** (175 lines)
   - 모든 게임 상수 정의
   - CANVAS, COLORS, BALL, PADDLE, BRICK, GAME, ITEM, ANIMATION, DIFFICULTY_SETTINGS
   - export: 상수 객체들

2. **audio.js** (232 lines)
   - Web Audio API 기반 사운드 시스템
   - BGM 2곡 (메뉴, 인게임), 효과음 5종
   - 볼륨 제어 (BGM, SFX 독립), 음소거, localStorage 저장
   - export: 17개 함수 (init, play, stop, toggle, volume 관련)

3. **i18n.js** (79 lines)
   - 다국어 지원 (한국어, English)
   - 언어 전환, 번역 함수
   - export: t(), setLanguage(), getCurrentLanguage()

4. **theme.js** (26 lines)
   - 4가지 컬러 테마 (기본, 다크, 네온, 파스텔)
   - CSS 변수 기반 동적 테마 변경
   - export: setTheme(), getCurrentTheme()

5. **stats.js** (59 lines)
   - 게임 통계 (총 플레이, 승/패, 최고 점수, 콤보)
   - localStorage 저장/로드
   - export: loadStats(), updateStats(), getStats()

6. **input.js** (67 lines)
   - 키보드/마우스 입력 처리
   - 콜백 패턴으로 game.js와 분리
   - export: isRightPressed, isLeftPressed, setupInputHandlers()

7. **animations.js** (268 lines)
   - 7가지 애니메이션 시스템
   - particles, brickFragments, ballTrail, scorePopups, paddleHitWaves, combo, shakeEffect
   - export: 21개 함수 (create, update, draw, reset 등)

8. **items.js** (146 lines)
   - 아이템 생성/낙하/충돌/효과
   - 4가지 아이템 (패들 확대/축소, 공 슬로우, 생명 추가)
   - 회전/반짝임/발광 애니메이션
   - export: items 배열, 5개 함수 (create, update, draw 등)

9. **bricks.js** (98 lines)
   - 벽돌 초기화/그리기/상태 관리
   - 2D 배열 기반 벽돌 시스템
   - export: bricks 배열, 5개 함수 (init, draw, check, destroy, get)

10. **physics.js** (127 lines)
    - 충돌 감지 유틸리티 함수
    - AABB, 원-사각형, 원-원, 점-사각형 충돌
    - 수학 함수 (distance, normalize, toRadians, toDegrees)
    - export: 8개 함수 (checkRectCircleCollision 등)
    - 중복 제거: items.js의 checkRectCollision 통합

#### 해결한 기술 이슈

1. **ES6 모듈 readonly 변수 문제**
   - 문제: `export let muted`는 import한 곳에서 수정 불가
   - 해결: setMuted() 함수 제공

2. **UTF-8 인코딩 문제**
   - 문제: Write 도구 사용 시 한글 주석 깨짐 (macOS)
   - 해결: 10개 파일 모두 재작성으로 해결

3. **애니메이션 배열 재할당 에러**
   - 문제: `particles = []`은 import된 배열 참조를 끊음
   - 해결: `particles.length = 0` 사용

4. **ctx 매개변수 누락**
   - 문제: draw 함수들이 전역 ctx를 참조
   - 해결: 모든 draw 함수에 ctx 매개변수 전달

5. **중복 함수 제거**
   - items.js의 checkRectCollision을 physics.js에서 import

#### Git 작업
- 브랜치: refactor/stage-17-module-separation
- 커밋: 12개 (각 모듈별 추출, 문서 업데이트)
- PR #1 생성 및 main 브랜치 병합 완료

---

### 🔄 Stage 18 예정 (2025-11-06~): 게임 객체 OOP 리팩토링

**목표**: Ball, Paddle, Brick을 클래스 기반 객체로 전환

**계획**:
- Ball 클래스 (ball.js)
- Paddle 클래스 (paddle.js)
- Brick 클래스 (brick.js 리팩토링)
- 브랜치: refactor/game-entities-oop

---

### 이전 진행 상황
- ✅ Stage 16: 9개 애니메이션 시스템 완성 (2025-10-28)

## 설계 결정 사항
### 콤보 타임아웃: 2초
**이유**:
- Normal 난이도 기준 공 속도: 5 px/frame (60 FPS)
- 패들(y=575) → 벽돌(y=80) 거리: 약 495px
- 최소 왕복 시간: 495÷5÷60 = 1.65초
- 실제 시간: 벽 튕김 고려 시 1.5~2.5초
- **결론**: 평균 왕복 시간 2초를 타임아웃으로 설정하여 자연스러운 콤보 유지 가능
