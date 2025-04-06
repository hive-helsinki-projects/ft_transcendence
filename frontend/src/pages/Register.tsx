import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { localAuth, User } from '../services/localAuth';
import RegisterForm from '../components/RegisterForm';
import '../css/Register.css';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);

  const handleSubmit = async (data: { username: string; email: string; password: string }) => {
    setIsLoading(true);
    setSuccessMessage('');
    
    try {
      await localAuth.register(data.username, data.email, data.password);
      setSuccessMessage('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowUsers = () => {
    const users = JSON.parse(localStorage.getItem('ft_transcendence_users') || '[]');
    setRegisteredUsers(users);
  };

  return (
    <RegisterForm
      onSubmit={handleSubmit}
      isLoading={isLoading}
      successMessage={successMessage}
      onShowUsers={handleShowUsers}
      registeredUsers={registeredUsers}
    />
  );
};

export default Register;