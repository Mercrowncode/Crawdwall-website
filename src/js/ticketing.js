document.addEventListener('DOMContentLoaded', () => {
    const ticketList = document.querySelector('.ticket-list');
    const addTicketBtn = document.querySelector('.add-ticket-btn');
    let ticketCount = 1;

    // Handle Early Bird Toggle
    const handleEarlyBirdToggle = (checkbox, options) => {
        checkbox.addEventListener('change', () => {
            options.style.display = checkbox.checked ? 'block' : 'none';
            updateSummary();
        });
    };

    // Handle Ticket Type Toggle
    const handleTicketTypeToggle = (toggles, priceInput) => {
        toggles.forEach(btn => {
            btn.addEventListener('click', () => {
                toggles.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                priceInput.closest('.form-group').style.display = 
                    btn.dataset.type === 'paid' ? 'block' : 'none';
                updateSummary();
            });
        });
    };

    // Create New Ticket
    const createTicket = () => {
        ticketCount++;
        const ticketTemplate = document.querySelector('.ticket-card').cloneNode(true);
        
        // Reset values
        ticketTemplate.querySelectorAll('input').forEach(input => {
            if (input.type === 'checkbox') {
                input.checked = false;
            } else {
                input.value = '';
            }
        });
        
        ticketTemplate.querySelector('.ticket-name').value = `Ticket Type ${ticketCount}`;
        ticketTemplate.querySelector('.early-bird-options').style.display = 'none';
        
        // Initialize handlers for new ticket
        initializeTicketHandlers(ticketTemplate);
        
        ticketList.appendChild(ticketTemplate);
        updateSummary();
    };

    // Delete Ticket
    const deleteTicket = (ticket) => {
        if (document.querySelectorAll('.ticket-card').length > 1) {
            ticket.remove();
            updateSummary();
        } else {
            alert('You must have at least one ticket type.');
        }
    };

    // Duplicate Ticket
    const duplicateTicket = (ticket) => {
        ticketCount++;
        const clone = ticket.cloneNode(true);
        clone.querySelector('.ticket-name').value += ' (Copy)';
        initializeTicketHandlers(clone);
        ticket.after(clone);
        updateSummary();
    };

    // Initialize Ticket Handlers
    const initializeTicketHandlers = (ticket) => {
        const earlyBirdCheckbox = ticket.querySelector('input[type="checkbox"]');
        const earlyBirdOptions = ticket.querySelector('.early-bird-options');
        const toggleButtons = ticket.querySelectorAll('.toggle-btn');
        const priceInput = ticket.querySelector('.price-input');
        const deleteBtn = ticket.querySelector('.delete-btn');
        const duplicateBtn = ticket.querySelector('.duplicate-btn');

        handleEarlyBirdToggle(earlyBirdCheckbox, earlyBirdOptions);
        handleTicketTypeToggle(toggleButtons, priceInput);

        deleteBtn.addEventListener('click', () => deleteTicket(ticket));
        duplicateBtn.addEventListener('click', () => duplicateTicket(ticket));

        // Add input event listeners for summary updates
        ticket.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', updateSummary);
        });
    };

    // Update Summary
    const updateSummary = () => {
        const tickets = document.querySelectorAll('.ticket-card');
        let totalCapacity = 0;
        let prices = [];

        tickets.forEach(ticket => {
            const quantity = parseInt(ticket.querySelector('#quantity').value) || 0;
            const price = parseFloat(ticket.querySelector('#price').value) || 0;
            const isPaid = ticket.querySelector('[data-type="paid"]').classList.contains('active');

            totalCapacity += quantity;
            if (isPaid && price > 0) prices.push(price);
        });

        // Update summary display
        document.querySelector('.summary-content').innerHTML = `
            <div class="summary-item">
                <span>Total Ticket Types:</span>
                <strong>${tickets.length}</strong>
            </div>
            <div class="summary-item">
                <span>Total Capacity:</span>
                <strong>${totalCapacity}</strong>
            </div>
            <div class="summary-item">
                <span>Price Range:</span>
                <strong>${getPriceRange(prices)}</strong>
            </div>
        `;
    };

    // Get Price Range String
    const getPriceRange = (prices) => {
        if (prices.length === 0) return 'Free';
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        return min === max ? `₦${min}` : `₦${min} - ₦${max}`;
    };

    // Initialize
    const initialize = () => {
        // Initialize handlers for initial ticket
        initializeTicketHandlers(document.querySelector('.ticket-card'));
        
        // Add ticket button handler
        addTicketBtn.addEventListener('click', createTicket);
        
        // Initial summary update
        updateSummary();
    };

    initialize();
});