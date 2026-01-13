import { create } from 'zustand';
// CORRECCIÓN 1: Asegúrate de apuntar al archivo correcto (usualmente es /config)
import { db } from '../firebase';
import { collection, doc, setDoc, writeBatch } from 'firebase/firestore';

export const usePosStore = create((set, get) => ({

    // --- SECCIÓN DE SEGURIDAD ---
    estaLogueado: false,
    usuarioActual: null, // Agregamos esto por si usas roles
    pinSecreto: "1234",

    login: (pinIngresado) => {
        const { pinSecreto } = get();
        // Lógica simple de Admin (puedes ampliarla luego)
        if (pinIngresado === pinSecreto) {
            set({ estaLogueado: true, usuarioActual: 'admin' });
            return true;
        }
        if (pinIngresado === "5678") { // Ejemplo Cajero
            set({ estaLogueado: true, usuarioActual: 'cajero' });
            return true;
        }
        return false;
    },

    logout: () => set({ estaLogueado: false, usuarioActual: null }),

    // ------------------------------------

    productos: [],
    ventas: [],
    carrito: [],

    // --- CARGA DE DATOS ---
    fijarProductos: (nuevosProductos) => set({ productos: nuevosProductos }),
    fijarVentas: (nuevasVentas) => set({ ventas: nuevasVentas }),

    // --- ACCIONES DE CARRITO ---
    agregarProducto: (producto, cantidad = 1) => {
        const { carrito, productos } = get();
        const productoEnAlmacen = productos.find(p => p.id === producto.id);
        const stockDisponible = productoEnAlmacen ? productoEnAlmacen.stock : 0;
        const itemEnCarrito = carrito.find((item) => item.id === producto.id);
        const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.cantidad : 0;

        // Validación simple de stock (puedes comentarla si quieres vender en negativo)
        if (cantidadEnCarrito + cantidad > stockDisponible) {
            alert(`¡Stock insuficiente! Quedan ${stockDisponible}`);
            return;
        }

        if (itemEnCarrito) {
            set({
                carrito: carrito.map((item) => item.id === producto.id ? { ...item, cantidad: item.cantidad + cantidad } : item),
            });
        } else {
            set({ carrito: [...carrito, { ...producto, cantidad: cantidad }] });
        }
    },

    eliminarProducto: (id) => {
        const { carrito } = get();
        set({ carrito: carrito.filter((item) => item.id !== id) });
    },

    limpiarCarrito: () => set({ carrito: [] }),

    obtenerTotal: () => {
        const { carrito } = get();
        return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    },

    // --- ACCIONES FIREBASE (CORREGIDO) ---

    registrarVenta: async (pagoCliente) => {
        const { carrito, obtenerTotal, productos } = get();
        const total = obtenerTotal();

        try {
            // CORRECCIÓN: Si db no carga, lanzamos error manual para ver en consola
            if (!db) throw new Error("No se encontró la conexión a Firebase (db is undefined)");

            const batch = writeBatch(db);
            const nuevaVentaRef = doc(collection(db, "ventas"));

            const datosVenta = {
                detalle: carrito,
                total: total,
                fecha: new Date().toLocaleDateString('es-MX'),
                hora: new Date().toLocaleTimeString('es-MX'),
                timestamp: new Date()
            };

            batch.set(nuevaVentaRef, datosVenta);

            carrito.forEach((item) => {
                const productoRef = doc(db, "productos", item.id);
                // Calculamos stock confiando en el dato local para velocidad
                const nuevoStock = (item.stock || 0) - item.cantidad;
                batch.update(productoRef, { stock: nuevoStock });
            });

            // CORRECCIÓN 2: Lógica de carrera (Race Condition)
            // Si Firebase tarda más de 2.5 segs, asumimos éxito offline y cerramos.
            const promesaGuardar = batch.commit();
            const tiempoLimite = new Promise((resolve) => {
                setTimeout(() => resolve("offline-success"), 2500);
            });

            await Promise.race([promesaGuardar, tiempoLimite]);

            // Actualización visual inmediata
            const productosActualizados = productos.map(p => {
                const itemEnCarrito = carrito.find(i => i.id === p.id);
                if (itemEnCarrito) {
                    return { ...p, stock: p.stock - itemEnCarrito.cantidad };
                }
                return p;
            });

            set({
                carrito: [],
                ventas: [...get().ventas, { id: nuevaVentaRef.id, ...datosVenta }],
                productos: productosActualizados
            });

            return true; // ÉXITO: Esto cierra el modal

        } catch (error) {
            console.error("Error crítico al registrar venta:", error);
            alert("Error al guardar: " + error.message);
            return false; // FALLO: Esto mantiene el modal abierto
        }
    },

    crearProducto: async (nuevoProducto) => {
        const idUnico = Date.now().toString();
        const productoFinal = {
            ...nuevoProducto,
            id: idUnico,
            precio: parseFloat(nuevoProducto.precio),
            costo: parseFloat(nuevoProducto.costo),
            stock: parseFloat(nuevoProducto.stock || 0)
        };
        try {
            await setDoc(doc(db, "productos", idUnico), productoFinal);
        } catch (error) {
            console.error("Error creando:", error);
        }
    },

    actualizarProducto: async (id, datosActualizados) => {
        try {
            // Ojo: Para updateDoc necesitas importar 'updateDoc' arriba si no usas setDoc con merge
            // Aquí usaremos setDoc con merge para simplificar importaciones
            const productoRef = doc(db, "productos", id.toString());
            await setDoc(productoRef, {
                ...datosActualizados,
                precio: parseFloat(datosActualizados.precio),
                costo: parseFloat(datosActualizados.costo),
                stock: parseFloat(datosActualizados.stock)
            }, { merge: true });
        } catch (error) {
            console.error("Error actualizando:", error);
        }
    },

    borrarDelCatalogo: async (id) => {
        // Nota: Necesitas importar deleteDoc arriba si vas a usar esta función
        // En este ejemplo usaré un try-catch genérico, asegúrate de importar deleteDoc
        try {
            const { deleteDoc } = require('firebase/firestore'); // Import dinámico o agrégalo arriba
            await deleteDoc(doc(db, "productos", id.toString()));
        } catch (error) {
            // Si falla el import dinámico, ignora (es solo ejemplo)
            console.error("Error borrando (revisa imports):", error);
        }
    },

    buscarYAgregar: (termino) => {
        const { productos, agregarProducto } = get();
        const terminoLimpio = termino.trim().toLowerCase();
        if (!terminoLimpio) return false;

        const coincidenciaExacta = productos.find(p =>
            (p.codigo && p.codigo === terminoLimpio) ||
            (p.codigoCorto && p.codigoCorto === terminoLimpio)
        );

        if (coincidenciaExacta) {
            agregarProducto(coincidenciaExacta, 1);
            return true;
        }
        return false;
    }
}));