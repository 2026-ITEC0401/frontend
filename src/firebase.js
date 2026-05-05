// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // 🔥 Firestore 임포트 추가

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCDGVetHsBphvMgMfxxzS2ILQYOe71RXvA",
    authDomain: "hearo-74382.firebaseapp.com",
    projectId: "hearo-74382",
    storageBucket: "hearo-74382.firebasestorage.app",
    messagingSenderId: "569868716660",
    appId: "1:569868716660:web:7d06b1064ca52423599f21",
    measurementId: "G-2PTE8BK6GD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 🔥 Firestore 초기화 및 내보내기 (MainPage.jsx에서 import { db } 로 사용)
export const db = getFirestore(app);