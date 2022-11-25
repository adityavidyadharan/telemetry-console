import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import Mappings from './components/Mappings/Mappings';
import EditMapping from './components/Mappings/EditMapping';
import Home from './components/Home';
import UploadMapping from './components/Mappings/UploadMapping';
import ChartGrid from './components/ChartGrid';
import SessionGrid from './components/Sessions/SessionGrid';
import Parse from './components/Parsing/Parse';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mappings" element={<Mappings />} />
        <Route path="/mappings/edit" element={<EditMapping />} />
        <Route path="/mappings/upload" element={<UploadMapping />} />
        <Route path="/charts" element={<ChartGrid />} />
        <Route path="/sessions" element={<SessionGrid />} />
        <Route path="/parse" element={<Parse />} />
      </Routes>
      <Link to="/">
        <Button>Home</Button>
      </Link>
    </Router>
  );
}
