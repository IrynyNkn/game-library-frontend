import React from 'react';
import styles from '/styles/pages/Login.module.scss';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { LoginDto } from '../utils/types/auth';
import { useLoading } from '../utils/hooks/useLoading';
import { emailRegExp } from '../utils/regExp';
import {authTokenName, saveTokenToCookies} from '../utils/auth';
import { toast } from 'react-toastify';
import getCookies from "../utils/getCookies";

const Login = () => {
  const router = useRouter();
  const { setLoading } = useLoading();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDto>();

  const onSubmit = async (data: LoginDto) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!result.error) {
        const token = result.token;
        saveTokenToCookies(token);
        await router.push('/');
      } else {
        toast.error(result.message);
      }
    } catch (e) {
      console.log('Error while registration', e);
      toast.error('Internal Server Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.backgroundLogin} />
      <div className={styles.contentWrapper}>
        <div className={styles.loginBox}>
          <h1 className={styles.title}>Log In</h1>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.loginForm}>
            <label className={`input-container ${errors.email ? 'error' : ''}`}>
              <input
                className="input"
                placeholder={'Email'}
                {...register('email', {
                  required: true,
                  pattern: emailRegExp,
                })}
              />
              <p className="input-label">Email</p>
            </label>
            <label
              className={`input-container ${errors.password ? 'error' : ''}`}>
              <input
                className="input"
                type="password"
                placeholder={'Password'}
                {...register('password', {
                  required: true,
                })}
              />
              <p className="input-label">Password</p>
            </label>
            <button type="submit" className="green-button">
              Login Now
            </button>
          </form>
          <p className={styles.message}>
            Have not registered yet?{' '}
            <Link href={'/register'}>Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
