import React from 'react';
import { Link } from 'react-router-dom'; 
import { useUser } from '../context/UserContext';
import './index.css';

const Header = () => {
  const { user, logout } = useUser(); 

  return (
    <header>
      <nav>
        <Link to="/">Главная</Link>
        <Link to="/profile">Профиль</Link>
        {user ? (
          <>
            <span>Добро пожаловать, {user.name}!</span>
            <button onClick={logout}>Выйти</button>
          </>
        ) : (
          <Link to="/login">Войти</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
