import { useAppSelector } from '../app/hooks';
import styles from './Dropdown.module.css';

interface DropdownProps {
  name: string,
  children: React.ReactNode,
}

function Dropdown ({ name, children }: DropdownProps) {
  const currentDropdownOpenedName = useAppSelector((state) => state.dropdown.dropdownName);

  return currentDropdownOpenedName === name && (
    <div className={styles.dropdown} onClick={(event) => {event.stopPropagation()}}>
      {children}
    </div>
  );
}

export default Dropdown;