import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Mappings = () => {
  return (
    <div className="mappingsHome">
      <div className="menu-wrapper">
        <Link to="/mappings/upload">
          <Button variant="link" className="menu-item">
            <span className="menu-item-text">Upload New Mapping</span>
          </Button>
        </Link>
        <Link to="/mappings/edit">
          <Button variant="link" className="menu-item">
            <span className="menu-item-text">Edit Existing Mapping</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Mappings;
