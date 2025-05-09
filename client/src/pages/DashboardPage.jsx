import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../assets/DashboardPage.css';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [goals, setGoals] = useState([]);
  const [categories, setCategories] = useState({ income: [], expense: [] });
  const [history, setHistory] = useState([]);
  const [transactions, setTransactions] = useState([]);
const [filterType, setFilterType] = useState('all');
const [filterCategory, setFilterCategory] = useState('all');
const [allCategories, setAllCategories] = useState([]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EFF', '#FF6699'];

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchGoals = async () => {
      const res = await fetch('http://localhost:5000/api/goal/get', {
        headers: { Authorization: token }
      });
      const data = await res.json();
      if (res.ok) setGoals(data);
    };

    const fetchMetrics = async () => {
      const currentDate = new Date();
      const firstDayOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      const lastDayOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

      const date_gte = firstDayOfLastMonth.toISOString().split('T')[0];
      const date_lte = lastDayOfLastMonth.toISOString().split('T')[0];

      try {
        const resIncome = await fetch(`http://localhost:5000/api/transactions/get?type=income&date_gte=${date_gte}&date_lte=${date_lte}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const incomeData = await resIncome.json();

        const resExpenses = await fetch(`http://localhost:5000/api/transactions/get?type=expense&date_gte=${date_gte}&date_lte=${date_lte}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const expensesData = await resExpenses.json();

        const totalIncome = incomeData.reduce((acc, transaction) => acc + transaction.amount, 0);
        const totalExpenses = expensesData.reduce((acc, transaction) => acc + transaction.amount, 0);

        const balance = totalIncome - totalExpenses;

        setMetrics({
          balance: balance || 0,
          incomeLastMonth: totalIncome || 0,
          expensesLastMonth: totalExpenses || 0
        });
      } catch (err) {
        console.error('Error fetching metrics:', err);
        alert('Server error while fetching metrics');
      }
    };

    const fetchCategories = async () => {
      const resIncome = await fetch('http://localhost:5000/api/transactions/get?type=income', {
        headers: { Authorization: token }
      });
      const incomeData = await resIncome.json();

      const resExpense = await fetch('http://localhost:5000/api/transactions/get?type=expense', {
        headers: { Authorization: token }
      });
      const expenseData = await resExpense.json();

      if (resIncome.ok && resExpense.ok) {
        const incomeCategoriesData = incomeData.reduce((acc, transaction) => {
          const category = transaction.category;
          const existingCategory = acc.find(c => c.category === category);
          if (existingCategory) {
            existingCategory.amount += transaction.amount;
          } else {
            acc.push({ category, amount: transaction.amount });
          }
          return acc;
        }, []);

        const expenseCategoriesData = expenseData.reduce((acc, transaction) => {
          const category = transaction.category;
          const existingCategory = acc.find(c => c.category === category);
          if (existingCategory) {
            existingCategory.amount += transaction.amount;
          } else {
            acc.push({ category, amount: transaction.amount });
          }
          return acc;
        }, []);

        setCategories({
          income: incomeCategoriesData,
          expense: expenseCategoriesData,
        });
      }
    };

    const fetchHistory = async () => {
      const resIncome = await fetch(`http://localhost:5000/api/transactions/get?type=income&sort=date_desc`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const resExpense = await fetch(`http://localhost:5000/api/transactions/get?type=expense&sort=date_desc`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const incomeData = await resIncome.json();
      const expenseData = await resExpense.json();

      if (resIncome.ok && resExpense.ok) {
        const historyData = [];

        incomeData.forEach((income) => {
          const date = income.transaction_date.split('T')[0];
          const existingData = historyData.find(item => item.date === date);
          if (existingData) {
            existingData.income += income.amount;
          } else {
            historyData.push({ date, income: income.amount, expense: 0 });
          }
        });

        expenseData.forEach((expense) => {
          const date = expense.transaction_date.split('T')[0];
          const existingData = historyData.find(item => item.date === date);
          if (existingData) {
            existingData.expense += expense.amount;
          } else {
            historyData.push({ date, income: 0, expense: expense.amount });
          }
        });

        const sortedHistoryData = historyData.sort((a, b) => new Date(a.date) - new Date(b.date));
        setHistory(sortedHistoryData);
      }
    };

    fetchMetrics();
    fetchGoals();
    fetchHistory();
    fetchCategories();

    const fetchTransactions = async () => {
      const res = await fetch('http://localhost:5000/api/transactions/get', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setTransactions(data);
        const categoriesSet = new Set(data.map(t => t.category));
        setAllCategories([...categoriesSet]);
      }
    };
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter((t) => {
    const typeMatch = filterType === 'all' || t.type === filterType;
    const categoryMatch = filterCategory === 'all' || t.category === filterCategory;
    return typeMatch && categoryMatch;

  }, []);

  return (
    <div className="dashboard-container">
      <Navbar />
      <h2>Dashboard</h2>

      <div className="metrics-container">
        <div className="metric-item">Balance: {metrics?.balance || 0}</div>
        <div className="metric-item">Income: {metrics?.incomeLastMonth || 0}</div>
        <div className="metric-item">Expenses: {metrics?.expensesLastMonth || 0}</div>
      </div>

      <section className="chart-section">
        <h3 className="section-title">Expenses by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categories.expense}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#FF8042"
              label
            >
              {categories.expense.map((_, index) => (
                <Cell key={`expense-cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </section>

      <section className="chart-section">
        <h3 className="section-title">Income by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categories.income}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#82ca9d"
              label
            >
              {categories.income.map((_, index) => (
                <Cell key={`income-cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </section>
      <section className="transactions-section">
        <h3 className="section-title">Transactions</h3>

        <div className="filters">
          <label>
            Type:
            <select value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>

          <label>
            Category:
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
              <option value="all">All</option>
              {allCategories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </label>
        </div>

        <table className="transactions-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((t) => (
              <tr key={t.id}>
                <td>{t.transaction_date.split('T')[0]}</td>
                <td>{t.type}</td>
                <td>{t.category}</td>
                <td>{t.amount}</td>
                <td>{t.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="chart-section">
        <h3 className="section-title">Income & Expenses Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={history}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#82ca9d" />
            <Line type="monotone" dataKey="expense" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </section>

      <section className="goals-section">
        <h3 className="section-title">Goals</h3>
        {goals.length > 0 ? (
          <div className="goals-list">
            {goals.map((goal) => (
              <div key={goal.id} className={`goal-item ${goal.status.toLowerCase()}`}>
                <div className="goal-header">
                  <strong>{goal.goal_name}</strong>
                  <span className="goal-status">{goal.status}</span>
                </div>
                <div className="goal-info">
                  <p>Target: <strong>{goal.target_amount}</strong></p>
                  <p>Current: <strong>{goal.current_amount}</strong></p>
                  <p>Deadline: <strong>{goal.deadline}</strong></p>
                  <div className="progress-bar">
                    <div className="progress" style={{ width: `${(goal.current_amount / goal.target_amount) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No goals found or loading...</p>
        )}
      </section>
    </div>
  );
}
