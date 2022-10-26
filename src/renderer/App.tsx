import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import Mappings from './components/Mappings/Mappings';
import EditMapping from './components/Mappings/EditMapping';
import Home from './components/Home';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mappings" element={<Mappings />} />
        <Route path="/mappings/edit" element={<EditMapping />} />
      </Routes>
    </Router>
  );
}
