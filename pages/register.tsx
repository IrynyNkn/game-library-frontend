import React from 'react';
import styles from '/styles/pages/Login.module.scss';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { SignUpDto, SignUpType } from '../utils/types/auth';
import { emailRegExp } from '../utils/regExp';
import { useLoading } from '../utils/hooks/useLoading';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { saveTokenToCookies } from '../utils/auth';

const Register = () => {
  const { setLoading } = useLoading();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignUpType>();

  const signUp = async (data: SignUpDto) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/signup`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!result.error) {
        // const token = result.data.token;
        // saveTokenToCookies(token);
        toast.success('Sign up was successful');
        await router.push('/login');
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

  const onSubmit = async (data: SignUpType) => {
    const { password, repeatPassword } = data;
    if (password !== repeatPassword) {
      setError('repeatPassword', {
        type: 'custom',
        message: 'Passwords do not match',
      });
    } else {
      const dto = { ...data };
      delete dto.repeatPassword;
      await signUp(dto);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <div className={styles.loginBox}>
          <h1 className={styles.title}>Register</h1>
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
              className={`input-container ${errors.userName ? 'error' : ''}`}>
              <input
                className="input"
                placeholder={'User Name'}
                {...register('userName', {
                  required: true,
                })}
              />
              <p className="input-label">User Name</p>
            </label>
            <label
              className={`input-container ${errors.password ? 'error' : ''}`}>
              <input
                type="password"
                className="input"
                placeholder={'Password'}
                {...register('password', {
                  required: true,
                  minLength: 6
                })}
              />
              <p className="input-label">Password</p>
              {errors.password && (
                <span className="error-message">
                  Password should contain at least 6 characters
                </span>
              )}
            </label>
            <label
              className={`input-container ${
                errors.repeatPassword ? 'error' : ''
              }`}>
              <input
                type="password"
                className="input"
                placeholder={'Repeat Password'}
                {...register('repeatPassword', {
                  required: true,
                })}
              />
              <p className="input-label">Repeat Password</p>
              {errors.repeatPassword?.message && (
                <span className="error-message">
                  {errors.repeatPassword.message}
                </span>
              )}
            </label>
            <button className="green-button">Sign Up</button>
          </form>
          <p className={styles.message}>
            Already have registered? <Link href={'/login'}>Login here</Link>
          </p>
        </div>
      </div>
      <div className={styles.backgroundSignup} />
    </div>
  );
};

export default Register;
