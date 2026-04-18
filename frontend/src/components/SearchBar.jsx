import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchBar = ({ onSearch }) => {
  // --- STATE MANAGEMENT ---
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);

  // --- FALLBACK DATASET ---
  // A robust local dataset in case the Teleport API fails or times out
  const fallbackCities = [
    'San Francisco', 'New York', 'London', 'Berlin', 
    'Toronto', 'Sydney', 'Bangalore', 'Seattle',
    'Austin', 'Tokyo', 'Amsterdam', 'Singapore',
    'Dublin', 'Paris', 'Dubai', 'Denver', 'Delhi',
    'Dallas', 'Detroit', 'Dehradun', 'Boston', 
    'Chicago', 'Pune', 'Hyderabad', 'Mumbai', 'Chennai'
  ];

  // --- DEBOUNCE EFFECT FOR FETCHING CITIES ---
  useEffect(() => {
    // 1. Clear previous suggestions if input is empty
    if (!location) {
      setSuggestions([]);
      setShowNoResults(false);
      setIsLoading(false);
      return;
    }

    // 2. Input Validation: Ignore numbers, only allow alphabetical characters, spaces, and commas
    const isValidInput = /^[a-zA-Z\s,]+$/.test(location);
    if (!isValidInput) {
      setSuggestions([]);
      setShowNoResults(false);
      setIsLoading(false);
      return;
    }

    // 3. Debounce Logic Timer
    setIsLoading(true);
    const timeout = setTimeout(() => {
      fetchCities(location);
    }, 500);

    // 4. Cleanup function to clear the timeout on rapid keystrokes
    return () => clearTimeout(timeout);
  }, [location]);

  // --- FETCH LOGIC ---
  const fetchCities = async (query) => {
    try {
      // Primary: Attempt to fetch from Teleport API
      const { data } = await axios.get(`https://api.teleport.org/api/cities/?search=${query}&limit=5`);
      const cityResults = data._embedded['city:search-results'].map(item => item.matching_full_name);
      
      handleResults(cityResults);
    } catch (error) {
      // Error Handling: If API fails (e.g., ERR_TUNNEL_CONNECTION_FAILED), use Fallback
      console.warn("Using local city data");
      
      // Fallback Filter: Case-insensitive AND strictly Starts With user input
      const matched = fallbackCities.filter(c => 
        c.toLowerCase().startsWith(query.toLowerCase())
      );
      handleResults(matched);
    }
  };

  // --- PROCESS AND SET RESULTS ---
  const handleResults = (results) => {
    setIsLoading(false); // Stop loading indicator
    if (results.length > 0) {
      setSuggestions(results);
      setShowNoResults(false);
    } else {
      setSuggestions([]);
      setShowNoResults(true); // Trigger "No results found"
    }
  };

  // --- HANDLERS ---
  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handleSelectCity = (city) => {
    setLocation(city);
    setSuggestions([]);
    setShowNoResults(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ keyword, location });
    setSuggestions([]);
  };

  // --- HELPER FUNCTION TO HIGHLIGHT MATCHING TEXT ---
  const highlightMatch = (cityText, query) => {
    // Splits the city string to make the matched portion bold
    if (!query) return cityText;
    const regex = new RegExp(`^(${query})`, 'gi');
    const parts = cityText.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? <strong key={index} style={{ color: 'var(--primary-color)' }}>{part}</strong> : part
    );
  };

  // --- RENDER ---
  return (
    <form onSubmit={handleSubmit} className="search-form">
      {/* Keyword Input */}
      <div className="search-input-group">
        <input
          type="text"
          placeholder="Job title, keywords, or company"
          className="search-input"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>
      
      {/* City Location Autocomplete Input */}
      <div className="search-input-group">
        <input
          type="text"
          placeholder="City, state, or zip"
          className="search-input"
          value={location}
          onChange={handleLocationChange}
        />
        
        {/* Loading Indicator */}
        {isLoading && (
          <div style={{ position: 'absolute', right: '10px', top: '35%', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Loading...
          </div>
        )}

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((city, idx) => (
              <li 
                key={idx} 
                onClick={() => handleSelectCity(city)}
              >
                {highlightMatch(city, location)}
              </li>
            ))}
          </ul>
        )}

        {/* No Results Fallback UI */}
        {showNoResults && location && !isLoading && (
          <ul className="suggestions-list" style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
            <li>No results found</li>
          </ul>
        )}
      </div>

      <button type="submit" className="btn-primary">
        Find Jobs
      </button>
    </form>
  );
};

export default SearchBar;
