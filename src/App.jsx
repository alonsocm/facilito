import React, { useState, useRef, useEffect } from 'react';
import { usePosStore } from './store/usePosStore';
import { Sincronizador } from './components/Sincronizador';
import { useReactToPrint } from 'react-to-print';

// --- COMPONENTES ---
import { BotonProducto } from './components/BotonProducto';
import { TicketVenta } from './components/TicketVenta';
import { ModalPago } from './components/ModalPago';
import { ModalInventario } from './components/ModalInventario';
import { Dashboard } from './components/Dashboard'; // Usamos el Dashboard nuevo
import { ModalGranel } from './components/ModalGranel';
import { EscanerCamara } from './components/EscanerCamara';
import { TicketImprimible } from './components/TicketImprimible';
import { PantallaBloqueo } from './components/PantallaBloqueo'; // <--- IMPORTAR

// --- ICONOS ---
import { Settings, Store, Search, X, ScanBarcode, ChevronUp, ChevronDown, ShoppingBag, LogOut } from 'lucide-react';

function App() {
  // 1. --- TODOS LOS HOOKS PRIMERO (SIEMPRE ARRIBA) ---
  const {
    productos,
    agregarProducto,
    registrarVenta,
    obtenerTotal,
    ventas,
    buscarYAgregar,
    carrito,
    estaLogueado, // <--- Seguridad
    logout        // <--- Seguridad
  } = usePosStore();

  const [mostrarPago, setMostrarPago] = useState(false);
  const [mostrarInventario, setMostrarInventario] = useState(false);
  const [mostrarDashboard, setMostrarDashboard] = useState(false);
  const [productoAGranel, setProductoAGranel] = useState(null);
  const [mostrarScanner, setMostrarScanner] = useState(false);
  const [ticketMovilAbierto, setTicketMovilAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const inputBusquedaRef = useRef(null);
  const ticketRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: ticketRef,
    documentTitle: 'Ticket Venta',
  });

  useEffect(() => {
    const manejarTecladoGlobal = (e) => {
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
      if (e.key.length === 1) inputBusquedaRef.current?.focus();
    };
    window.addEventListener('keydown', manejarTecladoGlobal);
    return () => window.removeEventListener('keydown', manejarTecladoGlobal);
  }, []);

  // 2. --- FUNCIONES LÓGICAS ---
  const manejarEnterBusqueda = (e) => {
    if (e.key === 'Enter' && busqueda) {
      const fueAgregado = buscarYAgregar(busqueda);
      if (fueAgregado) setBusqueda('');
    }
  };

  const manejarCobro = async (pagoCliente) => {
    // 1. Guardamos el resultado (true o false)
    const exito = await registrarVenta(pagoCliente);

    // 2. SI FALLÓ, NOS DETENEMOS AQUÍ.
    // El usuario verá la alerta de error y el modal seguirá abierto para que intente de nuevo.
    if (!exito) return;

    // 3. SI TUVO ÉXITO, CONTINUAMOS...
    setMostrarPago(false);
    setTicketMovilAbierto(false);

    if (confirm("¿Imprimir ticket?")) {
      setTimeout(() => handlePrint(), 500);
    }
  };

  const manejarSeleccionProducto = (producto) => {
    if (producto.esGranel) {
      setProductoAGranel(producto);
    } else {
      agregarProducto(producto, 1);
      setBusqueda('');
      inputBusquedaRef.current?.focus();
    }
  };

  const productosFiltrados = productos.filter(producto => {
    if (!busqueda) return true;
    const termino = busqueda.toLowerCase();
    return producto.nombre.toLowerCase().includes(termino) ||
      (producto.codigo && producto.codigo.includes(termino)) ||
      (producto.codigoCorto && producto.codigoCorto === termino);
  });

  // 3. --- EL GUARDIÁN DE SEGURIDAD (AHORA SÍ VA AQUÍ) ---
  // Justo antes del return final, cuando ya se cargaron todos los hooks.
  if (!estaLogueado) {
    return <PantallaBloqueo />;
  }

  // 4. --- RENDER PRINCIPAL ---
  return (
    <div className="flex flex-col lg:flex-row h-[100dvh] bg-facilito-fondo overflow-hidden relative">

      <Sincronizador />

      {/* --- SECCIÓN IZQUIERDA (CATÁLOGO) --- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">

        {/* HEADER */}
        <header className="bg-white p-2 sm:p-3 shadow-sm border-b border-gray-200 flex justify-between items-center shrink-0 z-20">
          <h1 className="text-lg sm:text-2xl font-black text-facilito-azul tracking-tighter flex items-center gap-1 sm:gap-2 truncate mr-2">
            <span className="hidden sm:inline">ABARROTES</span>
            <span className="text-facilito-verde">FACILITO</span>
          </h1>

          <div className="flex items-center gap-2 shrink-0">
            {/* Botón Dashboard */}
            <button
              onClick={() => setMostrarDashboard(true)}
              className="flex items-center gap-1 sm:gap-2 bg-gray-100 text-facilito-azul px-2 py-1.5 sm:px-3 sm:py-2 rounded-full font-bold hover:bg-blue-100 active:scale-95 transition-transform"
            >
              <Store size={18} className="sm:w-5 sm:h-5" />
              {ventas.length > 0 && (
                <span className="bg-facilito-rojo text-white text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full">
                  {ventas.length}
                </span>
              )}
            </button>

            {/* Botón Inventario */}
            <button
              onClick={() => setMostrarInventario(true)}
              className="p-2 text-gray-500 hover:text-facilito-azul bg-gray-50 hover:bg-blue-50 rounded-full transition-colors active:scale-95"
            >
              <Settings size={22} className="sm:w-6 sm:h-6" />
            </button>

            {/* Botón Salir (Logout) */}
            <button
              onClick={() => {
                if (confirm("¿Cerrar sesión y bloquear?")) logout();
              }}
              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors active:scale-95"
              title="Bloquear Terminal"
            >
              <LogOut size={22} className="sm:w-6 sm:h-6" />
            </button>
          </div>
        </header>

        {/* BUSCADOR */}
        <div className="p-3 bg-white border-b border-gray-200 shadow-sm z-10">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${busqueda ? 'text-facilito-azul' : 'text-gray-400'}`} size={20} />
              <input
                ref={inputBusquedaRef}
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                onKeyDown={manejarEnterBusqueda}
                placeholder="Buscar..."
                className="w-full pl-10 pr-10 py-3 text-lg font-bold border-2 border-gray-300 rounded-xl focus:border-facilito-azul outline-none"
              />
              {busqueda && (
                <button onClick={() => { setBusqueda(''); inputBusquedaRef.current.focus(); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <X size={20} />
                </button>
              )}
            </div>
            <button
              onClick={() => setMostrarScanner(true)}
              className="bg-facilito-azul text-white p-3 rounded-xl shadow-md hover:bg-blue-800"
            >
              <ScanBarcode size={24} />
            </button>
          </div>
        </div>

        {/* GRID PRODUCTOS */}
        <main className="flex-1 overflow-y-auto p-2 bg-gray-100 pb-24 lg:pb-4">
          {productosFiltrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400 opacity-60 mt-10">
              <Search size={48} className="mb-2" />
              <p className="text-lg font-bold">Sin resultados</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 lg:gap-4">
              {productosFiltrados.map((producto) => (
                <BotonProducto
                  key={producto.id}
                  producto={producto}
                  alHacerClick={() => manejarSeleccionProducto(producto)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* --- SECCIÓN DERECHA (TICKET DESKTOP) --- */}
      <div className="hidden lg:block w-[400px] xl:w-[450px] shadow-2xl z-20 border-l border-gray-300 bg-white h-full">
        <TicketVenta alPresionarCobrar={() => setMostrarPago(true)} />
      </div>

      {/* --- BARRA FLOTANTE MÓVIL (SOLO MÓVIL) --- */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-facilito-negro text-white p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.2)] z-30 flex justify-between items-center cursor-pointer active:bg-gray-800 transition-colors"
        onClick={() => setTicketMovilAbierto(!ticketMovilAbierto)}>

        <div className="flex flex-col">
          <span className="text-xs text-gray-400 font-bold uppercase flex items-center gap-1">
            {ticketMovilAbierto ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            {carrito.length} Artículos
          </span>
          <span className="text-2xl font-black text-facilito-verde">${obtenerTotal().toFixed(2)}</span>
        </div>

        <button
          className="bg-white text-facilito-negro px-6 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2"
        >
          <ShoppingBag size={18} />
          VER ORDEN
        </button>
      </div>

      {/* --- MODAL TICKET MÓVIL (CAJÓN) --- */}
      {ticketMovilAbierto && (
        <div className="lg:hidden fixed inset-0 z-40 flex flex-col justify-end bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="flex-1" onClick={() => setTicketMovilAbierto(false)}></div>

          <div className="bg-white rounded-t-3xl h-[85vh] shadow-2xl overflow-hidden flex flex-col animate-slide-up">
            <div className="w-full flex justify-center pt-3 pb-1" onClick={() => setTicketMovilAbierto(false)}>
              <div className="w-16 h-1.5 bg-gray-300 rounded-full"></div>
            </div>

            <div className="flex-1 overflow-hidden relative">
              <TicketVenta alPresionarCobrar={() => setMostrarPago(true)} />

              <button
                onClick={() => setTicketMovilAbierto(false)}
                className="absolute top-2 right-4 p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-500"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODALES --- */}
      {mostrarPago && <ModalPago total={obtenerTotal()} cerrarModal={() => setMostrarPago(false)} completarVenta={manejarCobro} />}
      {mostrarInventario && <ModalInventario cerrarModal={() => setMostrarInventario(false)} />}
      {mostrarDashboard && <Dashboard cerrarModal={() => setMostrarDashboard(false)} />}

      {productoAGranel && (
        <ModalGranel
          producto={productoAGranel}
          cerrarModal={() => setProductoAGranel(null)}
          confirmarAgregar={(cantidad) => {
            agregarProducto(productoAGranel, cantidad);
            setProductoAGranel(null);
            setBusqueda('');
            inputBusquedaRef.current?.focus();
          }}
        />
      )}

      {mostrarScanner && (
        <EscanerCamara
          cerrar={() => setMostrarScanner(false)}
          onScan={(codigo) => {
            setMostrarScanner(false);
            const encontrado = buscarYAgregar(codigo);
            if (!encontrado) {
              setBusqueda(codigo);
              alert('Producto no encontrado');
            }
          }}
        />
      )}

      {/* TICKET IMPRIMIBLE */}
      <div style={{ display: 'none' }}>
        <TicketImprimible ref={ticketRef} venta={ventas[0]} />
      </div>

    </div>
  );
}

export default App;