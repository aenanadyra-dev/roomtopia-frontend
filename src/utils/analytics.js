/* --------------------------------------------------------------------------
   Generic front-end analytics helper
   -------------------------------------------------------------------------- */
const SESSION_KEY = 'rt_session_id';

function getSessionId() {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = (crypto.randomUUID?.() || Date.now().toString(36));
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function send(payload) {
  const url  = '/api/analytics/track';
  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, new Blob([body], { type: 'application/json' }));
    return Promise.resolve();
  }
  return fetch(url, {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body
  });
}

export function trackEvent(type, data = {}) {
  return send({
    type,
    data,
    ts        : Date.now(),
    sessionId : getSessionId()
  }).catch((err) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Analytics tracking failed:', err);
    }
  });
}

/* --------------------------------------------------------------------------
   Convenience wrappers
   -------------------------------------------------------------------------- */
export const trackRoommateSearch = (filters) =>
  trackEvent('roommate_search', { gender: filters.gender });

export const trackRoommatePreference = (prefs) =>
  trackEvent('roommate_preference', prefs);

export const trackRoommateView       = (id)        => trackEvent('roommate_view',       { roommateId: id });
export const trackLocationSearch     = (loc)       => trackEvent('location_search',     { location: loc });

// ───────────────── track one property search ─────────────────
export const trackPropertySearch = (filters) =>
  trackEvent('property_search', { location: filters.location });

export const trackPropertyView       = (id, p, l)  => trackEvent('property_view',       { id, priceRange: p, location: l });
export const trackPropertyImageView  = (id, idx)   => trackEvent('property_image_view', { id, idx });