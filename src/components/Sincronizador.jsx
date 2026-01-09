import { useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { usePosStore } from '../store/usePosStore';

export const Sincronizador = () => {
    const { fijarProductos, fijarVentas } = usePosStore();

    useEffect(() => {
        // 1. Escuchar PRODUCTOS
        const qProductos = query(collection(db, "productos"));
        const unsubscribeProductos = onSnapshot(qProductos, (snapshot) => {
            const productosArray = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id // Aseguramos que el ID sea string
            }));
            fijarProductos(productosArray);
            console.log("📦 Inventario sincronizado desde la nube");
        });

        // 2. Escuchar VENTAS (Ordenadas por fecha reciente)
        // Nota: 'desc' significa descendente (lo más nuevo arriba)
        const qVentas = query(collection(db, "ventas"), orderBy("timestamp", "desc"));
        const unsubscribeVentas = onSnapshot(qVentas, (snapshot) => {
            const ventasArray = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            fijarVentas(ventasArray);
            console.log("💰 Ventas sincronizadas desde la nube");
        });

        // Limpieza al cerrar la app
        return () => {
            unsubscribeProductos();
            unsubscribeVentas();
        };
    }, []);

    return null; // Este componente no pinta nada visual
};