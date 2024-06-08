import styles from './modules.module.css';

/* eslint-disable-next-line */
export interface ModulesProps {}

export function Modules(props: ModulesProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Modules!</h1>
    </div>
  );
}

export default Modules;
