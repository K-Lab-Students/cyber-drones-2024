import styles from './create-drone-page.module.css';

/* eslint-disable-next-line */
export interface CreateDronePageProps {}

export function CreateDronePage(props: CreateDronePageProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to CreateDronePage!</h1>
    </div>
  );
}

export default CreateDronePage;
