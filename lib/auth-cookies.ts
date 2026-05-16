// Set auth cookies that the server-side middleware can read
export function setAuthCookies(token: string) {
  if (typeof document === 'undefined') return;
  
  // Set cookie to expire in 24 hours
  const expirationDate = new Date();
  expirationDate.setTime(expirationDate.getTime() + (24 * 60 * 60 * 1000));
  const expires = `expires=${expirationDate.toUTCString()}`;
  
  document.cookie = `auth_token=${token}; ${expires}; path=/; SameSite=Lax`;
}

export function clearAuthCookies() {
  if (typeof document === 'undefined') return;
  document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}
