import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import Form from "./Form";
import ClassifierForm from "./MiniClassifier";
import axios from "axios";
import Cookies from "js-cookie"; // Импортируем js-cookie

const Profile = () => {
  const { user, logout, updateUser } = useUser();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isClassifierVisible, setIsClassifierVisible] = useState(false);
  const [isMyDataVisible, setIsMyDataVisible] = useState(false);
  const [profileData, setProfileData] = useState(user || {});
  const [isEditing, setIsEditing] = useState(false); // Для переключения между режимами просмотра и редактирования данных

  // Функция для выхода
  const handleLogout = async () => {
    try {
      await axios.post(
        "https://registration-fastapi.onrender.com/authorization/logout",
        {},
        { withCredentials: true }
      );
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      logout();
      updateUser(null);  // Сбрасываем состояние пользователя после выхода
      alert("Выход выполнен успешно!");
    } catch (error) {
      console.error("Ошибка при выходе:", error);
      alert("Не удалось выполнить выход. Попробуйте еще раз.");
    }
  };

  // Загружаем данные пользователя из локального хранилища или с сервера при монтировании компонента
  useEffect(() => {
    const storedProfileData = localStorage.getItem("profileData");
    if (storedProfileData) {
      setProfileData(JSON.parse(storedProfileData)); // Загружаем данные из localStorage
      updateUser(JSON.parse(storedProfileData)); // Обновляем состояние user в контексте
    } else {
      const fetchUserData = async () => {
        try {
          const accessToken = Cookies.get("access_token");
          if (!accessToken) {
            alert("Токен не найден. Пожалуйста, авторизуйтесь.");
            return;
          }

          const response = await axios.get(
            "https://personal-account-fastapi.onrender.com/user_data/get/personal",
            {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          console.log("Данные от сервера:", response.data);
          setProfileData(response.data); // Устанавливаем полученные данные в состояние
          updateUser(response.data); // Обновляем состояние user в контексте
        } catch (error) {
          console.error("Ошибка при загрузке данных:", error);
          if (error.response && error.response.status === 401) {
            alert("Ошибка авторизации. Пожалуйста, войдите в систему.");
          } else {
            alert("Не удалось загрузить данные пользователя.");
          }
        }
      };

      fetchUserData();
    }
  }, []); // Этот useEffect выполняется только один раз при монтировании

  // Сохраняем данные в localStorage при изменении
  useEffect(() => {
    if (profileData) {
      localStorage.setItem("profileData", JSON.stringify(profileData));
    }
  }, [profileData]); // Каждый раз при изменении данных сохраняем их в localStorage

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

  // Функция для отправки PUT-запроса на сервер для обновления данных
  const updateUserData = async (updatedData) => {
    const dataToSend = {
      phone_number: updatedData.phone_number || "",
      first_name: updatedData.first_name,
      last_name: updatedData.last_name,
      dad_name: updatedData.dad_name,
      bio: updatedData.bio,
    };

    try {
      const response = await axios.put(
        "https://personal-account-fastapi.onrender.com/user_data/put/personal",
        dataToSend,
        { withCredentials: true }
      );

      // Обновляем данные в состоянии после успешного ответа от сервера
      setProfileData(response.data);
      localStorage.setItem("profileData", JSON.stringify(response.data)); // Сохраняем в localStorage
      alert("Данные успешно обновлены");
      setIsEditing(false); // Закрываем режим редактирования
    } catch (error) {
      console.error("Ошибка при обновлении данных:", error.response?.data || error);
      alert("Не удалось обновить данные");
    }
  };

  // Сохраняем изменения в профиле
  const saveChanges = async () => {
    try {
      await updateUserData(profileData); // Отправляем данные на сервер
      alert("Профиль успешно обновлен!");
    } catch (error) {
      console.error("Ошибка сохранения данных:", error);
    }
  };

  return (
    <div className="flex flex-col font-sans">
      {/* Header */}
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
        {/* Sidebar Navigation */}
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
                  className="text-red-500 hover:text-red-700"
                >
                  Выход
                </button>
              </li>
            )}
          </ul>
          <div className="px-6 py-4 text-sm text-center border-t border-purple-700">
            <p>© 2024 TIU</p>
          </div>
        </div>

        {/* Main Content */}
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
                    name="phone_number"
                    value={profileData.phone_number || ""}
                    disabled={!isEditing} // Только если редактирование включено
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone_number: e.target.value })
                    }
                    className="w-full p-2 text-black rounded"
                  />
                  <label htmlFor="first_name" className="block text-white">
                    Имя:
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={profileData.first_name || ""}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setProfileData({ ...profileData, first_name: e.target.value })
                    }
                    className="w-full p-2 text-black rounded"
                  />
                  <label htmlFor="last_name" className="block text-white">
                    Фамилия:
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={profileData.last_name || ""}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setProfileData({ ...profileData, last_name: e.target.value })
                    }
                    className="w-full p-2 text-black rounded"
                  />
                  <label htmlFor="dad_name" className="block text-white">
                    Отчество:
                  </label>
                  <input
                    type="text"
                    id="dad_name"
                    name="dad_name"
                    value={profileData.dad_name || ""}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setProfileData({ ...profileData, dad_name: e.target.value })
                    }
                    className="w-full p-2 text-black rounded"
                  />
                  <label htmlFor="bio" className="block text-white">
                    Биография:
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={profileData.bio || ""}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setProfileData({ ...profileData, bio: e.target.value })
                    }
                    className="w-full p-2 text-black rounded"
                  />
                  <div className="flex space-x-4 mt-4">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={saveChanges}
                          className="px-6 py-2 bg-green-500 hover:bg-green-700 text-white rounded"
                        >
                          Сохранить
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="px-6 py-2 bg-gray-500 hover:bg-gray-700 text-white rounded"
                        >
                          Отмена
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded"
                      >
                        Редактировать
                      </button>
                    )}
                  </div>
                </form>
              </>
            ) : isFormVisible ? (
              <Form />
            ) : isClassifierVisible ? (
              <ClassifierForm />
            ) : (
              <p className="text-white">Пожалуйста, выберите раздел.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
