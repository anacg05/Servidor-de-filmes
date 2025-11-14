import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import ListarFilmes from './pages/ListarFilmes/ListarFilmes';
import AddMovie from './pages/AdicionarFilmes/AddMovie';
import MovieDetail from './pages/MovieDetail/MovieDetail';
import EditMovie from './pages/EditMovie/EditMovie';
import Solicitacoes from './pages/Admin/Solicitacoes';

import ProtectedRoute from './components/ProtectedRoute';

import './App.css';

/* Configuração das Rotas da Aplicação */
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Rotas de Administrador */}
        <Route
          path="/admin/solicitacoes"
          element={
            <ProtectedRoute>
              <Solicitacoes />
            </ProtectedRoute>
          }
        />

        {/* Rotas protegidas - Usuário e Admin */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/listarfilmes"
          element={
            <ProtectedRoute>
              <ListarFilmes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/adicionarfilme"
          element={
            <ProtectedRoute>
              <AddMovie />
            </ProtectedRoute>
          }
        />

        <Route
          path="/filme/:id"
          element={
            <ProtectedRoute>
              <MovieDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/editarfilme/:id"
          element={
            <ProtectedRoute>
              <EditMovie />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
