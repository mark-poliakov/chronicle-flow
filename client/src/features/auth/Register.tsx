import { useState, type SubmitEvent, type SubmitEventHandler } from 'react';
import styles from './LoginRegister.module.css';
import { useAppDispatch } from '../../app/hooks';
import { logIn } from './authSlice';

interface RegisterProps {
  handleLogin: () => void,
}

function Register({ handleLogin }: RegisterProps) {
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  
  const handleSubmit: SubmitEventHandler = (event: SubmitEvent) => {
    event.preventDefault();
    dispatch(logIn({ email, password }));
  } 

  return (
    <>
      <h2>Register</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.fieldWrapper}>
          <label htmlFor='email'>Email:</label>
          <input
            type='email'
            id='email'
            value={email}
            onChange={(event) => {setEmail(event.target.value)}}
          ></input>
        </div>
        <div className={styles.fieldWrapper}>
          <label htmlFor='password'>Password:</label>
          <input
            type='password'
            id='password'
            value={password}
            onChange={(event) => {setPassword(event.target.value)}}
          ></input>
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