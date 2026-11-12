
const API_BASE_URL = "https://route-posts.routemisr.com";
const TOKEN_KEY = "vibely-token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const result = await response.json().catch(() => null);

  if (!response.ok || result?.success === false) {
    const details = Array.isArray(result?.errors)
      ? result.errors.join(" ")
      : "";

    throw new Error(
      [result?.message, details].filter(Boolean).join(" — ") ||
        `Request failed (${response.status})`
    );
  }

  return result;
}
