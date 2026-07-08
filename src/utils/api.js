/**
 * =============================================================================
 * API CLIENT – ScholarSense Backend
 * =============================================================================
 * Modul terpusat untuk berkomunikasi dengan backend FastAPI yang di-deploy di
 * Render. Setiap fungsi meng-handle JSON serialization, token injection, dan
 * error formatting secara konsisten.
 *
 * Base URL production: https://scholarsense-backend-28yf.onrender.com
 * Prefix semua endpoint: /api/v1
 * Auth: JWT Bearer token via header "Authorization: Bearer <token>"
 * =============================================================================
 */

const BASE_URL = 'https://scholarsense-backend-28yf.onrender.com';

// ---------------------------------------------------------------------------
// Generic request helper
// ---------------------------------------------------------------------------
async function apiRequest(method, path, { body = null, token = null } = {}) {
  const url = `${BASE_URL}${path}`;

  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = { method, headers };
  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(url, config);
    const json = await res.json().catch(() => null);

    if (!res.ok) {
      // Backend returns validation errors in { detail: [...] } format
      if (json?.detail && Array.isArray(json.detail)) {
        const msgs = json.detail.map((d) => d.msg).join('. ');
        throw new Error(msgs || 'Validasi gagal.');
      }
      throw new Error(json?.message || json?.detail || `Request gagal (${res.status})`);
    }

    return json;
  } catch (err) {
    if (err.message === 'Network request failed') {
      throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
    }
    throw err;
  }
}

// ---------------------------------------------------------------------------
// 1. AUTH
// ---------------------------------------------------------------------------

/** POST /api/v1/auth/register */
export async function apiRegister({ nama_lengkap, nim, email, password, konfirmasi_password }) {
  return apiRequest('POST', '/api/v1/auth/register', {
    body: { nama_lengkap, nim, email, password, konfirmasi_password },
  });
}

/** POST /api/v1/auth/login */
export async function apiLogin({ nim_or_email, password }) {
  return apiRequest('POST', '/api/v1/auth/login', {
    body: { nim_or_email, password },
  });
}

/** GET /api/v1/auth/profile */
export async function apiGetProfile(token) {
  return apiRequest('GET', '/api/v1/auth/profile', { token });
}

/** POST /api/v1/auth/logout */
export async function apiLogout(token) {
  return apiRequest('POST', '/api/v1/auth/logout', { token });
}

// ---------------------------------------------------------------------------
// 2. DASHBOARD
// ---------------------------------------------------------------------------

/** GET /api/v1/dashboard */
export async function apiGetDashboard(token) {
  return apiRequest('GET', '/api/v1/dashboard', { token });
}

// ---------------------------------------------------------------------------
// 3. CONSULTATIONS (Kuesioner + Forward Chaining)
// ---------------------------------------------------------------------------

/** GET /api/v1/consultations/questions */
export async function apiGetQuestions(token) {
  return apiRequest('GET', '/api/v1/consultations/questions', { token });
}

/**
 * POST /api/v1/consultations/submit
 * @param {string} token
 * @param {Array<{question_id: number, answer: boolean}>} answers – 15 jawaban
 */
export async function apiSubmitConsultation(token, answers) {
  return apiRequest('POST', '/api/v1/consultations/submit', {
    token,
    body: { answers },
  });
}

// ---------------------------------------------------------------------------
// 4. HISTORY
// ---------------------------------------------------------------------------

/** GET /api/v1/history */
export async function apiGetHistory(token) {
  return apiRequest('GET', '/api/v1/history', { token });
}

/** GET /api/v1/history/:consultation_id */
export async function apiGetHistoryDetail(token, consultationId) {
  return apiRequest('GET', `/api/v1/history/${consultationId}`, { token });
}

// ---------------------------------------------------------------------------
// 5. CHATBOT (Jhoko AI)
// ---------------------------------------------------------------------------

/** GET /api/v1/chatbot/:consultation_id/history */
export async function apiGetChatHistory(token, consultationId) {
  return apiRequest('GET', `/api/v1/chatbot/${consultationId}/history`, { token });
}

/** POST /api/v1/chatbot/:consultation_id/message */
export async function apiSendChatMessage(token, consultationId, message) {
  return apiRequest('POST', `/api/v1/chatbot/${consultationId}/message`, {
    token,
    body: { message },
  });
}

// ---------------------------------------------------------------------------
// 6. HEALTH
// ---------------------------------------------------------------------------

/** GET /api/v1/health */
export async function apiHealthCheck() {
  return apiRequest('GET', '/api/v1/health');
}
