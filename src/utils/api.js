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

import { Platform } from 'react-native';

export const BASE_URL = 'https://scholarsense-backend-28yf.onrender.com';

/** Helper to get full avatar image URL from foto_profil string */
export function getAvatarUrl(fotoProfil) {
  if (!fotoProfil) return null;
  if (fotoProfil.startsWith('http://') || fotoProfil.startsWith('https://')) {
    return fotoProfil;
  }
  return `${BASE_URL}${fotoProfil.startsWith('/') ? '' : '/'}${fotoProfil}`;
}

/** Helper to calculate percentage score from answers array or jawaban_raw object */
export function calculateAnswerScore(jawabanRawOrAnswers) {
  if (!jawabanRawOrAnswers) return null;

  if (Array.isArray(jawabanRawOrAnswers)) {
    if (jawabanRawOrAnswers.length === 0) return 0;
    const yaCount = jawabanRawOrAnswers.filter((a) => (typeof a === 'object' ? a.answer === true : a === true)).length;
    return Math.round((yaCount / jawabanRawOrAnswers.length) * 100);
  }

  if (typeof jawabanRawOrAnswers === 'object') {
    const vals = Object.values(jawabanRawOrAnswers);
    if (vals.length === 0) return 0;
    const yaCount = vals.filter(Boolean).length;
    return Math.round((yaCount / vals.length) * 100);
  }

  return null;
}

/** Helper to calculate real behavior percentage score for a consultation item */
export function getRealProfileScore(item) {
  if (!item) return 0;

  // 1. Precalculated score if available
  if (item.calculated_score !== undefined && item.calculated_score !== null) {
    return item.calculated_score;
  }

  // 2. Calculate directly from answers / jawaban_raw if present
  const scoreFromAnswers = calculateAnswerScore(item.answers || item.jawaban_raw);
  if (scoreFromAnswers !== null) {
    return scoreFromAnswers;
  }

  // 3. Fallback to persentase_utama if available
  if (item.persentase_utama !== undefined && item.persentase_utama !== null) {
    return Math.round(item.persentase_utama);
  }

  return 0;
}

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
// 1. AUTH & PROFILE
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

/** GET /api/v1/auth/profile [PROTECTED] */
export async function apiGetProfile(token) {
  return apiRequest('GET', '/api/v1/auth/profile', { token });
}

/** POST /api/v1/auth/logout [PROTECTED] */
export async function apiLogout(token) {
  return apiRequest('POST', '/api/v1/auth/logout', { token });
}

/** PUT /api/v1/auth/profile [PROTECTED] */
export async function apiUpdateProfile(token, { nama_lengkap, nim, email }) {
  return apiRequest('PUT', '/api/v1/auth/profile', {
    token,
    body: { nama_lengkap, nim, email },
  });
}

/** POST /api/v1/auth/profile/avatar [PROTECTED] (multipart/form-data) */
export async function apiUploadAvatar(token, fileUri) {
  const url = `${BASE_URL}/api/v1/auth/profile/avatar`;
  const formData = new FormData();

  const filename = fileUri.split('/').pop() || 'avatar.png';
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1].toLowerCase()}` : `image/png`;

  formData.append('file', {
    uri: Platform.OS === 'android' ? fileUri : fileUri.replace('file://', ''),
    name: filename,
    type: type,
  });

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });
    const json = await res.json().catch(() => null);

    if (!res.ok) {
      if (json?.detail && Array.isArray(json.detail)) {
        const msgs = json.detail.map((d) => d.msg).join('. ');
        throw new Error(msgs || 'Validasi gagal.');
      }
      throw new Error(json?.message || json?.detail || `Upload gagal (${res.status})`);
    }

    return json;
  } catch (err) {
    if (err.message === 'Network request failed') {
      throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
    }
    throw err;
  }
}

/** PUT /api/v1/auth/profile/password [PROTECTED] */
export async function apiChangePassword(token, { current_password, new_password, konfirmasi_password }) {
  return apiRequest('PUT', '/api/v1/auth/profile/password', {
    token,
    body: { current_password, new_password, konfirmasi_password },
  });
}

/** DELETE /api/v1/auth/profile [PROTECTED] */
export async function apiDeleteAccount(token) {
  return apiRequest('DELETE', '/api/v1/auth/profile', { token });
}

// ---------------------------------------------------------------------------
// 2. DASHBOARD
// ---------------------------------------------------------------------------

/** GET /api/v1/dashboard [PROTECTED] */
export async function apiGetDashboard(token) {
  return apiRequest('GET', '/api/v1/dashboard', { token });
}

// ---------------------------------------------------------------------------
// 3. CONSULTATIONS (Kuesioner + Forward Chaining)
// ---------------------------------------------------------------------------

/** GET /api/v1/consultations/questions [PROTECTED] */
export async function apiGetQuestions(token) {
  return apiRequest('GET', '/api/v1/consultations/questions', { token });
}

/**
 * POST /api/v1/consultations/submit [PROTECTED]
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

/** GET /api/v1/history [PROTECTED] */
export async function apiGetHistory(token) {
  return apiRequest('GET', '/api/v1/history', { token });
}

/** GET /api/v1/history/:consultation_id [PROTECTED] */
export async function apiGetHistoryDetail(token, consultationId) {
  return apiRequest('GET', `/api/v1/history/${consultationId}`, { token });
}

// ---------------------------------------------------------------------------
// 5. CHATBOT (Jhoko AI)
// ---------------------------------------------------------------------------

/** GET /api/v1/chatbot/:consultation_id/history [PROTECTED] */
export async function apiGetChatHistory(token, consultationId) {
  return apiRequest('GET', `/api/v1/chatbot/${consultationId}/history`, { token });
}

/** POST /api/v1/chatbot/:consultation_id/message [PROTECTED] */
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

