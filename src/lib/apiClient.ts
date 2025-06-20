import { fetchAuthSession } from 'aws-amplify/auth'
import config from '../config'

const API_URL = config.apiUrl

/**
 * A wrapper around the native fetch API that automatically adds the
 * Authorization header for making authenticated requests to the backend API.
 *
 * @param endpoint The API endpoint to call (e.g., '/messages').
 * @param options The standard fetch options object.
 * @returns The fetch Response object.
 */
export async function authenticatedFetch(endpoint: string, options: RequestInit = {}) {
  // Guard clause: esta função não deve ser chamada se o backend não estiver ativo.
  // A lógica nos stores deve prevenir que isso aconteça, mas esta é uma segurança adicional.
  if (!config.backendEnabled || !API_URL) {
    const errorMessage =
      'authenticatedFetch foi chamada, mas o backend não está habilitado ou a URL da API não foi encontrada.'
    console.error(errorMessage)
    // Retorna uma resposta de erro simulada para não quebrar a aplicação que está chamando.
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const session = await fetchAuthSession()
    const token = session.tokens?.idToken?.toString()

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
      }
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error(`API Error: ${response.status} ${response.statusText}`, {
        url: `${API_URL}${endpoint}`,
        body: errorBody
      })
      throw new Error(`Request failed with status ${response.status}`)
    }

    return response
  } catch (error) {
    console.error('Error during authenticated fetch:', error)
    throw error
  }
}
