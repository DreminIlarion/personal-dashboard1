import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';  // Убедитесь, что библиотека js-cookie установлена

// Создаем контекст
const UserContext = createContext();

// Хук для использования контекста
export const useUser = () => useContext(UserContext);

// Функции для работы с токенами
const setTokenInCookies = (accessToken, refreshToken) => {
  Cookies.set('access', accessToken, { expires: 1, path: '/', secure: true, sameSite: 'None' });
  Cookies.set('refresh', refreshToken, { expires: 1, path: '/', secure: true, sameSite: 'None' });
};

const getTokenFromCookies = (tokenName) => Cookies.get(tokenName);

// Функции для авторизации
const handleEmailLogin = async (email, password) => {
  const response = await fetch('https://registration-fastapi.onrender.com/authorization/login/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) throw new Error('Login failed');

  const data = await response.json();
  setTokenInCookies(data.access_token, data.refresh_token);
  return data;
};

const handlePhoneLogin = async (phoneNumber, password) => {
  const response = await fetch('https://registration-fastapi.onrender.com/authorization/login/phone/number', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone_number: phoneNumber, password }),
  });

  if (!response.ok) throw new Error('Login failed');

  const data = await response.json();
  setTokenInCookies(data.access_token, data.refresh_token);
  return data;
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
    Cookies.remove('access');
    Cookies.remove('refresh');
  };

  // Метод для обновления данных пользователя
  const updateUser = (updatedUser) => setUser(updatedUser);

  // Загружаем данные пользователя при монтировании компонента
  useEffect(() => {
    const accessToken = getTokenFromCookies('access');
    const refreshToken = getTokenFromCookies('refresh');

    if (accessToken || refreshToken) {
      // Отправляем запрос для получения данных пользователя с использованием токенов
      fetch('https://personal-account-fastapi.onrender.com/user_data/get/personal', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${accessToken}` },
        credentials: 'include',  // Убедитесь, что сервер поддерживает CORS и принимает куки
      })
        .then((response) => response.json())
        .then((data) => setUser(data))
        .catch(() => logout());  // Если токен невалидный или произошла ошибка, выходим
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
