import { Outlet } from 'react-router-dom';
import { AppHeader } from './app-header/app-header';
import styles from './app/app.module.css';

function Layout() {
  return (
    <div className={styles.app}>
      <AppHeader />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
