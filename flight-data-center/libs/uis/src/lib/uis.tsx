import styles from './uis.module.css';

/* eslint-disable-next-line */
export interface UisProps {}

export function Uis(props: UisProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Uis!</h1>
    </div>
  );
}

export default Uis;
