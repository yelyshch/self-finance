import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CreateTransaction from './pages/CreateTransactionPage';
import CreateGoal from './pages/CreateGoalPage';

function App() {
  return (
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/create-transaction" element={<CreateTransaction />} />
        <Route path="/create-goal" element={<CreateGoal />} />
      </Routes>
  );
}

export default App;
