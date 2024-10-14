import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AdminLogin() {
  const [isLogin, setIsLogin] = useState(true);
  const [telefono, setTelefono] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [nombreNegocio, setNombreNegocio] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isLogin) {
      // Login
      try {
        const { data: usuario, error } = await supabase
          .from('usuarios')
          .select('*')
          .eq('telefono', telefono)
          .eq('es_admin', true)
          .single();

        if (error) throw error;

        if (!usuario) {
          setError('Usuario no encontrado o no es administrador');
          return;
        }

        if (usuario.contrasena !== contrasena) {
          setError('Contraseña incorrecta');
          return;
        }

        // Login exitoso
        localStorage.setItem('adminUser', JSON.stringify(usuario));
        window.location.href = '/admin/ventas-finalizadas';
      } catch (error) {
        console.error('Error durante el login:', error);
        setError('Error durante el login. Por favor, intenta de nuevo.');
      }
    } else {
      // Registro
      try {
        const { data, error } = await supabase
          .from('usuarios')
          .insert([
            { 
              telefono,
              contrasena,
              nombre_negocio: nombreNegocio,
              es_admin: true
            }
          ]);

        if (error) throw error;

        // Registro exitoso
        setError('Registro exitoso. Por favor, inicia sesión.');
        setIsLogin(true);
      } catch (error) {
        console.error('Error durante el registro:', error);
        setError('Error durante el registro. Por favor, intenta de nuevo.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Iniciar sesión como Administrador' : 'Registrar nuevo Administrador'}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="telefono" className="sr-only">
                Teléfono
              </label>
              <input
                id="telefono"
                name="telefono"
                type="tel"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Teléfono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="contrasena" className="sr-only">
                Contraseña
              </label>
              <input
                id="contrasena"
                name="contrasena"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
              />
            </div>
            {!isLogin && (
              <div>
                <label htmlFor="nombreNegocio" className="sr-only">
                  Nombre del Negocio
                </label>
                <input
                  id="nombreNegocio"
                  name="nombreNegocio"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Nombre del Negocio"
                  value={nombreNegocio}
                  onChange={(e) => setNombreNegocio(e.target.value)}
                />
              </div>
            )}
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-2">{error}</div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLogin ? 'Iniciar sesión' : 'Registrarse'}
            </button>
          </div>
        </form>
        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>
      </div>
    </div>
  );
}