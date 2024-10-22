import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zlgdsntiqwresonrzzsc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsZ2RzbnRpcXdyZXNvbnJ6enNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgxMDI4ODcsImV4cCI6MjA0MzY3ODg4N30.6Jn_9bzI-4szpHk9j6ja1mnD7BxvvT3yGRdxvGAR4NU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface User {
  id: string;
  telefono: string;
  nombre_negocio: string;
  es_admin: boolean;
  admin_id: string;
}

export async function loginUser(telefono: string, contrasena: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('telefono', telefono)
    .single()

  if (error || !data) {
    console.error('Error during login:', error)
    return null
  }

  if (data.contrasena !== contrasena) {
    console.error('Incorrect password')
    return null
  }
 
  const user: User = {
    id: data.id,
    telefono: data.telefono,
    nombre_negocio: data.nombre_negocio,
    es_admin: data.es_admin,
    admin_id: data.admin_id
  }

  // Store user information in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user))
  }
  
  return user
}

export function logoutUser() {
  localStorage.removeItem('user')
}

export function getCurrentUser(): User | null {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  }
  return null
}

export function isLoggedIn(): boolean {
  return !!getCurrentUser()
}

export async function fetchOfertas(negocio_id: number) {
  const { data, error } = await supabase
    .from('ofertas')
    .select('*')
    .order('id')
    .eq('negocio_id', negocio_id);

  if (error) {
    console.error('id:', negocio_id);
    console.error('Error fetching ofertas:', error);
    return [];
  }
  
  return data || [];
}