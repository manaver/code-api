import { Client, Account } from "appwrite";

const client = new Client();

client.setEndpoint(process.env.APPWRITE_ENDPOINT).setProject(process.env.APPWRITE_PROJECT_ID);

export const account = new Account(client);

//Database
