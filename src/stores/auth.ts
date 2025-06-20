// src/stores/auth.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getCurrentUser, signOut } from 'aws-amplify/auth'
// Importa a variável e a renomeia para evitar conflito de nomes
import { backendEnabled as isBackendEnabled } from '../config' 

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<any>(null)
  const isAuthenticated = ref(false)

  // Converte o booleano importado em um ref reativo
  const backendEnabled = ref(isBackendEnabled)

  async function checkUser() {
    // Agora usa .value para acessar o valor do ref
    if (!backendEnabled.value) {
      currentUser.value = {
        username: 'Palestrante',
        attributes: { name: 'Palestrante', email: 'mock@example.com' }
      }
      isAuthenticated.value = true
      return // Saída antecipada
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
    // Usa .value aqui também
    if (!backendEnabled.value) {
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