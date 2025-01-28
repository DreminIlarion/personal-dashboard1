import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie'; 
import axios from 'axios';

const Form = () => {
  const [formData, setFormData] = useState({
    top_n: '',
    gender: '',
    age: '',
    sport: '',
    foreign: '',
    gpa: '',
    points: 0,
    bonus_points: '',
    exams: [],
    reception_form: '',
    priority: '',
    education: '',
    study_form: ''
  });

  const [responseMessage, setResponseMessage] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [classifierResults, setClassifierResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Хэндлер для изменений в форме
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleExamClick = (exam) => {
    setFormData((prevData) => {
      const newExams = prevData.exams.includes(exam)
        ? prevData.exams.filter((item) => item !== exam) // Удаляем экзамен из списка, если он уже выбран
        : [...prevData.exams, exam]; // Добавляем экзамен в список, если его еще нет
  
      return {
        ...prevData,
        exams: newExams,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log('Делаем запрос с параметром credentials: "include"');
      const response = await fetch('https://personal-account-fastapi.onrender.com/predict/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Убедитесь, что куки передаются
        body: JSON.stringify({
          ...formData,
        }),
      });

      console.log('Ответ от сервера:', response);
      // Проверяем статус ответа
      if (response.ok) {
        const data = await response.json();
        console.log('Ответ с сервера (JSON):', data);
        console.log('Ответ с сервера (JSON):', data.recomendate);

        if (data.status === 'ok') {
          setRecommendations(data.recomendate);
          setClassifierResults(data.classifier);
          setIsModalOpen(true);
        } else {
          
          setRecommendations(data.recomendate);
          setClassifierResults(data.classifier);
          setIsModalOpen(true);
        }
      } else {
        setResponseMessage('Ошибка при отправке данных.');
      }
    } catch (error) {
      console.error('Ошибка отправки данных:', error);
      setResponseMessage('Произошла ошибка при отправке данных.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-xl rounded-lg w-full max-w-xl ml-7">
        {/* Поле для количества направлений */}
        <label className="block mb-4 text-sm font-semibold">
          Количество направлений:
          <input
            type="number"
            value={formData.top_n}
            onChange={handleChange}
            name="top_n"
            className="w-full p-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            required
          />
        </label>

        {/* Поле для выбора пола */}
        <fieldset className="space-y-4 mb-6">
          <label className="block text-sm font-semibold">
            Пол:
            <select
              value={formData.gender}
              name="gender"
              onChange={handleChange}
              className="w-full p-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Выберите пол</option>
              <option value="М">Мужской</option>
              <option value="Ж">Женский</option>
            </select>
          </label>

          {/* Поле для возраста */}
          <label className="block text-sm font-semibold">
            Возраст:
            <input
              type="number"
              value={formData.age}
              name="age"
              onChange={handleChange}
              className="w-full p-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </label>

          {/* Поле для вида спорта */}
          <label className="block text-sm font-semibold">
            Вид спорта:
            <input
              type="text"
              value={formData.sport}
              name="sport"
              onChange={handleChange}
              className="w-full p-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </label>

          {/* Поле для среднего балла GPA */}
          <label className="block text-sm font-semibold">
            Средний балл (GPA):
            <input
              type="number"
              step="0.01"
              value={formData.gpa}
              name="gpa"
              onChange={handleChange}
              className="w-full p-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </label>

          {/* Поле для общего количества баллов */}
          <label className="block text-sm font-semibold">
            Общее количество баллов:
            <input
              type="range"
              min="0"
              max="310"
              step="1"
              value={formData.points}
              onChange={(e) => setFormData({ ...formData, points: e.target.value })}
              className="w-full mt-2"
            />
            <span className="text-sm">{formData.points} баллов</span>
          </label>

          {/* Поле для дополнительных баллов */}
          <label className="block text-sm font-semibold">
            Дополнительные баллы:
            <input
              type="number"
              value={formData.bonus_points}
              name="bonus_points"
              onChange={handleChange}
              className="w-full p-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </label>

          {/* Поле для выбора экзаменов */}
          <label className="block text-sm font-semibold">
            Выберите экзамены:
            <div className="grid grid-cols-2 gap-2 mt-2">
              {['Русский язык', 'Математика', 'Физика', 'Химия', 'Биология', 'Информатика', 'История', 'Обществознание', 'Литература', 'География', 'Иностранный язык'].map((exam) => (
                <div
                  key={exam}
                  className={`p-2 border rounded-lg cursor-pointer ${ formData.exams.includes(exam) ? 'bg-purple-500 text-white' : 'bg-gray-200' }`}
                  onClick={() => handleExamClick(exam)}
                >
                  {exam}
                </div>
              ))}
            </div>
          </label>

          {/* Поле для выбора формы приема */}
          <label className="block text-sm font-semibold">
            Вид приема:
            <select
              value={formData.reception_form}
              name="reception_form"
              onChange={handleChange}
              className="w-full p-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Выберите вид приема</option>
              <option value="Общий конкурс">Общий конкурс</option>
              <option value="По договору">По договору</option>
            </select>
          </label>

          {/* Поле для приоритета */}
          <label className="block text-sm font-semibold">
            Приоритет:
            <input
              type="number"
              value={formData.priority}
              name="priority"
              onChange={handleChange}
              className="w-full p-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </label>

          {/* Поле для выбора вида образования */}
          <label className="block text-sm font-semibold">
            Вид образования:
            <select
              value={formData.education}
              name="education"
              onChange={handleChange}
              className="w-full p-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Выберите вид образования</option>
              <option value="Начальное общее образование">Начальное общее образование</option>
              <option value="Среднее общее образование">Среднее общее образование</option>
              <option value="Высшее общее образование">Высшее общее образование</option>
            </select>
          </label>

          {/* Поле для выбора формы обучения */}
          <label className="block text-sm font-semibold">
            Форма обучения:
            <select
              value={formData.study_form}
              name="study_form"
              onChange={handleChange}
              className="w-full p-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Выберите форму обучения</option>
              <option value="Очная">Очная</option>
              <option value="Заочная">Заочная</option>
            </select>
          </label>
        </fieldset>

        {/* Кнопка отправки формы */}
        <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Рассчитать
        </button>
      </form>

      {/* Модальное окно с рекомендациями */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h2 className="text-2xl font-semibold mb-4">Рекомендации</h2>

            {/* Вывод рекомендаций */}
            <div className="space-y-4 mb-6">
              {recommendations.map((item, index) => (
                <div key={index} className="p-4 bg-blue-100 rounded-md shadow-md">
                  <p className="text-lg font-semibold text-blue-700">{item}</p>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Вероятность: {Math.round(classifierResults[index] * 100)}%</p>
                    <div className="w-full bg-gray-200 h-2 mt-1 rounded-full">
                      <div
                        style={{ width: `${Math.round(classifierResults[index] * 100)}%` }}
                        className="h-2 bg-green-500 rounded-full"
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full bg-purple-600 text-white p-3 rounded-lg"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      {/* Сообщения о статусе */}
      {responseMessage && (
        <div className="mt-4 text-red-500">
          {responseMessage}
        </div>
      )}
    </div>
  );
};

export default Form;
