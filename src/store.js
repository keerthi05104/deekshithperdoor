import seed from './data/content.json';

const CONTENT_KEY = 'framecraft_content_v1';
const ENQUIRY_KEY = 'framecraft_enquiries_v1';
const AUTH_KEY = 'framecraft_admin_session';

function clone(value) { return JSON.parse(JSON.stringify(value)); }
export function getContent() {
  try {
    const saved = localStorage.getItem(CONTENT_KEY);
    return saved ? { ...clone(seed), ...JSON.parse(saved) } : clone(seed);
  } catch { return clone(seed); }
}
export function saveContent(content) {
  localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
  window.dispatchEvent(new Event('framecraft-content-updated'));
  return content;
}
export function getEnquiries() {
  try { return JSON.parse(localStorage.getItem(ENQUIRY_KEY) || '[]'); } catch { return []; }
}
export function saveEnquiry(enquiry) {
  const all = getEnquiries();
  all.unshift({ ...enquiry, id: crypto.randomUUID?.() || String(Date.now()), status: 'new', createdAt: new Date().toISOString() });
  localStorage.setItem(ENQUIRY_KEY, JSON.stringify(all));
  window.dispatchEvent(new Event('framecraft-enquiries-updated'));
}
export function isAdmin() { return localStorage.getItem(AUTH_KEY) === '1'; }
export function signIn(username, password) {
  // Client-only gate for local editing; it is not secure authentication.
  const expectedUser = import.meta.env.VITE_ADMIN_USERNAME || 'admin';
  const expectedPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'ChangeThisPassword123!';
  if (username !== expectedUser || password !== expectedPassword) throw new Error('Incorrect username or password.');
  localStorage.setItem(AUTH_KEY, '1');
}
export function signOut() { localStorage.removeItem(AUTH_KEY); }
export function createSlug(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `project-${Date.now()}`;
}
