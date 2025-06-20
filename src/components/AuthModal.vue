<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import CustomAuthenticator from '@/components/CustomAuthenticator.vue'

// Emits
const emit = defineEmits<{
  authenticated: [user: any]
}>()

// Estado do modal
const isOpen = ref(false)

// Handler para quando o usuário se autentica
const handleAuthenticated = (user: any) => {
  isOpen.value = false
  emit('authenticated', user)
}
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <Button 
        variant="outline"
        class="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
      >
        🔐 Entrar / Cadastrar
      </Button>
    </DialogTrigger>
    
    <DialogContent class="sm:max-w-md p-0 border-0 bg-transparent shadow-none">
      <DialogHeader class="sr-only">
        <DialogTitle>Autenticação</DialogTitle>
        <DialogDescription>
          Faça login ou crie uma conta para interagir com o livro de visitas
        </DialogDescription>
      </DialogHeader>
      
      <!-- O CustomAuthenticator já tem seu próprio design -->
      <CustomAuthenticator @authenticated="handleAuthenticated" />
    </DialogContent>
  </Dialog>
</template>
