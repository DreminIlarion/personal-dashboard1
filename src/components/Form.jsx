import React, { useState ,useEffect} from 'react';
import Cookies from 'js-cookie'; // Для работы с куками

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const setTokenInCookies = (accessToken, refreshToken) => {
    document.cookie = `access=${accessToken}; path=/; SameSite=None; Secure`; // Для кросс-доменных запросов
    document.cookie = `refresh=${refreshToken}; path=/; SameSite=None; Secure`; // Для кросс-доменных запросов
    console.log('Тут добавились куки из авторизации', document.cookie);
  
  };

// useEffect(() => {
//   // Функция для вывода токенов в консоль
//   const logTokens = () => {
//     const access = Cookies.get('access');
//     const refresh = Cookies.get('refresh');
    
//     // console.log('вот первый токен', access || 'Нет токена');
//     // console.log('вот второй:', refresh || 'Нет токена');
//   };

//   // Логируем токены сразу при загрузке компонента
//   logTokens();

//   // Устанавливаем интервал для логирования токенов каждые 15 секунд
//   const intervalId = setInterval(() => {
//     logTokens();
//   }, 15000); // 15000 мс = 15 секунд

//   // Очистить интервал при размонтировании компонента
//   return () => clearInterval(intervalId);
// }, []);

  // Хэндлер для изменений в форме
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };
  const getTokenFromCookies = (tokenName) => {
    return Cookies.get(tokenName);
  };

  const handleExamClick = (exam) => {
    setFormData(prevFormData => {
      const updatedExams = prevFormData.exams.includes(exam)
        ? prevFormData.exams.filter(item => item !== exam)
        : [...prevFormData.exams, exam];
      return { ...prevFormData, exams: updatedExams };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Отправка формы с данными:', JSON.stringify(formData));
    const AccessToket=getTokenFromCookies('access')

    const RefreshToken=getTokenFromCookies('refresh')
    setTokenInCookies(AccessToket, RefreshToken);
    try {
      const response = await fetch('https://personal-account-fastapi.onrender.com/predict/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',  // Это позволяет отправлять куки с запросом
      });
      
      console.log('Ответ сервера:', response);
  
      if (response.ok) {
        const data = await response.json();
        console.log('Ответ с сервера:', data);
  
        if (data.status === 'ok') {
          setRecommendations(data.data);
          setIsModalOpen(true);
        } else {
          setResponseMessage('Ошибка при обработке данных.');
        }
      } else {
        console.log('Ошибка HTTP:', response.status);
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
            <ul className="mb-4">
              {recommendations.map((item, index) => (
                <li key={index} className="mb-2">{item}</li>
              ))}
            </ul>
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
