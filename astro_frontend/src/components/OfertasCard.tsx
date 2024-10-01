import React, { useState } from 'react';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/solid';
import VentasFinalizadas from './VentasFinalizadas.astro';

interface Oferta {
  id: number;
  producto: string;
  precio: number;
}

interface VentaFinalizada {
  id: number;
  items: {
    producto: string;
    cantidad: number;
    precio: number;
  }[];
  total: number;
}

const ofertas: Oferta[] = [
  { id: 1, producto: "Hamburguesa Clásica", precio: 5.99 },
  { id: 2, producto: "Pizza Margherita", precio: 8.99 },
  { id: 3, producto: "Ensalada César", precio: 4.99 },
  { id: 4, producto: "Pasta Alfredo", precio: 7.99 },
  { id: 5, producto: "Refresco Grande", precio: 1.99 },
  { id: 6, producto: "Helado de Vainilla", precio: 3.99 },
];

export default function Component() {
  const [selectedOfertas, setSelectedOfertas] = useState<Map<number, number>>(new Map());
  const [activeOferta, setActiveOferta] = useState<number | null>(null);
  const [ventasFinalizadas, setVentasFinalizadas] = useState<VentaFinalizada[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleOfertaClick = (id: number) => {
    setSelectedOfertas(prevSelected => {
      const newSelected = new Map(prevSelected);
      const currentCount = newSelected.get(id) || 0;
      newSelected.set(id, currentCount + 1);
      return newSelected;
    });
    setActiveOferta(id);
  };

  const handleQuantityChange = (id: number, newQuantity: number) => {
    setSelectedOfertas(prevSelected => {
      const newSelected = new Map(prevSelected);
      if (newQuantity > 0) {
        newSelected.set(id, newQuantity);
      } else {
        newSelected.set(id, 0);
      }
      return newSelected;
    });
  };

  const handleMouseLeave = (id: number) => {
    if (selectedOfertas.get(id) === 0) {
      setSelectedOfertas(prevSelected => {
        const newSelected = new Map(prevSelected);
        newSelected.delete(id);
        return newSelected;
      });
    }
    setActiveOferta(null);
  };

  const calculateTotal = () => {
    return Array.from(selectedOfertas.entries()).reduce((total, [id, count]) => {
      const oferta = ofertas.find(o => o.id === id);
      return total + (oferta ? oferta.precio * count : 0);
    }, 0);
  };

  const finalizarVenta = () => {
    const itemsVenta = Array.from(selectedOfertas.entries())
      .filter(([_, count]) => count > 0)
      .map(([id, count]) => {
        const oferta = ofertas.find(o => o.id === id)!;
        return {
          producto: oferta.producto,
          cantidad: count,
          precio: oferta.precio
        };
      });

    if (itemsVenta.length === 0) {
      setErrorMessage("No hay valores para generar una venta");
      return;
    }

    const nuevaVenta: VentaFinalizada = {
      id: Date.now(),
      items: itemsVenta,
      total: 34
    };

    setVentasFinalizadas(prev => [...prev, nuevaVenta]);
    setSelectedOfertas(new Map());
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 p-4">
      <div className="w-full max-w-md transform -rotate-3 transition-transform hover:rotate-0 duration-300 mb-8">
        <div className="bg-yellow-100 rounded-lg shadow-xl p-6 border-4 border-yellow-300">
          <h1 className="text-3xl font-bold text-center mb-6 text-yellow-800">Ofertas del Día</h1>
          <ul className="space-y-4">
            {ofertas.map((oferta) => (
              <li 
                key={oferta.id} 
                className={`flex justify-between items-center border-b border-yellow-200 pb-2 cursor-pointer hover:bg-yellow-200 transition-colors duration-200 ${selectedOfertas.get(oferta.id) || activeOferta === oferta.id ? 'font-bold bg-yellow-300' : ''}`}
                onClick={() => handleOfertaClick(oferta.id)}
                onMouseLeave={() => handleMouseLeave(oferta.id)}
              >
                <span className="text-lg font-medium text-gray-800">{oferta.producto}</span>
                <div className="flex items-center">
                  <span className="text-xl font-bold text-orange-600 mr-2">${oferta.precio.toFixed(2)}</span>
                  {(selectedOfertas.get(oferta.id) > 0 || activeOferta === oferta.id) && (
                    <div className="flex items-center bg-amber-500 text-white rounded-full" onClick={(e) => e.stopPropagation()}>
                      <button 
                        className="px-2 py-1 hover:bg-amber-600 rounded-l-full transition-colors duration-200"
                        onClick={() => handleQuantityChange(oferta.id, (selectedOfertas.get(oferta.id) || 0) - 1)}
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={selectedOfertas.get(oferta.id) || 0}
                        onChange={(e) => handleQuantityChange(oferta.id, parseInt(e.target.value) || 0)}
                        className="w-12 px-2 py-1 text-center bg-amber-500 focus:bg-amber-600 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button 
                        className="px-2 py-1 hover:bg-amber-600 rounded-r-full transition-colors duration-200"
                        onClick={() => handleQuantityChange(oferta.id, (selectedOfertas.get(oferta.id) || 0) + 1)}
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 text-right">
            <span className="text-lg font-bold text-gray-800">Total: </span>
            <span className="text-2xl font-bold text-orange-600">${calculateTotal().toFixed(2)}</span>
          </div>
          <button
            onClick={finalizarVenta}
            className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-600 transition-colors duration-200"
          >
            Finalizar Venta
          </button>
          {errorMessage && (
            <p className="mt-2 text-red-500 text-center">{errorMessage}</p>
          )}
        </div>
      </div>
      {ventasFinalizadas.length > 0 && (
        <div className="w-full max-w-md mt-8">
          <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Ventas Finalizadas</h2>
          <VentasFinalizadas ventas={ventasFinalizadas} />
        </div>
      )}
    </div>
  );
}