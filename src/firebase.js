// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// --- PEGA AQUÍ TU CONFIGURACIÓN DE FIREBASE ---
const firebaseConfig = {
    apiKey: "AIzaSyDP_ocjjSOJWvDNF69WoRs1G7Wyf6_F-I8",
    authDomain: "facilito-108fa.firebaseapp.com",
    projectId: "facilito-108fa",
    storageBucket: "facilito-108fa.firebasestorage.app",
    messagingSenderId: "1055817566488",
    appId: "1:1055817566488:web:bd63c8d12737ebfa3b766d"
};
// ---------------------------------------------

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // Exportamos la referencia a la base de datos