document.addEventListener('DOMContentLoaded', function() {
    // Initialize chart
    const chartContainer = document.getElementById('main-chart');
    const chart = LightweightCharts.createChart(chartContainer, {
        width: chartContainer.clientWidth,
        height: 500,
        layout: {
            backgroundColor: getComputedStyle(document.body).getPropertyValue('--card-bg'),
            textColor: getComputedStyle(document.body).getPropertyValue('--text-color'),
        },
        grid: {
            vertLines: {
                color: getComputedStyle(document.body).getPropertyValue('--border-color'),
            },
            horzLines: {
                color: getComputedStyle(document.body).getPropertyValue('--border-color'),
            },
        },
        crosshair: {
            mode: LightweightCharts.CrosshairMode.Normal,
        },
        rightPriceScale: {
            borderVisible: false,
        },
        timeScale: {
            borderVisible: false,
        },
    });
    
    const candleSeries = chart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderDownColor: '#ef5350',
        borderUpColor: '#26a69a',
        wickDownColor: '#ef5350',
        wickUpColor: '#26a69a',
    });
    
    // Load initial data
    loadChartData(candleSeries, 'EURUSD', '1m');
    
    // Symbol change
    document.getElementById('symbol-select').addEventListener('change', function() {
        const symbol = this.value;
        const timeframe = document.querySelector('.timeframe-btn.active').getAttribute('data-timeframe');
        loadChartData(candleSeries, symbol, timeframe);
    });
    
    // Timeframe change
    document.querySelectorAll('.timeframe-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.timeframe-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const symbol = document.getElementById('symbol-select').value;
            const timeframe = this.getAttribute('data-timeframe');
            loadChartData(candleSeries, symbol, timeframe);
        });
    });
    
    // Chart type change
    document.querySelectorAll('.chart-type-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            changeChartType(chart, candleSeries, type);
        });
    });
    
    // Indicator change
    document.getElementById('indicator-select').addEventListener('change', function() {
        const selectedIndicators = Array.from(this.selectedOptions).map(opt => opt.value);
        updateIndicators(chart, selectedIndicators);
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        chart.applyOptions({ width: chartContainer.clientWidth });
    });
});

async function loadChartData(series, symbol, timeframe) {
    try {
        // In a real app, you would fetch from a market data API
        // This is a mock implementation
        const mockData = generateMockChartData(symbol, timeframe);
        series.setData(mockData);
    } catch (error) {
        console.error('Error loading chart data:', error);
    }
}

function generateMockChartData(symbol, timeframe) {
    const now = new Date();
    const data = [];
    let basePrice = 1.0 + Math.random(); // Start with random base price
    
    // Generate 100 data points
    for (let i = 0; i < 100; i++) {
        const time = new Date(now);
        time.setMinutes(time.getMinutes() - i * getMinutesForTimeframe(timeframe));
        
        const open = basePrice;
        const volatility = 0.001 * (1 + Math.random());
        const close = open * (1 + (Math.random() * 2 - 1) * volatility);
        const high = Math.max(open, close) * (1 + Math.random() * volatility / 2);
        const low = Math.min(open, close) * (1 - Math.random() * volatility / 2);
        
        data.push({
            time: Math.floor(time.getTime() / 1000),
            open,
            high,
            low,
            close
        });
        
        basePrice = close;
    }
    
    return data.reverse();
}

function getMinutesForTimeframe(timeframe) {
    switch (timeframe) {
        case '1m': return 1;
        case '5m': return 5;
        case '15m': return 15;
        case '30m': return 30;
        case '1h': return 60;
        case '4h': return 240;
        case '1d': return 1440;
        default: return 1;
    }
}

function changeChartType(chart, series, type) {
    // Remove existing series
    chart.removeSeries(series);
    
    // Create new series based on type
    switch (type) {
        case 'candlestick':
            series = chart.addCandlestickSeries({
                upColor: '#26a69a',
                downColor: '#ef5350',
                borderDownColor: '#ef5350',
                borderUpColor: '#26a69a',
                wickDownColor: '#ef5350',
                wickUpColor: '#26a69a',
            });
            break;
        case 'heikin-ashi':
            // Would need to convert data to Heikin Ashi first
            series = chart.addCandlestickSeries({
                upColor: '#26a69a',
                downColor: '#ef5350',
                borderDownColor: '#ef5350',
                borderUpColor: '#26a69a',
                wickDownColor: '#ef5350',
                wickUpColor: '#26a69a',
            });
            break;
        case 'line':
            series = chart.addLineSeries({
                color: '#2962FF',
                lineWidth: 2,
            });
            break;
        case 'area':
            series = chart.addAreaSeries({
                topColor: 'rgba(41, 98, 255, 0.4)',
                bottomColor: 'rgba(41, 98, 255, 0)',
                lineColor: '#2962FF',
                lineWidth: 2,
            });
            break;
        case 'bar':
            series = chart.addBarSeries({
                upColor: '#26a69a',
                downColor: '#ef5350',
            });
            break;
    }
    
    // Reload data
    const symbol = document.getElementById('symbol-select').value;
    const timeframe = document.querySelector('.timeframe-btn.active').getAttribute('data-timeframe');
    loadChartData(series, symbol, timeframe);
    
    return series;
}

function updateIndicators(chart, indicators) {
    // Remove all existing indicators
    chart.removeSeries(chart._series);
    
    // Add main series back
    const candleSeries = chart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderDownColor: '#ef5350',
        borderUpColor: '#26a69a',
        wickDownColor: '#ef5350',
        wickUpColor: '#26a69a',
    });
    
    // Reload data
    const symbol = document.getElementById('symbol-select').value;
    const timeframe = document.querySelector('.timeframe-btn.active').getAttribute('data-timeframe');
    loadChartData(candleSeries, symbol, timeframe);
    
    // Add selected indicators
    indicators.forEach(indicator => {
        switch (indicator) {
            case 'sma':
                const smaSeries = chart.addLineSeries({
                    color: '#FF6D00',
                    lineWidth: 2,
                });
                // Would calculate SMA from data
                break;
            case 'ema':
                const emaSeries = chart.addLineSeries({
                    color: '#00BFA5',
                    lineWidth: 2,
                });
                // Would calculate EMA from data
                break;
            // More indicators...
        }
    });
}