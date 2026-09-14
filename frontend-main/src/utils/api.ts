export const API_BASE_URL = 
  typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://localhost:3001"
    : "https://institute-rize.onrender.com";

// Helper to construct full API URLs
export const getApiUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`;

// Helper to make API requests
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const url = getApiUrl(endpoint);
  const response = await fetch(url, options);
  return response;
};
