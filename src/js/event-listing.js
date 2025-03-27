document.addEventListener('DOMContentLoaded', () => {
    console.log('Event Listing Page Loaded');

    const sidebar = document.getElementById('sidebar');
    const openSidebarBtn = document.getElementById('openSidebar');
    const closeSidebarBtn = document.getElementById('closeSidebar');
    const mainContent = document.querySelector('.main-content');

    openSidebarBtn.addEventListener('click', () => {
        sidebar.classList.add('open');
        mainContent.classList.add('shift');
    });

    closeSidebarBtn.addEventListener('click', () => {
        sidebar.classList.remove('open');
        mainContent.classList.remove('shift');
    });

    const categoryFilter = document.getElementById('category-filter');
    const dateFilter = document.getElementById('date-filter');
    const locationFilter = document.getElementById('location-filter');
    const popularityFilter = document.getElementById('popularity-filter');
    const eventList = document.querySelector('.event-list');

    // Sample data - this would be fetched from a server in a real application
    const events = [
        { id: 1, title: 'Tech Conference 2025', category: 'tech', date: '2025-03-15', location: 'San Francisco', popularity: 5 },
        { id: 2, title: 'Business Expo', category: 'business', date: '2025-04-20', location: 'New York', popularity: 4 },
        { id: 3, title: 'Finance Summit', category: 'finance', date: '2025-05-10', location: 'Chicago', popularity: 3 },
        { id: 4, title: 'Education Fair', category: 'education', date: '2025-06-25', location: 'Los Angeles', popularity: 2 },
    ];

    function renderEvents(filteredEvents) {
        eventList.innerHTML = '';
        filteredEvents.forEach(event => {
            const eventItem = document.createElement('div');
            eventItem.classList.add('event-item');
            eventItem.innerHTML = `
                <h2>${event.title}</h2>
                <p>Category: ${event.category}</p>
                <p>Date: ${event.date}</p>
                <p>Location: ${event.location}</p>
                <button class="register-btn">Register</button>
            `;
            eventList.appendChild(eventItem);
        });
    }

    function filterEvents() {
        const category = categoryFilter.value;
        const date = dateFilter.value;
        const location = locationFilter.value.toLowerCase();
        const popularity = popularityFilter.value;

        const filteredEvents = events.filter(event => {
            return (category === 'all' || event.category === category) &&
                   (!date || event.date === date) &&
                   (!location || event.location.toLowerCase().includes(location)) &&
                   (!popularity || (popularity === 'most-popular' && event.popularity >= 4) || (popularity === 'least-popular' && event.popularity < 4));
        });

        renderEvents(filteredEvents);
    }

    categoryFilter.addEventListener('change', filterEvents);
    dateFilter.addEventListener('change', filterEvents);
    locationFilter.addEventListener('input', filterEvents);
    popularityFilter.addEventListener('change', filterEvents);

    // Initial render
    renderEvents(events);
});
