import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';

const TaskForm = ({ onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const newTask = await response.json();
      onTaskAdded(newTask);
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task. Make sure the server is running and MongoDB is connected.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Task Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description (Optional)</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add some details about this task..."
            disabled={isSubmitting}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting || !title.trim()}>
          <PlusCircle size={20} />
          {isSubmitting ? 'Adding...' : 'Add Task'}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
