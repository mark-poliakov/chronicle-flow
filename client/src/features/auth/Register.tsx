import type { SubmitEvent, SubmitEventHandler } from 'react';
import styles from './LoginRegister.module.css';
import { useAppDispatch } from '../../app/hooks';
import { logIn } from './AuthSlice';

interface RegisterProps {
  handleLogin: () => void,
}

function Register({ handleLogin }: RegisterProps) {
  const dispatch = useAppDispatch();
  
  const handleSubmit: SubmitEventHandler = (event: SubmitEvent) => {
    event.preventDefault();
    dispatch(logIn());
  } 

  return (
    <>
      <h2>Register</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.fieldWrapper}>
          <label htmlFor='email'>Email:</label>
          <input type='email' id='email'></input>
        </div>
        <div className={styles.fieldWrapper}>
          <label htmlFor='password'>Password:</label>
          <input type='password' id='password'></input>
        </div>
        <div className={styles.fieldWrapper}>
          <label htmlFor='repeatPassword'>Repeat Password:</label>
          <input type='password' id='repeatPassword'></input>
        </div>
        <input className={styles.submitButton} type='submit' value='Log in'></input>
      </form>
      <p>Already have an account? <button className={styles.loginRegisterButton} onClick={handleLogin}>Log in</button></p>
    </>
  );
}

export default Register