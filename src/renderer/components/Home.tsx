import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <Link to="/mappings">
        <Button variant="link" className="menu-item">
          <h4>Mappings</h4>
        </Button>
      </Link>
      <Link to="/charts">
        <Button variant="link" className="menu-item">
          <h4>Charts</h4>
        </Button>
      </Link>
    </div>
  );
};

export default Home;
