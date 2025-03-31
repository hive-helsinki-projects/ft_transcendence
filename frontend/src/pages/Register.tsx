import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

interface RegisterFormInputs {
  username: string;
  password: string;
}

const Register: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>();

  const onSubmit: SubmitHandler<RegisterFormInputs> = (data) => {
    console.log('Form Data:', data);
    // Handle registration logic here (e.g., API call)
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            {...register('username', { required: 'Username is required' })}
          />
          {errors.username && <p>{errors.username.message}</p>}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            {...register('password', { required: 'Password is required' })}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;