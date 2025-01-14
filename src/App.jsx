import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Login from './components/Login';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import Register from './components/Register';
import VK from './components/vk_vhod';

import VKAuth from "./VKAuth";
import VKCallback from "./VKCallback";
import Welcome from "./Welcome";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Перенаправление с корневого пути на страницу профиля */}

          <Route path="/" element={<Navigate to="/profile" replace />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/register" element={<VK />} />
          <Route path="/login" element={<Login />} />
          <Route path="/vk" element={<VKAuth />} />
          <Route path="/vk/callback" element={<VKCallback />} />
          <Route path="/welcome" element={<Welcome />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
