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

## 설계 원칙 요약

### 1. 단순함 우선 (KISS - Keep It Simple, Stupid)
- GameState: 클래스 대신 단순 객체
- 콤보 시스템: 과도한 기능 제거

### 2. 적절한 추상화
- EffectManager: 복잡한 로직 → 클래스 사용
- 객체 참조: JavaScript 표준 패턴 활용

### 3. 성능 고려
- 콜백 패턴: 초기화 시 설정으로 오버헤드 최소화
- 1D 배열: 메모리 효율성

### 4. 유지보수성
- 관심사 분리: 각 파일이 하나의 책임
- 명확한 인터페이스: 메서드 이름과 역할 명확화

---

## 참고

- **작성일**: 2025-11-13
- **프로젝트**: 벽돌깨기 게임
- **관련 문서**: PROGRESS.md, REFACTORING_TODO.md
