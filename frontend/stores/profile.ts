import { defineStore } from 'pinia'

interface UserProfile {
  id: string
  name: string
  email: string
  age: number
}

interface ProfileState {
  profile: UserProfile | null
  loading: boolean
  error: string | null
}

export const useProfileStore = defineStore('profile', {
  state: (): ProfileState => ({
    profile: null,
    loading: false,
    error: null
  }),

  getters: {
    getProfile: (state) => state.profile
  },

  actions: {
    async fetchProfile() {
      try {
        this.loading = true
        this.error = null
        const config = useRuntimeConfig()
        const token = localStorage.getItem('token')
        
        if (!token) {
          throw new Error('No token found')
        }

        this.profile = await $fetch<UserProfile>(`${config.public.apiBase}/users/profile`, {
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

    async updateProfile(profileData: Partial<UserProfile>) {
      try {
        this.loading = true
        this.error = null
        const config = useRuntimeConfig()
        const token = localStorage.getItem('token')
        
        if (!token) {
          throw new Error('No token found')
        }

        this.profile = await $fetch<UserProfile>(`${config.public.apiBase}/users/profile`, {
          method: 'PUT',
          body: profileData,
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      } catch (error: any) {
        this.error = error.message || 'Error al actualizar perfil'
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) 