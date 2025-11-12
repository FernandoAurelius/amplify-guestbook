import { createApp } from 'vue'
import App from './App.vue'
import { Amplify } from 'aws-amplify'
import outputs from '../amplify_outputs.json'

import '@/assets/main.css'

Amplify.configure(outputs)
createApp(App).mount('#app')
