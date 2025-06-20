<template>
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-sm">
        <!-- Header -->
        <div class="text-center mb-6">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                🔐 Acesso
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ currentMode === 'signIn' ? 'Faça login para continuar' : 'Crie sua conta gratuita' }}
            </p>
        </div>

        <!-- Abas de navegação -->
        <div class="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg mb-4">
            <button @click="currentMode = 'signIn'" :class="[
                'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200',
                currentMode === 'signIn'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            ]">
                Entrar
            </button>
            <button @click="currentMode = 'signUp'" :class="[
                'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200',
                currentMode === 'signUp'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            ]">
                Criar Conta
            </button>
        </div>

        <!-- Formulário de Login -->
        <form v-if="currentMode === 'signIn'" @submit.prevent="handleSignIn" class="space-y-4">
            <div>
                <label for="signInEmail" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                </label>
                <input id="signInEmail" v-model="signInForm.email" type="email" required
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                    placeholder="Digite seu email" />
            </div>
            <div>
                <label for="signInPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Senha
                </label>
                <input id="signInPassword" v-model="signInForm.password" type="password" required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                    placeholder="Digite sua senha" />
            </div>
            <button type="submit" :disabled="isLoading"
                class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none">
                {{ isLoading ? 'Entrando...' : 'Entrar' }}
            </button>
            <div class="text-center">
                <button type="button" @click="currentMode = 'forgotPassword'"
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
                    Esqueceu sua senha?
                </button>
            </div>
        </form>

        <!-- Formulário de Cadastro -->
        <form v-else-if="currentMode === 'signUp'" @submit.prevent="handleSignUp" class="space-y-3">
            <div>
                <label for="signUpName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nome ou Apelido
                </label>
                <input id="signUpName" v-model="signUpForm.name" type="text" required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                    placeholder="Como você gostaria de ser chamado?" />
            </div>
            <div>
                <label for="signUpEmail" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                </label>
                <input id="signUpEmail" v-model="signUpForm.email" type="email" required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                    placeholder="Digite seu email" />
            </div>
            <div>
                <label for="signUpPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Senha
                </label>
                <input id="signUpPassword" v-model="signUpForm.password" type="password" required :class="[
                    'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200',
                    passwordValidation.isValid ? 'border-gray-300 dark:border-gray-600' : 'border-red-300 dark:border-red-600'
                ]" placeholder="Digite sua senha" @input="validatePassword" />

                <!-- Requisitos da senha -->
                <div class="mt-1 space-y-0.5">
                    <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Sua senha deve conter:</p>
                    <div class="grid grid-cols-2 gap-1 text-xs">
                        <div
                            :class="['flex items-center gap-1', passwordValidation.hasMinLength ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400']">
                            <span>{{ passwordValidation.hasMinLength ? '✓' : '○' }}</span>
                            <span>8+ caracteres</span>
                        </div>
                        <div
                            :class="['flex items-center gap-1', passwordValidation.hasLowercase ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400']">
                            <span>{{ passwordValidation.hasLowercase ? '✓' : '○' }}</span>
                            <span>Minúscula</span>
                        </div>
                        <div
                            :class="['flex items-center gap-1', passwordValidation.hasUppercase ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400']">
                            <span>{{ passwordValidation.hasUppercase ? '✓' : '○' }}</span>
                            <span>Maiúscula</span>
                        </div>                        <div
                            :class="['flex items-center gap-1', passwordValidation.hasNumber ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400']">
                            <span>{{ passwordValidation.hasNumber ? '✓' : '○' }}</span>
                            <span>Número</span>
                        </div>
                        <div
                            :class="['flex items-center gap-1', passwordValidation.hasSpecialChar ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400']">
                            <span>{{ passwordValidation.hasSpecialChar ? '✓' : '○' }}</span>
                            <span>Especial</span>
                        </div>                    </div>
                </div>
            </div>
            <button type="submit" :disabled="isLoading || !passwordValidation.isValid"
                    class="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none">
                    {{ isLoading ? 'Criando conta...' : 'Criar Conta' }}
                </button>
        </form>

        <!-- Formulário de Reset de Senha -->
        <form v-else-if="currentMode === 'forgotPassword'" @submit.prevent="handleForgotPassword" class="space-y-4">
            <div>
                <label for="resetEmail" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                </label>
                <input id="resetEmail" v-model="resetForm.email" type="email" required
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                    placeholder="Digite seu email" />
            </div>
            <button type="submit" :disabled="isLoading"
                class="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none">
                {{ isLoading ? 'Enviando...' : 'Enviar Código' }}
            </button>
            <div class="text-center">
                <button type="button" @click="currentMode = 'signIn'"
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
                    Voltar ao Login
                </button>
            </div>
        </form> <!-- Mensagem de erro -->
        <div v-if="errorMessage && !successMessage"
            class="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
            {{ errorMessage }}
        </div>

        <!-- Mensagem de sucesso -->
        <div v-if="successMessage"
            class="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg">
            {{ successMessage }}
        </div>

        <!-- Footer com opções alternativas -->
        <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p class="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                Ou continue com:
            </p>
            <div class="flex justify-center space-x-4">
                <button @click="signInWithGoogle"
                    class="flex items-center justify-center w-12 h-12 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-full transition-colors duration-200"
                    title="Entrar com Google">
                    <Mail class="w-5 h-5" />
                </button>
                <button @click="signInWithPhone"
                    class="flex items-center justify-center w-12 h-12 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/40 text-green-600 dark:text-green-400 rounded-full transition-colors duration-200"
                    title="Entrar com Telefone">
                    <Phone class="w-5 h-5" />
                </button>
                <button @click="signInWithUsername"
                    class="flex items-center justify-center w-12 h-12 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full transition-colors duration-200"
                    title="Entrar com Nome de Usuário">
                    <User class="w-5 h-5" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { signIn, signUp, resetPassword } from 'aws-amplify/auth'
import { Mail, Phone, User } from 'lucide-vue-next'

// Emits
const emit = defineEmits<{
    authenticated: [user: any]
}>()

// Estado reativo
const currentMode = ref<'signIn' | 'signUp' | 'forgotPassword'>('signIn')
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Formulários
const signInForm = ref({
    email: '',
    password: ''
})

const signUpForm = ref({
    name: '',
    email: '',
    password: ''
})

const resetForm = ref({
    email: ''
})

// Validação de senha
const passwordValidation = computed(() => {
    const password = signUpForm.value.password
    return {
        hasMinLength: password.length >= 8,
        hasLowercase: /[a-z]/.test(password),
        hasUppercase: /[A-Z]/.test(password),
        hasNumber: /\d/.test(password),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        get isValid() {
            return this.hasMinLength && this.hasLowercase && this.hasUppercase && this.hasNumber && this.hasSpecialChar
        }
    }
})

// Função para validar senha em tempo real
const validatePassword = () => {
    // A validação é reativa através do computed
}

// Tradução de mensagens de erro do AWS Cognito
const translateError = (error: any): string => {
    const message = error.message || error.toString()

    if (message.includes('Password did not conform with policy')) {
        return 'A senha não atende aos requisitos de segurança. Verifique os critérios acima.'
    }
    if (message.includes('User already exists')) {
        return 'Este email já está cadastrado. Tente fazer login ou recuperar a senha.'
    }
    if (message.includes('Invalid verification code')) {
        return 'Código de verificação inválido. Verifique o código enviado para seu email.'
    }
    if (message.includes('Incorrect username or password')) {
        return 'Email ou senha incorretos. Verifique suas credenciais.'
    }
    if (message.includes('User does not exist')) {
        return 'Este email não está cadastrado. Crie uma conta primeiro.'
    }
    if (message.includes('Password attempts exceeded')) {
        return 'Muitas tentativas de login. Tente novamente em alguns minutos.'
    }
    if (message.includes('Network Error')) {
        return 'Erro de conexão. Verifique sua internet e tente novamente.'
    }

    // Mensagem genérica se não conseguir traduzir
    return message || 'Ocorreu um erro inesperado. Tente novamente.'
}

// Handlers
const handleSignIn = async () => {
    isLoading.value = true
    errorMessage.value = ''
    successMessage.value = ''

    try {
        const result = await signIn({
            username: signInForm.value.email,
            password: signInForm.value.password
        })

        if (result.isSignedIn) {
            emit('authenticated', result)
        }
    } catch (error: any) {
        errorMessage.value = translateError(error)
    } finally {
        isLoading.value = false
    }
}

const handleSignUp = async () => {
    isLoading.value = true
    errorMessage.value = ''
    successMessage.value = ''

    // Validação local antes de enviar
    if (!passwordValidation.value.isValid) {
        errorMessage.value = 'A senha não atende aos requisitos de segurança. Verifique os critérios acima.'
        isLoading.value = false
        return
    } try {
        const result = await signUp({
            username: signUpForm.value.email,
            password: signUpForm.value.password, options: {
                userAttributes: {
                    email: signUpForm.value.email,
                    name: signUpForm.value.name
                }
            }
        })

        console.log('Signup result:', result)

        if (result.isSignUpComplete) {
            // Conta criada e verificada automaticamente
            currentMode.value = 'signIn'
            successMessage.value = 'Conta criada com sucesso! Faça login para continuar.'
        } else {
            // Com auto-confirmação habilitada, isso não deveria acontecer
            // TODO: Implementar fluxo de confirmação quando necessário
            currentMode.value = 'signIn'
            successMessage.value = 'Conta criada! Agora você pode fazer login.'
        }
    } catch (error: any) {
        errorMessage.value = translateError(error)
    } finally {
        isLoading.value = false
    }
}

const handleForgotPassword = async () => {
    isLoading.value = true
    errorMessage.value = ''
    successMessage.value = ''

    try {
        await resetPassword({ username: resetForm.value.email })
        successMessage.value = 'Código de recuperação enviado para seu email! Verifique sua caixa de entrada.'
    } catch (error: any) {
        errorMessage.value = translateError(error)
    } finally {
        isLoading.value = false
    }
}

// Métodos alternativos de login (placeholder por enquanto)
const signInWithGoogle = () => {
    errorMessage.value = 'Login com Google será implementado em breve!'
}

const signInWithPhone = () => {
    errorMessage.value = 'Login com telefone será implementado em breve!'
}

const signInWithUsername = () => {
    errorMessage.value = 'Login com nome de usuário será implementado em breve!'
}
</script>
