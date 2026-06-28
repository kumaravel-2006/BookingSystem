import { authApi } from './api';

export const authService = {
  login: async (email, password) => {
    const res = await authApi.post('/auth/login', { email, password });
    return res.data;
  },
  register: async (name, email, password) => {
    // Specifically request the EVENT_MANAGER role
    const res = await authApi.post('/auth/register', {
      name,
      email,
      password,
      role: 'EVENT_MANAGER'
    });
    return res.data;
  }
};
