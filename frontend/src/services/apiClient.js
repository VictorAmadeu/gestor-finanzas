// src/services/apiClient.js

/**
 * fetchWithTimeout
 * Realiza una petición fetch que se aborta automáticamente si excede el tiempo límite (timeout).
 *
 * @param {string} url - URL del recurso a solicitar (puede ser relativa si tienes proxy).
 * @param {object} options - Opciones estándar para fetch (headers, body, method...).
 * @param {number} timeout - Tiempo máximo en milisegundos antes de abortar (por defecto 10000 ms).
 * @returns {Promise<Response>}
 */
export async function fetchWithTimeout(url, options = {}, timeout = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(id);
  }
}
