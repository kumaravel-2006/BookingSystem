import { createContext, useContext, useEffect } from 'react'
import { useAuthStore } from '../store/authSlice'
import { getToken, setToken, removeToken, decodeToken } from '../utils/jwtUtils'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const { user, setUser, clearUser } = useAuthStore()

  useEffect(() => {
    const token = getToken()
    if (token) {
      const decoded = decodeToken(token)
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setUser(decoded)
      } else {
        removeToken()
      }
    }
  }, [])
  const login = async (email, password) => {
    const data = await authService.login(email, password)
    setToken(data.token)
    const decoded = decodeToken(data.token)
    setUser(decoded)
    return decoded
  }

  const register = async (name, email, password) => {
    const data = await authService.register(name, email, password)
    setToken(data.token)
    const decoded = decodeToken(data.token)
    setUser(decoded)
    return decoded
  }

  const logout = () => {
    removeToken()
    clearUser()
  }



  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}