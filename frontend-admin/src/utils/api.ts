// Base URL for the backend API
export const API_BASE_URL = "http://localhost:3001";

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
