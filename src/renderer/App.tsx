import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import SensorChart from './components/SensorChart';

import 'bootstrap/dist/css/bootstrap.min.css';

const Hello = () => {
  return (
    <div>
      <SensorChart />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
