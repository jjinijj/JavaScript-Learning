// 🚀 JavaScript 개발환경 테스트 스크립트
console.log('🚀 JavaScript 개발환경이 정상적으로 작동 중!');

// 전역 변수들
let clickCount = 0;
let testResults = [];

// DOM 요소들
const button = document.getElementById('testBtn');
const result = document.getElementById('result');
const testResultsDiv = document.getElementById('testResults');

// 🎯 DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', () => {
    addTestResult('✅ DOM이 완전히 로드되었습니다!', 'success');
    
    // 버튼 이벤트 리스너 등록
    button.addEventListener('click', handleButtonClick);
    
    // 환경 테스트 실행
    runEnvironmentTests();
    
    // 비동기 테스트 실행
    testAsyncFeatures();
});

// 🎮 버튼 클릭 핸들러
function handleButtonClick() {
    clickCount++;
    result.textContent = `🎉 버튼을 ${clickCount}번 클릭했습니다!`;
    result.style.color = getRandomColor();
    result.style.transform = 'scale(1.1)';
    
    setTimeout(() => {
        result.style.transform = 'scale(1)';
    }, 200);
    
    addTestResult(`🎮 버튼 클릭 이벤트 #${clickCount} 정상 작동`, 'info');
}

// 🌈 랜덤 컬러 생성
const getRandomColor = () => {
    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
    return colors[Math.floor(Math.random() * colors.length)];
};

// 🧪 환경 테스트 함수들
function runEnvironmentTests() {
    addTestResult('🧪 JavaScript 환경 테스트 시작...', 'info');
    
    // Node.js/브라우저 정보
    testBrowserInfo();
    
    // ES6+ 기능 테스트
    testModernJSFeatures();
    
    // Web APIs 테스트
    testWebAPIs();
    
    addTestResult('✅ 환경 테스트 완료!', 'success');
}

// 브라우저 정보 테스트
function testBrowserInfo() {
    try {
        const userAgent = navigator.userAgent;
        const isChrome = userAgent.includes('Chrome');
        const isSafari = userAgent.includes('Safari') && !isChrome;
        const isFirefox = userAgent.includes('Firefox');
        
        let browser = 'Unknown';
        if (isChrome) browser = 'Chrome';
        else if (isSafari) browser = 'Safari';
        else if (isFirefox) browser = 'Firefox';
        
        addTestResult(`🌐 브라우저: ${browser}`, 'info');
        addTestResult(`📱 User Agent: ${userAgent.substring(0, 60)}...`, 'info');
    } catch (error) {
        addTestResult(`❌ 브라우저 정보 테스트 실패: ${error.message}`, 'error');
    }
}

// 모던 JavaScript 기능 테스트
function testModernJSFeatures() {
    addTestResult('🔧 ES6+ 기능 테스트 중...', 'info');
    
    // let/const 테스트
    try {
        const testConst = 'const 작동';
        let testLet = 'let 작동';
        addTestResult('✅ let/const 지원됨', 'success');
    } catch (error) {
        addTestResult('❌ let/const 지원 안됨', 'error');
    }
    
    // 화살표 함수 테스트
    try {
        const arrowFunc = () => 'arrow function works';
        const result = arrowFunc();
        addTestResult('✅ 화살표 함수 지원됨', 'success');
    } catch (error) {
        addTestResult('❌ 화살표 함수 지원 안됨', 'error');
    }
    
    // 템플릿 리터럴 테스트
    try {
        const name = 'World';
        const template = `Hello, ${name}!`;
        addTestResult('✅ 템플릿 리터럴 지원됨', 'success');
    } catch (error) {
        addTestResult('❌ 템플릿 리터럴 지원 안됨', 'error');
    }
    
    // 구조 분해 할당 테스트
    try {
        const [a, b] = [1, 2];
        const {x, y} = {x: 3, y: 4};
        addTestResult('✅ 구조 분해 할당 지원됨', 'success');
    } catch (error) {
        addTestResult('❌ 구조 분해 할당 지원 안됨', 'error');
    }
    
    // 스프레드 연산자 테스트
    try {
        const arr1 = [1, 2, 3];
        const arr2 = [...arr1, 4, 5];
        addTestResult('✅ 스프레드 연산자 지원됨', 'success');
    } catch (error) {
        addTestResult('❌ 스프레드 연산자 지원 안됨', 'error');
    }
    
    // 클래스 테스트
    try {
        class TestClass {
            constructor(name) {
                this.name = name;
            }
            
            greet() {
                return `Hello, ${this.name}!`;
            }
        }
        
        const instance = new TestClass('JavaScript');
        const greeting = instance.greet();
        addTestResult('✅ ES6 클래스 지원됨', 'success');
    } catch (error) {
        addTestResult('❌ ES6 클래스 지원 안됨', 'error');
    }
}

// Web APIs 테스트
function testWebAPIs() {
    addTestResult('🌐 Web APIs 테스트 중...', 'info');
    
    // LocalStorage 테스트
    try {
        localStorage.setItem('test', 'value');
        const value = localStorage.getItem('test');
        localStorage.removeItem('test');
        addTestResult('✅ LocalStorage 지원됨', 'success');
    } catch (error) {
        addTestResult('❌ LocalStorage 지원 안됨', 'error');
    }
    
    // Fetch API 테스트 (존재 여부만)
    if (typeof fetch === 'function') {
        addTestResult('✅ Fetch API 지원됨', 'success');
    } else {
        addTestResult('❌ Fetch API 지원 안됨', 'error');
    }
    
    // Promise 테스트
    if (typeof Promise === 'function') {
        addTestResult('✅ Promise 지원됨', 'success');
    } else {
        addTestResult('❌ Promise 지원 안됨', 'error');
    }
}

// 비동기 기능 테스트
async function testAsyncFeatures() {
    addTestResult('⏰ 비동기 기능 테스트 중...', 'info');
    
    try {
        // Promise 테스트
        const promiseTest = new Promise((resolve) => {
            setTimeout(() => resolve('Promise 테스트 완료!'), 1000);
        });
        
        const promiseResult = await promiseTest;
        addTestResult('✅ Promise/async-await 정상 작동', 'success');
        
        // setTimeout 테스트
        setTimeout(() => {
            addTestResult('✅ setTimeout 정상 작동', 'success');
        }, 1500);
        
        // setInterval 테스트 (3초 후 정리)
        let intervalCount = 0;
        const intervalId = setInterval(() => {
            intervalCount++;
            addTestResult(`📍 setInterval 카운트: ${intervalCount}`, 'info');
            
            if (intervalCount >= 3) {
                clearInterval(intervalId);
                addTestResult('✅ setInterval 테스트 완료 및 정리됨', 'success');
            }
        }, 2000);
        
    } catch (error) {
        addTestResult(`❌ 비동기 테스트 실패: ${error.message}`, 'error');
    }
}

// 테스트 결과 추가 함수
function addTestResult(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    testResults.push(`[${timestamp}] ${message}`);
    
    // DOM 업데이트
    if (testResultsDiv) {
        testResultsDiv.textContent = testResults.join('\n');
        testResultsDiv.scrollTop = testResultsDiv.scrollHeight;
    }
    
    // 콘솔에도 출력
    console.log(`${message}`);
}

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', () => {
    addTestResult('👋 페이지 종료 중... 모든 테스트 완료!', 'info');
});

// 초기 메시지
addTestResult('🚀 JavaScript 개발환경 테스트 스크립트 로드 완료!', 'success');