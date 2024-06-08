import styles from './drone-map.module.css';

/* eslint-disable-next-line */
export interface DroneMapProps {}

export function DroneMap(props: DroneMapProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to DroneMap!</h1>
    </div>
  );
}

export default DroneMap;
