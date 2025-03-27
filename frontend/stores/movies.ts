import { defineStore } from 'pinia'

interface Movie {
  id: string
  title: string
  director: string
  year: number
  genre: string
  duration: number
  rating: number
  synopsis: string
  image: string
}

interface Review {
  id: string
  userId: string
  movieId: string
  rating: number
  comment: string
  createdAt: string
  updatedAt: string
}

interface MoviesState {
  movies: Movie[]
  favorites: Movie[]
  currentMovie: Movie | null
  reviews: Review[]
  loading: boolean
  error: string | null
}

export const useMoviesStore = defineStore('movies', {
  state: (): MoviesState => ({
    movies: [],
    favorites: [],
    currentMovie: null,
    reviews: [],
    loading: false,
    error: null
  }),

  getters: {
    getMovies: (state) => state.movies,
    getFavorites: (state) => state.favorites,
    getCurrentMovie: (state) => state.currentMovie,
    getReviews: (state) => state.reviews
  },

  actions: {
    async fetchMovies() {
      try {
        this.loading = true
        this.error = null
        const config = useRuntimeConfig()
        this.movies = await $fetch<Movie[]>(`${config.public.apiBase}/movies`)
      } catch (error: any) {
        this.error = error.message || 'Error al obtener películas'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchMovie(id: string) {
      try {
        this.loading = true
        this.error = null
        const config = useRuntimeConfig()
        this.currentMovie = await $fetch<Movie>(`${config.public.apiBase}/movies/${id}`)
      } catch (error: any) {
        this.error = error.message || 'Error al obtener película'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchFavorites() {
      try {
        this.loading = true
        this.error = null
        const config = useRuntimeConfig()
        const token = localStorage.getItem('token')
        
        if (!token) {
          throw new Error('No token found')
        }

        this.favorites = await $fetch<Movie[]>(`${config.public.apiBase}/users/favorites`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      } catch (error: any) {
        this.error = error.message || 'Error al obtener favoritos'
        throw error
      } finally {
        this.loading = false
      }
    },

    async addToFavorites(movieId: string) {
      try {
        this.loading = true
        this.error = null
        const config = useRuntimeConfig()
        const token = localStorage.getItem('token')
        
        if (!token) {
          throw new Error('No token found')
        }

        await $fetch(`${config.public.apiBase}/users/favorites/${movieId}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        await this.fetchFavorites()
      } catch (error: any) {
        this.error = error.message || 'Error al agregar a favoritos'
        throw error
      } finally {
        this.loading = false
      }
    },

    async removeFromFavorites(movieId: string) {
      try {
        this.loading = true
        this.error = null
        const config = useRuntimeConfig()
        const token = localStorage.getItem('token')
        
        if (!token) {
          throw new Error('No token found')
        }

        await $fetch(`${config.public.apiBase}/users/favorites/${movieId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        await this.fetchFavorites()
      } catch (error: any) {
        console.error('Error al quitar de favoritos:', error)
        this.error = error.message || 'Error al quitar de favoritos'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchMovieReviews(movieId: string) {
      try {
        this.loading = true
        this.error = null
        const config = useRuntimeConfig()
        this.reviews = await $fetch<Review[]>(`${config.public.apiBase}/movies/${movieId}/reviews`)
      } catch (error: any) {
        this.error = error.message || 'Error al obtener reseñas'
        throw error
      } finally {
        this.loading = false
      }
    },

    async createReview(movieId: string, review: { rating: number; comment: string }) {
      try {
        this.loading = true
        this.error = null
        const config = useRuntimeConfig()
        const token = localStorage.getItem('token')
        
        if (!token) {
          throw new Error('No token found')
        }

        await $fetch(`${config.public.apiBase}/movies/${movieId}/reviews`, {
          method: 'POST',
          body: review,
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        await this.fetchMovieReviews(movieId)
      } catch (error: any) {
        this.error = error.message || 'Error al crear reseña'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateReview(movieId: string, reviewId: string, review: { rating: number; comment: string }) {
      try {
        this.loading = true
        this.error = null
        const config = useRuntimeConfig()
        const token = localStorage.getItem('token')
        
        if (!token) {
          throw new Error('No token found')
        }

        await $fetch(`${config.public.apiBase}/movies/${movieId}/reviews/${reviewId}`, {
          method: 'PUT',
          body: review,
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        await this.fetchMovieReviews(movieId)
      } catch (error: any) {
        this.error = error.message || 'Error al actualizar reseña'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteReview(movieId: string, reviewId: string) {
      try {
        this.loading = true
        this.error = null
        const config = useRuntimeConfig()
        const token = localStorage.getItem('token')
        
        if (!token) {
          throw new Error('No token found')
        }

        await $fetch(`${config.public.apiBase}/movies/${movieId}/reviews/${reviewId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        await this.fetchMovieReviews(movieId)
      } catch (error: any) {
        this.error = error.message || 'Error al eliminar reseña'
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) 