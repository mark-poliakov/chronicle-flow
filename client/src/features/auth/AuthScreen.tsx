import { useState } from 'react';
import styles from './AuthScreen.module.css';
import Register from './Register';
import Login from './Login';

function AuthScreen () {
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  
  return (
    <div className={styles.container}>
      <h1 className='logo-text'>Chronicle Flow</h1>
      <div className={styles.authFormContainer}>
        {isRegistering ? <Register handleLogin={() => {setIsRegistering(false)}} /> : <Login handleRegister={() => {setIsRegistering(true)}} />}
      </div>
    </div>
  )
}

export default AuthScreen;