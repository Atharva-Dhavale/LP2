import React, { useState, useEffect } from 'react';
import './index.css';

const API_URL = 'http://localhost:5000/api/posts';

function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error('Failed to fetch posts', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !author || !content) return;

    const payload = { title, author, content };
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    setLoading(true);
    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setTitle('');
      setAuthor('');
      setContent('');
      setEditingId(null);
      fetchPosts();
    } catch (err) {
      console.error('Error submitting post', err);
    }
    setLoading(false);
  };

  const handleEdit = (post) => {
    setEditingId(post.id);
    setTitle(post.title);
    setAuthor(post.author);
    setContent(post.content);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchPosts();
    } catch (err) {
      console.error('Error deleting post', err);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setAuthor('');
    setContent('');
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>My<span>Blog</span></h1>
        <p>React + Express + SQLite</p>
      </header>

      <main className="main-content">
        <div className="form-card">
          <h2>{editingId ? '✏️ Edit Post' : '📝 New Post'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <input
                type="text"
                placeholder="Post Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Author Name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
              />
            </div>
            <textarea
              placeholder="Write your content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
            <div className="btn-row">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : editingId ? 'Update Post' : 'Publish Post'}
              </button>
              {editingId && (
                <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="posts-container">
          {posts.length === 0 ? (
            <div className="empty-state">No posts yet. Create one above!</div>
          ) : (
            posts.map(post => (
              <div key={post.id} className="post-card">
                <div className="post-meta">
                  <span className="post-author">{post.author}</span>
                  <span className="post-date">📅 {post.created}</span>
                </div>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <div className="post-actions">
                  <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(post)}>✏️ Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(post.id)}>🗑️ Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
