import React, { useState } from 'react';
import { Trash2, CheckCircle, Circle, Clock, Edit2, X, Save } from 'lucide-react';

const TaskList = ({ tasks, onTaskUpdate, onTaskDelete }) => {
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      const response = await fetch(`/api/tasks/${task._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update task status');

      const updatedTask = await response.json();
      onTaskUpdate(updatedTask);
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task status.');
    }
  };

  const handleEditClick = (task) => {
    setEditingTaskId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const handleSaveEdit = async (taskId) => {
    if (!editTitle.trim()) {
      alert("Title cannot be empty");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: editTitle, description: editDescription }),
      });

      if (!response.ok) throw new Error('Failed to update task');

      const updatedTask = await response.json();
      onTaskUpdate(updatedTask);
      setEditingTaskId(null);
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete task');

      onTaskDelete(taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task.');
    }
  };

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (tasks.length === 0) {
    return (
      <div className="card empty-state">
        <CheckCircle size={48} />
        <h2>All caught up!</h2>
        <p>No tasks found. Add a new one above.</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => {
        const isEditing = editingTaskId === task._id;

        return (
          <div key={task._id} className={`card task-item ${task.status === 'completed' ? 'completed' : ''}`}>
            <div className="task-content" style={{ width: '100%' }}>
              {isEditing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Task Title"
                    disabled={isSubmitting}
                    style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-main)', width: '100%' }}
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Task Description"
                    disabled={isSubmitting}
                    style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-main)', minHeight: '60px', resize: 'vertical', width: '100%' }}
                  />
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => handleSaveEdit(task._id)}
                      disabled={isSubmitting}
                      style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                    >
                      <Save size={16} /> Save
                    </button>
                    <button 
                      className="btn" 
                      onClick={handleCancelEdit}
                      disabled={isSubmitting}
                      style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', background: 'transparent', border: '1px solid var(--border)' }}
                    >
                      <X size={16} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="task-title">
                    {task.status === 'completed' ? (
                      <CheckCircle size={20} className="text-success" />
                    ) : (
                      <Circle size={20} className="text-primary" />
                    )}
                    {task.title}
                  </h3>
                  {task.description && <p className="task-desc">{task.description}</p>}
                  <div className="task-meta">
                    <span className="badge badge-pending" style={{ display: task.status === 'pending' ? 'inline-block' : 'none', marginRight: '8px' }}>Pending</span>
                    <span className="badge badge-completed" style={{ display: task.status === 'completed' ? 'inline-block' : 'none', marginRight: '8px' }}>Completed</span>
                    <span><Clock size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} /> {formatDate(task.createdAt)}</span>
                  </div>
                </>
              )}
            </div>

            {!isEditing && (
              <div className="task-actions">
                <button 
                  className={`btn-icon ${task.status === 'completed' ? 'btn-success' : ''}`}
                  onClick={() => handleToggleStatus(task)}
                  title={task.status === 'completed' ? 'Mark as pending' : 'Mark as completed'}
                >
                  <CheckCircle size={20} />
                </button>
                <button 
                  className="btn-icon"
                  onClick={() => handleEditClick(task)}
                  title="Edit task"
                >
                  <Edit2 size={20} />
                </button>
                <button 
                  className="btn-icon btn-danger"
                  onClick={() => handleDelete(task._id)}
                  title="Delete task"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TaskList;
