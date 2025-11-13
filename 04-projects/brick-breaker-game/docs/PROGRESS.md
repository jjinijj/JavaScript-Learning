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

## 리팩토링 단계

### Stage 17 (2025-10-28 ~ 2025-11-06): 모듈 분리 ✅
- **목표**: 2200줄 game.js를 기능별 독립 모듈로 분리
- **결과**: 10개 ES6 모듈 추출 완료, game.js 61% 감소
- **모듈**: constants, audio, i18n, theme, stats, input, animations, items, bricks, physics
- **브랜치**: refactor/stage-17-module-separation
- **상태**: PR 병합 완료
- **상세**: REFACTORING_TODO.md 참조

### Stage 18 (2025-11-06 ~ 2025-11-11): 게임 객체 OOP ✅
- **목표**: Ball, Paddle, Brick을 클래스 기반 객체로 전환
- **결과**: 3개 클래스 추출, 캡슐화 및 단일 책임 원칙 적용
- **클래스**: Ball (178 lines), Paddle (195 lines), Brick & BrickManager (171 lines)
- **브랜치**: refactor/game-entities-oop
- **상태**: PR 병합 완료
- **상세**: REFACTORING_TODO.md 참조

### Stage 19 (완료 ✅): 게임 시스템 리팩토링
- **목표**: GameState 추출 및 EffectManager 클래스 분리
- **결과**: 2개 시스템 추출 완료, game.js 약 120줄 감소
- **브랜치**: refactor/game-systems-oop

#### ✅ 완료: gameState 추출
- **파일**: gameState.js (76 lines)
- **방식**: 클래스가 아닌 단순 객체 + 헬퍼 메서드
- **속성**: score, lives, difficulty, running, paused
- **메서드**:
  - `isPlaying()` - 게임 진행 중 체크
  - `start()`, `stop()` - 게임 시작/정지
  - `pause()`, `resume()`, `togglePause()` - 일시정지 제어
  - `reset()` - 상태 초기화
- **클래스가 아닌 단순 객체를 선택한 이유**:
  - ❌ 클래스: 168줄, 복잡한 메서드, 인스턴스 생성 필요 (`new GameState()`)
  - ✅ 단순 객체: 76줄, 간결한 코드, import 후 즉시 사용 가능
  - 게임 상태는 하나만 필요 (싱글톤) → 클래스의 이점 없음
  - 단순한 값 저장 위주 → 클래스의 복잡도가 과도함
  - Ball, Paddle처럼 여러 인스턴스가 필요하지 않음
- **개선 사항**:
  - GAME.INITIAL_LIVES 상수 추가 (constants.js)
  - 하드코딩된 lives = 3 제거
  - 싱글톤 패턴 (export된 객체 하나만 존재)
  - game.js 약 50줄 감소

#### ✅ 완료: EffectManager 추출
- **파일**: effectManager.js (165 lines)
- **방식**: 클래스 (타이머 관리 필요)
- **속성**: activeEffects, timers, callbacks
- **메서드**:
  - `setCallbacks()` - 콜백 함수 설정 (초기화 시 1회)
  - `activate(effectName, duration, currentWidth)` - 효과 활성화
  - `deactivate(effectName)` - 효과 비활성화
  - `isActive(effectName)` - 효과 활성화 여부 확인
  - `getActiveEffects()` - activeEffects 객체 반환
  - `reset()` - 모든 효과 초기화
- **클래스를 선택한 이유** (gameState와 다른 이유):
  - ✅ 복잡한 타이머 관리 로직 필요
  - ✅ 여러 메서드가 상태 공유 (activeEffects, timers)
  - ✅ 콜백 패턴으로 의존성 주입
  - ✅ 패들 확대/축소 상호 배타적 처리
- **개선 사항**:
  - activeEffects, effectTimers 변수 제거
  - activateEffect(), deactivateEffect() 함수 제거
  - 콜백 방식으로 의존성 분리 (효율성)
  - game.js 약 70줄 감소

---

## 버그 수정 이력

### 2025-10-28: 공이 벽에 끼이는 버그 ✅
- **문제**: 공이 좌우/상단 벽에 끼이거나 관통하는 현상
- **해결**: 위치 보정 + 절대값 사용으로 방향 명확화
- **결과**: 공이 벽에 부드럽게 반사
- **상세**: REFACTORING_TODO.md "버그 수정 목록" 참조

### 2025-11-11: 패들 및 공 관련 버그 2건 ✅
1. **패들이 화면 밖으로 나가는 문제**
   - 화면 경계 체크 추가 (`paddle.js`)

2. **패들 위치에 따른 공 속도 변경 문제**
   - 삼각함수 사용으로 속도 크기 유지 (`ball.js`)

- **브랜치**: fix/paddle-and-ball-bugs
- **상세**: REFACTORING_TODO.md "버그 수정 목록" 참조

---

## 다음 할 일
- [x] Stage 17: 모듈 분리 리팩토링 완료
- [x] Stage 18: 게임 객체 OOP 리팩토링 완료
- [x] 패들 및 공 관련 버그 2건 수정 완료
- [x] Stage 19: 게임 시스템 OOP 리팩토링 완료 (GameState, EffectManager)
- [ ] 디자인 패턴 적용 (공 상태 패턴)
- [ ] Update 함수 분리
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
