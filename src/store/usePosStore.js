import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const usePosStore = create(
    persist(
        (set, get) => ({

            // 1. PRODUCTOS CON STOCK INICIAL (NUEVO CAMPO 'stock')
            productos: [
                { id: 1, nombre: 'Coca-Cola 600ml', precio: 19.00, costo: 14.50, codigo: '7501055300075', esGranel: false, stock: 24, categoria: 'Bebidas' },
                { id: 4, nombre: 'Huevo Blanco Kg', precio: 58.00, costo: 42.00, codigoCorto: '10', esGranel: true, stock: 15.5, categoria: 'Canasta' }, // Stock decimal para granel
                { id: 9, nombre: 'Jamón Virginia Kg', precio: 140.00, costo: 90.00, codigoCorto: '50', esGranel: true, stock: 5.200, categoria: 'Salchichonería' },
                { id: 10, nombre: 'Queso Panela Kg', precio: 120.00, costo: 80.00, codigoCorto: '60', esGranel: true, stock: 3.000, categoria: 'Lácteos' },
                // ... puedes agregar más productos con stock aquí
            ],

            carrito: [],
            ventas: [],

            // --- ACCIONES ---

            // 2. AGREGAR CON VALIDACIÓN DE STOCK (MODIFICADO)
            agregarProducto: (producto, cantidad = 1) => {
                const { carrito, productos } = get();

                // Buscamos el stock real actual del producto
                const productoEnAlmacen = productos.find(p => p.id === producto.id);
                const stockDisponible = productoEnAlmacen ? productoEnAlmacen.stock : 0;

                // Buscamos si ya tenemos algo en el carrito
                const itemEnCarrito = carrito.find((item) => item.id === producto.id);
                const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.cantidad : 0;

                // VERIFICACIÓN: ¿Alcanza el stock?
                if (cantidadEnCarrito + cantidad > stockDisponible) {
                    alert(`¡No hay suficiente stock! Solo quedan ${stockDisponible}`);
                    return; // Detenemos la función, no agrega nada
                }

                // Si pasa la validación, agregamos normal
                if (itemEnCarrito) {
                    set({
                        carrito: carrito.map((item) =>
                            item.id === producto.id
                                ? { ...item, cantidad: item.cantidad + cantidad }
                                : item
                        ),
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
            borrarHistorialDia: () => set({ ventas: [] }),

            obtenerTotal: () => {
                const { carrito } = get();
                return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
            },

            // 3. REGISTRAR VENTA Y RESTAR INVENTARIO (MODIFICADO)
            registrarVenta: (pagoCliente) => {
                const { carrito, obtenerTotal, ventas, productos } = get();
                const total = obtenerTotal();

                // A. Restamos del inventario (Stock)
                const productosActualizados = productos.map(producto => {
                    const itemVendido = carrito.find(c => c.id === producto.id);
                    if (itemVendido) {
                        return {
                            ...producto,
                            stock: parseFloat((producto.stock - itemVendido.cantidad).toFixed(3)) // Restamos y cuidamos decimales
                        };
                    }
                    return producto;
                });

                // B. Guardamos la venta en el historial
                const nuevaVenta = {
                    id: Date.now(),
                    hora: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
                    total: total,
                    pago: pagoCliente,
                    cambio: pagoCliente - total,
                    articulos: carrito.length
                };

                set({
                    productos: productosActualizados, // Guardamos el nuevo stock reducido
                    ventas: [nuevaVenta, ...ventas],
                    carrito: []
                });
            },

            // --- BÚSQUEDA ---
            buscarYAgregar: (termino) => {
                const { productos, agregarProducto } = get();
                const terminoLimpio = termino.trim().toLowerCase();
                if (!terminoLimpio) return false;

                const coincidenciaExacta = productos.find(p =>
                    p.codigo === terminoLimpio || p.codigoCorto === terminoLimpio
                );

                if (coincidenciaExacta) {
                    agregarProducto(coincidenciaExacta, 1);
                    return true;
                }
                return false;
            },

            // --- INVENTARIO ---
            crearProducto: (nuevoProducto) => {
                const { productos } = get();
                const productoConId = {
                    ...nuevoProducto,
                    id: Date.now(),
                    precio: parseFloat(nuevoProducto.precio),
                    costo: parseFloat(nuevoProducto.costo),
                    stock: parseFloat(nuevoProducto.stock || 0) // Guardamos stock inicial
                };
                set({ productos: [...productos, productoConId] });
            },

            borrarDelCatalogo: (id) => {
                const { productos } = get();
                set({ productos: productos.filter(p => p.id !== id) });
            },

            // ACTUALIZAR (¡NUEVO!) <--- ESTO ES LO QUE NECESITAMOS
            actualizarProducto: (id, datosActualizados) => {
                const { productos } = get();
                set({
                    productos: productos.map(p =>
                        p.id === id
                            ? {
                                ...p, ...datosActualizados, // Mantenemos ID, sobrescribimos lo demás
                                precio: parseFloat(datosActualizados.precio),
                                costo: parseFloat(datosActualizados.costo),
                                stock: parseFloat(datosActualizados.stock)
                            }
                            : p
                    )
                });
            },

        }),
        { name: 'facilito-storage' }
    )
);