/* ==========================================================================
   CrypEduGo — Supabase client + shared auth/session helpers
   Loaded on every page via <script type="module" src="assets/js/supabase-client.js">
   ========================================================================== */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://rbncpakigxzbstefisgd.supabase.co';
// Publishable key only — safe to expose in frontend code. Row Level Security on
// every table (see backend migrations) is what actually enforces access control,
// not the secrecy of this key. The service_role key must NEVER appear in any
// frontend file — it lives only in the Supabase Edge Function / webhook environment.
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_XFRsJzrx35nobAiGaxehpg_ugez4hu2';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/* ---- Escape any user-generated text before injecting into innerHTML (XSS defense) ---- */
export function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ---- Format cents as a currency string, e.g. 14900 -> "€149" ---- */
export function formatPrice(cents, currency = 'USD') {
  const symbols = { USD: '$', EUR: '€', GBP: '£' };
  const symbol = symbols[currency] || currency + ' ';
  const value = cents / 100;
  return symbol + (value % 1 === 0 ? value.toFixed(0) : value.toFixed(2));
}

/* ---- Shared cart (localStorage array of course IDs) ---- */
const CART_KEY = 'crypedugo_cart';

export function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch (e) { return []; }
}

export function addToCart(courseId) {
  const cart = getCart();
  if (!cart.includes(courseId)) {
    cart.push(courseId);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }
  return cart;
}

export function removeFromCart(courseId) {
  const cart = getCart().filter(id => id !== courseId);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  return cart;
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
}

/* ---- Bundle purchase: remembers which bundle (if any) the current cart came from,
   so checkout can pass it to create_order() for the bundle discount. ---- */
const BUNDLE_KEY = 'crypedugo_bundle_id';

export function setPendingBundle(bundleId) {
  localStorage.setItem(BUNDLE_KEY, bundleId);
}

export function getPendingBundle() {
  return localStorage.getItem(BUNDLE_KEY);
}

export function clearPendingBundle() {
  localStorage.removeItem(BUNDLE_KEY);
}

/* ---- Post-login destination: if the visitor arrived via a course promo
   (e.g. the homepage free-trial popup), send them straight into that course
   on their first login instead of the generic dashboard. One-time use. ---- */
const INTENDED_COURSE_KEY = 'crypedugo_intended_course';

export function getPostLoginRedirect() {
  const slug = localStorage.getItem(INTENDED_COURSE_KEY);
  if (!slug) return 'dashboard.html';
  localStorage.removeItem(INTENDED_COURSE_KEY);
  return 'course-player.html?slug=' + encodeURIComponent(slug);
}

/* ---- Get the current session's user + profile (role, name, etc.), or null if signed out ---- */
export async function getCurrentProfile() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, username, avatar_url, role, is_suspended')
    .eq('id', session.user.id)
    .single();
  if (error) {
    console.error('Failed to load profile', error);
    return null;
  }
  return data;
}

/* ---- Redirect to login if not signed in. Call at the top of any protected student page. ---- */
export async function requireAuth(redirectTo = 'login.html') {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = redirectTo;
    return null;
  }
  return session;
}

/* ---- Redirect away if not an admin. Call at the top of any admin-*.html page.
   This is a UX convenience only — the REAL enforcement is server-side RLS
   (is_admin() checks on every admin table/function), so even if this check were
   bypassed client-side, no admin data could actually be read or written. ---- */
export async function requireAdmin(redirectTo = 'login.html') {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== 'admin') {
    window.location.href = redirectTo;
    return null;
  }
  if (profile.is_suspended) {
    await supabase.auth.signOut();
    window.location.href = redirectTo;
    return null;
  }
  return profile;
}

/* ---- Sign out and return to the homepage ---- */
export async function signOutAndRedirect(redirectTo = 'index.html') {
  await supabase.auth.signOut();
  window.location.href = redirectTo;
}

/* ---- Wire up every element with [data-signout] to sign out on click ---- */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-signout]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      signOutAndRedirect();
    });
  });
});
