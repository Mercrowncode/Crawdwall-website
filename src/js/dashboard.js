// Initialize Revenue Chart
const initRevenueChart = () => {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Revenue',
                data: [3000, 5000, 4000, 6000, 5500, 7000],
                borderColor: getComputedStyle(document.documentElement)
                    .getPropertyValue('--primary-color'),
                tension: 0.4,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: getComputedStyle(document.documentElement)
                            .getPropertyValue('--border-color')
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
};

// Populate Upcoming Events
const populateUpcomingEvents = () => {
    const events = [
        {
            name: "Tech Conference 2024",
            date: "Mar 15, 2024",
            status: "Active",
            ticketsLeft: 145
        },
        {
            name: "Music Festival",
            date: "Apr 2, 2024",
            status: "Sold Out",
            ticketsLeft: 0
        },
        {
            name: "Business Summit",
            date: "Apr 20, 2024",
            status: "Active",
            ticketsLeft: 89
        }
    ];

    const eventsContainer = document.getElementById('upcomingEvents');
    events.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'event-item';
        eventElement.innerHTML = `
            <div class="event-info">
                <h3>${event.name}</h3>
                <p>${event.date}</p>
            </div>
            <div class="event-meta">
                <span>${event.ticketsLeft} tickets left</span>
                <span class="event-status ${event.status === 'Active' ? 'status-active' : 'status-sold'}">
                    ${event.status}
                </span>
            </div>
        `;
        eventsContainer.appendChild(eventElement);
    });
};

// Populate Recent Sales
const populateRecentSales = () => {
    const sales = [
        {
            buyer: "John Doe",
            event: "Tech Conference 2024",
            ticketType: "VIP Pass",
            amount: "$299",
            date: "Feb 28, 2024"
        },
        {
            buyer: "Jane Smith",
            event: "Music Festival",
            ticketType: "Regular",
            amount: "$89",
            date: "Feb 27, 2024"
        },
        {
            buyer: "Mike Johnson",
            event: "Business Summit",
            ticketType: "Early Bird",
            amount: "$149",
            date: "Feb 27, 2024"
        }
    ];

    const tableBody = document.querySelector('#recentSales tbody');
    sales.forEach(sale => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale.buyer}</td>
            <td>${sale.event}</td>
            <td>${sale.ticketType}</td>
            <td>${sale.amount}</td>
            <td>${sale.date}</td>
        `;
        tableBody.appendChild(row);
    });
};

// Initialize Dashboard
// Add at the beginning of the file
document.addEventListener('DOMContentLoaded', () => {
    // Event Creation Button Handler
    const createEventBtn = document.querySelector('.manual-creation .create-event-btn');
    if (createEventBtn) {
        createEventBtn.addEventListener('click', () => {
            window.location.href = '/create-event';
        });
    }

    // Initialize existing dashboard components
    initRevenueChart();
    populateUpcomingEvents();
    populateRecentSales();
});