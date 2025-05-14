import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home'
import Analyze from './pages/Analyze';
import Repositories from './pages/Repositories';
import About from './pages/About';
import LoginPage from './pages/Login';
import Profile from './pages/Profile';
import Metrics from './pages/Metrics';
import Tests from './pages/Tests';
import Editor from './pages/Editor'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path = '/' element = {<Home />}/>
      <Route path = '/analyze' element = {<Analyze />}/>
      <Route path = '/repositories' element = {<Repositories />}/>
      <Route path = '/about' element = {<About />}/>
      <Route path = '/login' element = {<LoginPage/>}/>
      <Route path = '/profile' element = {<Profile/>}/>
      <Route path = '/metrics' element = {<Metrics/>}/>
      <Route path = '/challenges' element = {<Tests/>}/>
      <Route path = '/editor' element = {<Editor/>}/> 
    </Routes>
  );
};

export default AppRoutes;