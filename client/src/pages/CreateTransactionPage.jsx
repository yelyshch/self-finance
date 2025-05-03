import Navbar from '../components/Navbar';
import { useState } from 'react';

export default function CreateTransaction() {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const payload = {
      amount: Number(amount),
      type,
      category,
      description,
      transaction_date: new Date(date).toISOString()
    };

    try {
      const res = await fetch('http://localhost:5000/api/transactions/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        alert('Transaction created!');
        // Очистити форму
        setAmount('');
        setType('income');
        setCategory('');
        setDescription('');
        setDate('');
      } else {
        alert(data.message || 'Failed to create transaction');
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  return (
    <>
      <Navbar />
    <form onSubmit={handleSubmit}>
      <h3>Create Transaction</h3>
      <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} required />
      <select value={type} onChange={e => setType(e.target.value)}>
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>
      <input type="text" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} required />
      <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
      <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} required />
      <button type="submit">Add Transaction</button>
    </form>
    </>
  );
}
