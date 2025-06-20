import { defineBackend } from '@aws-amplify/backend';
import { Stack, RemovalPolicy } from 'aws-cdk-lib';
import {
  AttributeType, BillingMode, Table,
} from 'aws-cdk-lib/aws-dynamodb';
import {
  RestApi, Cors, LambdaIntegration,
  AuthorizationType, CognitoUserPoolsAuthorizer,
} from 'aws-cdk-lib/aws-apigateway';

import { auth } from './auth/resource';
import { messageApi } from './functions/message-api/resource';
import { autoConfirm } from './functions/auto-confirm/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  messageApi,
  autoConfirm,
});

/* ---- Dados ---------------------------------------------------------------- */
const dataStack = backend.createStack("data");
const messagesTable = new Table(dataStack, "Messages", {
  partitionKey: { name: "id", type: AttributeType.STRING },
  sortKey: { name: "createdAt", type: AttributeType.STRING },
  billingMode: BillingMode.PAY_PER_REQUEST,
  removalPolicy: RemovalPolicy.DESTROY,
});

/* ---- API ------------------------------------------------------------------ */
const apiStack = backend.createStack("api");
const api = new RestApi(apiStack, "GuestbookApi", {
  restApiName: "guestbook",
  deployOptions: { stageName: "dev", cacheClusterEnabled: false },
  defaultCorsPreflightOptions: {
    allowOrigins: Cors.ALL_ORIGINS,
    allowMethods: Cors.ALL_METHODS,
    allowHeaders: Cors.DEFAULT_HEADERS,
  },
});

// Configurar a função Lambda com acesso à tabela
backend.messageApi.addEnvironment("TABLE_NAME", messagesTable.tableName);
messagesTable.grantReadWriteData(backend.messageApi.resources.lambda);

// Configurar autorização
const authorizer = new CognitoUserPoolsAuthorizer(apiStack, "GuestbookAuthorizer", {
  cognitoUserPools: [backend.auth.resources.userPool],
});

const lambdaInt = new LambdaIntegration(backend.messageApi.resources.lambda);
const messages = api.root.addResource("messages");

// GET /messages - público
messages.addMethod("GET", lambdaInt);

// POST /messages - autenticado  
messages.addMethod("POST", lambdaInt, {
  authorizationType: AuthorizationType.COGNITO,
  authorizer: authorizer,
});

// PATCH /messages - autenticado
messages.addMethod("PATCH", lambdaInt, {
  authorizationType: AuthorizationType.COGNITO,
  authorizer: authorizer,
});

// Exportar URL da API
backend.addOutput({
  custom: {
    API_URL: api.url,
  },
});
