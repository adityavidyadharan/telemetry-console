import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Link to="/mappings">
      <Button variant="link" className="menu-item">
        <h4>Mappings</h4>
      </Button>
    </Link>
  );
};

export default Home;
