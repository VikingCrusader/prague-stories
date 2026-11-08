// The one account that may edit cards (2026-11-08, user's call). Usernames are
// unique, and this one is taken, so nobody else can register it.
export const ADMIN_USERNAME = 'evan';
export const isAdmin = user => user?.username === ADMIN_USERNAME;
