import { timingSafeEqual } from 'node:crypto';

export function familyPath(path) {
  return path.startsWith('/family-') || path.startsWith('/data/branches/') ||
    path === '/history-connection.js' || path === '/images/pignatelli-coat-of-arms.png';
}

function privateResponse(body, status, headers = {}) {
  return new Response(body, {status, headers: {
    'Cache-Control': 'private, no-store',
    'X-Robots-Tag': 'noindex, nofollow, noarchive',
    'Referrer-Policy': 'no-referrer',
    'X-Content-Type-Options': 'nosniff', ...headers
  }});
}

function credentials(header) {
  if (!header || header.length > 2048) return null;
  const match = /^Basic ([A-Za-z0-9+/]+={0,2})$/i.exec(header);
  if (!match) return null;
  try {
    const decoded = new TextDecoder('utf-8', {fatal: true}).decode(
      Uint8Array.from(atob(match[1]), c => c.charCodeAt(0)));
    const i = decoded.indexOf(':');
    return i < 0 ? null : [decoded.slice(0, i), decoded.slice(i + 1)];
  } catch { return null; }
}

async function matches(a, b) {
  const encode = new TextEncoder();
  const [x, y] = await Promise.all([a, b].map(v => crypto.subtle.digest('SHA-256', encode.encode(v))));
  return timingSafeEqual(new Uint8Array(x), new Uint8Array(y));
}

export async function handle(request, env, originFetch = fetch) {
  const url = new URL(request.url);
  let path;
  try { path = decodeURIComponent(url.pathname); }
  catch { return privateResponse('Invalid URL', 400); }
  // Never forward a family's Basic credential to the public origin.
  const cleanHeaders = new Headers(request.headers);
  cleanHeaders.delete('Authorization');
  const cleanRequest = new Request(request, {headers: cleanHeaders});
  if (!familyPath(path)) return originFetch(cleanRequest);
  if (url.protocol !== 'https:') {
    url.protocol = 'https:';
    return privateResponse(null, 308, {Location: url.href});
  }
  if (!env.FAMILY_PASSWORD || env.FAMILY_PASSWORD.length < 16 || !env.ASSETS) {
    return privateResponse('Family access is being configured. Accesso in preparazione.', 503);
  }
  const pair = credentials(request.headers.get('Authorization'));
  if (!pair || !(await matches(pair[0] + ':' + pair[1], 'famiglia:' + env.FAMILY_PASSWORD))) {
    return privateResponse('Family sign-in required. Accesso riservato alla famiglia.', 401, {
      'WWW-Authenticate': 'Basic realm="Famiglia Pignatelli", charset="UTF-8"'
    });
  }
  if (!['GET', 'HEAD'].includes(request.method)) return privateResponse('Method not allowed', 405, {Allow: 'GET, HEAD'});
  // Serve only the private asset bundle. Never fall back to public GitHub Pages.
  const assetURL = new URL(request.url);
  assetURL.pathname = path;
  const response = await env.ASSETS.fetch(new Request(assetURL, {method: request.method}));
  const headers = new Headers(response.headers);
  headers.set('Cache-Control', 'private, no-store');
  headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  headers.set('Referrer-Policy', 'no-referrer');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.delete('Access-Control-Allow-Origin');
  return new Response(response.body, {status: response.status, headers});
}

export default {fetch(request, env) { return handle(request, env); }};
