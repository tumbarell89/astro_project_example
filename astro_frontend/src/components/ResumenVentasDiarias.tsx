import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface ProductoVendido {
  producto: string;
  cantidad: number;
  total: number;
}

interface ResumenDiario {
  fecha: string;
  productos: ProductoVendido[];
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
        .rpc('resumen_ventas_diarias_detallado');

      if (error) throw error;

      const resumenProcesado = procesarResumen(data || []);
      setResumen(resumenProcesado);
    } catch (err) {
      console.error('Error fetching resumen de ventas:', err);
      setError('Error al cargar el resumen de ventas. Por favor, intente de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }

  function procesarResumen(data: any[]): ResumenDiario[] {
    return data.map(dia => {
      const productosAgrupados = dia.productos.reduce((acc: ProductoVendido[], producto: ProductoVendido) => {
        const productoExistente = acc.find(p => p.producto === producto.producto);
        if (productoExistente) {
          productoExistente.cantidad += producto.cantidad;
          productoExistente.total += producto.total;
        } else {
          acc.push({ ...producto });
        }
        return acc;
      }, []);

      return {
        ...dia,
        productos: productosAgrupados,
      };
    });
  }

  if (isLoading) return <div className="bg-white rounded-lg shadow p-4">Cargando resumen de ventas...</div>;
  if (error) return <div className="bg-white rounded-lg shadow p-4 text-red-500">Error: {error}</div>;
  if (resumen.length === 0) return <div className="bg-white rounded-lg shadow p-4">No hay ventas para mostrar.</div>;

  //const totalGeneral = resumen.reduce((acc, dia) => acc + dia.total_ventas, 0);
  const cantidadTotalVentas = resumen.reduce((acc, dia) => acc + dia.cantidad_ventas, 0);
  let totalGeneral = 0;
  return (
    <div className="bg-white rounded-lg shadow p-4">
      {/* <h2 className="text-2xl font-bold mb-4 h1responsivetext">Resumen de Ventas Diarias</h2> */}
      <div className="space-y-6">
        {resumen.map((dia) => {
          let totaldeldia = dia.productos.reduce((acc, producto) => acc + producto.total, 0);
          totalGeneral += totaldeldia;
          return (
            <div key={dia.fecha} className="border-b pb-4">
              <h3 className="text-xl font-semibold mb-2">{dia.fecha}</h3>
              <div className="overflow-x-auto">
                <table className="w-full mb-2">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left">Producto</th>
                      <th className="p-2 text-right">Cantidad</th>
                      <th className="p-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dia.productos.map((producto, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{producto.producto}</td>
                        <td className="p-2 text-right">{producto.cantidad}</td>
                        <td className="p-2 text-right">${producto.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-right font-bold">
                Total del día: ${totaldeldia.toFixed(2)}
              </div>
              <div className="text-right text-sm text-gray-600">
                Cantidad de ventas: {dia.cantidad_ventas}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 text-right">
        <div className="font-bold text-lg">
          Total General: ${totalGeneral.toFixed(2)}
        </div>
        <div className="text-sm text-gray-600">
          Cantidad Total de Ventas: {cantidadTotalVentas}
        </div>
      </div>
    </div>
  );
}
