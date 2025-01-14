import React from "react";
import axios from "axios";
import { FaVk } from "react-icons/fa";

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
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Авторизация через ВКонтакте
        </h1>
        <p className="text-gray-600 mb-4">
          Используйте вашу учетную запись ВКонтакте для входа в систему.
        </p>
        <button
          onClick={handleVKLogin}
          className="flex items-center justify-center w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          <FaVk className="mr-3 text-xl" />
          Войти через ВКонтакте
        </button>
      </div>
    </div>
  );
};

export default VKAuth;
