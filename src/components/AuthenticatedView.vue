<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { fetchAuthSession, getCurrentUser, signOut } from 'aws-amplify/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import outputs from '../../amplify_outputs.json'

// Definir props (usuário)
const props = defineProps<{
    user: any
}>()

// Definir emits
const emit = defineEmits<{
    signOut: []
}>()

// Tipos
interface Message {
    id: string
    text: string
    likes: number
    createdAt: string
}

// Estado do componente
const messages = ref<Message[]>([])
const newMessage = ref('')
const isLoading = ref(false)

// Computed properties
const totalLikes = computed(() =>
    messages.value.reduce((total, message) => total + (message.likes || 0), 0)
)

// URL da API REST
const API_URL = outputs.custom.API_URL

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
        return fetch(url, options)
    }
}

// Buscar mensagens via REST API
const fetchMessages = async () => {
    try {
        const response = await fetch(`${API_URL}messages`)
        const data = await response.json() as Message[]
        messages.value = data
    } catch (error) {
        console.error('Erro ao buscar mensagens:', error)
    }
}

// Adicionar nova mensagem via REST API
const addMessage = async () => {
    if (!newMessage.value.trim()) return

    isLoading.value = true
    try {
        const response = await makeAuthenticatedRequest(`${API_URL}messages`, {
            method: 'POST',
            body: JSON.stringify({
                text: newMessage.value
            })
        })

        if (response.ok) {
            newMessage.value = ''
            await fetchMessages() // Recarrega as mensagens
        } else {
            console.error('Erro ao adicionar mensagem:', await response.text())
        }
    } catch (error) {
        console.error('Erro ao adicionar mensagem:', error)
    } finally {
        isLoading.value = false
    }
}

// Curtir mensagem via REST API
const likeMessage = async (id: string) => {
    try {
        const response = await makeAuthenticatedRequest(`${API_URL}messages`, {
            method: 'PATCH',
            body: JSON.stringify({ id })
        })

        if (response.ok) {
            await fetchMessages() // Recarrega as mensagens para mostrar o like atualizado
        } else {
            console.error('Erro ao curtir mensagem:', await response.text())
        }
    } catch (error) {
        console.error('Erro ao curtir mensagem:', error)
    }
}

// Handler para logout
const handleSignOut = async () => {
    try {
        await signOut()
        emit('signOut')
    } catch (error) {
        console.error('Erro ao fazer logout:', error)
    }
}

onMounted(async () => {
    await fetchMessages()
})
</script>

<template>
    <div class="min-h-screen bg-background">
        <div class="container mx-auto py-8 px-4">
            <div class="max-w-2xl mx-auto">
                <!-- Header -->
                <header class="text-center mb-8">
                    <h1 class="text-4xl font-bold text-foreground mb-2">
                        📝 Livro de Visitas
                    </h1>
                    <p class="text-muted-foreground mb-4">
                        Bem-vindo, {{ user?.username }}!
                    </p>
                    <Button @click="handleSignOut" variant="outline" size="sm">
                        Sair
                    </Button>
                </header>

                <!-- Formulário para nova mensagem -->
                <Card class="mb-8">
                    <CardHeader>
                        <CardTitle>✍️ Deixe sua mensagem</CardTitle>
                        <CardDescription>
                            Compartilhe seus pensamentos com outros visitantes
                        </CardDescription>
                    </CardHeader>
                    <CardContent class="space-y-4">
                        <Textarea v-model="newMessage" placeholder="Digite sua mensagem aqui..."
                            class="min-h-[100px]" />
                        <Button @click="addMessage" :disabled="isLoading || !newMessage.trim()" class="w-full">
                            {{ isLoading ? 'Enviando...' : '📤 Enviar Mensagem' }}
                        </Button>
                    </CardContent>
                </Card>

                <!-- Lista de mensagens -->
                <div class="space-y-4">
                    <h2 class="text-2xl font-semibold mb-4">
                        💬 Mensagens ({{ messages.length }})
                    </h2>

                    <div v-if="messages.length === 0" class="text-center py-8">
                        <p class="text-muted-foreground">
                            Nenhuma mensagem ainda. Seja o primeiro a deixar uma!
                        </p>
                    </div>

                    <Card v-for="message in messages" :key="message.id" class="p-4">
                        <div class="space-y-2">
                            <p class="text-foreground">{{ message.text }}</p>
                            <div class="flex justify-between items-center text-sm text-muted-foreground">
                                <span>{{ new Date(message.createdAt).toLocaleString('pt-BR') }}</span>
                                <Button variant="outline" size="sm" @click="likeMessage(message.id)"
                                    class="flex items-center gap-2">
                                    ❤️ {{ message.likes }}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                <footer class="text-center mt-12 pt-8 border-t text-muted-foreground text-sm">
                    <p>Powered by AWS Amplify Gen 2 🚀</p>
                </footer>
            </div>
        </div>
    </div>
</template>
