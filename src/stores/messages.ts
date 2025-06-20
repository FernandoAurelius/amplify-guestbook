// src/stores/messages.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'
import { authenticatedFetch } from '../lib/apiClient'

interface Message {
  id: string
  text: string
  title: string
  icon: string
  userEmail: string
  userName: string
  likes: number
  createdAt: string
}

export const useMessages = defineStore('messages', () => {
  const items = ref<Message[]>([])
  const loading = ref(false)
  const auth = useAuthStore()

  const totalLikes = computed(() =>
    items.value.reduce((sum, m) => sum + (m.likes || 0), 0)
  )

  async function load() {
    loading.value = true
    try {
      if (auth.backendEnabled) {
        const response = await authenticatedFetch('/messages')
        items.value = await response.json()
      } else {
        items.value = mockMessages
      }
    } catch (e) {
      console.error('Erro ao carregar mensagens:', e)
      items.value = [] // Em caso de erro, limpa as mensagens
    } finally {
      loading.value = false
    }
  }

  async function add(msg: Partial<Message>) {
    if (!auth.isAuthenticated) return

    const messageToSend = {
      ...msg,
      userEmail: auth.currentUser?.attributes?.email,
      userName: auth.currentUser?.attributes?.name || auth.currentUser?.username
    }

    if (auth.backendEnabled) {
      await authenticatedFetch('/messages', {
        method: 'POST',
        body: JSON.stringify(messageToSend)
      })
    } else {
      items.value.unshift({
        ...messageToSend,
        id: String(Date.now()),
        likes: 0,
        createdAt: new Date().toISOString()
      } as Message)
    }
    await load() // Recarrega para obter a lista atualizada
  }

  async function like(id: string) {
    if (!auth.isAuthenticated) return

    if (auth.backendEnabled) {
      try {
        await authenticatedFetch('/messages', {
          method: 'PATCH',
          body: JSON.stringify({ id })
        })
        await load() // Recarrega para garantir consistência
      } catch (error) {
        console.error('Falha ao curtir mensagem:', error)
      }
    } else {
      const message = items.value.find(m => m.id === id)
      if (message) {
        message.likes++
      }
    }
  }

  return { items, loading, totalLikes, load, add, like }
})

const mockMessages: Message[] = [
    {
        id: '1',
        text: 'Bem-vindos ao nosso livro de visitas! Deixem suas mensagens aqui.',
        title: 'Primeira mensagem',
        icon: '👋',
        userEmail: 'admin@example.com',
        userName: 'Administrador',
        likes: 5,
        createdAt: '2024-01-15T10:30:00Z'
    },
    {
        id: '2',
        text: 'Que aplicação incrível! Parabéns pelo trabalho.',
        title: 'Feedback positivo',
        icon: '🎉',
        userEmail: 'user1@example.com',
        userName: 'João Silva',
        likes: 3,
        createdAt: '2024-01-16T14:22:00Z'
    },
    {
        id: '3',
        text: 'Adorei a interface, muito intuitiva e moderna.',
        title: 'Sobre o design',
        icon: '✨',
        userEmail: 'designer@example.com',
        userName: 'Maria Costa',
        likes: 7,
        createdAt: '2024-01-17T09:15:00Z'
    }
]