// DOM이 로드되면 실행 (Unity의 Start()와 비슷)
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM이 완전히 로드되었습니다!');
    
    // === 1. 요소 찾기 (Unity의 GameObject.Find와 비슷) ===
    const mainTitle = document.getElementById('mainTitle');
    const description = document.getElementById('description');
    const changeTextBtn = document.getElementById('changeTextBtn');
    const changeColorBtn = document.getElementById('changeColorBtn');
    const hideBtn = document.getElementById('hideBtn');
    const itemList = document.getElementById('itemList');
    const textInput = document.getElementById('textInput');
    const addBtn = document.getElementById('addBtn');
    
    console.log('✅ 모든 DOM 요소를 찾았습니다!');
    
    // === 2. 이벤트 리스너 등록 (Unity의 버튼 이벤트와 비슷) ===
    
    // 텍스트 변경 버튼
    changeTextBtn.addEventListener('click', function() {
        description.textContent = '🎉 JavaScript로 텍스트가 바뀌었습니다!';
        console.log('텍스트 변경됨');
    });
    
    // 색상 변경 버튼
    let isHighlighted = false;
    changeColorBtn.addEventListener('click', function() {
        if (isHighlighted) {
            description.classList.remove('highlight');
            changeColorBtn.textContent = '색상 변경';
        } else {
            description.classList.add('highlight');
            changeColorBtn.textContent = '색상 원복';
        }
        isHighlighted = !isHighlighted;
        console.log('색상 토글됨:', isHighlighted);
    });
    
    // 숨기기/보이기 버튼
    let isHidden = false;
    hideBtn.addEventListener('click', function() {
        if (isHidden) {
            description.classList.remove('hidden');
            hideBtn.textContent = '숨기기';
        } else {
            description.classList.add('hidden');
            hideBtn.textContent = '보이기';
        }
        isHidden = !isHidden;
        console.log('표시 상태 토글됨:', !isHidden);
    });
    
    // 아이템 추가 버튼
    addBtn.addEventListener('click', function() {
        const inputValue = textInput.value.trim();
        
        if (inputValue === '') {
            alert('내용을 입력해주세요!');
            return;
        }
        
        // 새로운 li 요소 생성 (Unity의 Instantiate와 비슷)
        const newItem = document.createElement('li');
        newItem.textContent = `📝 ${inputValue}`;
        newItem.style.margin = '5px 0';
        newItem.style.padding = '5px';
        newItem.style.background = '#ecf0f1';
        newItem.style.borderRadius = '5px';
        
        // 리스트에 추가
        itemList.appendChild(newItem);
        
        // 입력 필드 비우기
        textInput.value = '';
        
        console.log('새 아이템 추가됨:', inputValue);
    });
    
    // Enter 키로도 추가 가능하게
    textInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addBtn.click(); // 버튼 클릭 이벤트 실행
        }
    });
    
    // === 3. 초기 설정 ===
    console.log('🎮 모든 이벤트 리스너가 등록되었습니다!');
    
    // 5초 후 자동으로 메시지 추가
    setTimeout(function() {
        const autoItem = document.createElement('li');
        autoItem.textContent = '⏰ 5초 후 자동 추가된 메시지';
        autoItem.style.color = '#3498db';
        autoItem.style.fontWeight = 'bold';
        itemList.appendChild(autoItem);
        console.log('자동 메시지 추가됨');
    }, 5000);
    
});

// 추가적인 DOM 조작 함수들
function demonstrateMoreDOM() {
    console.log('=== DOM 조작 심화 예제 ===');
    
    // 현재 페이지의 모든 button 요소 찾기
    const allButtons = document.querySelectorAll('button');
    console.log('페이지의 버튼 개수:', allButtons.length);
    
    // 각 버튼에 호버 효과 추가
    allButtons.forEach(function(button, index) {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.2s';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // 페이지 제목 동적 변경
    document.title = `DOM 테스트 - ${new Date().toLocaleTimeString()}`;
}

// 페이지 로드 완료 후 심화 기능 실행
window.addEventListener('load', demonstrateMoreDOM);