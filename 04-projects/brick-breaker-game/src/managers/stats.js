// ========================================
// 게임 통계 시스템
// ========================================

let stats = {
    totalGames: 0,
    bestScore: 0,
    totalBricks: 0
};

// 통계 로드
export function loadStats() {
    const saved = localStorage.getItem('gameStats');
    if (saved) {
        try {
            stats = JSON.parse(saved);
            console.log('📊 통계 로드됨:', stats);
        } catch (error) {
            console.error('통계 로드 실패:', error);
        }
    }
    return stats;
}

// 통계 저장
export function saveStats() {
    localStorage.setItem('gameStats', JSON.stringify(stats));
    console.log('📊 통계 저장됨:', stats);
}

// 통계 업데이트
export function updateStats(gameData) {
    if (gameData.gameCompleted) {
        stats.totalGames++;
    }
    if (gameData.score > stats.bestScore) {
        stats.bestScore = gameData.score;
    }
    if (gameData.bricksDestroyed) {
        stats.totalBricks += gameData.bricksDestroyed;
    }
    saveStats();
}

// 통계 가져오기
export function getStats() {
    return { ...stats };
}

// 통계 초기화
export function resetStats() {
    stats = {
        totalGames: 0,
        bestScore: 0,
        totalBricks: 0
    };
    saveStats();
    console.log('📊 통계 초기화됨');
}
