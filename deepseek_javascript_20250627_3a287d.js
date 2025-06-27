// Theme switcher
document.getElementById('theme-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-theme');
    const icon = this.querySelector('i');
    if (document.body.classList.contains('dark-theme')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
});

// Tab functionality
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Remove active class from all buttons and content
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        this.classList.add('active');
        const tabId = this.getAttribute('data-tab') + '-tab';
        document.getElementById(tabId).classList.add('active');
    });
});

// Initialize market data
fetchMarketData();

async function fetchMarketData() {
    try {
        // Forex data
        const forexResponse = await fetch('https://api.twelvedata.com/forex_pairs?apikey=demo');
        const forexData = await forexResponse.json();
        populateMarketTable('forex-table', forexData.data.slice(0, 10));
        
        // Update ticker
        updateLiveTicker(forexData.data);
    } catch (error) {
        console.error('Error fetching market data:', error);
    }
}

function populateMarketTable(tableId, data) {
    const tableBody = document.querySelector(`#${tableId} tbody`);
    tableBody.innerHTML = '';
    
    data.forEach(item => {
        const row = document.createElement('tr');
        
        const pairCell = document.createElement('td');
        pairCell.textContent = item.symbol;
        
        const priceCell = document.createElement('td');
        priceCell.textContent = (Math.random() * 1.5).toFixed(5); // Simulated price
        
        const changeCell = document.createElement('td');
        const change = (Math.random() * 0.02 - 0.01).toFixed(4);
        changeCell.textContent = change;
        changeCell.style.color = change >= 0 ? 'green' : 'red';
        
        const highCell = document.createElement('td');
        highCell.textContent = (1.1 + Math.random() * 0.1).toFixed(5);
        
        const lowCell = document.createElement('td');
        lowCell.textContent = (1.0 + Math.random() * 0.1).toFixed(5);
        
        row.append(pairCell, priceCell, changeCell, highCell, lowCell);
        tableBody.appendChild(row);
    });
}

function updateLiveTicker(data) {
    const ticker = document.getElementById('live-ticker');
    ticker.innerHTML = '';
    
    data.slice(0, 15).forEach(item => {
        const span = document.createElement('span');
        span.style.margin = '0 20px';
        
        const symbol = document.createElement('strong');
        symbol.textContent = item.symbol + ': ';
        
        const price = document.createElement('span');
        price.textContent = (Math.random() * 1.5).toFixed(5);
        
        const change = (Math.random() * 0.02 - 0.01).toFixed(4);
        const changeSpan = document.createElement('span');
        changeSpan.textContent = ' (' + (change >= 0 ? '+' : '') + change + ')';
        changeSpan.style.color = change >= 0 ? 'green' : 'red';
        
        span.append(symbol, price, changeSpan);
        ticker.appendChild(span);
    });
}

// Simulate real-time updates
setInterval(() => {
    const prices = document.querySelectorAll('#forex-table td:nth-child(2)');
    prices.forEach(price => {
        const current = parseFloat(price.textContent);
        const newPrice = current * (1 + (Math.random() * 0.002 - 0.001));
        price.textContent = newPrice.toFixed(5);
    });
    
    const changes = document.querySelectorAll('#forex-table td:nth-child(3)');
    changes.forEach(change => {
        const newChange = (Math.random() * 0.02 - 0.01).toFixed(4);
        change.textContent = newChange;
        change.style.color = newChange >= 0 ? 'green' : 'red';
    });
}, 3000);