# 리팩토링 TODO 리스트

## 1. 파일 구조 분리
- [x] **game.js 분리** ✅ (Stage 17 완료)
  - ✅ `constants.js` (175 lines) - 모든 상수 정의
  - ✅ `audio.js` (232 lines) - 사운드 시스템
  - ✅ `i18n.js` (79 lines) - 다국어 지원
  - ✅ `theme.js` (26 lines) - 테마 시스템
  - ✅ `stats.js` (59 lines) - 통계 관리
  - ✅ `input.js` (67 lines) - 입력 처리
  - ✅ `animations.js` (268 lines) - 애니메이션 시스템
  - ✅ `items.js` (146 lines) - 아이템 시스템
  - ✅ `bricks.js` (98 lines) - 벽돌 시스템
  - ✅ `physics.js` (127 lines) - 충돌 감지 유틸리티
  - **결과**: 2200 lines → ~850 lines (61% 감소)

## 2. 게임 객체 클래스화 (OOP)
- [x] **Ball, Paddle, Brick 객체지향 리팩토링** ✅ (Stage 18 완료)
  - [x] `ball.js` - Ball 클래스 (178 lines)
    - 속성: x, y, speedX, speedY, radius, launched
    - 메서드: update(), draw(), launch(), reset(), checkWallCollision(), checkPaddleCollision(), adjustSpeed(), restoreSpeed(), getPosition()
  - [x] `paddle.js` - Paddle 클래스 (195 lines)
    - 속성: x, y, width, height, speed, animation, baseWidth
    - 메서드: update(), draw(), move(), moveTo(), reset(), startResizeAnimation(), getWidth(), getAnimatedWidth(), getPosition(), getBounds()
  - [x] `bricks.js` - Brick 클래스 & BrickManager (171 lines, 완전 재작성)
    - **Brick 클래스**: x, y, width, height, col, row, status, color
    - 메서드: draw(), destroy(), isAlive(), getBounds()
    - **BrickManager 클래스**: 1D 배열로 벽돌 그리드 관리
    - 메서드: init(), draw(), checkBallBrickCollision(), destroyBrick(), checkAllCleared(), getBricks(), getAliveBricks()
  - **결과**: 캡슐화 완료, 단일 책임 원칙 적용, 객체 참조 기반 설계

## 3. Update 함수 분리
- [ ] **update() 함수 모듈화**
  - `updateGameplay()` - 인게임 로직 (공, 패들, 충돌 등)
  - `updateAnimations()` - 모든 애니메이션 업데이트
  - `updateInput()` - 키보드/마우스 입력 처리
  - 현재: 모든 로직이 하나의 함수에 혼재

## 4. 디자인 패턴 적용
- [ ] **공 상태 패턴 사용**
  - `BallNotLaunched` - 패들에 붙어있는 상태
  - `BallMoving` - 발사되어 움직이는 상태
  - `BallSlowed` - 슬로우 아이템 효과 상태
  - 현재: if문으로 ballLaunched 체크

## 5. 애니메이션 시스템 개선
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

## 6. 추가 개선 사항
- [ ] (여기에 추가 항목 작성)

---

## 버그 수정 목록
- [x] **패들이 화면 밖으로 나가는 문제** ✅ (2025-11-11)
  - **문제**: 화면 가장자리에서 확장 아이템 획득 시 패들이 화면 밖으로 나감
  - **해결**: paddle.js의 update() 메서드에 화면 경계 체크 추가
  - **코드**: `this.x = Math.max(0, Math.min(this.x, CANVAS.WIDTH - currentWidth))`
  - **적용**: 애니메이션 진행 중(87줄)과 완료 시(94줄) 모두 경계 체크

- [x] **패들 위치에 따른 공 속도 변경 문제** ✅ (2025-11-11)
  - **문제**: 패들 중앙으로 갈수록 속도가 느려지고, 바깥으로 갈수록 속도가 빨라짐 (의도하지 않은 동작)
  - **원인**: X속도만 변경하면 전체 속도 크기가 달라짐
  - **기존 코드**:
    ```javascript
    const hitPos = (ballX - paddleX) / paddleWidth;
    ballSpeedX = (hitPos - 0.5) * 10;  // 문제!
    ballSpeedY = -Math.abs(ballSpeedY);
    ```
  - **해결**: 삼각함수를 사용해 각도만 변경하고 속도 크기 유지
  - **신규 코드** (ball.js:126-145):
    ```javascript
    const hitPos = (ballX - paddleX) / paddleWidth; // 0~1
    const angleInDegrees = (hitPos - 0.5) * 2 * 60; // -60~+60도
    const angleInRadians = angleInDegrees * Math.PI / 180;
    const currentSpeed = Math.sqrt(speedX² + speedY²);
    speedX = currentSpeed * Math.sin(angleInRadians);
    speedY = -currentSpeed * Math.cos(angleInRadians);
    ```
  - **추가 개선**: ball.js에 baseSpeed 속성 추가, restoreSpeed()에 0으로 나누기 방지

---

## 참고
- 현재 game.js 파일 크기: ~850 lines (Stage 17 후)
- 리팩토링 우선순위: 1 → 2 → 4 → 3 → 5
  - 이유: 클래스화(2) 후 상태패턴(4) 적용이 자연스럽고, 그 후 update 분리(3)가 단순해짐
- Stage 16 완료 (2025-10-28): 9개 애니메이션 시스템
- Stage 17 완료 (2025-10-28 ~ 2025-11-06): 모듈 분리
- Stage 18 진행 중 (2025-11-06~): OOP 리팩토링

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

### ✅ Stage 18 완료 (2025-11-06 ~ 2025-11-11): 게임 객체 OOP 리팩토링

**목표**: Ball, Paddle, Brick을 클래스 기반 객체로 전환

**결과**:
- 3개 클래스 추출 완료
- game.js에서 Ball, Paddle, BrickManager 인스턴스 사용
- 커밋: 4개 (문서 업데이트, Ball, Paddle, Brick 각각)
- 브랜치: refactor/game-entities-oop (푸시 완료)

#### 추출된 클래스 (3개)

1. **Ball 클래스** (ball.js, 178 lines)
   - **속성**: x, y, speedX, speedY, radius, launched
   - **메서드**:
     - `update(paddleX, paddleWidth)` - 위치 업데이트, 벽 충돌 감지 반환
     - `draw(ctx)` - 공 렌더링
     - `launch()` - 공 발사
     - `reset(difficulty)` - 난이도별 초기화
     - `checkWallCollision()` - 벽 충돌 감지 및 위치 보정
     - `checkPaddleCollision()` - 패들 충돌 감지 및 반사각 조정
     - `adjustSpeed(multiplier)` - 속도 배율 적용 (슬로우/패스트 효과)
     - `restoreSpeed(difficulty)` - 원래 속도 복원
     - `getPosition()` - {x, y, radius} 반환
   - **설계 개선**:
     - PADDLE 상수 사용으로 위치 계산 일관성 확보
     - `update()` 메서드가 충돌 정보 반환 (중복 호출 방지)
     - 위치 보정 로직 캡슐화

2. **Paddle 클래스** (paddle.js, 195 lines)
   - **속성**: x, y, width, height, speed, animation, baseWidth
   - **메서드**:
     - `update()` - 애니메이션 상태 업데이트
     - `draw(ctx)` - 패들 렌더링
     - `move(direction)` - 좌우 이동 (-1: 왼쪽, 1: 오른쪽)
     - `moveTo(x)` - 특정 위치로 이동 (마우스)
     - `reset()` - 초기 위치
     - `startResizeAnimation(centerX, targetWidth)` - 크기 변경 애니메이션
     - `getWidth(activeEffects)` - 효과 적용 너비 계산
     - `getAnimatedWidth(activeEffects)` - 애니메이션 중 너비 계산
     - `getPosition()` - {x, y, width, height} 반환
     - `getBounds()` - {x, y, width, height} 반환
   - **설계 개선**:
     - easeOutElastic 함수 포함 (애니메이션 전용)
     - 애니메이션 상태를 Paddle 내부에서 관리
     - 효과 플래그는 여전히 game.js에서 관리 (여러 엔티티 영향)

3. **Brick 클래스 & BrickManager** (bricks.js, 171 lines, 완전 재작성)

   **Brick 클래스**:
   - **속성**: x, y, width, height, col, row, status, color
   - **메서드**:
     - `draw(ctx)` - 벽돌 렌더링
     - `destroy()` - status = 0
     - `isAlive()` - status === 1 확인
     - `getBounds()` - {x, y, width, height} 반환

   **BrickManager 클래스**:
   - **데이터 구조 변경**: 2D 배열 `bricks[c][r]` → 1D 배열 `Brick[]`
   - **속성**: bricks (1D 배열), cols, rows
   - **메서드**:
     - `init(difficulty)` - 난이도별 벽돌 생성
     - `draw(ctx)` - 모든 살아있는 벽돌 렌더링
     - `checkBallBrickCollision(ballX, ballY, ballRadius, checkCollision)` - 충돌 감지 위임
     - `destroyBrick(brick)` - 벽돌 생명주기 관리 (이벤트/통계 확장 가능)
     - `checkAllCleared()` - 게임 클리어 조건 확인
     - `getBricks()` - 전체 벽돌 배열 반환
     - `getAliveBricks()` - 살아있는 벽돌만 필터링
   - **설계 개선**:
     - 객체 참조 기반 (JavaScript 표준 패턴)
     - 충돌 감지 함수를 콜백으로 받아 의존성 분리
     - 벽돌 관리 책임을 BrickManager에 집중

#### game.js 변경 사항

**제거된 변수**:
- `ballX, ballY, ballSpeedX, ballSpeedY, ballLaunched`
- `paddleX, paddleAnimation`
- `bricks` (2D 배열)

**추가된 인스턴스**:
```javascript
import { Ball } from './ball.js';
import { Paddle } from './paddle.js';
import { BrickManager } from './bricks.js';

const ball = new Ball();
const paddle = new Paddle();
const brickManager = new BrickManager();
```

**충돌 감지 간소화**:
```javascript
// Before: 중첩 for문 + 직접 배열 접근
function collisionDetection() {
    for (let c = 0; c < BRICK.COLS; c++) {
        for (let r = 0; r < settings.brickRows; r++) {
            const brick = bricks[c][r];
            if (brick.status === 1) {
                if (checkRectCircleCollision(...)) {
                    // 효과 적용 코드...
                }
            }
        }
    }
}

// After: BrickManager 위임
function collisionDetection() {
    const ballPos = ball.getPosition();
    const brick = brickManager.checkBallBrickCollision(
        ballPos.x, ballPos.y, ball.radius,
        checkRectCircleCollision
    );
    if (brick) {
        ball.speedY = -ball.speedY;
        brickManager.destroyBrick(brick);
        // 효과 적용 코드...
    }
}
```

#### 해결한 기술 이슈

1. **Ball 위치 계산 일관성 문제**
   - **문제**: `reset()`과 `update()`에서 Y 위치 계산이 다름 (-30 vs -40)
   - **원인**: 하드코딩된 값 사용
   - **해결**: PADDLE 상수 import 후 일관된 계산식 사용
   - **결과**: 모든 위치 계산이 `CANVAS.HEIGHT - PADDLE.HEIGHT - 10 - this.radius - 1`로 통일

2. **Ball update() 중복 호출 문제**
   - **문제**: `update()` 내부에서 `checkWallCollision()` 호출하지만 game.js에서도 호출
   - **해결**: `update()` 메서드가 충돌 정보를 반환하도록 변경
   - **결과**: 중복 호출 제거, 사운드 재생 타이밍 정확해짐

3. **Paddle animation 변수 잔여 참조**
   - **문제**: game.js 809번 줄에 `paddleAnimation = null` 잔존
   - **해결**: `paddle.animation = null`로 변경
   - **검증**: 모든 paddle 관련 변수 참조 확인 완료

4. **객체 참조 vs 인덱스 설계 고민**
   - **질문**: BrickManager가 brick 반환 후 다시 받아서 destroy하는 것이 비효율적인지?
   - **답변**: JavaScript에서는 객체 참조가 가장 효율적
     - 이미 찾은 객체를 바로 사용 (추가 탐색 불필요)
     - 인덱스 방식은 `this.bricks[index]` 접근 비용 발생
     - C#/C++ 표준 패턴과 동일
   - **결론**: 현재 객체 참조 기반 설계가 최적

#### 설계 원칙

1. **캡슐화**: 각 클래스가 자신의 상태와 동작을 관리
2. **단일 책임**: Ball(움직임/충돌), Paddle(조작/애니메이션), BrickManager(그리드 관리)
3. **의존성 분리**: 콜백 패턴으로 충돌 감지 함수 전달
4. **확장성**: BrickManager.destroyBrick()에서 이벤트/통계 추가 용이
5. **표준 패턴**: JavaScript 객체 참조를 활용한 효율적 설계

#### 효과 관리 결정 사항

**게임 효과(activeEffects)는 game.js에서 계속 관리**:
- **이유**:
  - 효과가 여러 엔티티에 영향 (ball, paddle)
  - 효과 간 상호작용 (slowBall ↔ fastBall 배타적)
  - 타이머 동기화 (일시정지/재개 시 전체 관리)
- **나중 고려**: Stage 19에서 EffectManager 분리 검토

#### Git 작업
- 브랜치: refactor/game-entities-oop
- 커밋: 4개
  1. 문서 업데이트 (Stage 17 완료 기록)
  2. Ball 클래스 추출 (위치 계산 일관성 수정 포함)
  3. Paddle 클래스 추출 (애니메이션 관리 포함)
  4. Brick 클래스 & BrickManager 추출 (2D → 1D 배열 전환)
- 푸시: origin/refactor/game-entities-oop 완료

---

### 🔄 Stage 19 진행 중 (2025-11-13~): 게임 시스템 리팩토링

**목표**: GameState 추출 및 EffectManager 클래스 분리

**현재 상황**:
- ✅ gameState 추출 완료
- 🔄 EffectManager 클래스 분리 예정

#### ✅ 완료: gameState 추출

**파일**: gameState.js (76 lines)

**방식 결정: 클래스 vs 단순 객체**
- ❌ **클래스 방식 폐기** (168 lines):
  - 복잡한 메서드, 인스턴스 생성 필요 (`new GameState()`)
  - 게임 상태는 하나만 필요 (싱글톤) → 클래스의 이점 없음
  - 단순한 값 저장 위주 → 클래스의 복잡도가 과도함

- ✅ **단순 객체 + 헬퍼 메서드 선택** (76 lines):
  - 간결한 코드, import 후 즉시 사용 가능
  - `export const gameState = { ... }` → 싱글톤 자동 보장
  - Ball, Paddle처럼 여러 인스턴스가 필요하지 않음

**비교**:
```javascript
// 클래스 방식 (폐기)
import { GameState } from './gameState.js';
let gameState = new GameState();  // 선언 필요
gameState.start();

// 단순 객체 방식 (채택)
import { gameState } from './gameState.js';
gameState.start();  // 즉시 사용
```

**구현 내용**:
- **속성**: score, lives, difficulty, running, paused
- **메서드**:
  - `isPlaying()` - 게임 진행 중 체크 (`running && !paused`)
  - `start()`, `stop()` - 게임 시작/정지
  - `pause()`, `resume()`, `togglePause()` - 일시정지 제어
  - `reset()` - 상태 초기화 (점수/생명만)

**개선 사항**:
- GAME.INITIAL_LIVES 상수 추가 (constants.js)
- 하드코딩된 `lives = 3` 모두 제거
- game.js 약 50줄 감소 (1275 → 1226 lines)

**설계 원칙**:
- **싱글톤 패턴**: export된 객체 하나만 존재
- **캡슐화**: 헬퍼 메서드로 상태 변경 로직 숨김
- **간결성**: 클래스보다 단순하면서도 구조화된 접근 제공

#### 🔄 예정: EffectManager 추출

**현재 문제**:
- `activeEffects`, `effectTimers` 객체가 game.js에 산재
- `activateEffect()`, `deactivateEffect()` 함수가 복잡한 타이머 관리
- 패들/공 효과가 상호 배타적인데 로직이 분산됨

**계획**:
- EffectManager 클래스로 타이머 관리 및 효과 적용 캡슐화
- activeEffects와 effectTimers를 클래스 내부로 이동
- 패들 확대/축소 상호 배타 로직을 메서드로 캡슐화

**예상 구조**:
```javascript
class EffectManager {
    activate(effectName, duration);
    deactivate(effectName);
    isActive(effectName);
    reset();
}
```

#### Git 작업
- 브랜치: refactor/game-systems-oop
- 커밋 예정: gameState 추출, EffectManager 추출

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
