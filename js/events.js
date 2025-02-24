document.addEventListener('DOMContentLoaded', function() {
    // Sample events data - In a real application, this would come from an API
    const events = [
        {
            id: 1,
            title: 'Tech Conference 2025',
            date: '2025-03-15',
            location: 'San Francisco, CA',
            price: '$299',
            image: 'images/tech-conference.jpg'
        },
        {
            id: 2,
            title: 'Summer Music Festival',
            date: '2025-07-20',
            location: 'Austin, TX',
            price: '$149',
            image: 'images/music-festival.jpg'
        },
        {
            id: 3,
            title: 'Business Leadership Summit',
            date: '2025-04-10',
            location: 'New York, NY',
            price: '$399',
            image: 'images/business-summit.jpg'
        },
        {
            id: 4,
            title: 'Sports Championship',
            date: '2025-06-05',
            location: 'Chicago, IL',
            price: '$79',
            image: 'images/sports-event.jpg'
        },
        {
            id: 5,
            title: 'Art Exhibition',
            date: '2025-05-01',
            location: 'Los Angeles, CA',
            price: 'Free',
            image: 'images/art-exhibition.jpg'
        },
        {
            id: 6,
            title: 'Startup Networking Event',
            date: '2025-03-25',
            location: 'Seattle, WA',
            price: '$49',
            image: 'images/networking-event.jpg'
        }
    ];

    const eventsGrid = document.querySelector('.events-grid');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    let currentPage = 1;
    const eventsPerPage = 6;

    // Function to format date
    function formatDate(dateString) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    // Function to render events
    function renderEvents(eventsToRender, replace = true) {
        const eventCards = eventsToRender.map(event => `
            <div class="event-card">
                <div class="event-image" style="background-image: url('${event.image}')"></div>
                <div class="event-details">
                    <div class="event-date">${formatDate(event.date)}</div>
                    <h3 class="event-title">${event.title}</h3>
                    <div class="event-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${event.location}
                    </div>
                    <div class="event-price">${event.price}</div>
                    <button class="btn btn-primary" onclick="registerForEvent(${event.id})">Register Now</button>
                </div>
            </div>
        `).join('');

        if (replace) {
            eventsGrid.innerHTML = eventCards;
        } else {
            eventsGrid.innerHTML += eventCards;
        }

        // Show/hide load more button
        loadMoreBtn.style.display = 
            currentPage * eventsPerPage < events.length ? 'block' : 'none';
    }

    // Initial render
    renderEvents(events.slice(0, eventsPerPage));

    // Load more events
    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        const start = (currentPage - 1) * eventsPerPage;
        const end = start + eventsPerPage;
        renderEvents(events.slice(start, end), false);
    });
});

// Function to handle event registration
function registerForEvent(eventId) {
    // In a real application, this would handle the registration process
    alert(`Registration for event ${eventId} will be implemented with backend integration.`);
}
