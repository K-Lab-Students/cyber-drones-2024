import styles from './pages.module.css';

/* eslint-disable-next-line */
export interface PagesProps {}

export function Pages(props: PagesProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Pages!</h1>
    </div>
  );
}

export default Pages;
