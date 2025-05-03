import { useState } from 'react';
import Navbar from '../components/Navbar';

export default function CreateGoal() {
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const payload = {
      goal_name: goalName,
      target_amount: Number(targetAmount),
      status: 'in_progress', // Завжди встановлюємо статус 'in_progress'
      deadline,
      description
    };

    try {
      const res = await fetch('http://localhost:5000/api/goal/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        alert('Goal created!');
        // Очистити форму
        setGoalName('');
        setTargetAmount('');
        setDeadline('');
        setDescription('');
      } else {
        alert(data.message || 'Failed to create goal');
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
        <h3>Create Goal</h3>
        <input
          type="text"
          placeholder="Goal Name"
          value={goalName}
          onChange={e => setGoalName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Target Amount"
          value={targetAmount}
          onChange={e => setTargetAmount(e.target.value)}
          required
        />
        {/* Прибираємо селект для статусу */}
        <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} required />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <button type="submit">Add Goal</button>
      </form>
    </>
  );
}
