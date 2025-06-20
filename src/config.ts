// Tenta importar o arquivo de configuração gerado pelo Amplify.
const modules = import.meta.glob('../amplify_outputs.json', { eager: true })
const raw = modules['../amplify_outputs.json'] ?? {}

interface AmplifyOutputs {
    custom?: { API?: Record<string, any> }
}

const outputs = (raw ?? {}) as AmplifyOutputs

export const backendEnabled = !!outputs.custom?.API?.guestbook?.endpoint
export const apiUrl = outputs.custom?.API?.guestbook?.endpoint ?? null
export default outputs
