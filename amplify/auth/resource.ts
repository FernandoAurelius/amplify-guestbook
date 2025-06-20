import { defineAuth } from '@aws-amplify/backend';
import { autoConfirm } from '../functions/auto-confirm/resource';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 * 
 * TODO: Implementar MFA via SMS/número de celular para melhor segurança
 * TODO: Adicionar atributos de perfil do usuário (nome, avatar, etc.)
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    email: {
      required: true,
    },
  },
  // Desabilita confirmação automática de email para simplificar o fluxo
  // TODO: Re-habilitar quando implementarmos a interface de confirmação
  accountRecovery: 'EMAIL_ONLY',
  // Auto-confirma usuários durante cadastro
  triggers: {
    preSignUp: autoConfirm
  }
});
