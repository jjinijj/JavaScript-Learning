// 전역 변수들
let timerInterval;
let counterInterval;
let counterValue = 0;

// DOM 요소들
let timerDisplay, counterDisplay, promiseResult, asyncResult, apiResult, logContainer;

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    setupEventListeners();
    addLog('🚀 비동기 프로그래밍 학습 앱 시작!', 'info');
});

function initializeElements() {
    timerDisplay = document.getElementById('timerDisplay');
    counterDisplay = document.getElementById('counterDisplay');
    promiseResult = document.getElementById('promiseResult');
    asyncResult = document.getElementById('asyncResult');
    apiResult = document.getElementById('apiResult');
    logContainer = document.getElementById('logContainer');
}

function setupEventListeners() {
    // Timer & Interval 버튼들
    document.getElementById('startTimerBtn').addEventListener('click', startTimer);
    document.getElementById('stopTimerBtn').addEventListener('click', stopTimer);
    document.getElementById('startCounterBtn').addEventListener('click', startCounter);
    document.getElementById('stopCounterBtn').addEventListener('click', stopCounter);
    
    // Promise 버튼들
    document.getElementById('simplePromiseBtn').addEventListener('click', testSimplePromise);
    document.getElementById('randomPromiseBtn').addEventListener('click', testRandomPromise);
    document.getElementById('chainPromiseBtn').addEventListener('click', testPromiseChaining);
    
    // async/await 버튼들
    document.getElementById('asyncBtn').addEventListener('click', testAsyncAwait);
    document.getElementById('parallelBtn').addEventListener('click', testParallelExecution);
    document.getElementById('sequentialBtn').addEventListener('click', testSequentialExecution);
    
    // API 버튼들
    document.getElementById('fetchPokemonBtn').addEventListener('click', fetchPokemonData);
    document.getElementById('multipleRequestBtn').addEventListener('click', multipleRequests);
    
    // Enter 키로 포켓몬 검색
    document.getElementById('pokemonInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            fetchPokemonData();
        }
    });
    
    // 로그 지우기
    document.getElementById('clearLogsBtn').addEventListener('click', clearLogs);
}

// === 1. setTimeout & setInterval ===

function startTimer() {
    if(timerInterval){
        clearInterval(timerInterval);
    }

    addLog('⏰  3초 타이머 시작', 'info');
    timerDisplay.textContent = '타이머: 3초 후 완료 예정...';
    timerDisplay.className = 'loading';
    
    // Unity의 yield return new WaitForSeconds(3f)와 비슷
    timerInterval = setTimeout(() => {
        timerDisplay.textContent = '타이머: ✅ 완료!';
        timerDisplay.className = 'success';
        addLog('✅ 3초 타이머 완료!', 'success');
    }, 3000);
}

function stopTimer() {
    if(timerInterval){
        clearInterval(timerInterval);
    }

    timerDisplay.textContent = '타이머: 중지됨';
    timerDisplay.className = '';
    addLog('⏹️ 타이머 중지', 'warning');
}

function startCounter() {
    if (counterInterval) {
        clearInterval(counterInterval);
    }
    
    counterValue = 0;
    addLog('🔄 1초마다 카운터 시작', 'info');
    
    // Unity의 InvokeRepeating과 비슷
    counterInterval = setInterval(() => {
        counterValue++;
        counterDisplay.textContent = `카운터: ${counterValue}`;
        addLog(`📊 카운터: ${counterValue}`, 'info');
    }, 1000);
}

function stopCounter() {
    if (counterInterval) {
        clearInterval(counterInterval);
        counterInterval = null;
        counterDisplay.textContent = `카운터: ${counterValue} (중지됨)`;
        addLog(`⏹️ 카운터 중지 (최종값: ${counterValue})`, 'warning');
    }
}

// === 2. Promise 기초 ===

function testSimplePromise() {
    promiseResult.textContent = '간단한 Promise 실행 중...';
    promiseResult.className = 'loading';
    addLog('🎯 간단한 Promise 테스트 시작', 'info');
    
    // Unity의 코루틴과 비슷한 개념
    const simplePromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('Promise가 성공적으로 완료되었습니다! 🎉');
        }, 2000);
    });
    
    simplePromise
        .then(result => {
            promiseResult.textContent = result;
            promiseResult.className = 'success';
            addLog(`✅ Promise 성공: ${result}`, 'success');
        })
        .catch(error => {
            promiseResult.textContent = `에러: ${error}`;
            promiseResult.className = 'error';
            addLog(`❌ Promise 실패: ${error}`, 'error');
        });
}

function testRandomPromise() {
    promiseResult.textContent = '랜덤 Promise 실행 중... (50% 확률로 성공/실패)';
    promiseResult.className = 'loading';
    addLog('🎲 랜덤 Promise 테스트 시작', 'info');
    
    const randomPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() > 0.5) {
                resolve('🎉 운이 좋네요! 성공했습니다!');
            } else {
                reject('😅 운이 나빴네요. 실패했습니다.');
            }
        }, 1500);
    });
    
    randomPromise
        .then(result => {
            promiseResult.textContent = result;
            promiseResult.className = 'success';
            addLog(`✅ 랜덤 Promise 성공: ${result}`, 'success');
        })
        .catch(error => {
            promiseResult.textContent = error;
            promiseResult.className = 'error';
            addLog(`❌ 랜덤 Promise 실패: ${error}`, 'error');
        });
}

function testPromiseChaining() {
    promiseResult.textContent = 'Promise 체이닝 실행 중...';
    promiseResult.className = 'loading';
    addLog('🔗 Promise 체이닝 테스트 시작', 'info');
    
    // 여러 단계를 거치는 Promise 체이닝
    Promise.resolve(1)
        .then(value => {
            addLog(`1단계: ${value}`, 'info');
            return value * 2;
        })
        .then(value => {
            addLog(`2단계: ${value}`, 'info');
            return value + 10;
        })
        .then(value => {
            addLog(`3단계: ${value}`, 'info');
            return `최종 결과: ${value}`;
        })
        .then(result => {
            promiseResult.textContent = result;
            promiseResult.className = 'success';
            addLog(`✅ 체이닝 완료: ${result}`, 'success');
        })
        .catch(error => {
            promiseResult.textContent = `체이닝 에러: ${error}`;
            promiseResult.className = 'error';
            addLog(`❌ 체이닝 실패: ${error}`, 'error');
        });
}

// === 3. async/await ===

async function testAsyncAwait() {
    asyncResult.textContent = 'async/await 테스트 중...';
    asyncResult.className = 'loading';
    addLog('🚀 async/await 테스트 시작', 'info');
    
    try {
        // Unity의 yield return과 비슷한 느낌
        const step1 = await delay(1000, '1단계 완료');
        addLog(`📍 ${step1}`, 'info');
        
        const step2 = await delay(1000, '2단계 완료');
        addLog(`📍 ${step2}`, 'info');
        
        const step3 = await delay(1000, '3단계 완료');
        addLog(`📍 ${step3}`, 'info');
        
        asyncResult.textContent = '🎉 모든 단계가 순차적으로 완료되었습니다!';
        asyncResult.className = 'success';
        addLog('✅ async/await 테스트 성공', 'success');
        
    } catch (error) {
        asyncResult.textContent = `에러: ${error}`;
        asyncResult.className = 'error';
        addLog(`❌ async/await 실패: ${error}`, 'error');
    }
}

async function testParallelExecution() {
    asyncResult.textContent = '병렬 처리 테스트 중...';
    asyncResult.className = 'loading';
    addLog('⚡ 병렬 처리 테스트 시작', 'info');
    
    const startTime = Date.now();
    
    try {
        // 모든 작업을 동시에 시작 (Unity의 여러 코루틴 동시 실행과 비슷)
        const promises = [
            delay(2000, '작업 A'),
            delay(1500, '작업 B'),
            delay(1000, '작업 C')
        ];
        
        const results = await Promise.all(promises);
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        asyncResult.textContent = `병렬 처리 완료! 결과: ${results.join(', ')} (소요시간: ${duration}ms)`;
        asyncResult.className = 'success';
        addLog(`✅ 병렬 처리 완료 (${duration}ms)`, 'success');
        
    } catch (error) {
        asyncResult.textContent = `병렬 처리 에러: ${error}`;
        asyncResult.className = 'error';
        addLog(`❌ 병렬 처리 실패: ${error}`, 'error');
    }
}

async function testSequentialExecution() {
    asyncResult.textContent = '순차 처리 테스트 중...';
    asyncResult.className = 'loading';
    addLog('📝 순차 처리 테스트 시작', 'info');
    
    const startTime = Date.now();
    
    try {
        // 하나씩 순차적으로 실행
        const resultA = await delay(1000, '작업 A');
        addLog(`📍 ${resultA} 완료`, 'info');
        
        const resultB = await delay(1000, '작업 B');
        addLog(`📍 ${resultB} 완료`, 'info');
        
        const resultC = await delay(1000, '작업 C');
        addLog(`📍 ${resultC} 완료`, 'info');
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        asyncResult.textContent = `순차 처리 완료! (소요시간: ${duration}ms)`;
        asyncResult.className = 'success';
        addLog(`✅ 순차 처리 완료 (${duration}ms)`, 'success');
        
    } catch (error) {
        asyncResult.textContent = `순차 처리 에러: ${error}`;
        asyncResult.className = 'error';
        addLog(`❌ 순차 처리 실패: ${error}`, 'error');
    }
}

// === 4. 실제 API 호출 ===

async function fetchPokemonData() {
    const input = document.getElementById('pokemonInput');
    const pokemonName = input.value.trim().toLowerCase();
    
    if (!pokemonName) {
        alert('포켓몬 이름을 입력해주세요!');
        return;
    }
    
    apiResult.textContent = '포켓몬 데이터 로딩 중...';
    apiResult.className = 'loading';
    addLog(`🔍 포켓몬 검색: ${pokemonName}`, 'info');
    
    try {
        // 실제 API 호출 (Unity의 UnityWebRequest와 비슷)
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: 포켓몬을 찾을 수 없습니다`);
        }
        
        const pokemon = await response.json();
        
        // 데이터 표시
        apiResult.innerHTML = `
            <div class="success">
                <h3>🐾 ${pokemon.name} (ID: ${pokemon.id})</h3>
                <p><strong>높이:</strong> ${pokemon.height / 10}m</p>
                <p><strong>무게:</strong> ${pokemon.weight / 10}kg</p>
                <p><strong>타입:</strong> ${pokemon.types.map(t => t.type.name).join(', ')}</p>
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" style="width: 100px;">
            </div>
        `;
        apiResult.className = '';
        
        addLog(`✅ 포켓몬 데이터 로드 성공: ${pokemon.name}`, 'success');
        
    } catch (error) {
        apiResult.textContent = `에러: ${error.message}`;
        apiResult.className = 'error';
        addLog(`❌ API 호출 실패: ${error.message}`, 'error');
    }
}

async function multipleRequests() {
    apiResult.textContent = '여러 포켓몬 데이터 동시 로딩 중...';
    apiResult.className = 'loading';
    addLog('⚡ 다중 API 요청 시작', 'info');
    
    const pokemonNames = ['pikachu', 'charmander', 'squirtle', 'bulbasaur'];
    
    try {
        // 모든 요청을 동시에 실행
        const promises = pokemonNames.map(name => 
            fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
                .then(response => response.json())
        );
        
        const pokemons = await Promise.all(promises);
        
        // 결과 표시
        apiResult.innerHTML = `
            <div class="success">
                <h3>🌟 여러 포켓몬 정보</h3>
                ${pokemons.map(p => `
                    <div style="display: inline-block; margin: 10px; text-align: center;">
                        <img src="${p.sprites.front_default}" alt="${p.name}" style="width: 60px;">
                        <br><strong>${p.name}</strong>
                    </div>
                `).join('')}
            </div>
        `;
        apiResult.className = '';
        
        addLog(`✅ 다중 API 요청 완료: ${pokemons.length}개 포켓몬`, 'success');
        
    } catch (error) {
        apiResult.textContent = `다중 요청 에러: ${error.message}`;
        apiResult.className = 'error';
        addLog(`❌ 다중 API 요청 실패: ${error.message}`, 'error');
    }
}

// === 유틸리티 함수들 ===

function delay(ms, message) {
    return new Promise(resolve => {
        setTimeout(() => resolve(message), ms);
    });
}

function addLog(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${type}`;
    logEntry.textContent = `[${timestamp}] ${message}`;
    
    logContainer.appendChild(logEntry);
    logContainer.scrollTop = logContainer.scrollHeight;
    
    console.log(`[${type.toUpperCase()}] ${message}`);
}

function clearLogs() {
    logContainer.innerHTML = '';
    addLog('🧹 로그가 지워졌습니다', 'info');
}