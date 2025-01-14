import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
const VKCallback = () => {
  const navigate = useNavigate();

  const { updateUser } = useUser();
  useEffect(() => {
    const handleVKCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const fullCode = urlParams.get("code"); // Получаем полный код из URL

      if (fullCode) {
        const code = fullCode.split("&")[0]; // Обрезаем до `&state`

        try {
          // Пробуем выполнить вход через API
          const loginResponse = await axios.get(
            `https://registration-fastapi.onrender.com/vk/login?code=${code}`,
            { withCredentials: true }
          );

          if (loginResponse.status === 200) {
            console.log("Успешный вход:", loginResponse.data);

            const userData = loginResponse.data;
            updateUser(userData);

            navigate("/profile"); // Перенаправляем на страницу приветствия
          } else {
            throw new Error("Пользователь не найден");
          }
        } catch (error) {
          console.error("Ошибка авторизации:", error);

          try {
            // Выполняем регистрацию, если вход не удался
            const registrationResponse = await axios.get(
              `https://registration-fastapi.onrender.com/vk/registration?code=${code}`,
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

    handleVKCallback();
  }, [navigate, updateUser]);

  return <div>Обрабатываем авторизацию через ВКонтакте...</div>;
};

export default VKCallback;
