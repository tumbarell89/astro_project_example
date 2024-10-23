import { useState, useEffect } from 'react';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/solid';
import { supabase, fetchOfertas } from '../lib/supabase';

export interface Oferta {
  id: number;
  producto: string;
  precio: number;
  usuario_id: number;
}

export interface VentaFinalizada {
  id: number;
  items: {
    producto: string;
    cantidad: number;
    precio: number;
  }[];
  total: number;
  usuario_id: number;
  negocio_id: number;
}

export default function OfertasCard() {
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [selectedOfertas, setSelectedOfertas] = useState<Map<number, number>>(new Map());
  const [activeOferta, setActiveOferta] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false); // Cambiar a useState para manejar el estado correctamente

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')!);
    if (user) {
      //const parsedUser = JSON.parse(userString);
      setUser(user);
      setIsAdmin(user.es_admin || false);

    }
  }, []);
  
  useEffect(() => {
    if (user) {
      let id = user.es_admin ? user.id : user.admin_id;
      console.log('user: '+ user.admin_id)
      loadOfertas(id);
    }
    const subscription = supabase
      .channel('ofertas_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ofertas' }, handleOfertasChange)
      .subscribe();
    return () => {
      subscription.unsubscribe();
    };
  }, [user]);// Añadido el `user` como dependencia para asegurar que fetchOfertas se llame después de que se cargue el usuario
  
  if (!user) {
    return <div>Cargando...</div>;
  }

  async function loadOfertas(negocio_id: number) {
    const data = await fetchOfertas(negocio_id);
    setOfertas(data);
  }

  function handleOfertasChange(payload: any) {
    console.log('Cambio en ofertas:', payload);
    fetchOfertas(user.id);
  }

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

  const finalizarVenta = async () => {
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

    const total = calculateTotal();
    let id = user.es_admin ? user.id : user.admin_id;
    const { error } = await supabase
      .from('ordenes')
      .insert({ items: itemsVenta, total, usuario_id: user.id, negocio_id: id})
      .select();

    if (error) {
      console.error('Error al finalizar la venta:', error);
      setErrorMessage("Error al finalizar la venta. Por favor, intente de nuevo.");
    } else {
      setSelectedOfertas(new Map());
      setErrorMessage(null);
      alert("Venta finalizada con éxito");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div className="max-w-2xl mx-auto transform -rotate-3 transition-transform hover:rotate-0 duration-300 mb-8">
      <div className="bg-yellow-100 rounded-lg shadow-xl p-6 border-4 border-yellow-300">
        {user && (
          <div>
            <a className="text-3xl font-bold text-left mb-6 text-yellow-800">Ofertas del Día en {user.nombre_negocio}</a>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white py-2 px-8 rounded hover:bg-red-600 transition-colors duration-200"
            >
              Cerrar sesión
            </button>
          </div>
        )}
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
                {(selectedOfertas.get(oferta.id) ?? 0 > 0) && (
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
          className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors duration-200"
        >
          Finalizar Venta
        </button>
        {isAdmin && (
          <button
            onClick={() => window.location.href = '/admin/ventas-finalizadas'}
            className="mt-2 w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition-colors duration-200"
          >
            Ver Ventas Finalizadas
          </button>
        )}
      </div>
    </div>
  );
}
