import { defineStore } from 'pinia'

interface User {
  id: string
  name: string
  email: string
  age: number
}

interface AuthResponse {
  token: string
  user: User
}

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user
  },

  actions: {
    async login(credentials: { email: string; password: string }) {
      try {
        this.loading = true
        this.error = null
        const config = useRuntimeConfig()
        const response = await $fetch<AuthResponse>(`${config.public.apiBase}/auth/login`, {
          method: 'POST',
          body: credentials
        })
        
        this.token = response.token
        this.user = response.user
        localStorage.setItem('token', response.token)
      } catch (error: any) {
        this.error = error.message || 'Error al iniciar sesión'
        throw error
      } finally {
        this.loading = false
      }
    },

    async register(userData: { name: string; email: string; password: string; age: number }) {
      try {
        this.loading = true
        this.error = null
        const config = useRuntimeConfig()
        const response = await $fetch<AuthResponse>(`${config.public.apiBase}/auth/register`, {
          method: 'POST',
          body: userData
        })
        
        this.token = response.token
        this.user = response.user
        localStorage.setItem('token', response.token)
      } catch (error: any) {
        this.error = error.message || 'Error al registrar usuario'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchProfile() {
      try {
        this.loading = true
        this.error = null
        const config = useRuntimeConfig()
        const token = localStorage.getItem('token')
        
        if (!token) {
          throw new Error('No token found')
        }

        this.user = await $fetch<User>(`${config.public.apiBase}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      } catch (error: any) {
        this.error = error.message || 'Error al obtener perfil'
        throw error
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
    }
  }
}) 