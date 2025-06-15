import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Medical from './pages/Medical/Medical';
import Clinical from './pages/Clinical/Clinical';
import UseCase from './pages/UseCase/UseCase';
import Contributors from './pages/Contributors/Contributors';
import Navbar from './components/Navbar/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/medical_analysis' element={<Medical />} />
        <Route path='/clinical_trial' element={<Clinical />} />
        <Route path='/use_case' element={<UseCase />} />
        <Route path='/contributors' element={<Contributors />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
