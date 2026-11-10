import { useState } from 'react';
import styles from './AuthScreen.module.css';
import Register from './Register';
import Login from './Login';
import { useAppSelector } from '../../app/hooks';

function AuthScreen () {
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const errorMessage = useAppSelector((state) => state.auth.error);
  
  return (
    <div className={styles.container}>
      <h1 className='logo-text'>Chronicle Flow</h1>
      <p className={styles.errorMessage}>{errorMessage}</p>
      <div className={styles.authFormContainer}>
        {isRegistering ? <Register handleLogin={() => {setIsRegistering(false)}} /> : <Login handleRegister={() => {setIsRegistering(true)}} />}
      </div>
    </div>
  )
}

export default AuthScreen;