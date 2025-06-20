import { type ClientSchema, a, defineData } from '@aws-amplify/backend'

const schema = a.schema({
  Message: a
    .model({
      text: a.string().required(),
      likes: a.integer().default(0),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(['read']),
      allow.authenticated().to(['create', 'update']),
    ]),
})

export type Schema = ClientSchema<typeof schema>

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
})
