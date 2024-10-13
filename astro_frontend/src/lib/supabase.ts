import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zlgdsntiqwresonrzzsc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsZ2RzbnRpcXdyZXNvbnJ6enNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgxMDI4ODcsImV4cCI6MjA0MzY3ODg4N30.6Jn_9bzI-4szpHk9j6ja1mnD7BxvvT3yGRdxvGAR4NU'
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getAuthenticatedUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function isAdmin(user: any) {
  if (!user) return false
  
  const { data, error } = await supabase
    .from('usuarios')
    .select('es_admin')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error checking admin status:', error)
    return false
  }

  return data?.es_admin || false
}