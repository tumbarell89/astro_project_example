import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';

interface Oferta {
  id: number;
  producto: string;
  precio: number;
  disponible: boolean;
}

export default function GestionOfertas() {
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [nuevaOferta, setNuevaOferta] = useState({ producto: '', precio: 0 });
  const [editando, setEditando] = useState<number | null>(null);
  const [ofertaEditada, setOfertaEditada] = useState<Oferta | null>(null);

  useEffect(() => {
    fetchOfertas();
  }, []);

  async function fetchOfertas() {
    const { data, error } = await supabase
      .from('ofertas')
      .select('*')
      .order('id');
    
    if (error) {
      console.error('Error fetching ofertas:', error);
    } else {
      setOfertas(data || []);
    }
  }

  async function agregarOferta() {
    const { data, error } = await supabase
      .from('ofertas')
      .insert([{ ...nuevaOferta, disponible: true }])
      .select();

    if (error) {
      console.error('Error adding oferta:', error);
    } else {
      setOfertas([...ofertas, data[0]]);
      setNuevaOferta({ producto: '', precio: 0 });
    }
  }

  async function actualizarOferta(id: number) {
    if (!ofertaEditada) return;

    const { error } = await supabase
      .from('ofertas')
      .update(ofertaEditada)
      .eq('id', id);

    if (error) {
      console.error('Error updating oferta:', error);
    } else {
      setOfertas(ofertas.map(o => o.id === id ? ofertaEditada : o));
      setEditando(null);
      setOfertaEditada(null);
    }
  }

  async function eliminarOferta(id: number) {
    const { error } = await supabase
      .from('ofertas')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting oferta:', error);
    } else {
      setOfertas(ofertas.filter(o => o.id !== id));
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-2xl font-bold mb-4">Gestión de Ofertas</h2>
      <div className="mb-4">
        <input
          type="text"
          value={nuevaOferta.producto}
          onChange={(e) => setNuevaOferta({ ...nuevaOferta, producto: e.target.value })}
          placeholder="Nombre del producto"
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="number"
          value={nuevaOferta.precio}
          onChange={(e) => setNuevaOferta({ ...nuevaOferta, precio: parseFloat(e.target.value) || 0 })}
          placeholder="Precio"
          className="w-full p-2 border rounded mb-2"
        />
        <button
          onClick={agregarOferta}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Agregar Oferta
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Producto</th>
              <th className="p-2 text-right">Precio</th>
              <th className="p-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ofertas.map((oferta) => (
              <tr key={oferta.id} className="border-b">
                <td className="p-2">
                  {editando === oferta.id ? (
                    <input
                      type="text"
                      value={ofertaEditada?.producto || ''}
                      onChange={(e) => setOfertaEditada({ ...ofertaEditada!, producto: e.target.value })}
                      className="w-full p-1 border rounded"
                    />
                  ) : (
                    oferta.producto
                  )}
                </td>
                <td className="p-2 text-right">
                  {editando === oferta.id ? (
                    <input
                      type="number"
                      value={ofertaEditada?.precio || 0}
                      onChange={(e) => setOfertaEditada({ ...ofertaEditada!, precio: parseFloat(e.target.value) || 0 })}
                      className="w-full p-1 border rounded"
                    />
                  ) : (
                    `$${oferta.precio.toFixed(2)}`
                  )}
                </td>
                <td className="p-2 text-center">
                  {editando === oferta.id ? (
                    <button
                      onClick={() => actualizarOferta(oferta.id)}
                      className="bg-green-500 text-white p-1 rounded hover:bg-green-600 mr-2"
                    >
                      Guardar
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditando(oferta.id);
                        setOfertaEditada(oferta);
                      }}
                      className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600 mr-2"
                    >
                      Editar
                    </button>
                  )}
                  <button
                    onClick={() => eliminarOferta(oferta.id)}
                    className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}