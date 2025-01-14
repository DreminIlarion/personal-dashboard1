import React, { useState } from 'react';
import styles from './Form.module.css';

const Form = () => {
  const [formData, setFormData] = useState({
    top_n: '',
    user: {
      gender: '',
      age: '',
      sport: '',
      foreign: '',
      gpa: '',
      total_points: 0, // Начальное значение для ползунка
      bonus_points: '',
      exams: [],
      education: '',
      study_form: ''
    }
  });

  const [responseMessage, setResponseMessage] = useState('');
  const [recommendations, setRecommendations] = useState([]); // Состояние для направлений
  const [isModalOpen, setIsModalOpen] = useState(false); // Состояние модального окна

  const handleChange = (e) => {
    if (e.target.name === 'exams') {
      let newExams = [...formData.user.exams];
      newExams.push(e.target.value);
      setFormData({ ...formData, user: { ...formData.user, exams: newExams } });
    } else {
      setFormData({ ...formData, user: { ...formData.user, [e.target.name]: e.target.value } });
    }
  };

  const egeExams = [
    'Русский язык',
    'Математика',
    'Физика',
    'Химия',
    'Биология',
    'Информатика',
    'История',
    'Обществознание',
    'Литература',
    'География',
    'Иностранный язык',
  ];

  const handleExamClick = (exam) => {
    setFormData((prevFormData) => {
      const updatedExams = prevFormData.user.exams.includes(exam)
        ? prevFormData.user.exams.filter((item) => item !== exam)
        : [...prevFormData.user.exams, exam];
      return {
        ...prevFormData,
        user: {
          ...prevFormData.user,
          exams: updatedExams,
        },
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Отправляемые данные:', JSON.stringify(formData, null, 2));

    try {
      const response = await fetch(
        'https://tyuiu-fastapi-recsys-production.up.railway.app/rec_sys/recommend/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData, null, 2),
        }
      );

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === 'ok') {
        setResponseMessage('Данные успешно отправлены!');
        setRecommendations(data.data); // Сохраняем направления в состоянии
        setIsModalOpen(true); // Открываем модальное окно
      } else {
        setResponseMessage('Ошибка при обработке данных.');
      }
    } catch (error) {
      console.error('Ошибка отправки данных:', error);
      setResponseMessage('Произошла ошибка при отправке данных.');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false); // Закрыть модальное окно
  };

  return (
    <div className="container mx-auto p-6">
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-xl rounded-lg w-full max-w-xl">
        <label className="block mb-4 text-sm font-semibold">Количество направлений:
          <input
            type="number"
            value={formData.top_n}
            onChange={(e) => setFormData({ ...formData, top_n: e.target.value })}
            className="w-full p-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            required
          />
        </label>

        <fieldset className="space-y-4 mb-6">
          <label className="block text-sm font-semibold">Пол:
            <select
              value={formData.user.gender}
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

          <label className="block text-sm font-semibold">Возраст:
            <input
              type="number"
              value={formData.user.age}
              name="age"
              onChange={handleChange}
              className="w-full p-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </label>

          <label className="block text-sm font-semibold">Вид спорта:
            <input
              type="text"
              value={formData.user.sport}
              name="sport"
              onChange={handleChange}
              className="w-full p-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </label>

          <label className="block text-sm font-semibold">Средний балл (GPA):
            <input
              type="number"
              step="0.01"
              value={formData.user.gpa}
              name="gpa"
              onChange={handleChange}
              className="w-full p-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </label>

          <label className="block text-sm font-semibold">Общее количество баллов:
            <input
              type="range"
              min="0"
              max="300"
              step="1"
              value={formData.user.total_points}
              onChange={(e) =>
                setFormData({ ...formData, user: { ...formData.user, total_points: e.target.value } })
              }
              className="w-full mt-2"
            />
            <span className="text-sm">{formData.user.total_points} баллов</span>
          </label>

          <label className="block text-sm font-semibold">Дополнительные баллы:
            <input
              type="number"
              value={formData.user.bonus_points}
              name="bonus_points"
              onChange={handleChange}
              className="w-full p-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </label>

          <label className="block text-sm font-semibold">Выберите экзамены:
            <div className="grid grid-cols-2 gap-2 mt-2">
              {egeExams.map((exam) => (
                <div
                  key={exam}
                  className={`p-2 border rounded-lg cursor-pointer ${
                    formData.user.exams.includes(exam) ? 'bg-purple-500 text-white' : 'bg-gray-200'
                  }`}
                  onClick={() => handleExamClick(exam)}
                >
                  {exam}
                </div>
              ))}
            </div>
          </label>

          <label className="block text-sm font-semibold">Вид образования:
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

          <label className="block text-sm font-semibold">Форма обучения:
            <select
              name="study_form"
              value={formData.user.study_form}
              onChange={handleChange}
              className="w-full p-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Выберите форму обучения</option>
              <option value="Очная">Очная</option>
              <option value="Заочная">Заочная</option>
              <option value="Очно-заочная">Очно-заочная</option>
            </select>
          </label>
        </fieldset>

        <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Рассчитать
        </button>
      </form>

      {/* Модальное окно */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 shadow-lg rounded-lg w-96 grid gap-4">
          <div className="grid grid-cols-[auto_1fr_auto] items-center">
            <span></span>
            <h3 className="text-xl font-semibold">Результаты</h3>
            <button className="p-2" onClick={closeModal}>
            ✕
            </button>
          </div>
          <div className="mt-4">
            <ul className="space-y-2">
              {recommendations.map((item, index) => (
                <li key={index}>{item.replace('Направление подготовки_', '')}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default Form;