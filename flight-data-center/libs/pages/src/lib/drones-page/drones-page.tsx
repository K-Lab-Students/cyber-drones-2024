import styles from './drones-page.module.css';

/* eslint-disable-next-line */
export interface DronesPageProps {}

export function DronesPage(props: DronesPageProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to DronesPage!</h1>
    </div>
  );
}

export default DronesPage;
