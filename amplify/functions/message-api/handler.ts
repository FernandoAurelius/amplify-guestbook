import type { APIGatewayProxyHandler } from "aws-lambda";
import {
  DynamoDBClient, ScanCommand, PutItemCommand, UpdateItemCommand, GetItemCommand
} from "@aws-sdk/client-dynamodb";
import { nanoid } from "nanoid";

const ddb = new DynamoDBClient({});
const TABLE_NAME = process.env.TABLE_NAME!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS"
};

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: "",
    };
  }

  try {
    if (event.httpMethod === "GET") {
      // Lista todas as mensagens
      const result = await ddb.send(new ScanCommand({ 
        TableName: TABLE_NAME 
      }));      // Converter formato DynamoDB para JSON simples
      const messages = result.Items?.map(item => ({
        id: item.id?.S || '',
        text: item.text?.S || '',
        title: item.title?.S || '',
        icon: item.icon?.S || '💭',
        userEmail: item.userEmail?.S || '',
        userName: item.userName?.S || 'Anônimo',
        likes: parseInt(item.likes?.N || "0"),
        createdAt: item.createdAt?.S || new Date().toISOString(),
      })) || [];

      // Ordenar por data de criação (mais recente primeiro)
      messages.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(messages),
      };
    }

        if (event.httpMethod === "POST") {
      // Criar nova mensagem
      const { text, title, icon, userEmail, userName } = JSON.parse(event.body ?? "{}");
      
      if (!text || text.trim().length === 0) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: "Text is required" }),
        };
      }

      const now = new Date().toISOString();
      const item = {
        id: { S: nanoid() },
        text: { S: text.trim() },
        title: { S: title?.trim() || '' },
        icon: { S: icon || '💭' },
        userEmail: { S: userEmail || '' },
        userName: { S: userName || 'Anônimo' },
        likes: { N: "0" },
        createdAt: { S: now },
      };

      await ddb.send(new PutItemCommand({
        TableName: TABLE_NAME,
        Item: item,
      }));

      // Retornar item no formato JSON simples
      const message = {
        id: item.id.S!,
        text: item.text.S!,
        title: item.title.S!,
        icon: item.icon.S!,
        userEmail: item.userEmail.S!,
        userName: item.userName.S!,
        likes: 0,
        createdAt: item.createdAt.S!,
      };

      return {
        statusCode: 201,
        headers: corsHeaders,
        body: JSON.stringify(message),
      };
    }

    if (event.httpMethod === "PATCH") {
      // Incrementar likes da mensagem
      const { id } = JSON.parse(event.body ?? "{}");
      
      if (!id) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: "ID is required" }),
        };
      }      // Primeiro verificar se a mensagem existe
      const getResult = await ddb.send(new GetItemCommand({
        TableName: TABLE_NAME,
        Key: { id: { S: id } },
      }));

      if (!getResult.Item) {
        return {
          statusCode: 404,
          headers: corsHeaders,
          body: JSON.stringify({ error: "Message not found" }),
        };
      }

      // Incrementar likes
      const updateResult = await ddb.send(new UpdateItemCommand({
        TableName: TABLE_NAME,
        Key: { id: { S: id } },
        UpdateExpression: "ADD likes :inc",
        ExpressionAttributeValues: { ":inc": { N: "1" } },
        ReturnValues: "ALL_NEW",
      }));      // Retornar item atualizado no formato JSON simples
      const updatedMessage = {
        id: updateResult.Attributes!.id.S!,
        text: updateResult.Attributes!.text.S!,
        title: updateResult.Attributes!.title?.S || '',
        icon: updateResult.Attributes!.icon?.S || '💭',
        userEmail: updateResult.Attributes!.userEmail?.S || '',
        userName: updateResult.Attributes!.userName?.S || 'Anônimo',
        likes: parseInt(updateResult.Attributes!.likes.N!),
        createdAt: updateResult.Attributes!.createdAt.S!,
      };

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(updatedMessage),
      };
    }

    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};