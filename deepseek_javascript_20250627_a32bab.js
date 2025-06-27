// Calculator tab functionality
document.querySelectorAll('.calc-tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Remove active class from all buttons and content
        document.querySelectorAll('.calc-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.calculator-content').forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        this.classList.add('active');
        const calcType = this.getAttribute('data-calc');
        document.getElementById(`${calcType}-calculator`).classList.add('active');
    });
});

// Pip Calculator
document.getElementById('pip-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const pair = document.getElementById('pair-select').value;
    const accountCurrency = document.getElementById('account-currency').value;
    const tradeSize = parseFloat(document.getElementById('trade-size').value);
    
    // Calculate pip value based on pair and account currency
    let pipValue = calculatePipValue(pair, accountCurrency);
    if (pipValue === null) {
        alert('Unable to calculate pip value for this pair/currency combination');
        return;
    }
    
    // Calculate pip cost
    const pipCost = pipValue * tradeSize * 100000; // Standard lot is 100,000 units
    
    // Display results
    document.getElementById('pip-value').textContent = pipValue.toFixed(8) + ' ' + accountCurrency;
    document.getElementById('pip-cost').textContent = pipCost.toFixed(2) + ' ' + accountCurrency;
});

function calculatePipValue(pair, accountCurrency) {
    // This is a simplified calculation - real implementation would need current prices
    const baseCurrency = pair.substring(0, 3);
    const quoteCurrency = pair.substring(3);
    
    // If account currency is the quote currency
    if (accountCurrency === quoteCurrency) {
        return 0.0001; // For most pairs, 1 pip is 0.0001
    }
    
    // If account currency is the base currency
    if (accountCurrency === baseCurrency) {
        // Would need current exchange rate to calculate properly
        // For demo purposes, we'll use a fixed rate
        return 0.0001 * 1.2; // Assuming exchange rate is 1.2
    }
    
    // For cross currencies, we'd need to do additional calculations
    // This is a simplified demo
    return 0.0001 * 1.1; // Arbitrary value for demo
}

// Special pairs calculations
document.querySelectorAll('.special-card .calculate-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const card = this.closest('.special-card');
        const type = card.getAttribute('data-type');
        const input = card.querySelector('.special-input');
        const resultDiv = card.querySelector('.result');
        
        const investment = parseFloat(input.value);
        if (isNaN(investment) || investment <= 0) {
            resultDiv.textContent = 'Please enter a valid investment amount';
            return;
        }
        
        // Calculate based on type
        let payout;
        if (type.startsWith('BOOM')) {
            const multiplier = parseInt(type.replace('BOOM', ''));
            payout = investment * multiplier;
        } else if (type.startsWith('CRASH')) {
            const multiplier = parseInt(type.replace('CRASH', ''));
            payout = investment * multiplier;
        } else if (type.startsWith('VOLATILITY')) {
            const level = parseInt(type.replace('VOLATILITY', '').replace('(1S)', ''));
            payout = investment * (level / 10);
        } else if (type.startsWith('STEP')) {
            const step = parseInt(type.replace('STEP', ''));
            payout = investment * (step / 100);
        } else if (type.startsWith('JUMP')) {
            const jump = parseInt(type.replace('JUMP', ''));
            payout = investment * (jump / 10);
        } else {
            payout = 0;
        }
        
        resultDiv.textContent = `Potential Payout: ${payout.toFixed(2)} ${accountCurrency}`;
        resultDiv.style.color = 'green';
    });
});

// Margin Calculator (simplified)
document.getElementById('margin-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const pair = document.getElementById('margin-pair-select').value;
    const tradeSize = parseFloat(document.getElementById('margin-trade-size').value);
    const leverage = parseInt(document.getElementById('leverage-select').value);
    
    // Simplified margin calculation
    // In reality, this would depend on the broker's requirements and current prices
    const marginRequired = (100000 * tradeSize) / leverage;
    
    document.getElementById('margin-result').textContent = `Margin Required: ${marginRequired.toFixed(2)} USD`;
});