import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  const navigate = useNavigate();
 

  
 

const handleRegister = async (e) => {
  e.preventDefault();
  try {
      const response = await fetch('https://registration-fastapi.onrender.com/registration', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              phone_number: phoneNumber,
              email: email,
              hash_password: password,
             
          }),
          
      });

      if (response.ok) {
          console.log('Registration successful');
      } else {
          console.error('Registration failed');
      }
  } catch (error) {
      console.error('Error during registration:', error);
  }
};




    


  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Регистрация</h2>
        
          
            <form onSubmit={handleRegister}>
              <div className="mb-4">
                <label htmlFor="phone_number" className="block text-sm font-semibold mb-2">Номер телефона</label>
                <input
                  id="phone_number"
                  type="tel"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-semibold mb-2">Электронная почта</label>
                <input
                  id="email"
                  type="email"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-semibold mb-2">Пароль</label>
                <input
                  id="password"
                  type="password"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <br />
              <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
          >
            Зарегистрироваться
          </button>
              </form>
            
         
          
          <p className="mt-4 text-center">
            Уже есть аккаунт?
            <span
              role="link"
              tabIndex={0}
              onClick={() => navigate('/')}
              className="cursor-pointer underline text-blue-600"
            >
              Войдите
            </span>
          </p>
       
      </div>
    </div>
  );
};

export default Register;