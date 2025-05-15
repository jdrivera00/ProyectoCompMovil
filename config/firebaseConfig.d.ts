// app/config/firebaseConfig.d.ts
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';

declare module '../../config/firebaseConfig' {
  export const app: FirebaseApp;
  export const auth: Auth;
  export const db: Firestore;
}