import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Amplify } from 'aws-amplify'
import { I18n } from 'aws-amplify/utils'
import config from './config' // Importa a configuração dinâmica
import App from './App.vue'

// Configura o Amplify apenas se o backend estiver habilitado (ou seja, se o outputs.json foi encontrado)
if (config.backendEnabled && config.amplifyOutputs) {
  Amplify.configure(config.amplifyOutputs)
}

// Configurar idioma português brasileiro
I18n.putVocabularies({
  'pt-BR': {
    'Sign In': 'Entrar',
    'Sign Up': 'Criar Conta',
    'Create Account': 'Criar Conta',
    'Email': 'Email',
    'Password': 'Senha',
    'Enter your Email': 'Digite seu email',
    'Enter your Password': 'Digite sua senha',
    'Forgot your password?': 'Esqueceu sua senha?',
    'Reset password': 'Redefinir senha',
    'Send code': 'Enviar código',
    'Code': 'Código',
    'Enter your code': 'Digite seu código',
    'Confirm': 'Confirmar',
    'Back to Sign In': 'Voltar ao Login',
    'Sign Out': 'Sair',
    'Username': 'Nome de usuário',
    'Enter your username': 'Digite seu nome de usuário',
    'Phone Number': 'Número de telefone',
    'Enter your phone number': 'Digite seu número de telefone',
    'Confirm Password': 'Confirmar senha',
    'Please confirm your password': 'Confirme sua senha',
    'Create account': 'Criar conta',
    'Creating account...': 'Criando conta...',
    'Signing in...': 'Entrando...',
    'Sign in': 'Entrar',
  }
})

I18n.setLanguage('pt-BR')

const app = createApp(App)

app.use(createPinia())

app.mount('#app')
