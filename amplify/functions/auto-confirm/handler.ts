/**
 * Lambda function para auto-confirmar usuários durante o cadastro
 * Remove a necessidade de confirmação de email para simplificar o fluxo
 * 
 * TODO: Implementar MFA via SMS quando necessário
 */
export const handler = async (event: any) => {
  // Auto-confirma o usuário
  event.response.autoConfirmUser = true;
  event.response.autoVerifyEmail = true;
  
  return event;
};
