const TOKEN_KEY = 'tickethub_manager_token';

export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

export const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};
