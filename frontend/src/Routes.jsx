import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home'
import Analyze from './pages/Analyze';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path = '/' element = {<Home />}/>
      <Route path = '/analyze' element = {<Analyze />}/>
    </Routes>
  );
};

export default AppRoutes;