// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';

import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import NxWelcome from './nx-welcome';
import {CreateDronePage, DashboardPage, DronesPage, ViewDronePage} from "@flight-data-center/pages";

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage/>} />
        <Route path="/drones" element={<DronesPage/>} />
        <Route path="/drone/create" element={<CreateDronePage/>} />
        {/*<Route path="/dron/:uuid" element={<ViewDronePage/>} />*/}
      </Routes>
    </Router>
  );
}

export default App;
