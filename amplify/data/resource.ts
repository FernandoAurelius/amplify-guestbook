import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Message: a
    .model({
      id: a.id(),
      text: a.string().required().validate(v => v.maxLength(500, 'Texto da mensagem pode ter no máximo 500 caracteres!')),
      authorEmail: a.string(),
      likes: a.integer().default(0),
      createdAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(['read']),
      allow.authenticated().to(['create', 'read', 'update'])
    ])
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: { expiresInDays: 7 }
  },
});
