import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VKCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleVKCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const fullCode = urlParams.get("code"); // Извлекаем весь `code`

      if (fullCode) {
        const code = fullCode.split("&")[0]; // Обрезаем до `&state`
        console.log("Извлеченный code:", code);

        try {
          // Пробуем выполнить вход
          const loginResponse = await axios.get(
            `https://registration-fastapi.onrender.com/vk/login?code=${code}`,
            { withCredentials: true }
          );

          if (loginResponse.status === 200) {
            console.log("Успешный вход:", loginResponse.data);
            navigate("/welcome"); // Перенаправляем на защищенную страницу
          } else {
            throw new Error("Пользователь не найден");
          }
        } catch (error) {
          console.error("Пользователь не найден, выполняем регистрацию...");

          try {
            const registrationResponse = await axios.get(
              `https://registration-fastapi.onrender.com/vk/registration?code=${code}`,
              { withCredentials: true }
            );

            if (registrationResponse.status === 200) {
              console.log("Пользователь зарегистрирован:", registrationResponse.data);
              navigate("/welcome"); // Перенаправляем на защищенную страницу
            }
          } catch (registrationError) {
            console.error("Ошибка при регистрации:", registrationError);
          }
        }
      } else {
        console.error("Не удалось извлечь код из URL.");
      }
    };

    handleVKCallback();
  }, [navigate]);

  return <div>Обрабатываем авторизацию...</div>;
};

export default VKCallback;
