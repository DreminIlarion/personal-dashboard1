import React from "react";
import axios from "axios";

const VKAuth = () => {
  const handleVKLogin = async () => {
    try {
      const response = await axios.get("https://registration-fastapi.onrender.com/vk/link");
      if (response.data) {
        window.location.href = response.data; // Перенаправляем на VK
      } else {
        console.error("Не удалось получить ссылку авторизации.");
      }
    } catch (error) {
      console.error("Ошибка при получении ссылки авторизации:", error);
    }
  };

  return (
    <div>
      <h1>Авторизация через ВКонтакте</h1>
      <button onClick={handleVKLogin}>Войти через ВКонтакте</button>
    </div>
  );
};

export default VKAuth;
