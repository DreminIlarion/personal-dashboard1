import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';  // Убедитесь, что библиотека js-cookie установлена

// Создаем контекст
const UserContext = createContext();

// Хук для использования контекста
export const useUser = () => useContext(UserContext);

// Функции для работы с   
const setTokenInCookies = (accessToken, refreshToken) => {
  document.cookie = `access=${accessToken}; 
             path=/; 
             secure; 
             samesite=None; 
             domain=personal-account-fastapi.onrender.com; 
             expires=Wed, 30 Jan 2025 00:00:00 GMT; 
             max-age=3600;`;
  document.cookie = `refresh=${refreshToken};  
             path=/; 
             secure; 
             samesite=None; 
             domain=personal-account-fastapi.onrender.com; 
             expires=Wed, 30 Jan 2025 00:00:00 GMT; 
             max-age=3600;`;

  console.log('Тут добавились куки из авторизации', document.cookie);
};
const getTokenFromCookies = (tokenName) => {
  return Cookies.get(tokenName);
};
    
// Функции для авторизации
const handleEmailLogin = async (email, password) => {
  const response = await fetch('https://registration-fastapi.onrender.com/authorization/login/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
 
  if (!response.ok) {
    throw new Error('Login failed');
  }

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
 
  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  setTokenInCookies(data.access_token, data.refresh_token);
  return data;
};

const handleVkLogin = async () => {
  const response = await fetch('https://registration-fastapi.onrender.com/vk/login', {
    method: 'GET',
  });
 
  if (!response.ok) {
    throw new Error('VK login failed');
  }

  const data = await response.json();
  setTokenInCookies(data.access_token, data.refresh_token);
  return data;
};

const handleMailRuLogin = async () => {
  const response = await fetch('https://registration-fastapi.onrender.com/mail.ru/login', {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Mail.ru login failed');
  }

  const data = await response.json();
  setTokenInCookies(data.access_token, data.refresh_token);
  return data;
};

const handleYandexLogin = async () => {
  const response = await fetch('https://registration-fastapi.onrender.com/yandex/login', {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Yandex login failed');
  }

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
    
    // Создаем объект заголовков для запроса
    const headers = {};

    
      headers['set-coie'] = `access=${accessToken}; refresh=${refreshToken}`;
    
    
      headers['set-cooie'] = `access=${refreshToken}; refresh=${accessToken}`;
    
   
    if (accessToken || refreshToken) {
      console.log(document.cookie);
      // Здесь можно добавить логику получения данных пользователя с сервера по токену
      // Например, запрос к API для получения информации о пользователе
      fetch('https://personal-account-fastapi.onrender.com/user_data/get/personal', {
        method: 'GET', 
        headers: headers,  // передаем заголовки с токенами
        credentials: 'include',  
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
