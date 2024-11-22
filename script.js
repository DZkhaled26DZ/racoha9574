class CandleAnalyzer {
    constructor() {
        this.isAnalyzing = false;
        this.notificationsEnabled = true;
        this.symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'DOGEUSDT'];
        this.analyzeInterval = null;
        this.SHADOW_THRESHOLD = 300; // 300% threshold

        this.initializeUI();
        this.setupEventListeners();
        this.updateLastUpdate();
        setInterval(() => this.updateLastUpdate(), 1000);
    }

    initializeUI() {
        this.toggleAnalysisBtn = document.getElementById('toggleAnalysis');
        this.toggleNotificationsBtn = document.getElementById('toggleNotifications');
        this.resultsBody = document.getElementById('resultsBody');
        this.alert = document.getElementById('alert');
        this.lastUpdateEl = document.querySelector('.last-update');
    }

    setupEventListeners() {
        this.toggleAnalysisBtn.addEventListener('click', () => this.toggleAnalysis());
        this.toggleNotificationsBtn.addEventListener('click', () => this.toggleNotifications());
    }

    async fetchCandleData(symbol) {
        try {
            const response = await fetch(
                `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1h&limit=24`
            );
            const data = await response.json();
            
            data.forEach(kline => {
                const openTime = kline[0];
                const open = parseFloat(kline[1]);
                const high = parseFloat(kline[2]);
                const low = parseFloat(kline[3]);
                const close = parseFloat(kline[4]);

                const bodyLength = Math.abs(close - open);
                const upperShadow = high - Math.max(open, close);
                const lowerShadow = Math.min(open, close) - low;

                const upperShadowPercentage = bodyLength > 0 ? (upperShadow / bodyLength) * 100 : 0;
                const lowerShadowPercentage = bodyLength > 0 ? (lowerShadow / bodyLength) * 100 : 0;
                
                const shadowPercentage = Math.max(upperShadowPercentage, lowerShadowPercentage);
                const isUpperShadow = upperShadowPercentage > lowerShadowPercentage;

                if (shadowPercentage >= this.SHADOW_THRESHOLD) {
                    const result = {
                        symbol,
                        timestamp: openTime,
                        shadowPercentage,
                        price: close,
                        trend: isUpperShadow ? 'up' : 'down',
                        recommendation: isUpperShadow ? 'sell' : 'buy'
                    };
                    this.addResult(result);
                }
            });
        } catch (error) {
            console.error(`Error fetching data for ${symbol}:`, error);
        }
    }

    toggleAnalysis() {
        this.isAnalyzing = !this.isAnalyzing;
        
        if (this.isAnalyzing) {
            this.startAnalysis();
            this.toggleAnalysisBtn.innerHTML = `
                <svg class="stop-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
                إيقاف التحليل
            `;
            this.toggleAnalysisBtn.classList.remove('btn-primary');
            this.toggleAnalysisBtn.classList.add('btn-danger');
        } else {
            this.stopAnalysis();
            this.toggleAnalysisBtn.innerHTML = `
                <svg class="play-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                بدء التحليل
            `;
            this.toggleAnalysisBtn.classList.remove('btn-danger');
            this.toggleAnalysisBtn.classList.add('btn-primary');
        }
    }

    startAnalysis() {
        // Initial fetch for all symbols
        this.symbols.forEach(symbol => this.fetchCandleData(symbol));

        // Set up interval to fetch new data every minute
        this.analyzeInterval = setInterval(() => {
            this.symbols.forEach(symbol => this.fetchCandleData(symbol));
        }, 60000);
    }

    stopAnalysis() {
        if (this.analyzeInterval) {
            clearInterval(this.analyzeInterval);
            this.analyzeInterval = null;
        }
    }

    formatTimestamp(timestamp) {
        return new Date(timestamp).toLocaleString('en-US', {
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: false
        });
    }

    addResult(result) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="symbol">
                    <span class="symbol-name">${result.symbol}</span>
                    <span class="symbol-pair">USDT</span>
                </div>
            </td>
            <td>${this.formatTimestamp(result.timestamp)}</td>
            <td>${result.shadowPercentage.toLocaleString('en-US', { maximumFractionDigits: 2 })}%</td>
            <td>$${result.price.toLocaleString('en-US', { maximumFractionDigits: 2 })}</td>
            <td class="${result.trend === 'up' ? 'trend-up' : 'trend-down'}">
                ${result.trend === 'up' ? '↑ أعلى الشمعة' : '↓ أسفل الشمعة'}
            </td>
            <td>
                <span class="recommendation ${result.recommendation === 'buy' ? 'trend-up' : 'trend-down'}">
                    ${result.recommendation === 'buy' ? 'شراء' : 'بيع'}
                </span>
            </td>
        `;

        if (this.resultsBody.firstChild) {
            this.resultsBody.insertBefore(row, this.resultsBody.firstChild);
        } else {
            this.resultsBody.appendChild(row);
        }

        if (this.notificationsEnabled) {
            this.showAlert();
        }
    }

    toggleNotifications() {
        this.notificationsEnabled = !this.notificationsEnabled;
        
        if (this.notificationsEnabled) {
            this.toggleNotificationsBtn.innerHTML = `
                <svg class="bell-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                التنبيهات مفعلة
            `;
        } else {
            this.toggleNotificationsBtn.innerHTML = `
                <svg class="bell-off-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13.73 21a2 2 0 0 1-3.46 0"></path><path d="M18.63 13A17.89 17.89 0 0 1 18 8"></path><path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"></path><path d="M18 8a6 6 0 0 0-9.33-5"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                التنبيهات معطلة
            `;
        }
    }

    showAlert() {
        this.alert.classList.add('show');
        setTimeout(() => this.alert.classList.remove('show'), 3000);
    }

    updateLastUpdate() {
        this.lastUpdateEl.textContent = `آخر تحديث: ${new Date().toLocaleTimeString('en-US')}`;
    }
}

// Initialize the analyzer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new CandleAnalyzer();
});