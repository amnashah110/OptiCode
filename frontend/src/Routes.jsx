import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home'
import Analyze from './pages/Analyze';
import Repositories from './pages/Repositories';
import About from './pages/About';
import LoginPage from './pages/Login';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path = '/' element = {<Home />}/>
      <Route path = '/analyze' element = {<Analyze />}/>
      <Route path = '/repositories' element = {<Repositories />}/>
      <Route path = '/about' element = {<About />}/>
      <Route path = '/login' element = {<LoginPage/>}/>
    </Routes>
  );
};

export default AppRoutes;