// ========================================
// 테마 시스템
// ========================================

let currentTheme = 'classic'; // 현재 테마

// 테마 설정
export function setTheme(theme) {
    currentTheme = theme;

    // HTML body에 data-theme 속성 설정
    if (theme === 'classic') {
        document.body.removeAttribute('data-theme');
    } else {
        document.body.setAttribute('data-theme', theme);
    }

    // LocalStorage에 저장
    localStorage.setItem('theme', theme);

    console.log('🎨 테마 변경:', theme);
}

export function getCurrentTheme() {
    return currentTheme;
}
