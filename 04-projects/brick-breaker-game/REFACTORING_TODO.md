# 리팩토링 TODO 리스트

## 1. 파일 구조 분리
- [ ] **game.js 분리**
  - `game-core.js` - 게임 루프, 초기화, 상태 관리
  - `game-objects.js` - 공, 패들, 벽돌 객체 및 로직
  - `animations.js` - 모든 애니메이션 시스템
  - `physics.js` - 충돌 감지, 물리 계산
  - `items.js` - 아이템 시스템
  - `audio.js` - 오디오 관리
  - `ui.js` - UI 관련 로직
  - `constants.js` - 모든 상수 정의

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
- Stage 16 완료 후 Stage 17에서 리팩토링 진행 예정

## 설계 결정 사항
### 콤보 타임아웃: 2초
**이유**:
- Normal 난이도 기준 공 속도: 5 px/frame (60 FPS)
- 패들(y=575) → 벽돌(y=80) 거리: 약 495px
- 최소 왕복 시간: 495÷5÷60 = 1.65초
- 실제 시간: 벽 튕김 고려 시 1.5~2.5초
- **결론**: 평균 왕복 시간 2초를 타임아웃으로 설정하여 자연스러운 콤보 유지 가능
