import React from 'react';

interface VentaItem {
  producto: string;
  cantidad: number;
  precio: number;
}

interface Venta {
  id: number;
  items: VentaItem[];
  total: number;
}

interface Props {
  ventas: Venta[];
}

const VentasFinalizadas: React.FC<Props> = ({ ventas }) => {
  return (
    <div className="space-y-6">
      {ventas.map((venta) => (
        <div key={venta.id} className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4">Venta #{venta.id}</h3>
          <table className="w-full mb-4">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Producto</th>
                <th className="text-right py-2">Cantidad</th>
                <th className="text-right py-2">Precio</th>
                <th className="text-right py-2">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {venta.items.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{item.producto}</td>
                  <td className="text-right py-2">{item.cantidad}</td>
                  <td className="text-right py-2">${item.precio.toFixed(2)}</td>
                  <td className="text-right py-2">${(item.cantidad * item.precio).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right font-bold">
            Total: ${venta.total.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VentasFinalizadas;