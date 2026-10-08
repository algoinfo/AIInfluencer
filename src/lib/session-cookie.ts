export const SESSION_COOKIE = "genjutsu_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export function sessionExpiryIso() {
  return new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000).toISOString();
}
