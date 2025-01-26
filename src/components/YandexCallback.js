import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const YandexCallback = () => {
  const navigate = useNavigate();
  const { updateUser } = useUser();

  useEffect(() => {
    const handleYandexCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code) {
        try {
          const loginResponse = await axios.get(
            `https://registration-fastapi.onrender.com/yandex/login?code=${code}`,
            { withCredentials: true }
          );

          if (loginResponse.status === 200) {
            console.log("Успешный вход:", loginResponse.data);

            const userData = loginResponse.data;
            updateUser(userData);

            navigate("/profile");
          } else {
            throw new Error("Пользователь не найден");
          }
        } catch (error) {
          console.error("Ошибка авторизации:", error);

          try {
            const registrationResponse = await axios.get(
              `https://registration-fastapi.onrender.com/yandex/registration?code=${code}`,
              { withCredentials: true }
            );

            if (registrationResponse.status === 200) {
              console.log("Пользователь зарегистрирован:", registrationResponse.data);
              navigate("/profile");
            }
          } catch (registrationError) {
            console.error("Ошибка регистрации:", registrationError);
          }
        }
      } else {
        console.error("Код авторизации не найден в URL.");
      }
    };

    handleYandexCallback();
  }, [navigate, updateUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-700">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
          Обрабатываем авторизацию через Яндекс...
        </h2>
        <div className="flex justify-center items-center space-x-4">
          <div className="w-16 h-16 border-4 border-t-transparent border-gray-300 rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

export default YandexCallback;
