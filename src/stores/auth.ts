// src/stores/auth.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getCurrentUser, signOut } from 'aws-amplify/auth'
import config from '../config' // Importa a configuração centralizada

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<any>(null)
  const isAuthenticated = ref(false)

  // A decisão agora vem do módulo de configuração
  const backendEnabled = config.backendEnabled

  async function checkUser() {
    // Se o backend estiver desabilitado, simula um usuário logado
    if (!backendEnabled) {
      currentUser.value = {
        username: 'Palestrante',
        attributes: { name: 'Palestrante', email: 'mock@example.com' }
      }
      isAuthenticated.value = true
      return // Early return
    }

    try {
      const user = await getCurrentUser()
      const { fetchUserAttributes } = await import('aws-amplify/auth')
      const attributes = await fetchUserAttributes()
      currentUser.value = { ...user, attributes }
      isAuthenticated.value = true
    } catch {
      currentUser.value = null
      isAuthenticated.value = false
    }
  }

  async function signOutUser() {
    if (!backendEnabled) {
      currentUser.value = null
      isAuthenticated.value = false
      return
    }

    try {
      await signOut()
      currentUser.value = null
      isAuthenticated.value = false
    } catch (e) {
      console.error('Erro ao sair:', e)
    }
  }

  return { currentUser, isAuthenticated, checkUser, signOutUser, backendEnabled }
})