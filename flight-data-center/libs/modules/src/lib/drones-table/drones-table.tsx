import styles from './drones-table.module.css';

/* eslint-disable-next-line */
export interface DronesTableProps {}

export function DronesTable(props: DronesTableProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to DronesTable!</h1>
    </div>
  );
}

export default DronesTable;
