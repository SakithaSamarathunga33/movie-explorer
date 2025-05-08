// Format date string from API (YYYY-MM-DD) to more readable format
export const formatDate = (dateString) => {
  if (!dateString) return 'Unknown';
  
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(dateString);
  
  return date.toLocaleDateString('en-US', options);
};

// Extract year from date string (YYYY-MM-DD)
export const extractYear = (dateString) => {
  if (!dateString) return '';
  
  return dateString.split('-')[0];
};

// Format movie runtime from minutes to hours and minutes
export const formatRuntime = (minutes) => {
  if (!minutes) return 'Unknown';
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) {
    return `${remainingMinutes}m`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
};

// Format large numbers with commas (e.g., budget, revenue)
export const formatNumber = (number) => {
  if (!number) return 'Unknown';
  
  return number.toLocaleString('en-US');
};

// Truncate text with ellipsis if it exceeds maxLength
export const truncateText = (text, maxLength = 150) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength).trim() + '...';
};

// Generate a random color based on string (e.g., for genre badges)
export const stringToColor = (string) => {
  if (!string) return '#e0e0e0';
  
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  
  return color;
};

// Check if image URL is valid
export const isValidImageUrl = (url) => {
  if (!url) return false;
  return url.startsWith('https://image.tmdb.org/t/p/');
}; 