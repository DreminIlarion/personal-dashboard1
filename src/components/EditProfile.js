import React, { useState } from 'react';
import { useUser } from '../context/UserContext';

const EditProfile = () => {
  const { user, updateUser } = useUser(); // Используем updateUser вместо login
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [exams, setExams] = useState(user?.exams || '');
  const [age, setAge] = useState(user?.age || '');
  const [gender, setGender] = useState(user?.gender || '');
  const [sport, setSport] = useState(user?.sport || '');
  const [foreignLanguage, setForeignLanguage] = useState(user?.foreignLanguage || '');
  const [GPA, setGPA] = useState(user?.GPA || '');
  const [totalPoints, setTotalPoints] = useState(user?.totalPoints || '');
  const [bonusPoints, setBonusPoints] = useState(user?.bonusPoints || '');
  const [education, setEducation] = useState(user?.education || '');
  const [studyForm, setStudyForm] = useState(user?.studyForm || '');

  const handleSave = () => {
    updateUser({
      name,
      email,
      age,
      gender,
      sport,
      foreignLanguage,
      GPA,
      totalPoints,
      bonusPoints,
      exams,
      education,
      studyForm,
    });
    alert('Данные профиля успешно сохранены!');
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Редактировать профиль</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold mb-2">Имя</label>
            <input
              id="name"
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-2">Email</label>
            <input
              id="email"
              type="email"
              className="w-full p-3 border border-gray-300 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="age" className="block text-sm font-semibold mb-2">Возраст</label>
            <input
              id="age"
              type="number"
              className="w-full p-3 border border-gray-300 rounded-md"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="gender" className="block text-sm font-semibold mb-2">Пол</label>
            <select
              id="gender"
              className="w-full p-3 border border-gray-300 rounded-md"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Выберите пол</option>
              <option value="male">Мужской</option>
              <option value="female">Женский</option>
            </select>
          </div>
          <div>
            <label htmlFor="sport" className="block text-sm font-semibold mb-2">Спорт</label>
            <input
              id="sport"
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md"
              value={sport}
              onChange={(e) => setSport(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="foreignLanguage" className="block text-sm font-semibold mb-2">Иностранный язык</label>
            <input
              id="foreignLanguage"
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md"
              value={foreignLanguage}
              onChange={(e) => setForeignLanguage(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="GPA" className="block text-sm font-semibold mb-2">Средний балл аттестата</label>
            <input
              id="GPA"
              type="number"
              step="0.01"
              className="w-full p-3 border border-gray-300 rounded-md"
              value={GPA}
              onChange={(e) => setGPA(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="totalPoints" className="block text-sm font-semibold mb-2">Общее количество баллов</label>
            <input
              id="totalPoints"
              type="number"
              className="w-full p-3 border border-gray-300 rounded-md"
              value={totalPoints}
              onChange={(e) => setTotalPoints(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="bonusPoints" className="block text-sm font-semibold mb-2">Дополнительные баллы</label>
            <input
              id="bonusPoints"
              type="number"
              className="w-full p-3 border border-gray-300 rounded-md"
              value={bonusPoints}
              onChange={(e) => setBonusPoints(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="exams" className="block text-sm font-semibold mb-2">Экзамены</label>
            <input
              id="exams"
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md"
              value={exams}
              onChange={(e) => setExams(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="education" className="block text-sm font-semibold mb-2">Образование</label>
            <input
              id="education"
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="studyForm" className="block text-sm font-semibold mb-2">Форма обучения</label>
            <select
              id="studyForm"
              className="w-full p-3 border border-gray-300 rounded-md"
              value={studyForm}
              onChange={(e) => setStudyForm(e.target.value)}
            >
              <option value="">Выберите форму обучения</option>
              <option value="full-time">Очная</option>
              <option value="part-time">Заочная</option>
              <option value="distance-learning">Дистанционная</option>
            </select>
          </div>
          <button
            className="mt-6 py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition duration-200"
            onClick={handleSave}
          >Сохранить изменения</button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
