// DOM 요소들 찾기 (Unity의 GameObject.Find와 비슷)
const countDisplay = document.getElementById('countValue');
const increaseBtn = document.getElementById('increaseBtn');
const decreaseBtn = document.getElementById('decreaseBtn');
const resetBtn = document.getElementById('resetBtn');
const stepInput = document.getElementById('stepInput');
const historyList = document.getElementById('historyList');

// 게임 상태 (Unity의 변수들과 비슷)
let count = 0;
let history = [];

// 초기화 함수 (Unity의 Start()와 비슷)
function initialize() {
    console.log('🚀 카운터 앱 초기화 중...');
    
    // 이벤트 리스너 등록 (Unity의 버튼 클릭 이벤트와 비슷)
    increaseBtn.addEventListener('click', increaseCount);
    decreaseBtn.addEventListener('click', decreaseCount);
    resetBtn.addEventListener('click', resetCount);
    stepInput.addEventListener('change', onStepChange);
    
    // 키보드 이벤트 (Unity의 Input.GetKeyDown과 비슷)
    document.addEventListener('keydown', handleKeyPress);
    
    // 초기 화면 업데이트
    updateDisplay();
    
    console.log('✅ 초기화 완료!');
}

// 카운트 증가 함수
function increaseCount() {
    const step = parseInt(stepInput.value) || 1;
    const oldCount = count;
    count += step;
    
    // 히스토리 추가
    addToHistory(`${oldCount} → ${count} (+${step})`);
    
    // 화면 업데이트
    updateDisplay();
    
    // 애니메이션 효과
    animateCountDisplay();
    
    console.log(`카운트 증가: ${oldCount} → ${count}`);
}

// 카운트 감소 함수
function decreaseCount() {
    const step = parseInt(stepInput.value) || 1;
    const oldCount = count;
    count -= step;
    
    // 히스토리 추가
    addToHistory(`${oldCount} → ${count} (-${step})`);
    
    // 화면 업데이트
    updateDisplay();
    
    // 애니메이션 효과
    animateCountDisplay();
    
    console.log(`카운트 감소: ${oldCount} → ${count}`);
}

// 카운트 리셋 함수
function resetCount() {
    const oldCount = count;
    count = 0;
    
    // 히스토리 추가
    addToHistory(`${oldCount} → 0 (리셋)`);
    
    // 화면 업데이트
    updateDisplay();
    
    // 애니메이션 효과
    animateCountDisplay();
    
    console.log('카운트 리셋됨');
}

// 화면 업데이트 함수 (Unity의 UI 업데이트와 비슷)
function updateDisplay() {
    countDisplay.textContent = count;
    
    // 숫자에 따라 색상 변경
    if (count > 0) {
        countDisplay.style.color = '#27ae60';  // 초록색
    } else if (count < 0) {
        countDisplay.style.color = '#e74c3c';  // 빨간색
    } else {
        countDisplay.style.color = 'white';    // 흰색
    }
}

// 히스토리 추가 함수
function addToHistory(action) {
    const timestamp = new Date().toLocaleTimeString();
    const historyItem = `[${timestamp}] ${action}`;
    
    history.unshift(historyItem);  // 배열 앞에 추가
    
    // 최대 10개까지만 유지
    if (history.length > 10) {
        history.pop();
    }
    
    // 히스토리 화면 업데이트
    updateHistoryDisplay();
}

// 히스토리 화면 업데이트
function updateHistoryDisplay() {
    historyList.innerHTML = '';  // 기존 내용 제거
    
    history.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        historyList.appendChild(li);
    });
}

// 애니메이션 효과
function animateCountDisplay() {
    countDisplay.classList.add('flash');
    
    // 애니메이션 제거 (0.3초 후)
    setTimeout(() => {
        countDisplay.classList.remove('flash');
    }, 300);
}

// 증감값 변경 이벤트
function onStepChange() {
    const step = parseInt(stepInput.value);
    
    if (step < 1 || step > 10) {
        stepInput.value = 1;
        alert('증감값은 1~10 사이의 숫자여야 합니다.');
        return;
    }
    
    console.log(`증감값 변경: ${step}`);
}

// 키보드 이벤트 처리 (Unity의 Input 시스템과 비슷)
function handleKeyPress(event) {
    switch(event.key) {
        case 'ArrowUp':
        case '+':
        case 'Enter':
            event.preventDefault();
            increaseCount();
            break;
            
        case 'ArrowDown':
        case '-':
            event.preventDefault();
            decreaseCount();
            break;
            
        case 'r':
        case 'R':
            resetCount();
            break;
            
        default:
            // 다른 키는 무시
            break;
    }
}

// 페이지 로드 완료 후 초기화 (Unity의 Awake/Start와 비슷)
document.addEventListener('DOMContentLoaded', initialize);

// 추가 기능: 로컬 스토리지에 저장
function saveToLocalStorage() {
    localStorage.setItem('counterValue', count);
    localStorage.setItem('counterHistory', JSON.stringify(history));
}

function loadFromLocalStorage() {
    const savedCount = localStorage.getItem('counterValue');
    const savedHistory = localStorage.getItem('counterHistory');
    
    if (savedCount !== null) {
        count = parseInt(savedCount);
    }
    
    if (savedHistory !== null) {
        history = JSON.parse(savedHistory);
    }
}

// 페이지 종료 전 저장
window.addEventListener('beforeunload', saveToLocalStorage);