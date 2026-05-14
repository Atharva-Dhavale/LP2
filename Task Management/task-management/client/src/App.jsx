import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { CheckSquare } from 'lucide-react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/tasks');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      setTasks(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Could not load tasks. Ensure the backend is running and connected to MongoDB.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskAdded = (newTask) => {
    setTasks([newTask, ...tasks]);
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks(tasks.map(task => task._id === updatedTask._id ? updatedTask : task));
  };

  const handleTaskDelete = (taskId) => {
    setTasks(tasks.filter(task => task._id !== taskId));
  };

  return (
    <div className="container">
      <header>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: '#818cf8' }}>
          <CheckSquare size={48} />
        </div>
        <h1>Task Management</h1>
        <p>Organize your work, effortlessly.</p>
      </header>

      {error && (
        <div className="error-message">
          <strong>Error: </strong> {error}
        </div>
      )}

      <TaskForm onTaskAdded={handleTaskAdded} />

      {isLoading ? (
        <div style={{ textAlign: 'center' }}>
          <div className="loading-spinner"></div>
          <p style={{ color: 'var(--text-muted)' }}>Loading tasks...</p>
        </div>
      ) : (
        <TaskList 
          tasks={tasks} 
          onTaskUpdate={handleTaskUpdate}
          onTaskDelete={handleTaskDelete}
        />
      )}
    </div>
  );
}

export default App;
