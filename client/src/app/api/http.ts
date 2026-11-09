const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1';
export const TOKEN_LOCAL_STORAGE_NAME = 'v1_chronicleFlow_token';

export async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}`} : {}),
      ...init?.headers },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}