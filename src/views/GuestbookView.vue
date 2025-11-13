<script setup lang="ts">
import { ref } from 'vue'
import MessageCard from '@/components/MessageCard.vue'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Heart, LogIn, LogOut, Plus, Inbox } from 'lucide-vue-next'

type Message = { id: string; authorEmail?: string; text: string; createdAt: string; likes: number }

const isAuthenticated = false
const dialogOpen = ref(false)

const messages: Message[] = []

const triggerPrimaryAction = () => {
  if (!isAuthenticated) {
    console.info('TODO: iniciar fluxo de autenticacao')
    return
  }

  dialogOpen.value = true
}

const handleDialogOpenChange = (value: boolean) => {
  dialogOpen.value = value
}
</script>

<template>
  <div class="min-h-screen w-full bg-linear-to-b from-amber-50 via-white to-emerald-50 text-slate-800 flex flex-col">
    <main class="mx-auto w-full max-w-6xl px-4 py-10 space-y-10 flex-1">
      <section class="text-center space-y-4">
        <p class="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-600 shadow-sm">
          <Heart class="h-4 w-4 text-rose-500" /> Amplify Guestbook
        </p>
        <h1 class="text-3xl sm:text-4xl font-bold text-slate-900">Mural com likes e mensagens da comunidade</h1>
        <p class="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
          Compartilhe novidades, deixe recados e celebre cada like. Autentique-se para publicar ou curtir mensagens na
          API REST.
        </p>

        <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button 
            v-if="!isAuthenticated" 
            variant="outline"
            class="border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          >
            <LogIn class="h-4 w-4 mr-2" />
            Entrar
          </Button>
          <Button 
            v-else 
            variant="outline" 
            class="border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          >
            <LogOut class="h-4 w-4 mr-2" />
            Sair
          </Button>

          <Dialog :open="dialogOpen" @update:open="handleDialogOpenChange">
            <div class="relative inline-flex group">
              <Button
                class="rounded-full h-12 w-12 bg-emerald-500 text-white hover:bg-emerald-400 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-emerald-200 disabled:bg-emerald-100 disabled:text-emerald-400 disabled:cursor-not-allowed"
                :disabled="!isAuthenticated"
                @click="triggerPrimaryAction"
              >
                <Plus class="h-5 w-5" />
              </Button>
              <div
                v-if="!isAuthenticated"
                class="pointer-events-none absolute -top-16 left-1/2 w-56 -translate-x-1/2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] font-semibold text-rose-600 shadow-xl opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0"
              >
                Faça login para poder enviar mensagens
              </div>
            </div>
            <DialogContent class="sm:max-w-md border border-slate-100 bg-white shadow-xl">
              <DialogHeader>
                <DialogTitle>Escrever nova mensagem</DialogTitle>
              </DialogHeader>
              <Textarea placeholder="Deixe sua mensagem..." class="min-h-[120px] bg-white border-slate-200" />
              <DialogFooter>
                <Button disabled>Enviar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      <section class="space-y-8">
        <div
          v-if="messages.length === 0"
          class="flex flex-col items-center justify-center rounded-3xl border border-dashed border-emerald-200/70 bg-white/60 px-6 py-14 text-center shadow-[0_0_50px_rgba(16,185,129,0.07)]"
        >
          <div class="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 mb-4">
            <Inbox class="h-7 w-7" />
          </div>
          <p class="text-lg font-semibold text-slate-900">Nenhuma mensagem por aqui ainda</p>
          <p class="text-sm text-slate-500 max-w-md mt-2">
            Seja a primeira pessoa a compartilhar um recado. Autentique-se para abrir o editor e deixar sua mensagem.
          </p>
          <Button
            class="mt-6 border border-emerald-100 bg-emerald-500 text-white hover:bg-emerald-400 disabled:bg-emerald-100 disabled:text-emerald-400"
            :disabled="!isAuthenticated"
            @click="triggerPrimaryAction"
          >
            <Plus class="h-4 w-4 mr-2" /> Escrever primeira mensagem
          </Button>
          <p v-if="!isAuthenticated" class="mt-3 text-xs text-emerald-600/70">
            É preciso entrar para começar a conversa.
          </p>
        </div>

        <div
          v-else
          class="
            grid gap-5
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          <MessageCard
            v-for="m in messages"
            :key="m.id!"
            :id="m.id!"
            :text="m.text!"
            :user="m.authorEmail!"
            :createdAt="m.createdAt!"
            :likes="m.likes!"
            :canLike="isAuthenticated"
            @like="() => {}"
          />
        </div>
      </section>
    </main>

    <footer class="mt-auto px-4 py-4">
      <p v-if="!isAuthenticated"  class="text-xs text-center text-slate-500">
        Faça login para postar e curtir mensagens.
      </p>
      <p v-else class="text-xs text-center text-slate-500">
        Amplify Guestbook - {{ new Date().getFullYear() }}
      </p>
    </footer>
  </div>
</template>
