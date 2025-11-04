import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyD_MnGaaq9v3miO-VvpotNqYVPaX9iKfU0",
    authDomain: "edunotas-web.firebaseapp.com",
    projectId: "edunotas-web",
    storageBucket: "edunotas-web.firebasestorage.app",
    messagingSenderId: "400225507111",
    appId: "1:400225507111:web:24dde71cd319077b55bb02",
    measurementId: "G-3QLM3VYYDE"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);