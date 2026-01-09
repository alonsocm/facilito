import { create } from 'zustand';
// Nota: Quitamos 'persist' porque ahora la persistencia es la Nube.
import { db } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';

export const usePosStore = create((set, get) => ({

    productos: [],
    ventas: [],
    carrito: [],

    // --- CARGA DE DATOS (Sincronización) ---
    // Esta función la llamaremos desde un componente "Escucha"
    fijarProductos: (nuevosProductos) => set({ productos: nuevosProductos }),
    fijarVentas: (nuevasVentas) => set({ ventas: nuevasVentas }),

    // --- ACCIONES DE CARRITO (LOCALES) ---
    // El carrito sigue siendo local, no necesitamos subirlo a la nube hasta vender
    agregarProducto: (producto, cantidad = 1) => {
        const { carrito, productos } = get();
        const productoEnAlmacen = productos.find(p => p.id === producto.id);
        const stockDisponible = productoEnAlmacen ? productoEnAlmacen.stock : 0;
        const itemEnCarrito = carrito.find((item) => item.id === producto.id);
        const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.cantidad : 0;

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

    // --- ACCIONES QUE ESCRIBEN EN FIREBASE ---

    // 1. REGISTRAR VENTA
    registrarVenta: async (pagoCliente) => {
        const { carrito, obtenerTotal, productos } = get();
        const total = obtenerTotal();

        // A. Crear objeto venta
        const nuevaVenta = {
            id: Date.now().toString(), // ID temporal
            hora: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
            fecha: new Date().toLocaleDateString('es-MX'), // Agregamos fecha para reportes futuros
            timestamp: new Date(), // Para ordenar cronológicamente
            total: total,
            pago: pagoCliente,
            cambio: pagoCliente - total,
            articulos: carrito.length,
            detalle: carrito // Guardamos qué se vendió
        };

        try {
            // B. Subir Venta a Firebase
            // Usamos el ID como nombre del documento para evitar duplicados
            await setDoc(doc(db, "ventas", nuevaVenta.id), nuevaVenta);

            // C. Restar Inventario en Firebase (Uno por uno)
            carrito.forEach(async (item) => {
                const productoRef = doc(db, "productos", item.id.toString());
                // Buscamos el producto original para tener el stock exacto
                const productoOriginal = productos.find(p => p.id === item.id);
                if (productoOriginal) {
                    const nuevoStock = parseFloat((productoOriginal.stock - item.cantidad).toFixed(3));
                    await updateDoc(productoRef, { stock: nuevoStock });
                }
            });

            // D. Limpiar carrito local
            set({ carrito: [] });

        } catch (error) {
            console.error("Error al registrar venta:", error);
            alert("Hubo un error al guardar la venta en la nube.");
        }
    },

    // 2. CREAR PRODUCTO
    crearProducto: async (nuevoProducto) => {
        const idUnico = Date.now().toString(); // Usamos timestamp como ID string
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
            console.error("Error creando producto:", error);
        }
    },

    // 3. ACTUALIZAR PRODUCTO
    actualizarProducto: async (id, datosActualizados) => {
        try {
            const productoRef = doc(db, "productos", id.toString());
            await updateDoc(productoRef, {
                ...datosActualizados,
                precio: parseFloat(datosActualizados.precio),
                costo: parseFloat(datosActualizados.costo),
                stock: parseFloat(datosActualizados.stock)
            });
        } catch (error) {
            console.error("Error actualizando:", error);
        }
    },

    // 4. BORRAR PRODUCTO
    borrarDelCatalogo: async (id) => {
        try {
            await deleteDoc(doc(db, "productos", id.toString()));
        } catch (error) {
            console.error("Error borrando:", error);
        }
    },

    // --- BÚSQUEDA (IGUAL QUE ANTES) ---
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