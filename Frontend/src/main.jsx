import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// 1. Importar o Provedor de Autenticação
import { AuthProvider } from './auth/AuthContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 2. Envolver o App com o Provedor */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)