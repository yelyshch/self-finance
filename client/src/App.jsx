import { Routes, Route, Link } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CreateTransaction from './pages/CreateTransactionPage';
import CreateGoal from './pages/CreateGoalPage';
import './assets/App.css';

function App() {
  const Home = () => (
    <div className="card">
      <h1>Welcome to the App</h1>
      <div style={{ marginTop: '1rem' }}>
        <Link to="/login">
          <button className="read-the-docs">Login</button>
        </Link>
        <span style={{ margin: '0 1rem' }}></span>
        <Link to="/register">
          <button className="read-the-docs">Register</button>
        </Link>
      </div>
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/create-transaction" element={<CreateTransaction />} />
      <Route path="/create-goal" element={<CreateGoal />} />
    </Routes>
  );
}

export default App;
