// src/config.ts
let config: { backendEnabled: boolean; apiUrl: string | null; amplifyOutputs: any | null };

try {
  // Tenta importar o arquivo de configuração gerado pelo Amplify.
  // O Vite trata isso de forma inteligente, não quebrando o build se o arquivo não existir.
  const outputs = await import('../amplify_outputs.json');
  
  config = {
    backendEnabled: true,
    apiUrl: outputs.default.custom.API.url,
    amplifyOutputs: outputs.default
  };

} catch (error) {
  // Se a importação falhar, significa que o arquivo não existe.
  // A aplicação entra em modo "mock".
  console.log('amplify_outputs.json não encontrado. Executando em modo mock.');
  config = {
    backendEnabled: false,
    apiUrl: null,
    amplifyOutputs: null
  };
}

export default config;
