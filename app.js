// BookMyShow Enhanced Sorting - Main Application Logic
// Core functionality for sorting, filtering, and map interactions

let map;
let userLocation = { ...defaultUserLocation };
let filteredEvents = [...events];
let currentGenreFilter = 'all';
let markers = [];
let userMarker = null;

// ========== UTILITY FUNCTIONS ==========

// Calculate distance using Haversine formula
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1); // Return distance in km
}

// Add distance to all events based on user location
function addDistanceToEvents() {
    return events.map(event => ({
        ...event,
        distance: calculateDistance(
            userLocation.lat,
            userLocation.lng,
            event.location.lat,
            event.location.lng
        )
    }));
}

// ========== SORTING ALGORITHMS ==========

// 1. Proximity-Based Sorting
function sortByProximity(eventsArray) {
    return [...eventsArray].sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
}

// 2. Budget-Friendly Sorting
function sortByBudget(eventsArray) {
    return [...eventsArray].sort((a, b) => a.basePrice - b.basePrice);
}

// 3. Accessibility-First Sorting
function sortByAccessibility(eventsArray) {
    return [...eventsArray].sort((a, b) => {
        if (a.accessible === b.accessible) {
            return parseFloat(a.distance) - parseFloat(b.distance);
        }
        return b.accessible - a.accessible; // true (1) comes before false (0)
    });
}

// 4. Popularity Sorting
function sortByPopularity(eventsArray) {
    return [...eventsArray].sort((a, b) => {
        const scoreA = (a.rating * 10) + (a.popularity * 0.5);
        const scoreB = (b.rating * 10) + (b.popularity * 0.5);
        return scoreB - scoreA;
    });
}

// 5. Smart Sort (AI-Weighted Algorithm)
function smartSort(eventsArray) {
    const weights = {
        distance: 0.30,
        price: 0.25,
        rating: 0.25,
        popularity: 0.15,
        accessibility: 0.05
    };

    // Normalize values to 0-100 scale
    const maxDistance = Math.max(...eventsArray.map(e => parseFloat(e.distance)));
    const maxPrice = Math.max(...eventsArray.map(e => e.basePrice));

    return [...eventsArray].sort((a, b) => {
        const scoreA = 
            (1 - parseFloat(a.distance) / maxDistance) * 100 * weights.distance +
            (1 - a.basePrice / maxPrice) * 100 * weights.price +
            (a.rating / 5) * 100 * weights.rating +
            a.popularity * weights.popularity +
            (a.accessible ? 100 : 0) * weights.accessibility;
        
        const scoreB = 
            (1 - parseFloat(b.distance) / maxDistance) * 100 * weights.distance +
            (1 - b.basePrice / maxPrice) * 100 * weights.price +
            (b.rating / 5) * 100 * weights.rating +
            b.popularity * weights.popularity +
            (b.accessible ? 100 : 0) * weights.accessibility;

        return scoreB - scoreA;
    });
}

// ========== FILTERING ==========

function filterEventsByGenre(genre) {
    currentGenreFilter = genre;
    const eventsWithDistance = addDistanceToEvents();
    
    if (genre === 'all') {
        filteredEvents = eventsWithDistance;
    } else {
        filteredEvents = eventsWithDistance.filter(event => event.genre === genre);
    }
    
    applySorting();
}

// ========== MAP FUNCTIONALITY ==========

function initializeMap() {
    // Initialize Leaflet map
    map = L.map('map').setView([userLocation.lat, userLocation.lng], 12);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);

    // Add user location marker
    userMarker = L.marker([userLocation.lat, userLocation.lng], {
        icon: L.divIcon({
            className: 'user-marker',
            html: '<div style="background: #2ecc71; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>'
        })
    }).addTo(map);
    userMarker.bindPopup(`<b>Your Location</b><br>${userLocation.name}`);

    addEventMarkersToMap();
}

function addEventMarkersToMap() {
    // Clear existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    // Add markers for filtered events
    filteredEvents.forEach(event => {
        const marker = L.marker([event.location.lat, event.location.lng], {
            icon: L.divIcon({
                className: 'event-marker',
                html: `<div style="background: #3498db; width: 30px; height: 30px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">${event.icon}</div>`
            })
        }).addTo(map);

        marker.bindPopup(`
            <div style="min-width: 200px;">
                <h3 style="margin: 0 0 10px 0; color: #c0392b;">${event.title}</h3>
                <p style="margin: 5px 0;"><strong>Venue:</strong> ${event.venue}</p>
                <p style="margin: 5px 0;"><strong>Distance:</strong> ${event.distance} km</p>
                <p style="margin: 5px 0;"><strong>Price:</strong> ₹${event.basePrice}</p>
                <p style="margin: 5px 0;"><strong>Rating:</strong> ${event.rating}/5 ⭐</p>
            </div>
        `);

        markers.push(marker);
    });
}

// ========== UI RENDERING ==========

function renderEventCards() {
    const grid = document.getElementById('eventsGrid');
    grid.innerHTML = '';

    filteredEvents.forEach(event => {
        const card = document.createElement('div');
        card.className = 'event-card';
        
        card.innerHTML = `
            <div class="event-image">${event.icon}</div>
            <div class="event-content">
                <h3 class="event-title">${event.title}</h3>
                <div class="event-meta">
                    <div class="meta-item">
                        <i class="fas fa-map-marker-alt"></i>
                        ${event.venue} - ${event.distance} km away
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-map"></i>
                        ${event.address}
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-clock"></i>
                        ${event.timeSlots.join(', ')}
                    </div>
                </div>
                <div class="event-badges">
                    <span class="badge badge-genre">${event.subGenre}</span>
                    <span class="badge badge-language">${event.language}</span>
                    ${event.accessible ? '<span class="badge badge-accessible"><i class="fas fa-wheelchair"></i> Accessible</span>' : ''}
                </div>
                <div class="event-footer">
                    <div class="price">₹${event.basePrice}</div>
                    <div class="rating">
                        <i class="fas fa-star"></i>
                        ${event.rating}
                    </div>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });

    updateStatistics();
}

function updateStatistics() {
    const eventCount = filteredEvents.length;
    const avgDistance = (filteredEvents.reduce((sum, e) => sum + parseFloat(e.distance), 0) / eventCount).toFixed(1);
    const avgPrice = Math.round(filteredEvents.reduce((sum, e) => sum + e.basePrice, 0) / eventCount);
    const avgRating = (filteredEvents.reduce((sum, e) => sum + e.rating, 0) / eventCount).toFixed(1);

    document.getElementById('eventCount').textContent = eventCount;
    document.getElementById('avgDistance').textContent = avgDistance;
    document.getElementById('avgPrice').textContent = avgPrice;
    document.getElementById('avgRating').textContent = avgRating;
}

// ========== EVENT HANDLERS ==========

function applySorting() {
    const sortMethod = document.getElementById('sortMethod').value;
    
    switch(sortMethod) {
        case 'proximity':
            filteredEvents = sortByProximity(filteredEvents);
            break;
        case 'budget':
            filteredEvents = sortByBudget(filteredEvents);
            break;
        case 'accessibility':
            filteredEvents = sortByAccessibility(filteredEvents);
            break;
        case 'popularity':
            filteredEvents = sortByPopularity(filteredEvents);
            break;
        case 'smart':
        default:
            filteredEvents = smartSort(filteredEvents);
            break;
    }

    renderEventCards();
    addEventMarkersToMap();
}

function setupEventListeners() {
    // Sort method change
    document.getElementById('sortMethod').addEventListener('change', applySorting);

    // Genre filter tags
    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', function() {
            document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            filterEventsByGenre(this.getAttribute('data-genre'));
        });
    });

    // Detect location button
    document.getElementById('detectLocation').addEventListener('click', function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        name: "Your Current Location"
                    };
                    document.getElementById('locationInput').value = userLocation.name;
                    
                    // Update map
                    map.setView([userLocation.lat, userLocation.lng], 12);
                    if (userMarker) map.removeLayer(userMarker);
                    userMarker = L.marker([userLocation.lat, userLocation.lng], {
                        icon: L.divIcon({
                            className: 'user-marker',
                            html: '<div style="background: #2ecc71; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>'
                        })
                    }).addTo(map);
                    userMarker.bindPopup(`<b>Your Location</b><br>${userLocation.name}`);

                    // Re-apply sorting with new location
                    filterEventsByGenre(currentGenreFilter);
                },
                error => {
                    alert('Unable to retrieve your location. Using default location.');
                }
            );
        } else {
            alert('Geolocation is not supported by your browser.');
        }
    });
}

// ========== INITIALIZATION ==========

function init() {
    console.log('Initializing BookMyShow Enhanced Sorting...');
    
    // Initialize map
    initializeMap();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initial load with smart sort
    filterEventsByGenre('all');
    
    console.log('Application initialized successfully!');
}

// Start the application when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
