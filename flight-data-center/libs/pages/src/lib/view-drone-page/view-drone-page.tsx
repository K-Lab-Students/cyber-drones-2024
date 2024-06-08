import styles from './view-drone-page.module.css';

/* eslint-disable-next-line */
export interface ViewDronePageProps {}

export function ViewDronePage(props: ViewDronePageProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to ViewDronePage!</h1>
    </div>
  );
}

export default ViewDronePage;
