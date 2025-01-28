import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import Form from "./Form";
import ClassifierForm from "./MiniClassifier";
import axios from "axios";
import Cookies from "js-cookie";

const Profile = () => {
  const { user, logout } = useUser();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isClassifierVisible, setIsClassifierVisible] = useState(false);
  const [isMyDataVisible, setIsMyDataVisible] = useState(false);
  const [profileData, setProfileData] = useState(user || {});
  const [isEditing, setIsEditing] = useState(false);

  const handleLogout = () => {
    // Удаляем токены из cookies
    Cookies.remove("access");
    Cookies.remove("refresh");
  
    // Логика для выхода из приложения
    logout(); // Убираем пользователя из состояния
    console.log("Выход выполнен успешно!");
    
  };
  

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = Cookies.get('access');
        const refreshToken = Cookies.get('refresh');
        
        // Создаем объект заголовков для запроса
        const headers = {};
        
        // Если есть access token, добавляем его в заголовки
        if (accessToken) {
          headers['Authorization'] = `Bearer ${accessToken}`;
        }
        
        // Если есть refresh token, добавляем его в заголовки
        if (refreshToken) {
          headers['Refresh-Token'] = `Bearer ${refreshToken}`;
        }
  
        // Выполняем запрос
        const response = await axios.get(
          "https://personal-account-fastapi.onrender.com/user_data/get/personal",
          {
            withCredentials: true,
            headers: headers,  // передаем заголовки с токенами
          }
        );
  
        console.log("Данные от сервера:", response.data);
        setProfileData(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
        if (error.response && error.response.status === 401) {
          console.log("Ошибка авторизации. Пожалуйста, войдите в систему.");
        } else {
          console.log("Не удалось загрузить данные пользователя.");
        }
      }
    };
  
    fetchUserData();
  }, []);
  

    

  const toggleFormVisibility = () => {
    setIsFormVisible(true);
    setIsClassifierVisible(false);
    setIsMyDataVisible(false);
  };

  const toggleClassifierVisibility = () => {
    setIsClassifierVisible(true);
    setIsFormVisible(false);
    setIsMyDataVisible(false);
  };

  const toggleMyDataVisibility = () => {
    setIsMyDataVisible(true);
    setIsFormVisible(false);
    setIsClassifierVisible(false);
  };

 


  const updateUserData = async (updatedData) => {
    const dataToSend = {
      phone_number: updatedData.phone_number || "",
      first_name: updatedData.first_name,
      last_name: updatedData.last_name,
      dad_name: updatedData.dad_name,
      bio: updatedData.bio,
      birth_date: updatedData.birth_date || "", // Новое поле
      address: updatedData.address || "", // Новое поле
    };

    try {
      const response = await axios.put(
        "https://personal-account-fastapi.onrender.com/user_data/put/personal",
        dataToSend,
        { withCredentials: true }
      );

      setProfileData(response.data);
      console.log("Данные успешно обновлены");
      setIsEditing(false);
    } catch (error) {
      console.error("Ошибка при обновлении данных:", error);
      console.log("Не удалось обновить данные");
    }
  };

  const saveChanges = async () => {
    try {
      await updateUserData(profileData);
      console.log("Профиль успешно обновлен!");
    } catch (error) {
      console.error("Ошибка сохранения данных:", error);
    }
  };

  return (
    <div className="flex flex-col font-sans">
      <header className="w-full bg-blue-800 text-white shadow-md fixed top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Личный кабинет</h1>
          <div className="flex space-x-4">
            <Link to="/help" className="hover:underline">
              Помощь
            </Link>
            <Link to="/contact" className="hover:underline">
              Контакты
            </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-grow mt-16">
        <div className="w-64 h-screen fixed left-0 top-0 bg-gradient-to-br from-blue-600 to-purple-700 text-white shadow-lg flex flex-col pt-16">
          <div className="flex items-center px-6 py-4 border-b border-purple-700">
            <FaUserCircle className="text-3xl text-white mr-3" />
            {user ? (
              <span className="text-xl font-semibold">
                {user.first_name || "Пользователь"}
              </span>
            ) : (
              <Link to="/login" className="text-white hover:underline">
                Войти
              </Link>
            )}
          </div>
          <ul className="mt-4 flex-grow">
            {user && (
              <li className="mb-2">
                <button
                  onClick={toggleMyDataVisibility}
                  className="w-full text-left px-6 py-3 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  Мои данные
                </button>
              </li>
            )}
            {user && (
              <li className="mb-2">
                <button
                  onClick={toggleFormVisibility}
                  className="w-full text-left px-6 py-3 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  Predict
                </button>
              </li>
            )}
            <li className="mb-2">
              <button
                onClick={toggleClassifierVisibility}
                className="w-full text-left px-6 py-3 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Free predict
              </button>
            </li>
            {user && (
              <li className="mb-2">
              <button
                onClick={handleLogout}
                className="w-full text-left px-6 py-3    focus:outline-none focus:ring-2 "
              >
                Выход
              </button>
            </li>
            )}
          </ul>
          <div className="px-6 py-4 text-sm text-center border-t border-purple-700">
            <p>© 2025 TIU</p>
          </div>
        </div>

        <div
          className="flex-1 ml-64 p-8 flex flex-col items-center justify-center min-h-screen relative bg-cover bg-center"
          style={{ backgroundImage: "url(https://www.neoflex.ru/upload/iblock/ffb/24.jpg)" }}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50"></div>
          <div className="w-full max-w-2xl relative z-10">
            {isMyDataVisible ? (
              <>
                <h2 className="text-3xl font-bold mb-6 text-center text-white">
                  Мои данные
                </h2>
                <form className="space-y-4">
                  <label htmlFor="phone_number" className="block text-white">
                    Номер телефона:
                  </label>
                  <input
                    type="text"
                    id="phone_number"
                    value={profileData.phone_number || ""}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        phone_number: e.target.value,
                      })
                    }
                    className="w-full p-2 rounded-md bg-gray-100 text-black"
                  />

                  <label htmlFor="first_name" className="block text-white">
                    Имя:
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    value={profileData.first_name || ""}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        first_name: e.target.value,
                      })
                    }
                    className="w-full p-2 rounded-md bg-gray-100 text-black"
                  />

                  <label htmlFor="last_name" className="block text-white">
                    Фамилия:
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    value={profileData.last_name || ""}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        last_name: e.target.value,
                      })
                    }
                    className="w-full p-2 rounded-md bg-gray-100 text-black"
                  />

                  <label htmlFor="dad_name" className="block text-white">
                    Отчество:
                  </label>
                  <input
                    type="text"
                    id="dad_name"
                    value={profileData.dad_name || ""}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        dad_name: e.target.value,
                      })
                    }
                    className="w-full p-2 rounded-md bg-gray-100 text-black"
                  />

                  <label htmlFor="bio" className="block text-white">
                    О себе:
                  </label>
                  <textarea
                    id="bio"
                    rows="4"
                    value={profileData.bio || ""}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setProfileData({ ...profileData, bio: e.target.value })
                    }
                    className="w-full p-2 rounded-md bg-gray-100 text-black resize-none"
                  ></textarea>

                  <label htmlFor="birth_date" className="block text-white">
                    Дата рождения:
                  </label>
                  <input
                    type="date"
                    id="birth_date"
                    value={profileData.birth_date || ""}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        birth_date: e.target.value,
                      })
                    }
                    className="w-full p-2 rounded-md bg-gray-100 text-black"
                  />

                  <label htmlFor="address" className="block text-white">
                    Адрес:
                  </label>
                  <input
                    type="text"
                    id="address"
                    value={profileData.address || ""}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        address: e.target.value,
                      })
                    }
                    className="w-full p-2 rounded-md bg-gray-100 text-black"
                  />

                  {isEditing ? (
                    <button
                      type="button"
                      onClick={saveChanges}
                      className="block w-full py-3 mt-6 text-white bg-purple-500 rounded-md hover:bg-green-600"
                    >
                      Сохранить изменения
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="block w-full py-3 mt-6 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                    >
                      Изменить данные
                   

                    </button>
                  )}
                </form>
              </>
            ) : isFormVisible ? (
              <Form />
            ) : isClassifierVisible ? (
              <ClassifierForm />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
