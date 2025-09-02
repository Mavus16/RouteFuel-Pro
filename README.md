<<<<<<< HEAD
# FuelCalc - Route Fuel Calculator

A modern React application for calculating fuel costs and finding gas stations along routes. Built with React, TypeScript, Tailwind CSS, and Google Maps integration.

## Features

- **Route Planning**: Input origin, destination, and optional intermediate stops
- **Google Places Autocomplete**: City selection with real-time suggestions
- **Fuel Cost Calculation**: Calculate fuel consumption and costs based on vehicle weight
- **Gas Station Finder**: Find and display gas stations along the route
- **Interactive Map**: Visualize the route with Google Maps integration
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark/Light Theme**: Toggle between themes with persistent preference

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Custom Design System
- **Routing**: React Router DOM
- **Maps**: Google Maps JavaScript API
- **Icons**: Lucide React
- **State Management**: React Hooks + localStorage

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Google Maps API Key

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fuelcalc
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Google Maps API**
   - Get a Google Maps API key from the [Google Cloud Console](https://console.cloud.google.com/)
   - Enable the following APIs:
     - Maps JavaScript API
     - Places API
Added Vite environment variable (VITE_GOOGLE_MAPS_API_KEY) import in index.html for API key management.

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Usage

### Input Page (`/`)
1. Enter your **Origin** city using the autocomplete
2. Enter your **Destination** city using the autocomplete
3. Optionally add **Intermediate Stops** (cities along the way)
4. Select your **Fuel Type** (diesel or petrol)
5. Choose your **Weight** range (10k to 80k lbs)
6. Click **"Calculate Route"** to submit

### Results Page (`/results`)
- View route summary with distance, duration, and fuel information
- See gas stations along the route with ratings and price levels
- Interactive map showing the route and stop locations
- Click **"Start a New Search"** to calculate a new route

## API Integration

The application integrates with the following webhook endpoint:
```
POST https://manav-n8n.duckdns.org/webhook-test/calc
```

**Request Body:**
```json
{
  "origin": "Dallas, TX",
  "destination": "Houston, TX",
  "intermediates": ["San Antonio, TX"],
  "fuelType": "diesel",
  "weight": 80000
}
```

**Response:**
```json
{
  "routeSummary": "Dallas, TX → San Antonio, TX → Houston, TX",
  "distance": 240.5,
  "adjustedDuration": 180,
  "fuelGallons": 45.2,
  "fuelCost": 135.60,
  "state": "Texas",
  "fuelPricePerGallon": 3.00,
  "stops": [...],
  "encodedPolyline": "..."
}
```

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Breadcrumbs.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Combobox.tsx
│       ├── PlacesAutocomplete.tsx
│       ├── Map.tsx
│       └── StopCard.tsx
├── pages/
│   ├── InputPage.tsx
│   └── ResultsPage.tsx
├── lib/
│   ├── api.ts
│   ├── types.ts
│   └── utils.ts
├── App.tsx
├── main.tsx
└── index.css
```

## Design System

The application follows a custom design system defined in `design.json` with:
- **Color Palette**: Primary, secondary, accent, and semantic colors
- **Typography**: Consistent font sizes and weights
- **Spacing**: Standardized spacing scale
- **Components**: Reusable UI components with consistent styling
- **Accessibility**: WCAG AA compliant with proper focus states

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

No environment variables are required for basic functionality. The Google Maps API key is configured directly in the HTML file.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request


=======
# RouteFuel-Pro
A fuel cost and route planner for US truck drivers. Save 10–15% on annual fuel costs with optimized routes that account for vehicle weight and fuel type. Get real-time fuel stop pricing and a visual map for efficient planning. Built with a Vercel frontend and n8n backend automation.
>>>>>>> 
