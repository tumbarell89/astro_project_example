const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://zlgdsntiqwresonrzzsc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsZ2RzbnRpcXdyZXNvbnJ6enNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgxMDI4ODcsImV4cCI6MjA0MzY3ODg4N30.6Jn_9bzI-4szpHk9j6ja1mnD7BxvvT3yGRdxvGAR4NU'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const ofertas = [
  { producto: "Hamburguesa Clásica", precio: 5.99, disponible: true },
  { producto: "Pizza Margherita", precio: 8.99, disponible: true },
  { producto: "Ensalada César", precio: 4.99, disponible: true },
  { producto: "Pasta Alfredo", precio: 7.99, disponible: true },
  { producto: "Refresco Grande", precio: 1.99, disponible: true },
  { producto: "Helado de Vainilla", precio: 3.99, disponible: true },
]

const ordenes = [
  {
    items: [
      { producto: "Hamburguesa Clásica", cantidad: 2, precio: 5.99 },
      { producto: "Refresco Grande", cantidad: 2, precio: 1.99 }
    ],
    total: 15.96
  },
  {
    items: [
      { producto: "Pizza Margherita", cantidad: 1, precio: 8.99 },
      { producto: "Ensalada César", cantidad: 1, precio: 4.99 }
    ],
    total: 13.98
  }
]

async function insertTestData() {
  // Insertar ofertas
  const { data: ofertasData, error: ofertasError } = await supabase
    .from('ofertas')
    .insert(ofertas)

  if (ofertasError) {
    console.error('Error al insertar ofertas:', ofertasError)
  } else {
    console.log('Ofertas insertadas con éxito:', ofertasData)
  }

  // Insertar órdenes
  const { data: ordenesData, error: ordenesError } = await supabase
    .from('ordenes')
    .insert(ordenes)

  if (ordenesError) {
    console.error('Error al insertar órdenes:', ordenesError)
  } else {
    console.log('Órdenes insertadas con éxito:', ordenesData)
  }
}

insertTestData()