<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Catálogo de Películas</h1>

    <div v-if="moviesStore.loading" class="flex justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
    </div>

    <div v-else-if="moviesStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ moviesStore.error }}
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="movie in moviesStore.movies" :key="movie._id" 
           class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <img :src="movie.image" :alt="movie.title" class="w-full h-48 object-cover">
        <div class="p-4">
          <h2 class="text-xl font-semibold mb-2">{{ movie.title }}</h2>
          <p class="text-gray-600 mb-2">{{ movie.director }}</p>
          <div class="flex items-center mb-2">
            <span class="text-yellow-500">★</span>
            <span class="ml-1">{{ movie.rating.toFixed(1) }}</span>
          </div>
          <div class="flex justify-between items-center">
            <NuxtLink :to="`/movies/${movie._id}`" 
                     class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors">
              Ver Detalles
            </NuxtLink>
            <button @click="addToFavorites(movie._id)"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMoviesStore } from '~/stores/movies'

const moviesStore = useMoviesStore()

// Cargar películas al montar el componente
onMounted(async () => {
  await moviesStore.fetchMovies()
})

// Función para agregar a favoritos
const addToFavorites = async (movieId: string) => {
  try {
    await moviesStore.addToFavorites(movieId)
    alert('Película agregada a favoritos')
  } catch (error) {
    alert('Error al agregar a favoritos')
  }
}
</script> 