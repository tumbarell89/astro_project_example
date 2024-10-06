import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';

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

export default function ListaVentasFinalizadas() {
  const [ventas, setVentas] = useState<VentaFinalizada[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVentas();
  }, []);

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

  if (isLoading) return <div className="bg-white rounded-lg shadow p-4">Cargando ventas finalizadas...</div>;
  if (error) return <div className="bg-white rounded-lg shadow p-4 text-red-500">Error: {error}</div>;
  if (ventas.length === 0) return <div className="bg-white rounded-lg shadow p-4">No hay ventas finalizadas.</div>;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-2xl font-bold mb-4 h1responsivetext">Ventas Finalizadas</h2>
      <div className="space-y-4">
        {ventas.map((venta) => (
          <div key={venta.id} className="border rounded p-4">
            <h3 className="text-xl font-bold mb-2 h1responsivetext">Venta #{venta.id}</h3>
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