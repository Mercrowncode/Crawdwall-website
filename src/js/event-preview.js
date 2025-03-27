document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const publishBtn = document.querySelector('.publish-btn');
    const editBtn = document.querySelector('.edit-btn');
    const modal = document.getElementById('publishModal');
    const confirmPublish = document.getElementById('confirmPublish');
    const cancelPublish = document.getElementById('cancelPublish');
    const saveDraft = document.getElementById('saveDraft');

    // Load Event Data
    const loadEventData = () => {
        // Retrieve data from localStorage
        const eventDetails = JSON.parse(localStorage.getItem('eventDetails') || '{}');
        const ticketSettings = JSON.parse(localStorage.getItem('ticketSettings') || '{}');
        const whatsappSettings = JSON.parse(localStorage.getItem('whatsappSettings') || '{}');
        const paymentSettings = JSON.parse(localStorage.getItem('paymentSettings') || '{}');

        // Update preview with event details
        updateEventPreview(eventDetails);
        updateTicketPreview(ticketSettings);
        updatePaymentPreview(paymentSettings);
        updateWhatsAppPreview(whatsappSettings);
    };

    const updateEventPreview = (details) => {
        if (!details) return;

        document.getElementById('eventName').textContent = details.eventName || 'Event Name';
        document.getElementById('eventDescription').textContent = details.eventDescription || 'No description available';
        document.getElementById('eventDate').textContent = formatDate(details.startDate);
        document.getElementById('eventTime').textContent = formatTimeRange(details.startDate, details.endDate);
        document.getElementById('eventLocation').textContent = details.location || 'Location TBD';
    };

    const updateTicketPreview = (tickets) => {
        if (!tickets) return;
        const ticketList = document.querySelector('.ticket-list');
        ticketList.innerHTML = ''; // Clear existing tickets

        // Add each ticket type
        tickets.forEach(ticket => {
            const ticketElement = createTicketElement(ticket);
            ticketList.appendChild(ticketElement);
        });
    };

    const updatePaymentPreview = (payment) => {
        if (!payment) return;
        const paymentDetails = document.querySelector('.payment-details');
        
        // Update payment gateway info
        const gatewayElement = paymentDetails.querySelector('.payment-item:nth-child(1) strong');
        gatewayElement.textContent = payment.selectedGateway || 'Not configured';

        // Update bank account info
        const accountElement = paymentDetails.querySelector('.payment-item:nth-child(2) strong');
        if (payment.bankDetails) {
            const accountNumber = payment.bankDetails.accountNumber;
            const maskedNumber = `**** ${accountNumber.slice(-4)}`;
            accountElement.textContent = `${payment.bankDetails.bankName} (${maskedNumber})`;
        }
    };

    const updateWhatsAppPreview = (whatsapp) => {
        if (!whatsapp) return;
        const messageBubble = document.querySelector('.message-bubble p');
        messageBubble.textContent = whatsapp.initialResponse || 'Automated response not configured';
    };

    // Utility Functions
    const formatDate = (dateString) => {
        if (!dateString) return 'Date TBD';
        return new Date(dateString).toLocaleDateString('en-NG', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTimeRange = (start, end) => {
        if (!start || !end) return 'Time TBD';
        const startTime = new Date(start).toLocaleTimeString('en-NG', {
            hour: '2-digit',
            minute: '2-digit'
        });
        const endTime = new Date(end).toLocaleTimeString('en-NG', {
            hour: '2-digit',
            minute: '2-digit'
        });
        return `${startTime} - ${endTime}`;
    };

    const createTicketElement = (ticket) => {
        const div = document.createElement('div');
        div.className = `ticket-item ${ticket.isEarlyBird ? 'early-bird' : ''}`;
        div.innerHTML = `
            ${ticket.isEarlyBird ? '<div class="ticket-badge">Early Bird</div>' : ''}
            <div class="ticket-details">
                <h4>${ticket.name}</h4>
                <p>${ticket.description || 'No description available'}</p>
            </div>
            <div class="ticket-price">
                <strong>${ticket.price ? `₦${ticket.price.toLocaleString()}` : 'Free'}</strong>
                <span>${ticket.quantity} available</span>
            </div>
        `;
        return div;
    };

    // Event Handlers
    publishBtn.addEventListener('click', () => {
        modal.classList.add('active');
    });

    cancelPublish.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    confirmPublish.addEventListener('click', async () => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            showNotification('Event published successfully!', 'success');
            modal.classList.remove('active');
            
            // Redirect to events dashboard
            setTimeout(() => {
                window.location.href = 'organizer-dashboard.html';
            }, 2000);
        } catch (error) {
            showNotification('Failed to publish event. Please try again.', 'error');
        }
    });

    editBtn.addEventListener('click', () => {
        window.location.href = 'create-event.html';
    });

    saveDraft.addEventListener('click', async () => {
        try {
            // Simulate saving
            await new Promise(resolve => setTimeout(resolve, 1000));
            showNotification('Draft saved successfully!', 'success');
        } catch (error) {
            showNotification('Failed to save draft', 'error');
        }
    });

    // Notification System
    const showNotification = (message, type) => {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    };

    // Initialize
    loadEventData();
});