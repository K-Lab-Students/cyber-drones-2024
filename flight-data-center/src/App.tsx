import React from 'react';
import logo from './logo.svg';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import DashboardPage from "./pages/DashboardPage";
import MLPage from "./pages/MLPage";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/ml" element={<MLPage />} />
        </Routes>
      </Router>
  );
}

export default App;
