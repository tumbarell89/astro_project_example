import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
// import {VentasProvider, useVentas } from '../contexts/VentasContext';

interface VentaFinalizada {
  id: number;
  fecha: string;
  items: {
    producto: string;
    cantidad: number;
    precio: number;
  }[];
  total: number;
}

interface Props {
  ventas: VentaFinalizada[];
}

export default function ListaVentasFinalizadas({ ventas: initialVentas }: Props) {
  const [ventas, setVentas] = useState<VentaFinalizada[]>(initialVentas);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const { triggerVentasUpdate } = useVentas();

  useEffect(() => {
    if (initialVentas.length === 0) {
      fetchVentas();
    }
  }, [initialVentas]);

  async function fetchVentas() {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('ordenes')
        .select('*')
        .order('fecha', { ascending: false });
      
      if (error) {
        throw error;
      }

      setVentas(data || []);
    } catch (err) {
      console.error('Error fetching ventas:', err);
      setError('Error al cargar las ventas finalizadas. Por favor, intente de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteVenta(id: number) {
    try {
      const { error } = await supabase
        .from('ordenes')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Remove the deleted venta from the local state
      setVentas(ventas.filter(venta => venta.id !== id));
      
      // Trigger update for other components
      // triggerVentasUpdate();
    } catch (err) {
      console.error('Error deleting venta:', err);
      setError('Error al eliminar la venta. Por favor, intente de nuevo.');
    }
  }

  if (isLoading) return <div className="bg-white rounded-lg shadow p-4">Cargando ventas finalizadas...</div>;
  if (error) return <div className="bg-white rounded-lg shadow p-4 text-red-500">Error: {error}</div>;
  if (ventas.length === 0) return <div className="bg-white rounded-lg shadow p-4">No hay ventas finalizadas.</div>;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="space-y-4">
        {ventas.map((venta) => (
          <div key={venta.id} className="border rounded p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-bold h1responsivetext">Venta #{venta.id}</h3>
              <button 
                onClick={() => {
                  if (window.confirm('¿Está seguro de que desea eliminar esta venta?')) {
                    deleteVenta(venta.id);
                  }
                }}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
              >
                Eliminar
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-2">Fecha: {new Date(venta.fecha).toLocaleString()}</p>
            <div className="overflow-x-auto">
              <table className="w-full mb-2">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">Producto</th>
                    <th className="p-2 text-right">Cantidad</th>
                    <th className="p-2 text-right">Precio</th>
                    <th className="p-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {venta.items.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{item.producto}</td>
                      <td className="p-2 text-right">{item.cantidad}</td>
                      <td className="p-2 text-right">${item.precio.toFixed(2)}</td>
                      <td className="p-2 text-right">${(item.cantidad * item.precio).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-right font-bold">
              Total: ${venta.total.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}