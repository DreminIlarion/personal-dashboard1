import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import Form from "./Form";
import ClassifierForm from "./MiniClassifier";

const Profile = () => {
  const { user, logout, updateUser } = useUser();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isClassifierVisible, setIsClassifierVisible] = useState(false);
  const [isMyDataVisible, setIsMyDataVisible] = useState(false);
  const [profileData, setProfileData] = useState(user || {});

  // Загружаем данные пользователя из localStorage при монтировании
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("profileData"));
    if (storedData) {
      setProfileData(storedData);
    }
  }, []);

  // Сохраняем данные пользователя в localStorage при изменении
  useEffect(() => {
    localStorage.setItem("profileData", JSON.stringify(profileData));
  }, [profileData]);

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

  const saveChanges = () => {
    updateUser(profileData);
    alert("Профиль успешно обновлён!");
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
            {/* Navigation Tabs */}
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
                  onClick={() => logout()}
                  className="w-full text-left px-6 py-3 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  <label htmlFor="first_name" className="block text-white">
                    Имя:
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={profileData.first_name || ""}
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
                    name="last_name"
                    value={profileData.last_name || ""}
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
                    name="dad_name"
                    value={profileData.dad_name || ""}
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
                    name="bio"
                    rows="4"
                    value={profileData.bio || ""}
                    onChange={(e) =>
                      setProfileData({ ...profileData, bio: e.target.value })
                    }
                    className="w-full p-2 rounded-md bg-gray-100 text-black resize-none"
                  ></textarea>
                </form>
                <button
                  className="block w-full py-3 mt-6 text-white bg-purple-500 rounded-md hover:bg-green-600"
                  onClick={saveChanges}
                >
                  Сохранить изменения
                </button>
              </>
            ) : isFormVisible ? (
              <>
                <h2 className="text-3xl font-bold mb-6 text-center text-white">
                  Predict
                </h2>
                <p className="text-xl text-center mb-4 text-white">
                  Здесь вы можете узнать свои шансы на поступление сразу по
                  нескольким направлениям
                </p>
                <Form />
              </>
            ) : isClassifierVisible ? (
              <div className="flex items-center justify-center w-full h-full relative z-10">
                <div className="w-full max-w-4xl p-8">
                  <ClassifierForm />
                </div>
              </div>
            ) : (
              <div className="w-full max-w-2xl text-center relative z-10">
                <h2 className="text-3xl font-bold mb-6 text-white">
                  Добро пожаловать!
                </h2>
                <p className="text-xl mb-4 text-white">
                  Слева в навигационном меню вы можете воспользоваться сервисом
                  (predict), который рассчитает ваши шансы поступления на одну
                  специальность. Если вы хотите видеть информацию по нескольким
                  направлениям.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
