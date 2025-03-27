<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Barra de navegación -->
    <nav class="bg-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-16">
          <div class="flex">
            <!-- Logo y enlaces principales -->
            <div class="flex-shrink-0 flex items-center">
              <NuxtLink to="/" class="text-xl font-bold text-purple-600">
                CineApp
              </NuxtLink>
            </div>
          </div>

          <!-- Enlaces de navegación -->
          <div class="flex items-center space-x-4">
            <template v-if="authStore.isAuthenticated">
              <NuxtLink to="/profile" 
                       class="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">
                Mi Perfil
              </NuxtLink>
              <button @click="handleLogout"
                      class="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">
                Cerrar Sesión
              </button>
            </template>
            <template v-else>
              <NuxtLink to="/login"
                       class="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">
                Iniciar Sesión
              </NuxtLink>
              <NuxtLink to="/register"
                       class="bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-md text-sm font-medium">
                Registrarse
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Contenido principal -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script> 