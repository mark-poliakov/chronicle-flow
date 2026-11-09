import { useState, type SubmitEvent, type SubmitEventHandler } from 'react';
import styles from './LoginRegister.module.css';
import { useAppDispatch } from '../../app/hooks';
import { logIn } from './AuthSlice';

interface LoginProps {
  handleRegister: () => void,
}

function Login ({ handleRegister }: LoginProps) {
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit: SubmitEventHandler = (event: SubmitEvent) => {
    event.preventDefault();
    dispatch(logIn({ email, password }));
  }

  return (
    <>
      <h2>Log in</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.fieldWrapper}>
          <label htmlFor='email'>Email: </label>
          <input
            type='email'
            id='email'
            value={email}
            onChange={(event) => {setEmail(event.target.value)}}
            autoComplete='email'
          ></input>
        </div>
        <div className={styles.fieldWrapper}>
          <label htmlFor='password'>Password: </label>
          <input
            type='password'
            id='password'
            value={password}
            onChange={(event) => {setPassword(event.target.value)}}
            autoComplete='current-password'
          ></input>
        </div>
        <input className={styles.submitButton} type='submit' value='Log in'></input>
      </form>
      <p>Don't have an account? <button className={styles.loginRegisterButton} onClick={handleRegister}>Register</button></p>
    </>
  );
}

export default Login;