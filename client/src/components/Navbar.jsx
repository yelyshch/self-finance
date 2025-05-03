import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav>
      <h3>Finance Dashboard</h3>
      <div>
        <Link to="/dashboard">Dashboard</Link> |{' '}
        <Link to="/create-transaction">New Transaction</Link> |{' '}
        <Link to="/create-goal">New Goal</Link> |{' '}
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
