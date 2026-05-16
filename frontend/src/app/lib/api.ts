// Backend API URL - use environment variable or default to localhost:3001
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export const API_BASE_URL = BACKEND_URL.replace(/\/$/, "");

export const apiUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

// Generate or retrieve persistent client ID
function getClientId(): string {
  if (typeof window === "undefined") return "server-ssr";
  let clientId = localStorage.getItem("open-resume-client-id");
  if (!clientId) {
    clientId = crypto.randomUUID();
    localStorage.setItem("open-resume-client-id", clientId);
  }
  return clientId;
}

// Helper for API calls
export async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = apiUrl(endpoint);
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-client-id": getClientId(),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
