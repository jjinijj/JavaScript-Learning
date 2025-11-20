# 설계 결정 및 기술적 논의

## 📌 문서 목적

프로젝트 진행 중 내린 **설계 결정**과 **그 이유**를 기록합니다.

- **기술적 논의**: 여러 옵션 중 왜 이것을 선택했는가?
- **트레이드오프 분석**: 각 선택의 장단점
- **설계 패턴 근거**: 왜 이 패턴이 적합한가?
- **성능/효율성**: 메모리, 속도, 가독성 고려 사항

**대상 독자**: 미래의 나, 팀원, 코드를 배우는 사람

---

## Stage 18: 게임 객체 OOP 리팩토링

### 1. 객체 참조 vs 인덱스 설계

#### 질문
> BrickManager가 `checkBallBrickCollision()`에서 brick 객체를 반환하고, game.js에서 그 brick을 다시 `destroyBrick(brick)`에 넘겨주는 방식이 비효율적인가?
>
> 인덱스를 반환해서 `destroyBrick(index)`로 하는 것이 더 나은가?

#### 답변: 객체 참조가 더 효율적

**JavaScript에서는 객체 참조가 가장 효율적입니다.**

**비교**:
```javascript
// Option 1: 객체 참조 (채택)
const brick = brickManager.checkBallBrickCollision(...);
if (brick) {
    brickManager.destroyBrick(brick);  // 이미 찾은 객체 바로 사용
}

// Option 2: 인덱스 방식 (비효율적)
const index = brickManager.checkBallBrickCollision(...);
if (index !== -1) {
    brickManager.destroyBrick(index);  // 다시 this.bricks[index] 접근
}
```

**이유**:
1. **추가 탐색 불필요**: 이미 찾은 객체를 바로 사용 (O(1))
2. **인덱스 접근 비용**: `this.bricks[index]` 배열 접근 비용 발생
3. **JavaScript 표준**: 객체 참조가 일반적 (C#/C++과 동일)
4. **타입 안정성**: 객체는 타입 체크 가능, 인덱스는 -1 체크 필요

**결론**: 현재 객체 참조 기반 설계가 최적 ✅

---

### 2. 2D 배열 vs 1D 배열

#### 결정: 2D 배열 `bricks[c][r]` → 1D 배열 `bricks[]`

**Before**:
```javascript
// 2D 배열
const bricks = [];
for (let c = 0; c < cols; c++) {
    bricks[c] = [];
    for (let r = 0; r < rows; r++) {
        bricks[c][r] = new Brick(...);
    }
}

// 접근
const brick = bricks[col][row];
```

**After**:
```javascript
// 1D 배열
const bricks = [];
for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
        bricks.push(new Brick(c, r, ...));
    }
}

// 접근
bricks.forEach(brick => { ... });
```

**1D 배열의 장점**:
1. **반복 간단**: `forEach`, `filter`, `map` 직접 사용 가능
2. **메모리 효율**: 중첩 배열 오버헤드 없음
3. **객체 기반 접근**: col, row를 brick 속성으로 저장
4. **확장 용이**: 불규칙한 벽돌 배치도 가능

**결론**: 객체지향 설계에서는 1D 배열이 더 자연스러움 ✅

---

## Stage 19: 게임 시스템 리팩토링

### 1. GameState - 클래스 vs 단순 객체

#### 질문
> GameState를 클래스로 만들까, 단순 객체로 만들까?

#### 결정: 단순 객체 선택

**비교**:

| 항목 | 클래스 | 단순 객체 |
|------|--------|----------|
| 코드 크기 | 168 lines | 76 lines |
| 사용 방법 | `new GameState()` 필요 | import 후 즉시 사용 |
| 복잡도 | 복잡한 메서드 | 간단한 헬퍼 메서드 |
| 인스턴스 | 여러 개 생성 가능 | 싱글톤 (하나만 존재) |

**클래스 방식 (폐기)**:
```javascript
// 클래스 정의
export class GameState {
    constructor() {
        this.score = 0;
        this.lives = 3;
        // ... 복잡한 초기화
    }

    start() { /* ... */ }
    // ... 많은 메서드
}

// 사용
import { GameState } from './gameState.js';
let gameState = new GameState();  // 인스턴스 생성 필요
gameState.start();
```

**단순 객체 방식 (채택)**:
```javascript
// 객체 정의
export const gameState = {
    score: 0,
    lives: GAME.INITIAL_LIVES,
    running: false,
    paused: false,

    isPlaying() {
        return this.running && !this.paused;
    },

    start() {
        this.running = true;
        this.paused = false;
    }
    // ... 간단한 헬퍼 메서드
};

// 사용
import { gameState } from './gameState.js';
gameState.start();  // 즉시 사용
```

**단순 객체를 선택한 이유**:
1. ✅ **싱글톤 필요**: 게임 상태는 하나만 필요 (여러 인스턴스 불필요)
2. ✅ **단순한 데이터**: 값 저장이 주 목적, 복잡한 로직 없음
3. ✅ **간결성**: 76줄 vs 168줄 (55% 감소)
4. ✅ **즉시 사용**: `new` 키워드 불필요

**Ball, Paddle과의 차이**:
- **Ball, Paddle**: 여러 개 생성 가능성 → 클래스 적합
- **GameState**: 항상 하나만 존재 → 단순 객체 적합

**결론**: 싱글톤 + 단순 데이터 = 단순 객체가 최적 ✅

---

### 2. EffectManager - 왜 클래스인가?

#### 질문
> GameState는 단순 객체인데, EffectManager는 왜 클래스인가?

#### 결정: 클래스 선택 (GameState와 다른 이유)

**비교**:

| 특성 | GameState | EffectManager |
|------|-----------|---------------|
| 데이터 복잡도 | 단순 (5개 변수) | 복잡 (타이머, 콜백) |
| 로직 복잡도 | 간단 (플래그 변경) | 복잡 (타이머 생명주기) |
| 상태 공유 | 독립적 | 여러 메서드 간 공유 |
| 의존성 | 없음 | 콜백 함수 필요 |

**EffectManager를 클래스로 선택한 이유**:

1. **복잡한 타이머 관리**:
```javascript
// 여러 setTimeout 동시 관리
this.timers = {
    paddleExpanded: null,
    ballSlow: null,
    paddleShrink: null
};

// 타이머 생명주기 관리
activate() {
    if (this.timers[effectName]) {
        clearTimeout(this.timers[effectName]);  // 기존 타이머 취소
    }
    this.timers[effectName] = setTimeout(() => {
        // 효과 종료 로직
    }, duration);
}
```

2. **여러 메서드가 상태 공유**:
```javascript
// activeEffects, timers, callbacks를 여러 메서드가 사용
activate()    // timers 설정
deactivate()  // timers 취소
reset()       // 모든 timers 정리
```

3. **콜백 패턴으로 의존성 주입**:
```javascript
constructor() {
    this.callbacks = {
        getPaddleWidth: null,
        startPaddleAnimation: null,
        restoreBallSpeed: null
    };
}

setCallbacks(callbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
}
```

4. **상호 배타적 효과 처리**:
```javascript
// 패들 확대 ↔ 축소 동시 불가
if (effectManager.isActive('paddleShrink')) {
    effectManager.deactivate('paddleShrink');
}
effectManager.activate('paddleExpanded', 10000);
```

**단순 객체가 부적합한 이유**:
- ❌ `setTimeout` 여러 개 관리 어려움
- ❌ 콜백 함수 저장 및 호출 복잡
- ❌ 효과별 생명주기 관리 어려움

**결론**: 복잡한 상태 관리 = 클래스가 적합 ✅

---

### 3. 콜백 패턴 - 초기화 vs 호출 시 전달

#### 질문
> 콜백 함수를 초기화 시 한 번 설정하는 것이 효율적인가?
>
> 아니면 함수 호출 시마다 콜백을 넘겨주는 것이 효율적인가?

#### 결정: 초기화 시 설정 (더 효율적)

**Option 1: 초기화 시 설정 (채택)**:
```javascript
// 초기화 시 한 번만
effectManager.setCallbacks({
    getPaddleWidth: getPaddleWidth,
    getAnimatedPaddleWidth: getAnimatedPaddleWidth,
    startPaddleAnimation: startPaddleResizeAnimation,
    restoreBallSpeed: restoreBallSpeed
});

// 사용 시 간단
effectManager.activate('paddleExpanded', 10000, currentWidth);
effectManager.activate('ballSlow', 5000);
```

**Option 2: 호출 시 전달 (비효율적)**:
```javascript
// 매번 전달
effectManager.activate('paddleExpanded', 10000, currentWidth, {
    getPaddleWidth: getPaddleWidth,
    getAnimatedPaddleWidth: getAnimatedPaddleWidth,
    startPaddleAnimation: startPaddleResizeAnimation,
    restoreBallSpeed: restoreBallSpeed
});
```

**비교표**:

| 측면 | 초기화 시 설정 | 호출 시 전달 |
|------|--------------|------------|
| **성능** | ✅ 초기화 1회 | ❌ 매번 객체 생성 |
| **메모리** | ✅ 참조 유지 (32 bytes) | ❌ 반복 할당/해제 (GC 부담) |
| **가독성** | ✅ 호출 코드 간결 | ❌ 호출 코드 장황 |
| **안정성** | ✅ 콜백 누락 불가 | ❌ 콜백 누락 가능 |
| **유연성** | ❌ 동적 변경 어려움 | ✅ 호출마다 다른 콜백 가능 |

**초기화 시 설정이 더 나은 이유**:

1. **성능**:
   - 초기화: 1회만 객체 생성
   - 호출 시: 아이템 획득마다 객체 생성/해제 (가비지 컬렉터 부담)

2. **메모리**:
   - 초기화: 콜백 참조 4개 유지 (약 32 bytes)
   - 호출 시: 매번 새 객체 할당 → GC 오버헤드

3. **가독성**:
```javascript
// 초기화: 간결
effectManager.activate('ballSlow', 10000);

// 호출 시: 장황
effectManager.activate('ballSlow', 10000, null, { /* 4개 콜백 */ });
```

**호출 시 전달이 더 나은 경우**:
- ✅ 콜백이 **매번 달라질 때** (동적 동작)
- ✅ **일회성 작업** (한 번만 호출)
- ✅ **범용 라이브러리** (Array.map, setTimeout)
- ✅ 콜백이 **컨텍스트를 캡처**해야 할 때

**우리 경우**:
- 콜백은 항상 동일 (getPaddleWidth, restoreBallSpeed 등)
- 반복 호출됨 (아이템 먹을 때마다)
- 컨텍스트 불필요 (함수 자체만 필요)

**결론**: 초기화 시 설정이 최적 (효율성, 성능, 가독성) ✅

---

## Stage 16: 애니메이션 시스템

### 콤보 시스템 폐기 결정

#### 질문
> 콤보 애니메이션 시스템을 구현할까?

#### 결정: 폐기

**계획했던 내용**:
- 연속으로 벽돌 3개 이상 깰 때 콤보 표시
- 콤보 수에 따라 크기와 색상 변화
- 2초 타임아웃 (공의 왕복 시간 고려)

**콤보 타임아웃 계산**:
```javascript
// Normal 난이도 기준
공 속도: 5 px/frame (60 FPS)
패들(y=575) → 벽돌(y=80) 거리: 495px
최소 왕복 시간: 495÷5÷60 = 1.65초
실제 시간: 벽 튕김 고려 시 1.5~2.5초
→ 평균 2초를 타임아웃으로 설정
```

**폐기 이유**:
1. ❌ **게임 템포 방해**: 시각적 복잡성 증가
2. ❌ **불필요한 요소**: 단순한 벽돌깨기 게임에 과도한 기능
3. ❌ **핵심에서 벗어남**: 핵심 게임플레이에 집중하기 위해 제거

**결론**: 단순함 유지 = 더 나은 게임플레이 ✅

---

## Stage 21: 충돌 감지 시스템 리팩토링

### 1. CollisionDetector 클래스 vs 이벤트 핸들러

#### 질문
> 충돌 처리 로직을 CollisionDetector 클래스로 분리해야 하는가?

#### 결정: 이벤트 핸들러 방식 채택 (클래스 폐기)

**초기 시도 - CollisionDetector 클래스**:
```javascript
class CollisionDetector {
    detectBallBrickCollision(ball, brickManager) {
        return brickManager.checkBallBrickCollision(...);  // 단순 래퍼
    }
    detectBallPaddleCollision(ball, paddle) {
        return ball.checkPaddleCollision(...);  // 단순 래퍼
    }
}
```

**문제점**:
- Ball, BrickManager가 이미 충돌 감지 메서드 보유
- 단순 래퍼 클래스는 불필요한 추상화 레이어 (YAGNI 원칙 위배)
- 실제 필요한 건 충돌 **처리** 로직의 분리, **감지**는 이미 존재

**사용자 피드백**:
> "수정한게 의미가 있는 수정이야? 함수 하나 분리했을뿐인데?"

**채택한 방식 - 이벤트 핸들러**:
```javascript
// 메인 충돌 감지 루프
function checkCollisions(wallCollision) {
    const brick = brickManager.checkBallBrickCollision(...);  // 직접 호출
    if (brick) {
        onBrickHit(brick);  // 이벤트 처리
        return;
    }

    if (wallCollision) {
        playWallHitSound();
    }

    if (ball.checkPaddleCollision(...)) {  // 직접 호출
        onPaddleHit();  // 이벤트 처리
    } else if (ball.checkBottomCollision()) {  // 직접 호출
        onLifeLost();  // 이벤트 처리
    }
}

// 이벤트 핸들러들
function onBrickHit(brick) { /* 벽돌 충돌 처리 */ }
function onPaddleHit() { /* 패들 충돌 처리 */ }
function onLifeLost() { /* 생명 손실 처리 */ }
```

**이벤트 핸들러 방식의 장점**:
1. ✅ **YAGNI 원칙**: 필요하지 않은 추상화 제거
2. ✅ **단일 책임 원칙**: 각 핸들러가 하나의 이벤트만 처리
3. ✅ **명확한 네이밍**: `on~` 스타일로 이벤트 처리 명확
4. ✅ **직접 호출**: 불필요한 레이어 없이 직접 접근

**교훈**:
- 클래스가 항상 답은 아니다
- 추상화는 명확한 이유가 있을 때만
- YAGNI: You Aren't Gonna Need It

**결론**: 불필요한 추상화 제거 = 더 나은 코드 ✅

---

### 2. 충돌 우선순위 설계

#### 질문
> 충돌 감지 순서와 if-else 구조를 어떻게 설계해야 하는가?

#### 결정: 물리적 우선순위 + 배타성 고려

**초기 설계**:
```javascript
// 벽돌 → 벽 → 하단 → 패들 (else-if로 모두 연결)
if (brick) {
    onBrickHit(brick);
} else {
    const wallCollision = ball.update(...);
    if (wallCollision) {
        playWallHitSound();
    } else if (ball.checkBottomCollision()) {
        onLifeLost();
    } else if (ball.checkPaddleCollision(...)) {
        onPaddleHit();
    }
}
```

**문제점**:
- 하단 충돌이 패들 충돌보다 먼저 체크 (논리적으로 이상)
- 벽 충돌이 else-if에 묶여있어 다른 충돌과 동시 발생 불가

**개선된 설계**:
```javascript
// 1. 벽돌 충돌 (최우선, early return)
const brick = brickManager.checkBallBrickCollision(...);
if (brick) {
    onBrickHit(brick);
    return;
}

// 2. 벽 충돌 (독립적 처리)
if (wallCollision) {
    playWallHitSound();
}

// 3. 패들 vs 하단 충돌 (배타적 if-else)
if (ball.checkPaddleCollision(...)) {
    onPaddleHit();
} else if (ball.checkBottomCollision()) {
    onLifeLost();
}
```

**설계 원칙**:

1. **벽돌 충돌 (최우선)**:
   - 게임의 핵심 메커니즘
   - early return으로 불필요한 체크 방지

2. **벽 충돌 (독립적)**:
   - 좌우/상단 벽은 언제든 충돌 가능
   - 다른 충돌과 동시 발생 가능 (if 단독)

3. **패들 vs 하단 (배타적)**:
   - 물리적으로 동시 발생 불가능
   - 패들이 하단 위에 있으므로 패들 먼저 체크
   - if-else로 배타성 명확히 표현

**사용자 제안**:
> "패들 충돌이랑 하단 충돌은 동시에 일어날 수 없지않아?"

**결론**: 물리적 현실 반영 + 명확한 우선순위 = 직관적 코드 ✅

---

### 3. 함수 네이밍 - handle vs on

#### 질문
> 충돌 처리 함수 이름에 `handle` prefix가 적절한가?

#### 결정: `on~` 이벤트 스타일 채택

**초기 네이밍 (handle prefix)**:
```javascript
function handleCollision() { ... }
function handleBrickCollision(brick) { ... }
function handlePaddleCollision() { ... }
function handleBottomCollision() { ... }
```

**문제점**:
- `handle`이 일반적이고 애매함
- 이벤트 핸들러임을 명확히 표현하지 못함

**사용자 질문**:
> "함수명 handle이 들어간건 네가 수정한걸 따라한건데 handle이 들어가는게 맞아?"

**대안 검토**:

1. **이벤트 스타일 (on~)** - 채택 ✅
```javascript
onBrickHit(brick)
onPaddleHit()
onLifeLost()
```
- 명확한 이벤트 핸들러 표현
- JavaScript 표준 관례 (onClick, onSubmit 등)

2. **액션 스타일**
```javascript
destroyBrick(brick)
bounceBallOffPaddle()
loseLife()
```
- 동작 중심 표현
- 이벤트 핸들러임이 불명확

**최종 네이밍**:
```javascript
checkCollisions()     // 메인 충돌 감지 루프 (check~)
onBrickHit(brick)     // 벽돌 충돌 이벤트 (on~)
onPaddleHit()         // 패들 충돌 이벤트 (on~)
onLifeLost()          // 생명 손실 이벤트 (on~)
```

**네이밍 규칙**:
- `check~`: 상태 확인, 검증 (반환값 있음)
- `on~`: 이벤트 핸들러 (반환값 없음)
- `handle~`: 일반적인 처리 (애매함, 지양)

**결론**: 명확한 의미 전달 = 더 나은 네이밍 ✅

---

## Stage 21.5: Ball.update() 메서드 분리

### 1. update() 메서드의 단일 책임 원칙

#### 질문
> `ball.update()`가 벽 충돌 정보를 반환하는 것이 적절한가?

#### 결정: 위치 업데이트와 충돌 감지 분리

**기존 설계**:
```javascript
// ball.js
update(paddleX, paddleWidth) {
    if (!this.launched) { return null; }  // 발사 전: null
    this.x += this.speedX;
    this.y += this.speedY;
    return this.checkWallCollision();  // 발사 후: 충돌 정보
}

// game.js
const wallCollision = ball.update(paddle.x, paddleWidth);
checkCollisions(wallCollision);
```

**문제점**:
1. **두 가지 책임**: 위치 업데이트 + 벽 충돌 감지
2. **반환값 혼재**: 발사 전 `null`, 발사 후 충돌 정보
3. **네이밍 불명확**: `update()`에서 충돌 정보 반환 예상 어려움
4. **부수 효과 혼재**: 상태 변경(위치) + 정보 반환(충돌)

**사용자 질문**:
> "ball.update에서 항상 wallCollision을 return해주는게 맞을까?"

**개선된 설계**:
```javascript
// ball.js - 순수하게 위치만 업데이트 (void)
update(paddleX, paddleWidth) {
    if (!this.launched) { return; }
    this.x += this.speedX;
    this.y += this.speedY;
}

// game.js - 명시적 분리
ball.update(paddle.x, paddleWidth);  // 위치 업데이트
const wallCollision = ball.checkWallCollision();  // 충돌 감지
checkCollisions(wallCollision);  // 충돌 처리
```

**개선 효과**:
1. ✅ **단일 책임 원칙**: 각 메서드가 하나의 일만 수행
2. ✅ **명확한 네이밍**: 메서드 이름이 역할을 정확히 표현
3. ✅ **반환값 일관성**: void 반환으로 혼재 문제 해결
4. ✅ **코드 가독성**: 위치 업데이트 → 충돌 감지 흐름 명시적

**설계 원칙**:
- **Command-Query Separation (CQS)**:
  - Command: 상태를 변경, 반환값 없음 (`update()`)
  - Query: 정보를 반환, 상태 변경 없음 (`checkWallCollision()`)
- **메서드 네이밍**: 수행 작업을 명확히 표현
- **부수 효과 분리**: 상태 변경과 정보 조회를 분리

**결론**: 단일 책임 = 명확한 코드 ✅

---

### 2. ball.update() 이중 호출 버그

#### 문제
> 공 속도가 갑자기 2배로 빨라짐

#### 원인
`ball.update()`가 두 곳에서 호출되어 위치가 2배로 업데이트됨:

```javascript
// update() 함수
const wallCollision = ball.update(paddle.x, paddleWidth);  // 1번째 호출

// checkCollisions() 함수 내부
const wallCollision = ball.update(paddle.x, paddleWidth);  // 2번째 호출
```

**초기 해결 시도 (실패)**:
```javascript
// checkCollisions() 내부에서만 ball.update() 호출
function checkCollisions() {
    ball.update(...);  // 여기서 호출
    const brick = brickManager.checkBallBrickCollision(...);
    if (brick) {
        onBrickHit(brick);
        return;  // early return → ball.update() 누락!
    }
}
```

**문제점**: 벽돌 충돌 시 early return으로 `ball.update()` 누락

**최종 해결**:
```javascript
// update() 함수에서만 ball.update() 호출
function update() {
    ball.update(paddle.x, paddleWidth);  // 위치 업데이트 (항상)
    const wallCollision = ball.checkWallCollision();  // 충돌 감지
    checkCollisions(wallCollision);  // wallCollision을 매개변수로 전달
}

// checkCollisions()는 매개변수로 받음
function checkCollisions(wallCollision) {
    const brick = brickManager.checkBallBrickCollision(...);
    if (brick) {
        onBrickHit(brick);
        return;  // 이제 안전함 (ball.update는 이미 실행됨)
    }

    if (wallCollision) {
        playWallHitSound();
    }
}
```

**해결 포인트**:
1. ✅ `ball.update()`는 **한 곳(update 함수)에서만** 호출
2. ✅ `wallCollision`은 **매개변수로 전달**
3. ✅ early return해도 위치 업데이트는 이미 완료됨

**교훈**:
- 상태 변경 함수는 한 곳에서만 호출
- 결과값이 필요하면 매개변수로 전달
- early return 전에 필수 작업 완료 확인

**결론**: 호출 흐름 명확화 = 버그 방지 ✅

---

## Stage 22: UI 관리 시스템 리팩토링

### 1. UIManager 클래스 범위 - God Object vs 단일 책임

#### 질문
> UIManager를 어떻게 설계해야 하는가? 모든 UI 로직을 통합할까, 책임별로 분리할까?

#### 결정: 단일 책임 원칙 (표시 업데이트만)

**Option 1: God Object (폐기)**
- 모든 UI 로직 통합: DOM 캐싱 + 표시 업데이트 + 화면 전환 + 이벤트 핸들러
- 문제: 300-400줄 거대 클래스, 단일 책임 원칙 위배

**Option 2: 단일 책임 (채택)** ✅
- UIManager: 표시 업데이트만
- 화면 전환: game.js 함수로 유지
- 이벤트 핸들러: game.js에 유지

**결론**: 작고 명확한 책임 = 유지보수 용이 ✅

---

### 2. querySelector vs getElementById

#### 질문
> DOM 요소 선택 시 `querySelector('#id')`와 `getElementById('id')` 중 무엇을 사용할까?

#### 결정: querySelector 사용

**성능 비교**:
- `getElementById('score')`: 직접 ID 검색 (O(1))
- `querySelector('#score')`: CSS 선택자 파싱 (약간 느림)

**querySelector를 선택한 이유**:
1. ✅ **일관성**: 모든 선택자를 같은 API로
2. ✅ **가독성**: CSS와 동일한 문법
3. ✅ **유연성**: 복합 선택자 사용 가능
4. ✅ **성능 차이 미미**: 현대 브라우저에서 거의 차이 없음

```javascript
// 일관된 방식
querySelector('#score')        // ID
querySelector('.button')       // 클래스
querySelector('div.active')    // 복합 선택자
```

**결론**: 일관성과 가독성 > 미미한 성능 차이 ✅

---

### 3. 파라미터 설계 - 개별 값 vs 객체 전달

#### 질문
> UIManager 메서드에 개별 값을 전달할까, gameState 객체를 전달할까?

#### 결정: 개별 값 전달

**Option 1: 개별 값 전달 (채택)** ✅
```javascript
// 호출
uiManager.updateDisplay(gameState.score, gameState.lives);

// UIManager
updateDisplay(score, lives) {
    this.updateScore(score);
    this.updateLives(lives);
}
```

**Option 2: 객체 전달 (폐기)**
```javascript
// 호출
uiManager.updateDisplay(gameState);

// UIManager
updateDisplay(gameState) {
    this.updateScore(gameState.score);
    this.updateLives(gameState.lives);
}
```

**개별 값 전달의 장점**:
1. ✅ **의존성 분리**: UIManager는 gameState 구조를 모름
2. ✅ **재사용성**: 어디서든 `updateScore(100)` 호출 가능
3. ✅ **테스트 용이**: Mock 객체 불필요
4. ✅ **명확한 인터페이스**: 시그니처만 봐도 필요한 값 명확

**객체 전달의 장점**:
- 호출 코드 간결
- 파라미터 추가 시 변경 적음

**결론**: 낮은 결합도와 재사용성 > 호출 간결성 ✅

---

## 설계 원칙 요약

### 1. 단순함 우선 (KISS - Keep It Simple, Stupid)
- GameState: 클래스 대신 단순 객체
- 콤보 시스템: 과도한 기능 제거
- CollisionDetector: 불필요한 추상화 제거 (YAGNI)

### 2. 적절한 추상화
- EffectManager: 복잡한 로직 → 클래스 사용
- 객체 참조: JavaScript 표준 패턴 활용
- 이벤트 핸들러: 클래스 대신 함수로 충분

### 3. 단일 책임 원칙 (Single Responsibility Principle)
- Ball.update(): 위치 업데이트만
- Ball.checkWallCollision(): 충돌 감지만
- 이벤트 핸들러: 각 함수가 하나의 이벤트만 처리

### 4. 명확한 네이밍
- `check~`: 상태 확인/검증 (반환값 있음)
- `on~`: 이벤트 핸들러 (반환값 없음)
- `update~`: 상태 변경 (반환값 없음)
- Command-Query Separation (CQS) 원칙

### 5. 성능 고려
- 콜백 패턴: 초기화 시 설정으로 오버헤드 최소화
- 1D 배열: 메모리 효율성
- early return: 불필요한 체크 방지

### 6. 유지보수성
- 관심사 분리: 각 파일이 하나의 책임
- 명확한 인터페이스: 메서드 이름과 역할 명확화
- 물리적 현실 반영: 충돌 우선순위 직관적 설계

---

## Stage 22.5: 화면 전환 시스템 리팩토링

### 1. SceneManager 필요성

#### 질문
> UIManager를 만들 때 화면 전환 로직도 포함시켜야 할까?
> 아니면 별도의 SceneManager를 만들어야 할까?

#### 결정: SceneManager 별도 생성 ✅

**Option 1: God Object (폐기)** ❌
```javascript
class UIManager {
    // 1. DOM 캐싱
    // 2. 표시 업데이트
    // 3. 화면 전환
    // 4. 이벤트 핸들러
}
// 문제: 300-400줄의 거대한 클래스, 단일 책임 원칙 위배
```

**Option 2: 책임 분리 (채택)** ✅
```javascript
class UIManager {
    // 표시 업데이트만
    updateScore(score) { ... }
    updateLives(lives) { ... }
}

class SceneManager {
    // 화면 전환만
    showScreen(screenName) { ... }
    hideScreen(screenName) { ... }
}
```

**현재 문제**:
- 화면 전환 코드가 game.js 곳곳에 분산
- 같은 패턴이 6개 함수에서 반복
```javascript
// 반복 패턴
UI.winScreen.classList.remove('hidden');
animationManager.startUIPopupAnimation(UI.winScreen);
```

**SceneManager 생성 이유**:
1. ✅ **코드 중복 제거**: 화면 전환 패턴 중앙화
2. ✅ **단일 책임**: 각 매니저가 하나의 역할만
3. ✅ **유지보수성**: 화면 전환 로직 한 곳에서 관리
4. ✅ **일관성**: 모든 화면 전환이 동일한 방식

**결론**: 작고 명확한 클래스 > 거대한 God Object ✅

---

### 2. UI 객체 캐싱 필요성

#### 질문
> UI 객체에 DOM 요소를 캐싱하는 것이 의미 있을까?

#### 결정: UI 객체 제거 ✅

**현재 상황**:
```javascript
const UI = {};
const uiElements = ['muteBtn', 'fullscreenBtn', 'bgmVolume', 'sfxVolume', ...];
uiElements.forEach(id => {
    UI[id] = document.getElementById(id);
});

// 사용
UI.muteBtn.addEventListener('click', handleMuteToggle);
UI.bgmVolume.addEventListener('input', (e) => { ... });
```

**문제점**:
1. ❌ **캐싱 이점 없음**: 초기화 시 1회만 사용
2. ❌ **메모리 낭비**: 불필요한 객체 유지
3. ❌ **간접 참조**: `UI.muteBtn` vs `document.querySelector('#muteBtn')`
4. ❌ **추가 유지보수**: UI 객체 관리 필요

**개선 후**:
```javascript
// 직접 쿼리
document.querySelector('#muteBtn').addEventListener('click', handleMuteToggle);
document.querySelector('#bgmVolume').addEventListener('input', (e) => { ... });
```

**캐싱이 유용한 경우**:
- ✅ 게임 루프에서 매 프레임 접근 (UIManager의 score, lives)
- ❌ 초기화 시 1회만 사용 (버튼 이벤트 등록)

**결론**: 불필요한 캐싱 제거, 메모리 최적화 ✅

---

### 3. querySelector vs getElementById 통일

#### 질문
> querySelector와 getElementById를 혼용하고 있는데 통일해야 할까?

#### 결정: querySelector로 통일 ✅

**현재 상황**:
```javascript
// 혼용
canvas = document.getElementById('gameCanvas');
document.getElementById('startBtn').addEventListener('click', startGame);
document.querySelector('#muteBtn').addEventListener('click', handleMuteToggle);
```

**getElementById의 장점**:
- 미세하게 빠름 (직접 ID 해시 테이블 조회)

**querySelector의 장점**:
1. ✅ **일관성**: 코드 전체에서 동일한 API
2. ✅ **확장성**: CSS 선택자로 쉽게 변경 가능
3. ✅ **통합 API**: 모든 선택자 지원
4. ✅ **Stage 22 결정 일치**: UIManager에서 이미 querySelector 사용

**성능 비교**:
```javascript
// 초기화 시 1회 호출 → 성능 차이 무시 가능
getElementById('btn');  // ~0.001ms
querySelector('#btn');  // ~0.002ms
```

**결론**: 일관성 > 미세한 성능 차이 ✅

---

## 참고

- **최초 작성일**: 2025-11-13
- **최종 업데이트**: 2025-11-20 (Stage 22.5 추가)
- **프로젝트**: 벽돌깨기 게임
- **관련 문서**: PROGRESS.md, REFACTORING_TODO.md
