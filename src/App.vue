<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import NewMessageModal from '@/components/NewMessageModal.vue'
import AuthModal from '@/components/AuthModal.vue'
import { useMessages } from './stores/messages'
import { useAuthStore } from './stores/auth'

// Stores Pinia
const auth = useAuthStore()
const messagesStore = useMessages()

// Mapeia o estado e getters dos stores para refs reativas
const { currentUser, isAuthenticated, backendEnabled } = storeToRefs(auth)
const { items: messages, loading, totalLikes } = storeToRefs(messagesStore)

// Handlers que delegam para os stores
function handleAuthenticated() {
  auth.checkUser()
  messagesStore.load()
}

async function handleSignOut() {
  await auth.signOutUser()
  await messagesStore.load()
}

const likeMessage = (id: string) => messagesStore.like(id)

// Carregamento inicial
onMounted(async () => {
  await auth.checkUser()
  await messagesStore.load()
})
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800"
  >
    <div class="container mx-auto py-8 px-4">
      <!-- Cabeçalho principal -->
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          📝 Campus Guestbook
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Conecte-se e compartilhe seus pensamentos com nossa comunidade. Veja o que outros
          visitantes estão dizendo!
        </p>

        <!-- Estatísticas -->
        <div class="flex justify-center gap-4 mb-8">
          <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {{ messages.length }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Mensagens</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
            <div class="text-2xl font-bold text-green-600 dark:text-green-400">
              {{ totalLikes }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Curtidas</div>
          </div>
        </div>

        <!-- Info do usuário logado -->
        <div v-if="isAuthenticated" class="mb-6">
          <div
            class="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-2 rounded-full"
          >
            <span class="text-green-600">👤</span>
            <span class="font-medium"
              >Logado como {{ currentUser?.attributes?.name || currentUser?.username }}</span
            >
            <Button
              variant="ghost"
              size="sm"
              @click="handleSignOut"
              class="ml-2 h-6 px-2 text-xs text-green-700 hover:text-green-900 dark:text-green-300 dark:hover:text-green-100"
            >
              Sair
            </Button>
          </div>
        </div>
      </div>
      <!-- Lista de mensagens -->
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl font-semibold text-gray-900 dark:text-white text-center mb-8">
          💬 Mensagens da Comunidade
        </h2>

        <div v-if="loading" class="text-center py-16">
          <div class="text-6xl animate-spin">⏳</div>
          <h3 class="text-2xl font-semibold text-gray-900 dark:text-white mt-6">
            Carregando mensagens...
          </h3>
        </div>

        <div v-else-if="messages.length === 0" class="text-center py-16">
          <div class="text-8xl mb-6 animate-bounce">🌟</div>
          <h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Nenhuma mensagem ainda
          </h3>
          <p class="text-gray-600 dark:text-gray-400 text-lg">
            Seja o primeiro a deixar uma mensagem na nossa comunidade!
          </p>
        </div>

        <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card
            v-for="(message, index) in messages"
            :key="message.id"
            class="p-6 hover:shadow-xl transition-all duration-300 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-lg transform hover:scale-105 cursor-pointer group"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <div class="space-y-4">
              <!-- Cabeçalho da mensagem com ícone e título -->
              <div class="flex items-start gap-3">
                <div class="text-2xl">{{ message.icon || '💭' }}</div>
                <div class="flex-1">
                  <h3
                    v-if="message.title"
                    class="font-semibold text-lg text-gray-900 dark:text-white mb-1"
                  >
                    {{ message.title }}
                  </h3>
                  <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span class="font-medium text-blue-600 dark:text-blue-400">
                      {{ message.userName || 'Anônimo' }}
                    </span>
                    <span>•</span>
                    <span
                      >{{
                        new Date(message.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })
                      }}</span
                    >
                  </div>
                </div>
              </div>

              <!-- Conteúdo da mensagem -->
              <div class="text-gray-700 dark:text-gray-300 leading-relaxed">
                <p class="whitespace-pre-wrap">{{ message.text }}</p>
              </div>

              <!-- Footer com curtidas -->
              <div class="flex justify-end items-center">
                <button
                  @click.stop="likeMessage(message.id)"
                  :disabled="!isAuthenticated"
                  :class="[
                    'flex items-center gap-2 px-3 py-1 rounded-full transition-all duration-200',
                    isAuthenticated
                      ? 'bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 cursor-pointer group-hover:scale-110'
                      : 'bg-gray-50 dark:bg-gray-800 cursor-not-allowed opacity-70'
                  ]"
                  :title="isAuthenticated ? 'Curtir mensagem' : 'Faça login para curtir'"
                >
                  <span class="text-lg">❤️</span>
                  <span class="font-medium">{{ message.likes }}</span>
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <!-- Botões fixos no canto superior esquerdo -->
      <div class="fixed top-4 left-4 z-50">
        <div
          class="flex gap-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-full p-2 shadow-2xl border border-gray-200/50 dark:border-gray-700/50"
        >
          <!-- Botão para adicionar mensagem (só aparece se logado) -->
          <NewMessageModal v-if="isAuthenticated" />

          <!-- Botão de login/cadastro (só aparece se não logado) -->
          <AuthModal v-if="!isAuthenticated && backendEnabled" @authenticated="handleAuthenticated" />
        </div>
      </div>
    </div>
  </div>
</template>
