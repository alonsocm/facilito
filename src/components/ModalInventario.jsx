import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Package, Save, Edit2, RotateCcw, ScanBarcode, Scale } from 'lucide-react'; // Agregamos Scale (Báscula)
import { usePosStore } from '../store/usePosStore';
import { EscanerCamara } from './EscanerCamara';
import { toast } from 'react-hot-toast';

export const ModalInventario = ({ cerrarModal }) => {
    const { productos, crearProducto, borrarDelCatalogo, actualizarProducto } = usePosStore();

    const [productoAEditar, setProductoAEditar] = useState(null);
    const [mostrarScanner, setMostrarScanner] = useState(false);

    // Estados del formulario
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [costo, setCosto] = useState('');
    const [stock, setStock] = useState('');
    const [categoria, setCategoria] = useState('');
    const [codigo, setCodigo] = useState('');
    const [esGranel, setEsGranel] = useState(false);

    useEffect(() => {
        if (productoAEditar) {
            setNombre(productoAEditar.nombre);
            setPrecio(productoAEditar.precio);
            setCosto(productoAEditar.costo);
            setStock(productoAEditar.stock);
            setCategoria(productoAEditar.categoria);
            setCodigo(productoAEditar.codigo || '');
            setEsGranel(productoAEditar.esGranel || false); // <--- CARGAMOS EL VALOR
        } else {
            limpiarFormulario();
        }
    }, [productoAEditar]);

    const limpiarFormulario = () => {
        setNombre('');
        setPrecio('');
        setCosto('');
        setStock('');
        setCategoria('');
        setCodigo('');
        setEsGranel(false); // <--- RESETEAMOS
        setProductoAEditar(null);
    };

    const manejarSubmit = (e) => {
        e.preventDefault();
        if (!nombre || !precio) return;

        const datos = {
            nombre,
            precio,
            costo: costo || 0,
            stock: stock || 0,
            categoria: categoria || 'General',
            codigo,
            esGranel // <--- GUARDAMOS EL VALOR
        };

        if (productoAEditar) {
            actualizarProducto(productoAEditar.id, datos);
            toast.success('¡Producto actualizado!');
            limpiarFormulario();
        } else {
            crearProducto(datos);
            toast.success('¡Producto creado!');
            limpiarFormulario();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden animate-fade-in relative">

                {/* Cabecera */}
                <div className={`p-6 flex justify-between items-center text-white shrink-0 transition-colors ${productoAEditar ? 'bg-orange-600' : 'bg-facilito-negro'}`}>
                    <div className="flex items-center gap-3">
                        {productoAEditar ? <Edit2 size={32} /> : <Package size={32} />}
                        <div>
                            <h2 className="text-2xl font-bold">
                                {productoAEditar ? 'Editar Producto' : 'Inventario General'}
                            </h2>
                            <p className="text-sm opacity-80">
                                {productoAEditar ? `Modificando: ${productoAEditar.nombre}` : 'Agrega o administra tus productos'}
                            </p>
                        </div>
                    </div>
                    <button onClick={cerrarModal} className="bg-white/20 p-2 rounded-full hover:bg-white/40">
                        <X size={28} />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">

                    {/* COLUMNA IZQUIERDA: FORMULARIO */}
                    <div className="w-1/3 bg-gray-50 p-6 border-r border-gray-200 overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className={`text-xl font-bold ${productoAEditar ? 'text-orange-600' : 'text-facilito-azul'}`}>
                                {productoAEditar ? 'Datos del Producto' : 'Nuevo Ingreso'}
                            </h3>
                            {productoAEditar && (
                                <button onClick={limpiarFormulario} className="text-sm text-gray-500 flex items-center gap-1 hover:text-facilito-azul">
                                    <RotateCcw size={14} /> Cancelar
                                </button>
                            )}
                        </div>

                        <form onSubmit={manejarSubmit} className="space-y-3">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Nombre</label>
                                <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-facilito-azul outline-none font-bold" autoFocus />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Costo</label>
                                    <input type="number" value={costo} onChange={e => setCosto(e.target.value)} className="w-full p-2 border-2 border-gray-300 rounded-lg outline-none bg-yellow-50" placeholder="0.00" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Precio Venta</label>
                                    <input type="number" value={precio} onChange={e => setPrecio(e.target.value)} className="w-full p-2 border-2 border-gray-300 rounded-lg outline-none bg-green-50 font-bold text-green-700" placeholder="0.00" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Stock Actual</label>
                                    <input type="number" value={stock} onChange={e => setStock(e.target.value)} className="w-full p-2 border-2 border-gray-300 rounded-lg outline-none font-bold" placeholder="0" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Categoría</label>
                                    <input type="text" value={categoria} onChange={e => setCategoria(e.target.value)} className="w-full p-2 border-2 border-gray-300 rounded-lg outline-none" placeholder="General" />
                                </div>
                            </div>

                            {/* CHECKBOX DE GRANEL */}
                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100 cursor-pointer" onClick={() => setEsGranel(!esGranel)}>
                                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${esGranel ? 'bg-facilito-azul border-facilito-azul' : 'border-gray-300 bg-white'}`}>
                                    {esGranel && <Scale size={16} className="text-white" />}
                                </div>
                                <div>
                                    <span className="font-bold text-gray-700 text-sm block">Venta a Granel</span>
                                    <span className="text-xs text-gray-400 block">Kilos, Litros, Metros...</span>
                                </div>
                            </div>

                            {/* INPUT CÓDIGO */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Código de Barras</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={codigo}
                                        onChange={e => setCodigo(e.target.value)}
                                        className="flex-1 p-2 border-2 border-gray-300 rounded-lg outline-none text-sm font-mono"
                                        placeholder="Escanea o escribe..."
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setMostrarScanner(true)}
                                        className="bg-facilito-azul text-white p-2 rounded-lg hover:bg-blue-800"
                                    >
                                        <ScanBarcode size={24} />
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-white shadow-lg mt-4 transition-all
                    ${productoAEditar
                                        ? 'bg-orange-500 hover:bg-orange-600'
                                        : 'bg-facilito-azul hover:bg-blue-900'}`}
                            >
                                {productoAEditar ? <Save size={20} /> : <Plus size={20} />}
                                {productoAEditar ? 'GUARDAR CAMBIOS' : 'AGREGAR CATÁLOGO'}
                            </button>
                        </form>
                    </div>

                    {/* COLUMNA DERECHA: LISTA */}
                    <div className="flex-1 p-6 overflow-y-auto bg-white">
                        <h3 className="text-lg font-bold text-gray-400 mb-4 border-b pb-2 uppercase tracking-wide">
                            Catálogo ({productos.length})
                        </h3>

                        <div className="grid grid-cols-1 gap-2">
                            {productos.map(p => (
                                <div key={p.id} className={`flex justify-between items-center p-3 border rounded-xl hover:shadow-md transition-all ${productoAEditar?.id === p.id ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-100' : 'border-gray-200'}`}>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-lg text-facilito-negro">{p.nombre}</p>
                                            {/* Etiqueta de Granel */}
                                            {p.esGranel && (
                                                <span className="text-[10px] bg-purple-100 text-purple-600 px-2 rounded-full font-bold flex items-center gap-1">
                                                    <Scale size={10} /> GRANEL
                                                </span>
                                            )}
                                            {p.stock <= 5 && (
                                                <span className="text-[10px] bg-red-100 text-red-600 px-2 rounded-full font-bold">BAJO STOCK</span>
                                            )}
                                        </div>
                                        <div className="flex gap-4 text-sm text-gray-500">
                                            <span>Stock: <b className={p.stock > 0 ? 'text-gray-700' : 'text-red-500'}>{p.stock}</b></span>
                                            <span className="font-mono text-xs opacity-60">
                                                {p.codigo ? `Código: ${p.codigo}` : 'Sin código'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 pl-4 border-l border-gray-100">
                                        <span className="font-black text-xl text-facilito-verde">${parseFloat(p.precio).toFixed(2)}</span>

                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => setProductoAEditar(p)}
                                                className="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-100 hover:scale-110 transition-transform"
                                            >
                                                <Edit2 size={20} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (confirm('¿Eliminar permanentemente?')) borrarDelCatalogo(p.id);
                                                }}
                                                className="bg-red-50 text-red-400 p-2 rounded-lg hover:bg-red-100 hover:text-red-600 transition-colors"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {mostrarScanner && (
                    <EscanerCamara
                        cerrar={() => setMostrarScanner(false)}
                        onScan={(codigoDetectado) => {
                            setCodigo(codigoDetectado);
                            setMostrarScanner(false);
                        }}
                    />
                )}

            </div>
        </div>
    );
};