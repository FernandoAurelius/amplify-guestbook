<script setup lang="ts">
import { ref } from 'vue'
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
  DialogTrigger
} from '@/components/ui/dialog'
import { useMessages } from '@/stores/messages'

// Store
const messagesStore = useMessages()

// Estado do formulário
const isOpen = ref(false)
const isLoading = ref(false)
const title = ref('')
const icon = ref('💭')
const message = ref('')

// Ícones disponíveis
const availableIcons = ['💭', '💡', '🎉', '❤️', '🌟', '🚀', '🎯', '✨', '🔥', '💫', '🎨', '🎵']

// Adicionar nova mensagem usando o store
const addMessage = async () => {
  if (!title.value.trim() || !message.value.trim()) return

  isLoading.value = true
  try {
    await messagesStore.add({
      title: title.value.trim(),
      text: message.value.trim(),
      icon: icon.value
    })

    // Limpar formulário e fechar modal
    title.value = ''
    message.value = ''
    icon.value = '💭'
    isOpen.value = false
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
        variant="default"
        size="lg"
        class="rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
      >
        <span class="mr-2 text-xl">➕</span>
        Nova Mensagem
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[480px]">
      <DialogHeader>
        <DialogTitle>Deixe sua marca</DialogTitle>
        <DialogDescription>
          Compartilhe uma ideia, um feedback ou um simples olá com a comunidade.
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <label for="icon" class="text-right font-medium"> Ícone </label>
          <div class="col-span-3 flex gap-2 flex-wrap">
            <button
              v-for="i in availableIcons"
              :key="i"
              @click="icon = i"
              :class="[
                'p-2 rounded-full text-xl transition-all duration-200',
                icon === i
                  ? 'bg-blue-500 text-white scale-110 shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300'
              ]"
            >
              {{ i }}
            </button>
          </div>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <label for="title" class="text-right font-medium"> Título </label>
          <Input id="title" v-model="title" class="col-span-3" placeholder="Um título para sua mensagem" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <label for="message" class="text-right font-medium"> Mensagem </label>
          <Textarea
            id="message"
            v-model="message"
            class="col-span-3 min-h-[100px]"
            placeholder="Escreva sua mensagem aqui..."
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="ghost" @click="isOpen = false"> Cancelar </Button>
        <Button @click="addMessage" :disabled="isLoading">
          <span v-if="isLoading" class="animate-spin mr-2">⏳</span>
          {{ isLoading ? 'Enviando...' : 'Enviar Mensagem' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
