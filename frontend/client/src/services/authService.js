import axios from 'axios'
import { getToken, removeToken } from '../utils/jwtUtils'

const authApi = axios.create({
  baseURL: 'https://cinepassapi.kumaravel.online'
})

export const authService = {
  login: async (email, password) => {
    const res = await authApi.post('/auth/login', { email, password })
    return res.data
  },
  register: async (name, email, password) => {
    const res = await authApi.post('/auth/register', { name, email, password })
    return res.data
  },
  forgotPassword: async (email) => {
    const res = await authApi.post('/auth/forgot-password', { email })
    return res.data
  }
}