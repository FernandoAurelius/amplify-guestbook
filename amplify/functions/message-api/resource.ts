import { defineFunction } from '@aws-amplify/backend';

export const messageApi = defineFunction({
  name: 'message-api',
  entry: './handler.ts',
});