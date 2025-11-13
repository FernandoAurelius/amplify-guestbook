import { generateClient } from "aws-amplify/api";
import type { Schema } from '../../amplify/data/resource';

export type Message = Schema['Message']['type'];

const client = generateClient<Schema>();

export async function getMessages() {
    const response = await client.models.Message.list();
    return response.data;
}

export async function createMessage(text: string, authorEmail: string) {
    await client.models.Message.create({
        text,
        authorEmail,
    });
}

export async function likeMessage(id: string, currentLikes: number) {
    await client.models.Message.update({
        id,
        likes: currentLikes + 1,
    });
}
