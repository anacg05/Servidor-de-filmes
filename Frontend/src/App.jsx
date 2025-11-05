import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import ListarFilmes from './pages/ListarFilmes/ListarFilmes'
import AddMovie from './pages/AdicionarFilmes/AddMovie';
import MovieDetail from './pages/MovieDetail/MovieDetail';
// import EditMovie from './components/EditMovie/EditMovie';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/listarfilmes" element={<ListarFilmes />} />
        {/* <Route path="/editarfilme" element={<EditMovie />} /> */}
        <Route path="/adicionarfilme" element={<AddMovie />} />
        <Route path="/filme/:id" element={<MovieDetail />} />





      </Routes>
    </BrowserRouter>
  );
}

export default App;
