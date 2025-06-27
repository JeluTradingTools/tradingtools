// API configuration
const API_CONFIG = {
    forex: {
        endpoint: 'https://api.twelvedata.com/forex_pairs',
        apiKey: 'demo' // In production, use a real API key
    },
    crypto: {
        endpoint: 'https://api.twelvedata.com/cryptocurrencies',
        apiKey: 'demo'
    },
    calendar: {
        endpoint: 'https://www.economiccalendar.com/api/events',
        apiKey: 'demo'
    },
    prices: {
        endpoint: 'https://api.twelvedata.com/price',
        apiKey: 'demo'
    }
};

// Cache for storing API responses
const API_CACHE = {
    forex: null,
    crypto: null,
    calendar: null
};

// Fetch forex pairs
export async function fetchForexPairs() {
    if (API_CACHE.forex) return API_CACHE.forex;
    
    try {
        const response = await fetch(`${API_CONFIG.forex.endpoint}?apikey=${API_CONFIG.forex.apiKey}`);
        const data = await response.json();
        API_CACHE.forex = data.data;
        return data.data;
    } catch (error) {
        console.error('Error fetching forex pairs:', error);
        return [];
    }
}

// Fetch cryptocurrencies
export async function fetchCryptocurrencies() {
    if (API_CACHE.crypto) return API_CACHE.crypto;
    
    try {
        const response = await fetch(`${API_CONFIG.crypto.endpoint}?apikey=${API_CONFIG.crypto.apiKey}`);
        const data = await response.json();
        API_CACHE.crypto = data.data;
        return data.data;
    } catch (error) {
        console.error('Error fetching cryptocurrencies:', error);
        return [];
    }
}

// Fetch economic calendar events
export async function fetchEconomicCalendar(startDate, endDate) {
    try {
        const response = await fetch(`${API_CONFIG.calendar.endpoint}?from=${startDate}&to=${endDate}&apikey=${API_CONFIG.calendar.apiKey}`);
        const data = await response.json();
        return data.events || [];
    } catch (error) {
        console.error('Error fetching economic calendar:', error);
        return [];
    }
}

// Fetch real-time price
export async function fetchRealTimePrice(symbol) {
    try {
        const response = await fetch(`${API_CONFIG.prices.endpoint}?symbol=${symbol}&apikey=${API_CONFIG.prices.apiKey}`);
        const data = await response.json();
        return data.price || null;
    } catch (error) {
        console.error('Error fetching real-time price:', error);
        return null;
    }
}

// WebSocket for real-time updates
export function setupPriceWebSocket(symbols, callback) {
    // In a real implementation, this would connect to a WebSocket API
    // For demo purposes, we'll simulate with setInterval
    
    // Simulate price changes
    const interval = setInterval(() => {
        const updates = symbols.map(symbol => ({
            symbol,
            price: (Math.random() * 1.5).toFixed(5),
            change: (Math.random() * 0.02 - 0.01).toFixed(4)
        }));
        callback(updates);
    }, 3000);
    
    return {
        close: () => clearInterval(interval)
    };
}