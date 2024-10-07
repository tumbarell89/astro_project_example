import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zlgdsntiqwresonrzzsc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsZ2RzbnRpcXdyZXNvbnJ6enNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgxMDI4ODcsImV4cCI6MjA0MzY3ODg4N30.6Jn_9bzI-4szpHk9j6ja1mnD7BxvvT3yGRdxvGAR4NU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 3
    }
  }
})

// Test the connection
supabase.from('ofertas').select('*').limit(1).then(({ data, error }) => {
  if (error) {
    console.error('Error connecting to Supabase:', error)
  } else {
    console.log('Successfully connected to Supabase')
  }
})