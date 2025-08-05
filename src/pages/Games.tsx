import { Link } from 'react-router-dom';

const Games = () => (
  <div className="games-container">
    <h1>Games</h1>
    <Link to="/" style={{ color: '#8ab4f8', marginTop: '2rem' }}>Back to Menu</Link>
  </div>
);

export default Games; 