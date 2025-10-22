const CONFIG = {
    API_KEY : '23975c46bd09a010f6a604af52e016d7',

    API_BASE_URL : 'https://api.openweathermap.org/data/2.5',
    ICON_BASE_URL : 'https://openweathermap.org/img/wn',

    // 기본 설정
    DEFAULT_CITY : 'Seoul',
    UPDATE_INTERVAL : 10 * 60 * 1000, // 10분마다 업데이트

    // 지원하는 언어
    LANGUAGE : 'ko',

    //온도 단위
    UNIT : 'metric', // metric = 섭씨, imperial = 화씨
};

if(CONFIG.API_KEY === 'YOUR_API_KEY_HERE'){
    console.warn('API키를 설정해주세요. config.js 파일에서 설정 가능합니다.')
}