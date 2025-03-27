<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="moviesStore.loading" class="flex justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
    </div>

    <div v-else-if="moviesStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ moviesStore.error }}
    </div>

    <div v-else-if="moviesStore.currentMovie" class="max-w-4xl mx-auto">
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="md:flex">
          <div class="md:w-1/2">
            <img :src="moviesStore.currentMovie.image" 
                 :alt="moviesStore.currentMovie.title"
                 class="w-full h-96 object-cover">
          </div>
          <div class="p-6 md:w-1/2">
            <h1 class="text-3xl font-bold mb-4">{{ moviesStore.currentMovie.title }}</h1>
            
            <div class="mb-4">
              <p class="text-gray-600">
                <span class="font-semibold">Director:</span> {{ moviesStore.currentMovie.director }}
              </p>
              <p class="text-gray-600">
                <span class="font-semibold">Año:</span> {{ moviesStore.currentMovie.releaseYear }}
              </p>
              <p class="text-gray-600">
                <span class="font-semibold">Género:</span> {{ moviesStore.currentMovie.genre }}
              </p>
              <p class="text-gray-600">
                <span class="font-semibold">Duración:</span> {{ moviesStore.currentMovie.duration }} minutos
              </p>
              <p class="text-gray-600">
                <span class="font-semibold">Calificación:</span> 
                <span class="text-yellow-500">★</span> {{ moviesStore.currentMovie.rating.toFixed(1) }}
              </p>
            </div>

            <div class="mb-6">
              <h2 class="text-xl font-semibold mb-2">Sinopsis</h2>
              <p class="text-gray-700">{{ moviesStore.currentMovie.synopsis }}</p>
            </div>

            <div class="flex justify-between items-center">
              <button @click="toggleFavorite"
                      class="text-gray-500 hover:text-red-500 transition-colors">
                <span class="sr-only">Agregar a favoritos</span>
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Sección de Reseñas -->
        <div class="border-t p-6">
          <h2 class="text-2xl font-bold mb-4">Reseñas</h2>
          
          <!-- Formulario de Reseña -->
          <form @submit.prevent="submitReview" class="mb-8">
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">
                Calificación
              </label>
              <div class="flex space-x-2">
                <button v-for="star in 5" :key="star"
                        type="button"
                        @click="newReview.rating = star"
                        class="text-2xl focus:outline-none">
                  <span :class="star <= newReview.rating ? 'text-yellow-500' : 'text-gray-300'">★</span>
                </button>
              </div>
            </div>
            
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">
                Comentario
              </label>
              <textarea v-model="newReview.comment"
                        class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        rows="4"
                        required></textarea>
            </div>
            
            <button type="submit"
                    class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors">
              Enviar Reseña
            </button>
          </form>

          <!-- Lista de Reseñas -->
          <div v-if="moviesStore.reviews.length > 0" class="space-y-4">
            <div v-for="review in moviesStore.reviews" :key="review._id"
                 class="bg-gray-50 p-4 rounded-lg">
              <div class="flex justify-between items-start">
                <div>
                  <div class="flex items-center mb-2">
                    <span class="text-yellow-500">★</span>
                    <span class="ml-1">{{ review.rating }}</span>
                  </div>
                  <p class="text-gray-700">{{ review.comment }}</p>
                </div>
                <div v-if="review.user === authStore.user?.id" class="flex space-x-2">
                  <button @click="editReview(review)"
                          class="text-blue-500 hover:text-blue-700">
                    Editar
                  </button>
                  <button @click="deleteReview(review._id)"
                          class="text-red-500 hover:text-red-700">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
          <p v-else class="text-gray-500">No hay reseñas aún. ¡Sé el primero en opinar!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMoviesStore } from '~/stores/movies'
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const moviesStore = useMoviesStore()
const authStore = useAuthStore()

// Estado para nueva reseña
const newReview = ref({
  rating: 0,
  comment: ''
})

// Cargar datos al montar el componente
onMounted(async () => {
  const movieId = route.params.id as string
  await Promise.all([
    moviesStore.fetchMovieById(movieId),
    moviesStore.fetchUserReviews()
  ])
})

// Función para agregar/eliminar de favoritos
const toggleFavorite = async () => {
  if (!moviesStore.currentMovie) return
  
  try {
    const isFavorite = moviesStore.favorites.some(f => f.movie._id === moviesStore.currentMovie?._id)
    if (isFavorite) {
      await moviesStore.removeFromFavorites(moviesStore.currentMovie._id)
      alert('Película eliminada de favoritos')
    } else {
      await moviesStore.addToFavorites(moviesStore.currentMovie._id)
      alert('Película agregada a favoritos')
    }
  } catch (error) {
    alert('Error al modificar favoritos')
  }
}

// Función para enviar reseña
const submitReview = async () => {
  if (!moviesStore.currentMovie) return
  
  try {
    await moviesStore.createReview(
      moviesStore.currentMovie._id,
      newReview.value.rating,
      newReview.value.comment
    )
    newReview.value = { rating: 0, comment: '' }
    alert('Reseña creada correctamente')
  } catch (error) {
    alert('Error al crear la reseña')
  }
}

// Función para editar reseña
const editReview = (review: any) => {
  newReview.value = {
    rating: review.rating,
    comment: review.comment
  }
}

// Función para eliminar reseña
const deleteReview = async (reviewId: string) => {
  if (!confirm('¿Estás seguro de que deseas eliminar esta reseña?')) return
  
  try {
    await moviesStore.deleteReview(reviewId)
    alert('Reseña eliminada correctamente')
  } catch (error) {
    alert('Error al eliminar la reseña')
  }
}
</script> 