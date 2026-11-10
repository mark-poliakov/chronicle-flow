import styles from './Profile.module.css';
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { type MouseEvent } from 'react';
import { logOut } from './authSlice';
import Dropdown from '../../components/Dropdown';
import { closeDropdown, openDropdown } from '../../components/dropdownSlice';

function Profile () {
  const userEmail = useAppSelector((state) => state.auth.email);
  const dropdownName = 'profile-options';

  const dispatch = useAppDispatch();
  const handleOpenDropdown = (event: MouseEvent) => {
    event.stopPropagation();
    dispatch(openDropdown(dropdownName));
  }
  const handleLogOut = () => {
    dispatch(logOut());
    dispatch(closeDropdown());
  }
  
  return (
    <button className={styles.profileWrapper} tabIndex={1} onClick={handleOpenDropdown}>
      <span className={styles.profileName}>{userEmail ?? 'Profile'}</span>
      <div className={styles.profileImageWrapper}></div>
      <Dropdown name={dropdownName}>
        <a onClick={handleLogOut} tabIndex={1}>Logout</a>
      </Dropdown>
    
    </button>
  );
}

export default Profile;