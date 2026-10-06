/**
 * Centralized API client for communicating with the Flask backend.
 */

const API_BASE = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('maternal_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

export async function login(identifier, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password })
  });
  return res.json();
}

export async function register(username, email, password) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });
  return res.json();
}

export async function getCurrentUser() {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: getAuthHeaders()
  });
  return res.json();
}

export async function predictRisk(vitals) {
  const res = await fetch(`${API_BASE}/predict`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(vitals)
  });
  return res.json();
}

export async function getPredictionHistory() {
  const res = await fetch(`${API_BASE}/history`, {
    headers: getAuthHeaders()
  });
  return res.json();
}

export async function deleteHistoryRecord(recordId) {
  const res = await fetch(`${API_BASE}/history/${recordId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return res.json();
}

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  } catch {
    return { status: 'offline' };
  }
}
