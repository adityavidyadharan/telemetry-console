import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import Mappings from './components/Mappings/Mappings';
import EditMapping from './components/Mappings/EditMapping';
import Home from './components/Home';
import UploadMapping from './components/Mappings/UploadMapping';
import SensorChart from './components/SensorChart';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mappings" element={<Mappings />} />
        <Route path="/mappings/edit" element={<EditMapping />} />
        <Route path="/mappings/upload" element={<UploadMapping />} />
        <Route path="/charts" element={<SensorChart />} />
      </Routes>
      <Link to="/">
        <Button>Home</Button>
      </Link>
    </Router>
  );
}
