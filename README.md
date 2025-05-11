# 🎬 Movie Explorer App

<div align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <img src="https://img.shields.io/badge/license-MIT-yellow.svg" />
  <img src="https://img.shields.io/badge/react-19.0.0-61DAFB.svg" />
  <img src="https://img.shields.io/badge/made%20with-love-red.svg" />
  <br />
  <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" />
  <img src="https://img.shields.io/badge/material--ui-%230081CB.svg?style=for-the-badge&logo=material-ui&logoColor=white" />
  <img src="https://img.shields.io/badge/axios-%23000000.svg?style=for-the-badge&logo=axios&logoColor=white" />
  <img src="https://img.shields.io/badge/react%20router-%23CA4245.svg?style=for-the-badge&logo=react-router&logoColor=white" />
  <img src="https://img.shields.io/badge/TMDB-01D277?style=for-the-badge&logo=themoviedatabase&logoColor=white" />
  <img src="https://img.shields.io/badge/context--api-%23663399.svg?style=for-the-badge&logo=react&logoColor=white" />
</div>

<p align="center">
  <img src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3" alt="Movie Explorer Banner" width="1200" height="400" />
</p>

## 📋 Overview

A modern React application that allows users to search and browse movies using the TMDb API. This app features a sleek Material UI interface, responsive design, and various features like user authentication, favorites management, and dark/light mode toggle for an exceptional movie browsing experience.

## ✨ Features

### 👤 For Users
- **Movie Search & Discovery**: Find movies with advanced filters by year, genre, or rating
- **Trending Movies**: Browse what's popular right now in the movie world
- **Detailed Movie Pages**: View comprehensive movie information including trailers, cast, and similar movies
- **Responsive Design**: Fully responsive interface optimized for mobile, tablet, and desktop
- **Authentication**: Simple login with username/password for personalized experience
- **Favorites Management**: Save your favorite movies for quick access later
- **Dark/Light Mode**: Choose your preferred visual theme for comfortable browsing

### 🎬 Movie Features
- **HD Video Quality Indicators**: Easily see which movies are available in high definition
- **Rating System**: Browse movies by their ratings and popularity
- **Cast Information**: View the actors and crew behind your favorite films
- **Interactive Trailers**: Watch movie trailers directly within the app
- **Similar Movies**: Discover related films you might enjoy
- **Genre Filtering**: Browse movies by specific genres
- **Uniform Card Layout**: Consistent movie cards for a clean browsing experience

## 🛠️ Technology Stack

### Frontend
- **React 19**: Latest version of the popular JavaScript library
- **React Router v7**: For seamless navigation between pages
- **Material UI v7**: Modern component library for sleek UI elements
- **Axios**: Promise-based HTTP client for API requests
- **Context API**: State management across the application
- **TMDb API**: Rich source of movie data and metadata
- **localStorage**: For persistent favorites and user settings

## 📁 Project Structure

```
movie-explorer-app/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Layout.js    # Main application layout
│   │   ├── MovieCard.js # Movie presentation card
│   │   ├── SearchBar.js # Search functionality 
│   │   └── ...          # Other components
│   ├── contexts/        # React Context providers
│   │   ├── ThemeContext.js  # Dark/light mode management
│   │   ├── MovieContext.js  # Movie data management
│   │   └── AuthContext.js   # User authentication state
│   ├── hooks/           # Custom React hooks
│   │   ├── useMovies.js     # Movie API interactions
│   │   ├── useFavorites.js  # Favorites management
│   │   └── useTheme.js      # Theme preference hook
│   ├── pages/           # Page components
│   │   ├── HomePage.js        # Main landing page
│   │   ├── MovieDetailsPage.js # Individual movie details
│   │   ├── FavoritesPage.js    # User's saved movies
│   │   └── ...                 # Other pages
│   ├── services/        # API services
│   │   └── tmdbApi.js   # TMDb API interaction layer
│   ├── utils/           # Utility functions
│   │   └── helpers.js   # Formatting and helper functions
│   └── assets/          # Static assets
│       └── images/      # Images and icons
├── public/              # Public assets
└── package.json         # Dependencies
```


## 📱 Key Screens

### 🏠 Home Page
- Trending movies section
- Popular movies carousel
- Top-rated films collection
- Upcoming movies preview
- Filter controls for discovery

### 🎞️ Movie Details Page
- Full movie information and metadata
- Cast and crew information
- Similar movie recommendations
- Trailer viewing capability
- Add to favorites functionality

### ❤️ Favorites Page
- Collection of user's saved movies
- Remove from favorites functionality
- Persistent across sessions

### 🔍 Search Results Page
- Filter controls
- Responsive grid layout
- Load more functionality
- Clear search options

## 📝 Notes

- For demonstration purposes, the login functionality allows any non-empty username and password.
- In a real application, you would implement proper authentication with a backend service.
- Favorites are stored in localStorage based on the user's username.

## 🔮 Future Features

- **User Reviews**: Ability to leave and read reviews for movies
- **Watchlist Management**: Create and manage a to-watch list
- **Advanced Filtering**: More sophisticated search and filter options
- **Social Sharing**: Share movies with friends via social media
- **Personalized Recommendations**: AI-powered movie suggestions
- **Multiple Languages**: Support for international users
- **Offline Mode**: Basic functionality when internet is unavailable
- **User Statistics**: Track viewing history and preferences

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">Made with ❤️ </p>
