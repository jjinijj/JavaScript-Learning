// ========================================
// 다국어 지원 시스템 (i18n - internationalization)
// ========================================

let currentLanguage = 'ko'; // 현재 언어
let translations = {};      // 로드된 번역 데이터

// 번역 텍스트 가져오기 (translate의 약자)
export function t(key) {
    return translations[key] || key;
}

// JSON 파일에서 언어 로드
async function loadLanguage(lang) {
    try {
        const response = await fetch(`../lang/${lang}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load language: ${lang}`);
        }
        translations = await response.json();
        console.log(`✅ 언어 로드 완료: ${lang}`);
        return true;
    } catch (error) {
        console.error(`❌ 언어 로드 실패: ${lang}`, error);
        return false;
    }
}

// 언어 설정 및 UI 업데이트
export async function setLanguage(lang, updateMuteButtonCallback) {
    currentLanguage = lang;
    const success = await loadLanguage(lang);

    if (success) {
        updateLanguageUI(updateMuteButtonCallback);
        localStorage.setItem('language', lang);

        // HTML lang 속성 업데이트
        document.documentElement.lang = lang;

        // 페이지 제목 업데이트
        document.title = t('pageTitle');

        console.log(`🌐 언어 변경: ${lang}`);
    }
}

// 모든 UI 요소의 언어 업데이트
function updateLanguageUI(updateMuteButtonCallback) {
    // data-i18n 속성을 가진 모든 요소 찾기
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = t(key);

        // innerHTML로 설정 (br 태그 지원)
        if (translation.includes('<br>')) {
            element.innerHTML = translation;
        } else {
            element.textContent = translation;
        }
    });

    // 특수한 경우: "레벨 X 완료!" 같은 동적 텍스트
    updateDynamicTexts();

    // 음소거 버튼도 업데이트 (callback 사용)
    if (updateMuteButtonCallback) {
        updateMuteButtonCallback();
    }
}

// 동적 텍스트 업데이트 (숫자가 포함된 텍스트)
function updateDynamicTexts() {
    // "레벨 X 완료!" 패턴 - 나중에 필요시 구현
}

export function getCurrentLanguage() {
    return currentLanguage;
}
