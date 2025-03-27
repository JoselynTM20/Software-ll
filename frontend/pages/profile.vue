<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="profileStore.loading" class="flex justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
    </div>

    <div v-else-if="profileStore.error" class="text-red-500 text-center">
      {{ profileStore.error }}
    </div>

    <div v-else class="space-y-8">
      <!-- Perfil -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-2xl font-bold mb-4">Mi Perfil</h2>
        <form @submit.prevent="updateProfile" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nombre</label>
            <input v-model="profileData.name" type="text" required
                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input v-model="profileData.email" type="email" required
                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Edad</label>
            <input v-model="profileData.age" type="number" required
                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500">
          </div>
          <button type="submit"
                  class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
            Actualizar Perfil
          </button>
        </form>
      </div>

      <!-- Favoritos -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-2xl font-bold mb-4">Mis Películas Favoritas</h2>
        <div v-if="moviesStore.loading" class="flex justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
        <div v-else-if="moviesStore.error" class="text-red-500 text-center">
          {{ moviesStore.error }}
        </div>
        <div v-else-if="moviesStore.favorites.length === 0" class="text-gray-500 text-center">
          No tienes películas favoritas
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="movie in moviesStore.favorites" :key="movie.id"
               class="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <img :src="movie.image" :alt="movie.title" class="w-full h-48 object-cover">
            <div class="p-4">
              <h3 class="font-semibold text-lg">{{ movie.title }}</h3>
              <p class="text-gray-600">{{ movie.director }}</p>
              <div class="mt-2 flex justify-between items-center">
                <span class="text-yellow-500">★ {{ movie.rating }}</span>
                <button @click="removeFromFavorites(movie.id)"
                        class="text-red-500 hover:text-red-700">
                  Quitar de favoritos
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reseñas -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-2xl font-bold mb-4">Mis Reseñas</h2>
        <div v-if="moviesStore.loading" class="flex justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
        <div v-else-if="moviesStore.error" class="text-red-500 text-center">
          {{ moviesStore.error }}
        </div>
        <div v-else-if="moviesStore.reviews.length === 0" class="text-gray-500 text-center">
          No has escrito ninguna reseña
        </div>
        <div v-else class="space-y-4">
          <div v-for="review in moviesStore.reviews" :key="review.id"
               class="border rounded-lg p-4">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-semibold">{{ review.movieId }}</h3>
                <p class="text-gray-600">{{ review.comment }}</p>
                <div class="mt-2 text-yellow-500">★ {{ review.rating }}</div>
              </div>
              <div class="space-x-2">
                <button @click="editReview(review)"
                        class="text-blue-500 hover:text-blue-700">
                  Editar
                </button>
                <button @click="deleteReview(review.movieId, review.id)"
                        class="text-red-500 hover:text-red-700">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProfileStore } from '~/stores/profile'
import { useMoviesStore } from '~/stores/movies'
import { onMounted, ref } from 'vue'

const profileStore = useProfileStore()
const moviesStore = useMoviesStore()

const profileData = ref({
  name: '',
  email: '',
  age: 0
})

onMounted(async () => {
  try {
    await profileStore.fetchProfile()
    profileData.value = { ...profileStore.profile }
    await moviesStore.fetchFavorites()
    await moviesStore.fetchUserReviews()
  } catch (error) {
    console.error('Error loading profile:', error)
  }
})

const updateProfile = async () => {
  try {
    await profileStore.updateProfile(profileData.value)
    alert('Perfil actualizado correctamente')
  } catch (error) {
    alert('Error al actualizar el perfil')
  }
}

const removeFromFavorites = async (movieId: string) => {
  if (confirm('¿Estás seguro de quitar esta película de favoritos?')) {
    try {
      await moviesStore.removeFromFavorites(movieId)
    } catch (error) {
      alert('Error al quitar de favoritos')
    }
  }
}

const editReview = (review: any) => {
  // Implementar lógica de edición
}

const deleteReview = async (movieId: string, reviewId: string) => {
  if (confirm('¿Estás seguro de eliminar esta reseña?')) {
    try {
      await moviesStore.deleteReview(movieId, reviewId)
    } catch (error) {
      alert('Error al eliminar la reseña')
    }
  }
}
</script> 