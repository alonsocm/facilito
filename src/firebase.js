import { initializeApp } from "firebase/app";
import {
    getFirestore,
    enableIndexedDbPersistence,
    CACHE_SIZE_UNLIMITED
} from "firebase/firestore";

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

// 1. Inicializar App
const app = initializeApp(firebaseConfig);

// 2. Inicializar Firestore
const db = getFirestore(app);

// 3. --- ACTIVAR MODO OFFLINE (PERSISTENCIA) ---
// Esto hace que la base de datos funcione sin internet
enableIndexedDbPersistence(db, { forceOwnership: true })
    .then(() => {
        console.log("✅ Persistencia Offline Activada: El sistema funcionará sin internet.");
    })
    .catch((err) => {
        if (err.code == 'failed-precondition') {
            console.warn("⚠️ Error Offline: Tienes múltiples pestañas abiertas. Cierra las otras.");
        } else if (err.code == 'unimplemented') {
            console.warn("⚠️ Error Offline: Tu navegador no soporta almacenamiento local.");
        }
    });

export { db };