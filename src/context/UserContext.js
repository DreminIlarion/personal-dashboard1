import React, { createContext, useContext, useState, useEffect } from 'react';

// Создаем контекст
const UserContext = createContext();

// Хук для использования контекста
export const useUser = () => useContext(UserContext);

// Функции для работы с cookies
const setTokenInCookies = (accessToken, refreshToken) => {
  document.cookie = `access=${accessToken}; path=/; Secure; HttpOnly; SameSite=Strict`;
  document.cookie = `refresh=${refreshToken}; path=/; Secure; HttpOnly; SameSite=Strict`;
};

const getTokenFromCookies = (tokenName) => {
  const match = document.cookie.match(new RegExp('(^| )' + tokenName + '=([^;]+)'));
  return match ? match[2] : null;
};

// Провайдер для управления состоянием пользователя
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Метод для входа
  const login = (userData, accessToken, refreshToken) => {
    setUser(userData);
    setTokenInCookies(accessToken, refreshToken);
  };

  // Метод для выхода
  const logout = () => {
    setUser(null);
    document.cookie = 'access=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/'; // Удаление токенов
    document.cookie = 'refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
  };

  // Метод для обновления данных пользователя
  const updateUser = (updatedUser) => setUser(updatedUser);

  // Загружаем данные пользователя при монтировании компонента
  useEffect(() => {
    const accessToken = getTokenFromCookies('access');
    if (accessToken) {
      // Здесь можно добавить логику получения данных пользователя с сервера по токену
      // Например, запрос к API для получения информации о пользователе
      fetch('https://registration-fastapi.onrender.com/user', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setUser(data))
        .catch(() => logout()); // Если токен невалидный или произошла ошибка, выходим
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Функция для логина пользователя
export const userLogin = async (email, password) => {
  const response = await fetch('https://registration-fastapi.onrender.com/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  return data; // Возвращаем данные, включая токены
};

// Функция для регистрации нового пользователя
export const userRegister = async (userData) => {
  const response = await fetch('https://registration-fastapi.onrender.com/registration', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Registration failed');
  }

  return response.json();
};

