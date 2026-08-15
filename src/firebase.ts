import {
  initializeApp,
  type FirebaseOptions,
  type FirebaseApp,
} from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyCDGVetHsBphvMgMfxxzS2ILQYOe71RXvA",
  authDomain: "hearo-74382.firebaseapp.com",
  projectId: "hearo-74382",
  storageBucket: "hearo-74382.firebasestorage.app",
  messagingSenderId: "569868716660",
  appId: "1:569868716660:web:7d06b1064ca52423599f21",
  measurementId: "G-2PTE8BK6GD",
};

// Firebase 초기화
const app: FirebaseApp = initializeApp(firebaseConfig);

// Firestore 초기화 및 내보내기 => MainPage.jsx에서 import { db } 로 사용
export const db: Firestore = getFirestore(app);
