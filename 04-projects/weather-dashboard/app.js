let currentWeatherData = null;
let favoritesCities = JSON.parse(localStorage.getItem('favoritesCities')) || [];
let updateInterval = null;

//DOM 요소들

const elements = {

    //화면들
    loadingScreen: document.getElementById('loadingScreen'),
    errorScreen: document.getElementById('errorScreen'),
    dashboard: document.getElementById('dashboard'),

    //에러 관련
    errorMessage: document.getElementById('errorMessage'),
    retryButton: document.getElementById('retryBtn'),

    // 헤더 버튼들
    locationButton: document.getElementById('locationBtn'),
    searchButton: document.getElementById('searchBtn'),
    favoritesButton: document.getElementById('favoritesBtn'),
    refreshButton: document.getElementById('refreshBtn'),

    //검색 관련
    searchContainer: document.getElementById('searchContainer'),
    searchInput: document.getElementById('searchInput'),
    searchSubmit: document.getElementById('searchSubmit'),
    searchResult: document.getElementById('searchResults'),
    
    //현재 날씨
    currentTemp: document.getElementById('currentTemp'),
    currentLocation: document.getElementById('currentLocation'),
    currentDescription: document.getElementById('currentDescription'),
    currentTime: document.getElementById('currentTime'),
    currentIcon: document.getElementById('currentIcon'),
    
    // 상세 정보
    feelsLike: document.getElementById('feelsLike'),
    humidity: document.getElementById('humidity'),
    windSpeed: document.getElementById('windSpeed'),
    pressure: document.getElementById('pressure'),
    visibility: document.getElementById('visibility'),
    uvIndex: document.getElementById('uvIndex'),
    
    // 예보
    hourlyContainer: document.getElementById('hourlyContainer'),
    dailyContainer: document.getElementById('dailyContainer'),
    
    // 즐겨찾기
    favoritesSection: document.getElementById('favoritesSection'),
    favoritesContainer: document.getElementById('favoritesContainer'),
};

// 앱초기화
document.addEventListener('DOMContentLoaded', function(){
    console.log('날씨 대시보드 앱 시작');

    initializeApp();
    setupEventListners();
});

async function initializeApp(){
    try{
        showLoading();

        //API key 확인
        if(CONFIG.API_KEY === 'YOUR_API_KEY_HERE'){
            throw new Error('API key가 설정되지 않았습니다. config.js 파일을 확인해주세요.');
        }

        // 현재 위치 기반으로 날씨 로드
        await loadCurrentLocationWeather();

        // 즐겨찾기 도시들 로드
        loadFavorites();

        // 자동 업데이트 시작
        startAutoUpdate();

        showDashboard();
        console.log('앱 초기화 완료');
    } catch(error){
        console.error('앱 초기화 실패: ', error);
        showError(error.errorMessage);
    }

    document.getElementById('locationBtn').addEventListener('click', () => {
  console.log('클릭됨!');
});
    
}

function setupEventListners(){
    //헤더 버튼들
    console.log(elements.locationButton);
    elements.locationButton.addEventListener('click', loadCurrentLocationWeather);

    console.log(elements.locationButton);
    console.log(typeof loadCurrentLocationWeather);


    elements.searchButton.addEventListener('click', toggleSearch);
    elements.favoritesButton.addEventListener('click', toggleFavorites);
    elements.refreshButton.addEventListener('click', refreshWeatherData);
    
    // 검색 기능
    elements.searchInput.addEventListener('click', handleSearchKeyPress);
    elements.searchSubmit.addEventListener('click', handleSearch);
    
    // 에러화면
    elements.refreshButton.addEventListener('click', initializeApp);
    
    // 키보드 단축키
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// === 날씨 데이터 로딩 함수들 ===

// 현재 위치 기반 날씨 로드
async function loadCurrentLocationWeather(){
    try{
        console.log('현재 위치 가져오는 중');

        const position = await getCurrentPosition();
        const{latitude, longitude} = position.coords;

        console.log(`위치: ${latitude}, ${longitude}`);
        await LoadWeatherByCoords(latitude, longitude);
    } catch(error){
        console.log('위치 가져오기 실패, 기본 도시로 대체 :', error.errorMessage);
        await loadWeatherByCity(CONFIG.DEFAULT_CITY);
    }
}

//도시명으로 날씨 로드
async function loadWeatherByCity(cityName){
    console.log(cityName);
    
    try{
        console.log(`${cityName} 날씨 로드 중`);

        const currentWeatherData = await fetchCurrentWeather({q: cityName});
        console.log('현재 날씨 정보 요청 완료');
        const forecast = await fetchForecast({q:cityName});
        console.log('날씨 정보 요청 완료');

        updateWeatherDisplay(currentWeatherData, forecast);
        console.log(`${cityName} 날씨 로드 완료`);
    } catch (error){
        console.log(`${cityName} 날씨 로드 실패 : `, error.errorMessage);
        throw error;
    }
}

async function LoadWeatherByCoords(lat, lon){
    try{
        console.log(`좌표 (${lat}, ${lon})날씨 로드 중`);

        const currentWeather = await fetchCurrentWeather({lat, lon});
        console.log('현재 날씨 정보 요청 완료');

        const forecast = await fetchForecast({lat, lon});

        console.log('날씨 정보 요청 완료');

        updateWeatherDisplay(currentWeather, forecast);
        console.log('현재 위치 날씨 로드 완료');
        
    }catch(error){
        console.error('현재 위치 날씨 로드 실패: ', error);
        throw error;
    }
}

// === API 호출 함수들 ===

// 현재 날씨 호출
async function fetchCurrentWeather(params){
    const url = buildApiUrl('/weather', params);
    const response = await fetch(url);
    //console.log(response.json());
    console.log(response.ok);

    if(!response.ok){
        throw new Error(`날씨 정보를 가져올 수 없습니다 (${response.status})`);
    }

    return await response.json();
}

// 예보 호출
async function fetchForecast(params){
    const url = buildApiUrl('/forecast', params);
    const response = await fetch(url);
    //console.log(response.json());

    if(!response.ok){
        throw new Error(`예보 정보를 가져올 수 없습니다.(${response.status})`);
    }

    return await response.json();
}

// API URL 생성
function buildApiUrl(endpoint, params){
    const url = new URL(CONFIG.API_BASE_URL + endpoint);

    // 공통 매개변수 추가
    url.searchParams.append('appid', CONFIG.API_KEY);
    url.searchParams.append('units', CONFIG.UNIT);
    url.searchParams.append('lang', CONFIG.LANGUAGE);

    // 추가 매개변수들
    Object.entries(params).forEach(([Key, value]) =>{
        url.searchParams.append(Key, value);
    });

    return url.toString();
}

// === UI 업데이트 함수들 ===

// 날씨 정보 화면 업데이트
function updateWeatherDisplay(currentWeather, forecast){
    currentWeatherData = currentWeather;

    console.log(currentWeather);
    console.log('현재 날씨 업데이트');
    updateCurrentWeather(currentWeather);

    console.log('예보 업데이트');
    updateHourlyForecast(forecast.list.slice(0, 24));// 24시간
    updateDailyForecast(processDailyForecast(forecast.list));

    console.log('배경 변경');
    
    updateBackground(currentWeather.weather[0].main.toLowerCase());

    console.log('화면 업데이트 완료');
}

// 현재 날씨 정보 업데이트
function updateCurrentWeather(data){
    const {main, weather, wind, visibility, name, sys} = data;


    console.log(data);

    // 기본정보
    elements.currentTemp.textContent = Math.round(main.temp);
    elements.currentLocation.textContent = `${name}, ${sys.country}`;
    elements.currentDescription.textContent = weather[0].description;
    elements.currentTime.textContent = formatCurrentTime();

    // 날씨 아이콘
    const iconUrl = `${CONFIG.ICON_BASE_URL}/${weather[0].icon}@2x.png`;
    elements.currentIcon.src = iconUrl;
    elements.currentIcon.alt = weather[0].description;

    // 상세 정보
    elements.feelsLike.textContent = `${Math.round(main.feels_like)}°C`;
    elements.humidity.textContent = `${main.humidity}%`;
    elements.windSpeed.textContent = `${wind.speed} m/s`;
    elements.pressure.textContent = `${main.pressure} hPa`;
    elements.visibility.textContent = `${(visibility / 1000).toFixed(1)} km`;
    
    // UV 인덱스는 별도 API호출 필요(간단하게 더미 데이터) ??
    elements.uvIndex.textContent = Math.floor(Math.random() * 10) + 1;
}

// 시간별 예보 업데이트
function updateHourlyForecast(hourlyData){
    elements.hourlyContainer.innerHTML = '';

    hourlyData.forEach(item => {
        
        const houlyItem = document.createElement('div');
        houlyItem.className = 'hourly-item';

        const time = new Date(item.dt * 1000);
        const iconUrl = `${CONFIG.ICON_BASE_URL}/${item.weather[0].icon}.png`;

        houlyItem.innerHTML = `
        <div class = "hourly-time">${formatHourTime(time)}</div>
        <img src="${iconUrl}" alt="${item.weather[0].description}" class= "hourly-icon">
        <div class = "hourly-temp">${Math.round(item.main.temp)}°</div>
        `;

        console.log(`${formatHourTime(time)}, ${iconUrl}, ${item.weather[0].description}`)

        elements.hourlyContainer.appendChild(houlyItem);

    })
}

// 일별 예보 업데이트
function updateDailyForecast(dailyData){
    elements.dailyContainer.innerHTML ='';

    dailyData.forEach( day =>{
        const dailyItem = document.createElement('div');
        dailyItem.className = 'daily-item';

        const iconUrl = `${CONFIG.ICON_BASE_URL}/${day.icon}.png`

        dailyItem.innerHTML = `
            <div class="daily-date">${day.date}</div>
            <div class="daily-weather">
                <img src="${iconUrl}" alt="${day.description}" class="daily-icon">
                <div class="daily-desc">${day.description}</div>
            </div>
            <div class="daily-temps">
                <span class="daily-high">${day.high}°</span>
                <span class="daily-low">${day.low}°</span>
            </div>
        `;

        
        
        elements.dailyContainer.appendChild(dailyItem);
    });
}

// === 데이터 처리 함수들 ===

// 일별 예보 데이터 처리
function processDailyForecast(forecastList){
    const dailyData = {};

    forecastList.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dateKey = date.toDateString();

        if(!dailyData[dateKey]){
            dailyData[dateKey] = {
                date : formatdayname(date),
                temps: [],
                weather: item.weather[0],
                icon: item.weather[0].icon,
                description: item.weather[0].description
            };
        }

        dailyData[dateKey].temps.push(item.main.temp);

    });

    return Object.values(dailyData).slice(0, 5).map(day =>({
        ...day,
        high: Math.round(Math.max(...day.temps)),
        low: Math.round(Math.min(...day.temps))
    }));
}

// === 검색 기능 ===

// 검색 토글
function toggleSearch(){
    const isVisible = !elements.searchContainer.classList.contains('hidden');

    if(isVisible){
        elements.searchContainer.classList.add('hidden');
    }else {
        elements.searchContainer.classList.remove('hidden');
        elements.searchInput.focus();
    }
}

// 검색 키 입력 처리
function handleSearchKeyPress(event){
    if(event.Key === 'Enter'){
        handleSearch();
    }
}

// 검색 처리
async function handleSearch(){
    const query = elements.searchInput.value.trim();

    if(!query){
        alert('도시 이름을 입력해주세요');
        return;
    }

    try{
        showLoading();
        await loadWeatherByCity(query);

        //검색창 닫기
        elements.searchContainer.classList.add('hidden');
        elements.searchInput.value = '';

        showDashboard();
    }catch(error){
        showDashboard();
        alert(`"${query}" 도시의 날씨 정보를 찾을 수 없습니다.`);
    }
}

// === 즐겨찾기 기능 ===

// 즐겨찾기 토글
function toggleFavorites(){
    const isVisible = !elements.favoritesSection.classList.contains('hidden');
    elements.favoritesSection.classList.toggle('hidden');

    if(!isVisible){
        loadFavorites();
    }
}

// 즐겨찾기 로드
function loadFavorites(){
    elements.favoritesContainer.innerHTML = '';
    
    if(favoritesCities.elements === 0){
        elements.favoritesContainer.innerHTML = `
            <div style="text-align: center; color: var(--text-secondary); padding 20px;">
                즐겨찾기한 도시가 없습니다.<br>
                검색해서 도시를 추가해보세요.
            </div>
        `;

        return;
    }

    favoritesCities.forEach(async(city, index) =>{
        try{
            const weather = await fetchCurrentWeather({q:city.name});

            const favoriteItem = document.createElement('div');
            favoriteItem.className = 'favorite-item';
            favoriteItem.innerHTML = `
                <div class = "favorite-city">${city.name}</div>
                <div class = "favorite-temp">${Math.round(weather.main.temp)}</div>
                <div class = "favorite-desc">${weather.weather[0].description}</div>
            `;

            // 클릭으로 해당 도시 날씨 보지
            favoriteItem.addEventListener('click', ()=>{
                loadWeatherByCity(city.name);
                toggleFavorites();//즐겨찾기 닫기
            });

            elements.favoritesContainer.appendChild(favoriteItem);

        }catch(error){
            console.error(`즐겨찾기 도시 ${city.name}로드 실패: `,error);
        }
    });

}

// === 유틸리티 함수들 ===

// 현재 위치 가져오기
function getCurrentPosition(){
    return new Promise((resolve, reject) =>{
        if(!navigator.geolocation){
            reject(new Error('위치 서비스를 지원하지 않는 브라우저입니다.'));
            return;
        }

        navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            enableHighAccuracy: true
        });
    });
}

// 시간 포맷팅
function formatCurrentTime(){
    return new Date().toLocaleDateString('ko-KR',{
        year:'numeric',
        month:'long',
        day:'numeric',
        hour:'2-digit',
        minute:'2-digit'
    });
}

function formatHourTime(date){
    return date.toLocaleTimeString('ko-KR',{
        hour:'2-digit',
        minute:'2-digit'
    });
}

function formatdayname(date){
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if(date.toDateString() === today.toDateString()){
        return '오늘';
    }else if(date.toDateString() === tomorrow.toDateString()){
        return '내일';
    }else{
        return date.toLocaleDateString('ko-KR', {weekday:'long'});
    }
}

// 배경 업데이트
function updateBackground(weatherType){
    const body = document.body;

    // 기존 날씨 클래스 제거
    body.classList.remove('clear', 'clouds','rain','snow','thunderstorm');

    // 날씨 타입에 따른 클래스 추가
    switch(weatherType){
        case 'clear':
            body.classList.add('clear');
            break;
        case 'clouds':
            body.classList.add('clouds');
            break;
        case 'rain':
        case 'drizzle':
            body.classList.add('rain');
            break;
        case 'snow':
            body.classList.add('snow');
            break;
        case 'thunderstorm':
            body.classList.add('thunderstorm');
            break;
        derault:
            body.classList.add('clear');
    }
}

// === 화면 상태 관리 ===

function showLoading(){
    elements.loadingScreen.classList.remove('hidden');
    elements.errorScreen.classList.add('hidden');
    elements.dashboard.classList.add('hidden');
}

function showError(message) {
    elements.loadingScreen.classList.add('hidden');
    elements.errorScreen.classList.remove('hidden');
    elements.dashboard.classList.add('hidden');
    elements.errorMessage.textContent = message;
}

function showDashboard() {
    elements.loadingScreen.classList.add('hidden');
    elements.errorScreen.classList.add('hidden');
    elements.dashboard.classList.remove('hidden');
}

// === 자동 업데이트 ===
function startAutoUpdate(){
    //기존 인터벌 정리
    if(updateInterval){
        clearInterval(updateInterval);
    }

    updateInterval = setInterval(async()=>{
        try{
            console.log('자동 업데이트 중...');
            await refreshWeatherData();
        }catch(error){
            console.error('자동 업데이트 실패: ',error);
        }
    }, CONFIG.UPDATE_INTERVAL);

    console.log(`${CONFIG.UPDATE_INTERVAL / 10000 / 60}분마다 자동 업데이트 시작`);
}

// 새로고침
async function refreshWeatherData(){
    if(!currentWeatherData){
        await initializeApp();
        return;
    }

    try{
        elements.refreshButton.style.transform = 'rotate(360deg)';
        elements.refreshButton.style.transition = 'transform 0.5s';

        const {name} = currentWeatherData;
        await loadWeatherByCity(name);

        setTimeout(()=>{
            elements.refreshButton.style.transform = 'rotate(0deg)';
        }, 500);
    }catch(error){
        console.error('새로고침 실패: ', error);
        alert('날씨 정보를 새로고침할 수 없습니다.');
    }
}

function handleKeyboardShortcuts(event){
    //ctrl/cmd + 키조합
    if(event.ctrlKey || event.metaKey){
        switch(event.Key){
            case 'f':
                event.preventDefaule();
                toggleSearch();
                break;
            case 'r':
                event.preventDefaule();
                refreshWeatherData();
                break;
        }
    }

    //esc
    if(event.Key === 'Escape'){
        elements.searchContainer.classList.add('hidden');
        elements.favoritesSection.classList.add('hidden');
    }
}

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', ()=>{
    if(updateInterval){
        clearInterval(updateInterval);
    }
});

// 에러 처리
window.addEventListener('unhandledrejection', (event)=>{
    console.error('처리되지 않은 Promise 에러: ', event.reason);
});