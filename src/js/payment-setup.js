document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const gatewayCards = document.querySelectorAll('.gateway-card');
    const verifyBtn = document.getElementById('verifyAccount');
    const accountNumber = document.getElementById('accountNumber');
    const bankName = document.getElementById('bankName');
    const accountName = document.getElementById('accountName');
    const calculatorInputs = document.querySelectorAll('.calculator-form input');

    // Gateway Connection Handlers
    gatewayCards.forEach(card => {
        const connectBtn = card.querySelector('.connect-btn, .disconnect-btn');
        connectBtn?.addEventListener('click', () => handleGatewayConnection(card));
    });

    const handleGatewayConnection = (card) => {
        const statusBadge = card.querySelector('.status-badge');
        const button = card.querySelector('.connect-btn, .disconnect-btn');
        const isConnected = statusBadge.classList.contains('connected');

        if (isConnected) {
            // Disconnect logic
            statusBadge.classList.remove('connected');
            statusBadge.textContent = 'Not Connected';
            button.className = 'connect-btn';
            button.textContent = 'Connect';
        } else {
            // Connect logic
            statusBadge.classList.add('connected');
            statusBadge.textContent = 'Connected';
            button.className = 'disconnect-btn';
            button.textContent = 'Disconnect';
        }
    };

    // Account Verification
    const verifyAccount = async () => {
        const bank = bankName.value;
        const number = accountNumber.value;

        if (!bank || !number || number.length !== 10) {
            showError('Please enter valid bank details');
            return;
        }

        verifyBtn.classList.add('loading');
        verifyBtn.disabled = true;

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Mock response
            const mockName = 'John Doe';
            accountName.value = mockName;
            showSuccess('Account verified successfully');
        } catch (error) {
            showError('Failed to verify account');
        } finally {
            verifyBtn.classList.remove('loading');
            verifyBtn.disabled = false;
        }
    };

    verifyBtn?.addEventListener('click', verifyAccount);

    // Input Validation
    accountNumber?.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
    });

    // Revenue Calculator
    const updateCalculations = () => {
        const price = parseFloat(document.getElementById('ticketPrice').value) || 0;
        const quantity = parseInt(document.getElementById('ticketQuantity').value) || 0;
        
        const grossRevenue = price * quantity;
        const platformFee = grossRevenue * 0.05; // 5% platform fee
        const netRevenue = grossRevenue - platformFee;

        document.getElementById('grossRevenue').textContent = formatCurrency(grossRevenue);
        document.getElementById('platformFee').textContent = formatCurrency(platformFee);
        document.getElementById('netRevenue').textContent = formatCurrency(netRevenue);
    };

    calculatorInputs.forEach(input => {
        input.addEventListener('input', updateCalculations);
    });

    // Utility Functions
    const formatCurrency = (amount) => {
        return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
    };

    const showError = (message) => {
        showToast(message, 'error');
    };

    const showSuccess = (message) => {
        showToast(message, 'success');
    };

    const showToast = (message, type) => {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    };

    // Save Settings
    const saveBtn = document.querySelector('.save-btn');
    saveBtn?.addEventListener('click', () => {
        const settings = {
            selectedGateway: Array.from(gatewayCards).find(card => 
                card.querySelector('.status-badge.connected'))?.dataset.gateway,
            bankDetails: {
                bankName: bankName.value,
                accountNumber: accountNumber.value,
                accountName: accountName.value
            }
        };

        localStorage.setItem('paymentSettings', JSON.stringify(settings));
        showSuccess('Settings saved successfully');
    });

    // Load Saved Settings
    const loadSavedSettings = () => {
        const saved = localStorage.getItem('paymentSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            
            // Restore gateway selection
            if (settings.selectedGateway) {
                const card = document.querySelector(`[data-gateway="${settings.selectedGateway}"]`);
                if (card) handleGatewayConnection(card);
            }

            // Restore bank details
            if (settings.bankDetails) {
                bankName.value = settings.bankDetails.bankName;
                accountNumber.value = settings.bankDetails.accountNumber;
                accountName.value = settings.bankDetails.accountName;
            }
        }
    };

    // Initialize
    loadSavedSettings();
    updateCalculations();
});