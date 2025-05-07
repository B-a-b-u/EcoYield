import { Client, Account, Avatars } from 'react-native-appwrite';

export const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('681a24140016a4c5ac87')
    .setPlatform('com.sbr.ecoyield');

export const account = new Account(client);
export const avatars = new Avatars(client);
