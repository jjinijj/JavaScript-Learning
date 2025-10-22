// 전역 변수들 (Unity의 public 변수와 비슷)
let todos = [];
let currentFilter = 'all';
let nextId = 1;

// DOM 요소들 (Unity의 GameObject 참조와 비슷)
let todoInput, addBtn, todoList, totalCount, completedCount, remainingCount;
let filterBtns, clearCompletedBtn, clearAllBtn, emptyState;

// 초기화 함수 (Unity의 Start()와 비슷)
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 할 일 목록 앱 시작!');
    
    // DOM 요소들 찾기
    initializeElements();
    
    // 이벤트 리스너 등록
    setupEventListeners();
    
    // 저장된 데이터 불러오기
    loadFromStorage();
    
    // 화면 업데이트
    renderTodos();
    
    console.log('✅ 초기화 완료!');
});

// DOM 요소 초기화
function initializeElements() {
    todoInput = document.getElementById('todoInput');
    addBtn = document.getElementById('addBtn');
    todoList = document.getElementById('todoList');
    totalCount = document.getElementById('totalCount');
    completedCount = document.getElementById('completedCount');
    remainingCount = document.getElementById('remainingCount');
    filterBtns = document.querySelectorAll('.filter-btn');
    clearCompletedBtn = document.getElementById('clearCompletedBtn');
    clearAllBtn = document.getElementById('clearAllBtn');
    emptyState = document.getElementById('emptyState');
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 추가 버튼
    addBtn.addEventListener('click', addTodo);
    
    // Enter 키로 추가
    todoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
    
    // 필터 버튼들
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            setFilter(this.dataset.filter);
        });
    });
    
    // 완료된 항목 삭제
    clearCompletedBtn.addEventListener('click', clearCompleted);
    
    // 전체 삭제
    clearAllBtn.addEventListener('click', clearAll);
    
    // 페이지 종료 전 저장
    window.addEventListener('beforeunload', saveToStorage);
}

// 할 일 추가 (Unity의 Instantiate와 비슷)
function addTodo() {
    const text = todoInput.value.trim();
    
    if (text === '') {
        alert('할 일을 입력해주세요!');
        todoInput.focus();
        return;
    }
    
    if (text.length > 100) {
        alert('할 일이 너무 깁니다! (최대 100자)');
        return;
    }
    
    // 새 할 일 객체 생성
    const newTodo = {
        id: nextId++,
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    // 배열에 추가 (Unity의 List.Add와 비슷)
    todos.unshift(newTodo); // 맨 앞에 추가
    
    // 입력 필드 초기화
    todoInput.value = '';
    
    // 화면 업데이트
    renderTodos();
    
    // 저장
    saveToStorage();
    
    console.log('새 할 일 추가:', newTodo);
}

// 할 일 완료/미완료 토글
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    
    if (todo) {
        todo.completed = !todo.completed;
        renderTodos();
        saveToStorage();
        console.log('할 일 상태 변경:', todo);
    }
}

// 할 일 삭제 (Unity의 Destroy와 비슷)
function deleteTodo(id) {
    if (!confirm('정말 삭제하시겠습니까?')) {
        return;
    }
    
    const index = todos.findIndex(t => t.id === id);
    
    if (index !== -1) {
        const deletedTodo = todos.splice(index, 1)[0];
        
        // 삭제 애니메이션
        const todoElement = document.querySelector(`[data-id="${id}"]`);
        if (todoElement) {
            todoElement.classList.add('removing');
            setTimeout(() => {
                renderTodos();
            }, 300);
        } else {
            renderTodos();
        }
        
        saveToStorage();
        console.log('할 일 삭제:', deletedTodo);
    }
}

// 할 일 수정
function editTodo(id) {
    const todo = todos.find(t => t.id === id);
    
    if (!todo) return;
    
    const newText = prompt('할 일을 수정하세요:', todo.text);
    
    if (newText !== null && newText.trim() !== '') {
        todo.text = newText.trim();
        renderTodos();
        saveToStorage();
        console.log('할 일 수정:', todo);
    }
}

// 필터 설정
function setFilter(filter) {
    currentFilter = filter;
    
    // 필터 버튼 활성화 상태 업데이트
    filterBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    
    renderTodos();
    console.log('필터 변경:', filter);
}

// 완료된 할 일들 삭제
function clearCompleted() {
    const completedTodos = todos.filter(t => t.completed);
    
    if (completedTodos.length === 0) {
        alert('완료된 할 일이 없습니다.');
        return;
    }
    
    if (!confirm(`완료된 할 일 ${completedTodos.length}개를 삭제하시겠습니까?`)) {
        return;
    }
    
    todos = todos.filter(t => !t.completed);
    renderTodos();
    saveToStorage();
    console.log('완료된 할 일들 삭제:', completedTodos);
}

// 전체 삭제
function clearAll() {
    if (todos.length === 0) {
        alert('삭제할 할 일이 없습니다.');
        return;
    }
    
    if (!confirm(`모든 할 일 ${todos.length}개를 삭제하시겠습니까?`)) {
        return;
    }
    
    todos = [];
    renderTodos();
    saveToStorage();
    console.log('모든 할 일 삭제');
}

// 화면에 할 일 목록 렌더링 (Unity의 UI 업데이트와 비슷)
function renderTodos() {
    // 현재 필터에 맞는 할 일들 필터링
    const filteredTodos = getFilteredTodos();
    
    // 통계 업데이트
    updateStats();
    
    // 빈 상태 체크
    if (todos.length === 0) {
        emptyState.classList.add('show');
        todoList.innerHTML = '';
        return;
    } else {
        emptyState.classList.remove('show');
    }
    
    // 할 일 목록 생성
    todoList.innerHTML = '';
    
    filteredTodos.forEach(todo => {
        const todoElement = createTodoElement(todo);
        todoList.appendChild(todoElement);
    });
    
    console.log(`${filteredTodos.length}개의 할 일 렌더링됨 (필터: ${currentFilter})`);
}

// 할 일 DOM 요소 생성 (Unity의 UI 프리팹 생성과 비슷)
function createTodoElement(todo) {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.dataset.id = todo.id;
    
    li.innerHTML = `
        <input 
            type="checkbox" 
            class="todo-checkbox" 
            ${todo.completed ? 'checked' : ''}
            onchange="toggleTodo(${todo.id})"
        >
        <span class="todo-text">${escapeHtml(todo.text)}</span>
        <div class="todo-actions">
            <button class="edit-btn" onclick="editTodo(${todo.id})">✏️</button>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})">🗑️</button>
        </div>
    `;
    
    return li;
}

// 필터된 할 일 목록 반환
function getFilteredTodos() {
    switch (currentFilter) {
        case 'active':
            return todos.filter(t => !t.completed);
        case 'completed':
            return todos.filter(t => t.completed);
        default:
            return todos;
    }
}

// 통계 업데이트
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const remaining = total - completed;
    
    totalCount.textContent = `전체: ${total}`;
    completedCount.textContent = `완료: ${completed}`;
    remainingCount.textContent = `남은 것: ${remaining}`;
}

// HTML 이스케이프 (보안을 위해)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 로컬 스토리지에 저장
function saveToStorage() {
    try {
        localStorage.setItem('todos', JSON.stringify(todos));
        localStorage.setItem('nextId', nextId.toString());
        console.log('데이터 저장됨');
    } catch (error) {
        console.error('저장 실패:', error);
    }
}

// 로컬 스토리지에서 불러오기
function loadFromStorage() {
    try {
        const savedTodos = localStorage.getItem('todos');
        const savedNextId = localStorage.getItem('nextId');
        
        if (savedTodos) {
            todos = JSON.parse(savedTodos);
            console.log('할 일 목록 불러옴:', todos.length + '개');
        }
        
        if (savedNextId) {
            nextId = parseInt(savedNextId);
        }
        
    } catch (error) {
        console.error('불러오기 실패:', error);
        todos = [];
        nextId = 1;
    }
}