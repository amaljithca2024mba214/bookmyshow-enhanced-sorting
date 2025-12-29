# BookMyShow Enhanced Sorting

A smart event discovery platform with AI-powered sorting algorithms to help users find the perfect shows based on multiple criteria including proximity, pricing, accessibility, and popularity.

## Features

### 🎯 Smart Sorting Algorithms
1. **Proximity-Based Sorting** - Find events closest to your location
2. **Budget-Friendly Sorting** - Discover affordable entertainment options
3. **Accessibility-First Sorting** - Prioritize wheelchair-accessible venues
4. **Popularity Sorting** - See what's trending and highly rated
5. **Balanced Smart Sort** - AI-weighted combination of all factors

### 🎨 User Interface
- Clean, modern design inspired by BookMyShow
- Interactive map view showing venue locations
- Real-time filtering and sorting
- Detailed event cards with all relevant information
- Mobile-responsive layout

### 📊 Event Information
Each event displays:
- Title, genre, and language
- Venue name and address
- Distance from user location
- Price range (₹)
- Accessibility features
- Rating and popularity score
- Available time slots

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Mapping**: Leaflet.js for interactive maps
- **Icons**: Font Awesome
- **Data**: JSON-based sample dataset

## Installation

1. Clone the repository:
```bash
git clone https://github.com/amaljithca2024mba214/bookmyshow-enhanced-sorting.git
cd bookmyshow-enhanced-sorting
```

2. Open `index.html` in your web browser:
```bash
# Using Python 3
python -m http.server 8000

# Or using Node.js
npx http-server
```

3. Visit `http://localhost:8000` in your browser

## Usage

1. **Select Your Location**: Click on the map or use the location input to set your position
2. **Choose Sort Method**: Use the dropdown to select your preferred sorting algorithm
3. **Browse Events**: Scroll through the sorted event cards
4. **View Details**: Click on event cards for more information

## Sorting Algorithms Explained

### Proximity Sort
Sorts events by distance from user location using haversine formula.
```javascript
Distance = 2 × R × arcsin(√(sin²(Δφ/2) + cos(φ1) × cos(φ2) × sin²(Δλ/2)))
```

### Budget Sort
Prioritizes events with lower base prices, perfect for cost-conscious users.

### Accessibility Sort
Brings wheelchair-accessible venues to the top, followed by distance.

### Popularity Sort
Combines user ratings and popularity scores to show trending events.

### Smart Sort (AI-Weighted)
Balanced algorithm using multiple factors:
- Distance: 30% weight
- Price: 25% weight
- Rating: 25% weight
- Popularity: 15% weight
- Accessibility: 5% weight

## Project Structure

```
bookmyshow-enhanced-sorting/
├── index.html          # Main HTML file
├── styles.css          # Styling and layout
├── app.js             # Core application logic
├── data.js            # Sample event data
├── README.md          # Documentation
└── screenshots/       # UI screenshots (optional)
```

## Sample Data

The application includes sample data for various events:
- Movies (Bollywood, Hollywood, Regional)
- Concerts and Live Shows
- Comedy Shows
- Theatre Performances
- Sports Events

## Future Enhancements

- [ ] Real-time data integration with BookMyShow API
- [ ] User authentication and personalized recommendations
- [ ] Booking integration
- [ ] Advanced filters (date range, genre, language)
- [ ] Save favorite events
- [ ] Share events on social media
- [ ] Push notifications for nearby events
- [ ] Machine learning-based personalization

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

**Amaljith CA**
- GitHub: [@amaljithca2024mba214](https://github.com/amaljithca2024mba214)
- Project: BookMyShow Enhanced Sorting

## Acknowledgments

- Inspired by BookMyShow's user experience
- Built as part of MBA coursework on digital innovation
- Thanks to the open-source community for amazing tools

---

**Note**: This is an educational project and is not affiliated with BookMyShow.
