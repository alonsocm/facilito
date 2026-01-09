import React, { useState, useRef, useEffect } from 'react';
import { usePosStore } from './store/usePosStore';

// --- COMPONENTES ---
import { BotonProducto } from './components/BotonProducto';
import { TicketVenta } from './components/TicketVenta';
import { ModalPago } from './components/ModalPago';
import { ModalInventario } from './components/ModalInventario';
import { ModalCorte } from './components/ModalCorte';
import { ModalGranel } from './components/ModalGranel'; // <--- ¡ESTA FALTABA SEGURO!
import { EscanerCamara } from './components/EscanerCamara'; // <--- IMPORTAR

// --- ICONOS ---
import { Settings, Store, Search, X, ScanBarcode } from 'lucide-react';

function App() {
  const {
    productos,
    agregarProducto,
    registrarVenta,
    obtenerTotal,
    ventas,
    buscarYAgregar
  } = usePosStore();

  // --- ESTADOS DE LA INTERFAZ ---
  const [mostrarPago, setMostrarPago] = useState(false);
  const [mostrarInventario, setMostrarInventario] = useState(false);
  const [mostrarCorte, setMostrarCorte] = useState(false);

  // Estado para el modal de productos a granel (Huevo, Jamón, etc.)
  const [productoAGranel, setProductoAGranel] = useState(null); // <--- ESTE ESTADO ES CRÍTICO

  // --- BUSCADOR ---
  const [busqueda, setBusqueda] = useState("");
  const inputBusquedaRef = useRef(null);
  const [mostrarScanner, setMostrarScanner] = useState(false);

  // --- LÓGICA DE FOCO (Para el lector de barras) ---
  useEffect(() => {
    const manejarTecladoGlobal = (e) => {
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
      if (e.key.length === 1) inputBusquedaRef.current.focus();
    };
    window.addEventListener('keydown', manejarTecladoGlobal);
    return () => window.removeEventListener('keydown', manejarTecladoGlobal);
  }, []);

  // --- MANEJADORES ---
  const manejarEnterBusqueda = (e) => {
    if (e.key === 'Enter' && busqueda) {
      const fueAgregado = buscarYAgregar(busqueda);
      if (fueAgregado) setBusqueda('');
    }
  };

  const manejarCobro = () => {
    registrarVenta(0);
    setMostrarPago(false);
    alert('¡Venta cobrada con éxito!');
  };

  // --- SELECCIÓN INTELIGENTE DE PRODUCTO ---
  const manejarSeleccionProducto = (producto) => {
    if (producto.esGranel) {
      // 1. Si es a granel, abrimos el modal especial
      setProductoAGranel(producto);
    } else {
      // 2. Si es normal, agregamos directo
      agregarProducto(producto, 1);
      setBusqueda('');
      inputBusquedaRef.current.focus();
    }
  };

  // --- FILTRO VISUAL ---
  const productosFiltrados = productos.filter(producto => {
    if (!busqueda) return true;
    const termino = busqueda.toLowerCase();
    return producto.nombre.toLowerCase().includes(termino) ||
      producto.codigo?.includes(termino) ||
      producto.codigoCorto === termino;
  });

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-facilito-fondo overflow-hidden">

      {/* SECCIÓN IZQUIERDA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="bg-white p-3 shadow-sm border-b border-gray-200 flex justify-between items-center shrink-0">
          <h1 className="text-xl lg:text-2xl font-black text-facilito-azul tracking-tighter flex items-center gap-2">
            ABARROTES <span className="text-facilito-verde">FACILITO</span>
          </h1>
          <div className="flex items-center gap-2">
            <button onClick={() => setMostrarCorte(true)} className="flex items-center gap-2 bg-gray-100 text-facilito-azul px-3 py-2 rounded-full font-bold hover:bg-blue-100">
              <Store size={20} />
              {ventas.length > 0 && <span className="bg-facilito-rojo text-white text-xs px-2 py-0.5 rounded-full">{ventas.length}</span>}
            </button>
            <button onClick={() => setMostrarInventario(true)} className="p-2 text-gray-400 hover:text-facilito-azul hover:bg-blue-50 rounded-full">
              <Settings size={24} />
            </button>
          </div>
        </header>

        {/* BARRA DE BÚSQUEDA */}
        <div className="p-4 bg-white border-b border-gray-200 shadow-sm z-10">
          <div className="relative">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${busqueda ? 'text-facilito-azul' : 'text-gray-400'}`} size={24} />
            <input
              ref={inputBusquedaRef}
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyDown={manejarEnterBusqueda}
              placeholder="Escanea o escribe..."
              className="w-full pl-12 pr-12 py-4 text-xl font-bold border-2 border-gray-300 rounded-2xl focus:border-facilito-azul focus:ring-4 focus:ring-blue-100 outline-none"
              autoFocus
            />
            {busqueda && (
              <button onClick={() => { setBusqueda(''); inputBusquedaRef.current.focus(); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-facilito-rojo">
                <X size={24} />
              </button>
            )}
          </div>
          {/* BOTÓN DE CÁMARA (Solo visible en móviles o si quieres usarlo siempre) */}
          <button
            onClick={() => setMostrarScanner(true)}
            className="bg-facilito-azul text-white p-4 rounded-2xl shadow-md hover:bg-blue-800 transition-colors"
            title="Abrir Cámara"
          >
            <ScanBarcode size={28} />
          </button>
        </div>

        {/* REJILLA DE PRODUCTOS */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
          {productosFiltrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-60">
              <Search size={64} className="mb-4" />
              <p className="text-2xl font-bold">No encontrado</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 pb-20 lg:pb-4">
              {productosFiltrados.map((producto) => (
                <BotonProducto
                  key={producto.id}
                  producto={producto}
                  // AQUÍ USAMOS LA NUEVA FUNCIÓN QUE DISCRIMINA SI ES GRANEL O NO
                  alHacerClick={() => manejarSeleccionProducto(producto)}
                />
              ))}
            </div>
          )}
        </main>

        {/* --- MODALES --- */}
        {mostrarPago && <ModalPago total={obtenerTotal()} cerrarModal={() => setMostrarPago(false)} completarVenta={manejarCobro} />}
        {mostrarInventario && <ModalInventario cerrarModal={() => setMostrarInventario(false)} />}
        {mostrarCorte && <ModalCorte ventas={ventas} cerrarModal={() => setMostrarCorte(false)} />}

        {/* EL MODAL DE GRANEL QUE DABA PROBLEMAS */}
        {productoAGranel && (
          <ModalGranel
            producto={productoAGranel}
            cerrarModal={() => setProductoAGranel(null)}
            confirmarAgregar={(cantidad) => {
              agregarProducto(productoAGranel, cantidad);
              setProductoAGranel(null);
              setBusqueda('');
              inputBusquedaRef.current.focus();
            }}
          />
        )}

        {/* ESCÁNER DE CÁMARA */}
        {mostrarScanner && (
          <EscanerCamara
            cerrar={() => setMostrarScanner(false)}
            onScan={(codigo) => {
              // 1. Cerramos la cámara
              setMostrarScanner(false);
              // 2. Intentamos buscar y agregar
              const encontrado = buscarYAgregar(codigo);
              if (encontrado) {
                // Éxito: Feedback sonoro o visual (opcional)
                alert(`Producto agregado: ${codigo}`); // Temporal para que sepas que funcionó
              } else {
                // No encontrado: Lo ponemos en la barra de búsqueda para que el usuario decida qué hacer
                setBusqueda(codigo);
                alert('Producto no encontrado en inventario');
              }
            }}
          />
        )}

      </div>

      <div className="h-[40%] lg:h-full w-full lg:w-[450px] shadow-2xl z-10 shrink-0 border-l border-gray-300">
        <TicketVenta alPresionarCobrar={() => setMostrarPago(true)} />
      </div>

    </div>
  );
}

export default App;