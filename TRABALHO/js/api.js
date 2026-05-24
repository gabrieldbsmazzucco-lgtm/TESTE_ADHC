// =====================================================
// api.js — Comunicação com o backend ADHC
// =====================================================
// Troque a URL abaixo pelo endereço real do seu backend no Railway.
// Em desenvolvimento local use: http://localhost:8080
// =====================================================

const API_BASE = 'https://SEU-BACKEND.railway.app';

// ── Helpers internos ──────────────────────────────────────────────────────

function getToken() {
  return sessionStorage.getItem('adhc_token');
}

function salvarToken(token) {
  sessionStorage.setItem('adhc_token', token);
}

function removerToken() {
  sessionStorage.removeItem('adhc_token');
}

function headersAutenticados() {
  const token = getToken();
  if (!token) throw new Error('Não autenticado. Faça login primeiro.');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

async function checarResposta(res) {
  if (res.status === 401) {
    removerToken();
    throw new Error('Sessão expirada. Faça login novamente.');
  }
  if (!res.ok) {
    const texto = await res.text().catch(() => 'Erro desconhecido.');
    throw new Error(`Erro ${res.status}: ${texto}`);
  }
  return res.json();
}

// ── Auth ──────────────────────────────────────────────────────────────────

/**
 * Faz login com usuário e senha.
 * Se bem-sucedido, salva o token na sessão.
 * @returns {Promise<void>}
 */
export async function login(usuario, senha) {
  const res = await fetch(`${API_BASE}/api/partidas/login`, {
    method: 'POST',
    headers: {
      'X-Admin-User': usuario,
      'X-Admin-Pass': senha,
    },
  });
  const data = await checarResposta(res);
  salvarToken(data.token);
}

/**
 * Remove o token da sessão (logout local).
 */
export function logout() {
  removerToken();
}

/**
 * Retorna true se houver um token salvo na sessão.
 */
export function estaAutenticado() {
  return !!getToken();
}

// ── Partidas ──────────────────────────────────────────────────────────────

/**
 * Busca todas as partidas (público, sem autenticação).
 * @returns {Promise<Partida[]>}
 */
export async function getPartidas() {
  const res = await fetch(`${API_BASE}/api/partidas`);
  return checarResposta(res);
}

/**
 * Salva (substitui) todas as partidas. Requer login.
 * @param {Partida[]} partidas
 * @returns {Promise<Partida[]>}
 */
export async function salvarPartidas(partidas) {
  const res = await fetch(`${API_BASE}/api/partidas`, {
    method: 'PUT',
    headers: headersAutenticados(),
    body: JSON.stringify(partidas),
  });
  return checarResposta(res);
}

/**
 * Restaura as partidas padrão. Requer login.
 * @returns {Promise<Partida[]>}
 */
export async function resetarPartidas() {
  const res = await fetch(`${API_BASE}/api/partidas/reset`, {
    method: 'POST',
    headers: headersAutenticados(),
  });
  return checarResposta(res);
}