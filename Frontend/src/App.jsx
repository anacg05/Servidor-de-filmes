import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// 1. Importar os componentes de rota
import Home from './pages/Home/Home';
import Login from './pages/Login/Login'; 
import AdminDashboard from './pages/Admin/AdminDashboard';
import ListarFilmes from './pages/ListarFilmes/ListarFilmes';
import AddMovie from './pages/AdicionarFilmes/AddMovie';
import MovieDetail from './pages/MovieDetail/MovieDetail';
import EditMovie from './pages/EditMovie/EditMovie';
import ProtectedRoute from './components/ProtectedRoute'; 

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
      
        <Route path="/" element={<Login />} />

        
        {/* Rota para Utilizador Comum */}
        <Route 
          path="/home" 
          element={<ProtectedRoute><Home /></ProtectedRoute>} 
        />
        
        {/* Rota para Administrador */}
        <Route 
          path="/admin" 
          element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} 
        />

        {/* Rotas partilhadas (assumindo que ambos podem ver) */}
        <Route 
          path="/listarfilmes" 
          element={<ProtectedRoute><ListarFilmes /></ProtectedRoute>} 
        />
        <Route 
          path="/adicionarfilme" 
          element={<ProtectedRoute><AddMovie /></ProtectedRoute>} 
        />
        <Route 
          path="/filme/:id" 
          element={<ProtectedRoute><MovieDetail /></ProtectedRoute>} 
        />
        <Route 
          path="/editarfilme/:id" 
          element={<ProtectedRoute><EditMovie /></ProtectedRoute>} 
        />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;