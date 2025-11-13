import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// 1. Importar os componentes de rota
import Home from './pages/Home/Home';
import Login from './pages/Login/Login'; 
import ListarFilmes from './pages/ListarFilmes/ListarFilmes';
import AddMovie from './pages/AdicionarFilmes/AddMovie';
import MovieDetail from './pages/MovieDetail/MovieDetail';
import EditMovie from './pages/EditMovie/EditMovie';
import ProtectedRoute from './components/ProtectedRoute'; 

import './App.css';
import Solicitacoes from './pages/Admin/Solicitacoes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
      
        <Route path="/" element={<Login />} />

        
        
        
        {/* Rota para Administrador */}
        <Route 
          path="/admin/solicitacoes" 
          element={<ProtectedRoute><Solicitacoes /></ProtectedRoute>} 
        />

        {/* Rotas partilhadas (assumindo que ambos podem ver) */}
       
        <Route 
          path="/home" 
          element={<ProtectedRoute><Home /></ProtectedRoute>} 
        />
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