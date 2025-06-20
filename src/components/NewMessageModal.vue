<script setup lang="ts">
import { ref } from 'vue'
import { fetchAuthSession } from 'aws-amplify/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import outputs from '../../amplify_outputs.json'

// Props
const props = defineProps<{
  user: any
}>()

// Emits
const emit = defineEmits<{
  messageAdded: []
}>()

// Estado do formulário
const isOpen = ref(false)
const isLoading = ref(false)
const title = ref('')
const icon = ref('💭')
const message = ref('')

// URL da API REST
const API_URL = outputs.custom.API_URL

// Ícones disponíveis
const availableIcons = ['💭', '💡', '🎉', '❤️', '🌟', '🚀', '🎯', '✨', '🔥', '💫', '🎨', '🎵']

// Helper para fazer requisições autenticadas
const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
  try {
    const session = await fetchAuthSession()
    const token = session.tokens?.idToken?.toString()

    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.headers,
      },
    })
  } catch (error) {
    console.error('Erro ao obter sessão:', error)
    throw error
  }
}

// Adicionar nova mensagem
const addMessage = async () => {
  if (!title.value.trim() || !message.value.trim()) return
  isLoading.value = true
  try {
    // Debug: verificar o que está sendo enviado
    console.log('User object:', props.user)
    console.log('User attributes:', props.user?.attributes)
    console.log('User name being sent:', props.user?.attributes?.name || props.user?.username || 'Usuário')
    
    const response = await makeAuthenticatedRequest(`${API_URL}messages`, {
      method: 'POST',
      body: JSON.stringify({
        title: title.value.trim(),
        text: message.value.trim(),
        icon: icon.value,        userEmail: props.user?.signInDetails?.loginId || props.user?.username || '',
        userName: props.user?.attributes?.name || props.user?.username || 'Usuário'
      })
    })

    if (response.ok) {
      // Limpar formulário
      title.value = ''
      message.value = ''
      icon.value = '💭'
      isOpen.value = false
      
      // Emitir evento para recarregar mensagens
      emit('messageAdded')
    } else {
      console.error('Erro ao adicionar mensagem:', await response.text())
    }
  } catch (error) {
    console.error('Erro ao adicionar mensagem:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <Button 
        class="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
      >
        ✍️ Adicionar Mensagem
      </Button>
    </DialogTrigger>
    
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle class="text-xl font-bold text-gray-900 dark:text-white">
          ✍️ Nova Mensagem
        </DialogTitle>
        <DialogDescription class="text-gray-600 dark:text-gray-400">
          Compartilhe seus pensamentos com a comunidade!
        </DialogDescription>
      </DialogHeader>
      
      <div class="space-y-4 py-4">
        <!-- Seleção de Ícone -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Ícone
          </label>
          <div class="grid grid-cols-6 gap-2">
            <button
              v-for="iconOption in availableIcons"
              :key="iconOption"
              type="button"
              @click="icon = iconOption"
              :class="[
                'p-2 text-xl rounded-lg border-2 transition-all duration-200 hover:scale-110',
                icon === iconOption 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
              ]"
            >
              {{ iconOption }}
            </button>
          </div>
        </div>

        <!-- Título -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Título
          </label>
          <Input
            v-model="title"
            placeholder="Título da sua mensagem..."
            class="w-full"
          />
        </div>

        <!-- Mensagem -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Mensagem
          </label>
          <Textarea
            v-model="message"
            placeholder="Escreva sua mensagem aqui..."
            rows="4"
            class="w-full resize-none"
          />
        </div>

        <!-- Preview -->
        <div v-if="title || message" class="space-y-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Preview
          </label>
          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
            <div class="font-semibold text-gray-900 dark:text-white mb-2">
              {{ icon }} {{ title || 'Título da mensagem' }}
            </div>
            <p class="text-gray-600 dark:text-gray-400 text-sm">
              {{ message || 'Sua mensagem aparecerá aqui...' }}
            </p>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          @click="isOpen = false"
          :disabled="isLoading"
        >
          Cancelar
        </Button>
        <Button
          @click="addMessage"
          :disabled="!title.trim() || !message.trim() || isLoading"
          class="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          <span v-if="isLoading" class="flex items-center gap-2">
            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Publicando...
          </span>
          <span v-else>Publicar Mensagem</span>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
