import { defineFunction } from '@aws-amplify/backend';

export const autoConfirm = defineFunction({
  name: 'auto-confirm',
  entry: './handler.ts'
});
