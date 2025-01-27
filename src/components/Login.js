import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { FaVk, FaMailBulk, FaYandex } from 'react-icons/fa';
import { useUser } from "../context/UserContext";

const Login = () => {
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isPhoneLogin, setIsPhoneLogin] = useState(false); // Для переключения между входом по телефону или email
    const navigate = useNavigate();

    const setTokenInCookies = (accessToken, refreshToken) => {
        document.cookie = `access=${accessToken}; path=/; Secure; HttpOnly; SameSite=Strict`;
        document.cookie = `refresh=${refreshToken}; path=/; Secure; HttpOnly; SameSite=Strict`;
    };
    

    const { updateUser } = useUser(); // Получаем функцию обновления пользователя из контекста

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const body = isPhoneLogin
            ? { phone_number: phoneNumber, hash_password: password }
            : { email: email, hash_password: password };
    
        const loginEndpoint = isPhoneLogin
            ? '/authorization/login/phone/number'
            : '/authorization/login/email';
    
        try {
            const response = await fetch(
                `https://registration-fastapi.onrender.com${loginEndpoint}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                }
            );
    
            if (response.ok) {
                const { access, refresh, userData } = await response.json();
                setTokenInCookies(access, refresh);
    
                // Проверь данные пользователя
                console.log('User data:', userData);
    
                updateUser(userData);
    
                toast.success('Вход выполнен успешно!');
                setTimeout(() => navigate('/profile'), 1500);
            } else {
                const errorData = await response.json();
                toast.error(`Ошибка входа: ${errorData.message || 'Попробуйте снова'}`);
            }
        } catch (error) {
            console.error('Error during login:', error);
            toast.error('Ошибка сети. Проверьте соединение.');
        } finally {
            setIsLoading(false);
        }
    };
    

    
    

   

    const handleOAuthRedirect = async (provider) => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `https://registration-fastapi.onrender.com/${provider}/link`,
                { method: 'GET' }
            );

            const textResponse = await response.text();

            if (response.ok && textResponse) {
                const cleanLink = textResponse.replace(/^"|"$/g, '');
                window.location.href = cleanLink;
            } else {
                toast.error('Ошибка получения ссылки.');
            }
        } catch (error) {
            console.error('Ошибка при получении ссылки:', error);
            toast.error('Ошибка сети. Проверьте соединение.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = async (provider, code) => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `https://registration-fastapi.onrender.com/${provider}/get/token?code=${code}`,
                { method: 'GET' }
            );

            const { access, refresh } = await response.json();
            setTokenInCookies(access, refresh);

            // В зависимости от того, является ли это регистрацией или авторизацией
            if (provider === 'vk') {
                await fetch(`https://registration-fastapi.onrender.com/vk/registration`, { method: 'GET' });
                toast.success('Вход через ВКонтакте выполнен успешно!');
            } else if (provider === 'mail.ru') {
                await fetch(`https://registration-fastapi.onrender.com/mail.ru/registration`, { method: 'GET' });
                toast.success('Вход через Mail.ru выполнен успешно!');
            } else if (provider === 'yandex') {
                await fetch(`https://registration-fastapi.onrender.com/yandex/registration`, { method: 'GET' });
                toast.success('Вход через Яндекс выполнен успешно!');
            }

            // Валидация токенов после успешной авторизации
           
            setTimeout(() => navigate('/profile'), 1500);
        } catch (error) {
            console.error('Ошибка при авторизации через соцсеть:', error);
            toast.error('Ошибка при авторизации. Попробуйте снова.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-blue-500 to-purple-600">
            <Toaster position="top-right" />
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Добро пожаловать</h2>
                <form onSubmit={handleLogin}>
                    <div className="flex justify-center mb-6">
                        <button
                            type="button"
                            className={`px-6 py-3 font-semibold rounded-l-lg ${!isPhoneLogin ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800'} text-lg`}
                            onClick={() => setIsPhoneLogin(false)}
                        >
                            Вход через Email
                        </button>
                        <button
                            type="button"
                            className={`px-6 py-3 font-semibold rounded-r-lg ${isPhoneLogin ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800'} text-lg`}
                            onClick={() => setIsPhoneLogin(true)}
                        >
                            Вход через Телефон
                        </button>
                    </div>

                    {!isPhoneLogin ? (
                        <div className="mb-6">
                            <label htmlFor="email" className="block text-sm font-semibold mb-2 text-gray-700">
                                Электронная почта
                            </label>
                            <input
                                id="email"
                                type="email"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    ) : (
                        <div className="mb-6">
                            <label htmlFor="phone_number" className="block text-sm font-semibold mb-2 text-gray-700">
                                Номер телефона
                            </label>
                            <input
                                id="phone_number"
                                type="tel"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    <div className="mb-8">
                        <label htmlFor="password" className="block text-sm font-semibold mb-2 text-gray-700">
                            Пароль
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-3 text-white font-bold rounded-lg transition ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Загрузка...' : 'Войти'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm font-medium mb-4 text-gray-700">Или войдите через:</p>
                    <div className="grid grid-cols-1 gap-4">
                        <button
                            onClick={() => handleOAuthRedirect('vk')}
                            className="flex items-center justify-center py-4 w-full bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                        >
                            <FaVk size={24} className="mr-2" />
                            Войти через ВКонтакте
                        </button>
                        <button
                            onClick={() => handleOAuthRedirect('mail.ru')}
                            className="flex items-center justify-center py-4 w-full bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
                        >
                            <FaMailBulk size={24} className="mr-2" />
                            Войти через Mail.ru
                        </button>
                        <button
                            onClick={() => handleOAuthRedirect('yandex')}
                            className="flex items-center justify-center py-4 w-full bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition"
                        >
                            <FaYandex size={24} className="mr-2" />
                            Войти через Яндекс
                        </button>
                    </div>
                </div>

                <p className="mt-6 text-center text-sm text-gray-700">
                    Нет аккаунта?{' '}
                    <span
                        role="link"
                        tabIndex={0}
                        onClick={() => navigate('/registration')}
                        className="cursor-pointer underline text-blue-600 font-semibold"
                    >
                        Зарегистрируйтесь
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;
