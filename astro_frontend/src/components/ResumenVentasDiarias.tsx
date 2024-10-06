import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';

interface ResumenDiario {
  fecha: string;
  total_ventas: number;
  cantidad_ventas: number;
}

export default function ResumenVentasDiarias() {
  const [resumen, setResumen] = useState<ResumenDiario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResumenVentas();
  }, []);

  async function fetchResumenVentas() {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .rpc('resumen_ventas_diarias');

      if (error) throw error;

      setResumen(data || []);
    } catch (err) {
      console.error('Error fetching resumen de ventas:', err);
      setError('Error al cargar el resumen de ventas. Por favor, intente de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) return <div className="bg-white rounded-lg shadow p-4">Cargando resumen de ventas...</div>;
  if (error) return <div className="bg-white rounded-lg shadow p-4 text-red-500">Error: {error}</div>;
  if (resumen.length === 0) return <div className="bg-white rounded-lg shadow p-4">No hay ventas para mostrar.</div>;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-2xl font-bold mb-4">Resumen de Ventas Diarias</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Fecha</th>
              <th className="p-2 text-right">Total Ventas</th>
              <th className="p-2 text-right">Cantidad de Ventas</th>
            </tr>
          </thead>
          <tbody>
            {resumen.map((dia) => (
              <tr key={dia.fecha} className="border-b">
                <td className="p-2">{new Date(dia.fecha).toLocaleDateString()}</td>
                <td className="p-2 text-right">${dia.total_ventas.toFixed(2)}</td>
                <td className="p-2 text-right">{dia.cantidad_ventas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}