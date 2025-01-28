import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import Form from './Form';
import ClassifierForm from './MiniClassifier';
import Chat from './Chat';
import axios from 'axios';
const Profile = () => {
  const { user, logout, updateUser } = useUser();
  const [activeSection, setActiveSection] = useState(null); // Хранит активный раздел
  
  const [isChatVisible, setIsChatVisible] = useState(false);
  
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    dad_name: "",
    bio: "",
  });
  const [isFirstTime, setIsFirstTime] = useState(true); // Определяет, первый ли это раз

  const clearCookies = () => {
    const cookies = document.cookie.split(";"); // Получаем все куки
    cookies.forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`; // Удаляем куки, задавая истекший срок
    });
    console.log(document.cookie);
    console.log("Все cookies очищены.");
  };
  

  // Получение данных с сервера при загрузке
   // Получение данных профиля
   useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(
          "https://personal-account-fastapi.onrender.com/user_data/get/personal",
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log('вот тут мне показывает типо',data);
          setProfileData({
            first_name: data.data.first_name || "",
            last_name: data.data.last_name || "",
            dad_name: data.data.dad_name || "",
            bio: data.data.bio || "",
          });
          setIsFirstTime(false);
        }
      } catch (error) {
        console.log("Ошибка получения данных профиля:",error);
      }
    };

    fetchProfileData();
  }, []);

  // Обработка сохранения данных
  const saveChanges = async () => {
    const url = isFirstTime
      ? "https://personal-account-fastapi.onrender.com/user_data/post/personal"
      : "https://personal-account-fastapi.onrender.com/user_data/put/personal";

    const method = isFirstTime ? "POST" : "PUT";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // для передачи cookies
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        alert(isFirstTime ? "Данные успешно сохранены!" : "Данные успешно обновлены!");
        if (isFirstTime) setIsFirstTime(false);
      } else {
        console.error("Ошибка при сохранении данных:", response.status);
        alert("Произошла ошибка при сохранении данных. Попробуйте еще раз.");
      }
    } catch (error) {
      console.error("Ошибка при сохранении данных профиля:", error);
      alert("Произошла ошибка при сохранении данных. Попробуйте еще раз.");
    }
  };


  const toggleChatVisibility = () => {
    setIsChatVisible(!isChatVisible);
  };

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('profileData'));
    if (storedData) {
      setProfileData(storedData);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('profileData', JSON.stringify(profileData));
  }, [profileData]);

  

  return (
    <div className="flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <header
        className="w-full bg-blue-800 text-white shadow-md fixed top-0 z-50"
        style={{
          background: 'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgb(25, 29, 255) 0%, rgba(0,99,255,1) 100%)',
        }}
      >
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
        <div
          className="w-64 h-screen fixed left-0 top-0 text-white shadow-lg flex flex-col pt-16"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgb(25, 29, 255) 0%, rgba(0,99,255,1) 100%)',
          }}
        >
          <div className="flex items-center px-6 py-4 border-b border-blue-700">
            <FaUserCircle className="text-3xl text-white mr-3" />
            {user ? (
              <span className="text-xl font-semibold">{user.email}</span>
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
                  onClick={() => setActiveSection('myData')}
                  className={`w-full text-left px-6 py-3 focus:outline-none ${
                    activeSection === 'myData' ? 'text-white' : 'text-gray-200 hover:text-white'
                  } transition-colors duration-200`}
                >
                  Мои данные
                </button>
              </li>
            )}
            {user && (
              <li className="mb-2">
                <button
                  onClick={() => setActiveSection('form')}
                  className={`w-full text-left px-6 py-3 focus:outline-none ${
                    activeSection === 'form' ? 'text-white' : 'text-gray-200 hover:text-white'
                  } transition-colors duration-200`}
                >
                  Расширенный шанс поступления 
                </button>
              </li>
            )}
            <li className="mb-2">
              <button
                onClick={() => setActiveSection('classifier')}
                className={`w-full text-left px-6 py-3 focus:outline-none ${
                  activeSection === 'classifier' ? 'text-white' : 'text-gray-200 hover:text-white'
                } transition-colors duration-200`}
              >
                Базовый шанс поступления
              </button>
            </li>
            {user && (
              <li className="mb-2">
                <button
                  onClick={() => {logout();clearCookies();window.location.reload(); }}
                  className="w-full text-left px-6 py-3 focus:outline-none text-gray-200 hover:text-white transition-colors duration-200"
                >
                  Выход
                </button>
              </li>
            )}
          </ul>
          <div className="px-6 py-4 text-sm text-center border-t border-blue-600">
            <p>© 2025 TyuIU</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-64 p-8 min-h-screen bg-white relative">
          {activeSection === 'myData' && (
            <div className="mb-8">
            <h2 className="text-3xl font-bold mb-6 text-center text-black">
              Мои данные
            </h2>
            <div className="p-6 bg-white border border-gray-300 rounded-md shadow-md max-w-lg mx-auto">
              <form className="space-y-4">
                <label htmlFor="first_name" className="block text-black">
                  Имя:
                </label>
                <input
                  type="text"
                  id="first_name"
                  value={profileData.first_name}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      first_name: e.target.value,
                    })
                  }
                  className="w-full p-2 rounded-md bg-gray-100 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <label htmlFor="last_name" className="block text-black">
                  Фамилия:
                </label>
                <input
                  type="text"
                  id="last_name"
                  value={profileData.last_name}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      last_name: e.target.value,
                    })
                  }
                  className="w-full p-2 rounded-md bg-gray-100 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <label htmlFor="dad_name" className="block text-black">
                  Отчество:
                </label>
                <input
                  type="text"
                  id="dad_name"
                  value={profileData.dad_name}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      dad_name: e.target.value,
                    })
                  }
                  className="w-full p-2 rounded-md bg-gray-100 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <label htmlFor="bio" className="block text-black">
                  О себе:
                </label>
                <textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) =>
                    setProfileData({ ...profileData, bio: e.target.value })
                  }
                  className="w-full p-2 rounded-md bg-gray-100 text-black border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                ></textarea>
              </form>
              <button
                className="block w-full py-3 mt-6 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                onClick={saveChanges}
              >
                Сохранить изменения
              </button>
            </div>
          </div>
          )}

          {activeSection === 'form' && (
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-6 text-center text-black">Расширенный шанс поступления</h2>
              <Form />
            </div>
          )}

          {activeSection === 'classifier' && (
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-6 text-center text-black">Базовый шанс поступления</h2>
              <ClassifierForm />
            </div>
          )}

          {!activeSection && (
            <div className="flex items-center justify-center min-h-screen text-black text-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Добро пожаловать!</h2>
              <p className="text-2xl mb-6">Вкладка "Базовый шанс поступления" предоставляет приблизительный расчет шансов.</p>
              <p className="text-2xl mb-6">Для доступа к полному функционалу войдите на сайт</p>
            </div>
          </div>
          
          )}
        </div>
      </div>
      <div className="fixed bottom-4 right-4">
        {!isChatVisible ? (
          <button
            onClick={toggleChatVisibility}
            className="bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition duration-200"
          >
            Чат
          </button>
        ) : (
          <div className="bg-white shadow-lg rounded-lg w-280 h-196 p-4 relative">
            <button
              onClick={toggleChatVisibility}
              className="absolute top-0 right-1 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <Chat />
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

