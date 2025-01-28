import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Cookies from "js-cookie";

const VKCallback = () => {
  const navigate = useNavigate();
  const { updateUser } = useUser();

  useEffect(() => {
    const handleVKCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      
      // Извлекаем необходимые параметры из URL
      const code = urlParams.get("code");  // Код авторизации
      const deviceId = urlParams.get("device_id");  // device_id
      const state = urlParams.get("state");  // state
      const extId = urlParams.get("ext_id");  // ext_id
      const expiresIn = urlParams.get("expires_in");  // expires_in (если нужно для валидации)

      if (code && deviceId) {
        try {
          // Получаем токены от ВКонтакте
          const tokenResponse = await axios.get(
            `https://registration-fastapi.onrender.com/vk/get/token?code=${code}&device_id=${deviceId}`
          );

          if (tokenResponse.status === 200) {
            const { access_token, refresh_token } = tokenResponse.data;

            // Пробуем выполнить вход через API
            const loginResponse = await axios.get(
              `https://registration-fastapi.onrender.com/vk/login?access_token=${access_token}`,
              { withCredentials: true }
            );

            if (loginResponse.status === 200) {
              // Если вход успешный, обновляем пользователя
              console.log("Успешный вход:", loginResponse.data);
              const userData = loginResponse.data;
              updateUser(userData);
              navigate("/profile");
            } else {
              throw new Error("Пользователь не найден, пробуем регистрацию");
            }
          } else {
            throw new Error("Ошибка получения токенов от ВКонтакте");
          }
        } catch (error) {
          console.error("Ошибка авторизации или регистрации:", error);

          try {
            // Если вход не удался, пробуем регистрацию
            const registrationResponse = await axios.get(
              `https://registration-fastapi.onrender.com/vk/registration?access_token=${urlParams.get('access_token')}`,
              { withCredentials: true }
            );

            if (registrationResponse.status === 200) {
              console.log("Пользователь зарегистрирован:", registrationResponse.data);
              const { access, refresh } = registrationResponse.data;

              // Сохраняем токены в куки через js-cookie
              Cookies.set('access', access, {
                path: '/',
                secure: true,
                sameSite: 'None',
                expires: 1, // 1 день
              });
              Cookies.set('refresh', refresh, {
                path: '/',
                secure: true,
                sameSite: 'None',
                expires: 7, // 7 дней
              });

              // Отправляем токены на другой эндпоинт через cookies
              const accessToken = Cookies.get('access'); // Получаем access токен из cookies
              const refreshToken = Cookies.get('refresh'); // Получаем refresh токен из cookies

              const tokenResponse = await fetch(
                `https://personal-account-fastapi.onrender.com/get_toket/`,
                {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  credentials: 'include', // Это позволяет отправлять куки с запросом
                }
              );

              const data = await tokenResponse.json();
              console.log(data);

              if (tokenResponse.ok) {
                navigate("/profile");
              } else {
                console.error("Ошибка передачи токенов.");
              }
            }
          } catch (registrationError) {
            console.error("Ошибка регистрации:", registrationError);
          }
        }
      } else {
        console.error("Код авторизации или device_id не найден в URL.");
      }
    };

    handleVKCallback();
  }, [navigate, updateUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-700">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
          Обрабатываем авторизацию через ВКонтакте...
        </h2>
        <div className="flex justify-center items-center space-x-4">
          <div className="w-16 h-16 border-4 border-t-transparent border-gray-300 rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

export default VKCallback;
