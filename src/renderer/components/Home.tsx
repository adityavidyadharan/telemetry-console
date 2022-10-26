import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Link to="/mappings">
      <Button variant="link" className="menu-item">
        <span className="menu-item-text">Mappings</span>
      </Button>
    </Link>
  );
};

export default Home;
