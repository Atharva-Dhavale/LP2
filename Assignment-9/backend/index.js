const express = require('express');
const cors    = require('cors');
const Database = require('better-sqlite3');
const path    = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Database setup ──────────────────────────────────────
const db = new Database(path.join(__dirname, 'blog.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    title   TEXT    NOT NULL,
    author  TEXT    NOT NULL,
    content TEXT    NOT NULL,
    created TEXT    DEFAULT (datetime('now','localtime'))
  )
`);

// Seed a sample post if empty
const count = db.prepare('SELECT COUNT(*) as c FROM posts').get();
if (count.c === 0) {
  db.prepare('INSERT INTO posts (title, author, content) VALUES (?, ?, ?)')
    .run('Welcome to MyBlog!', 'Admin', 'This is the first post. Create your own!');
}

// ── Routes ──────────────────────────────────────────────

// GET all posts
app.get('/api/posts', (req, res) => {
  const posts = db.prepare('SELECT * FROM posts ORDER BY id DESC').all();
  res.json(posts);
});

// GET single post
app.get('/api/posts/:id', (req, res) => {
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
});

// CREATE post
app.post('/api/posts', (req, res) => {
  const { title, author, content } = req.body;
  if (!title || !author || !content)
    return res.status(400).json({ error: 'title, author, and content are required' });

  const result = db.prepare('INSERT INTO posts (title, author, content) VALUES (?, ?, ?)')
    .run(title, author, content);
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(post);
});

// UPDATE post
app.put('/api/posts/:id', (req, res) => {
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  const title   = req.body.title   ?? post.title;
  const author  = req.body.author  ?? post.author;
  const content = req.body.content ?? post.content;

  db.prepare('UPDATE posts SET title = ?, author = ?, content = ? WHERE id = ?')
    .run(title, author, content, req.params.id);

  const updated = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// DELETE post
app.delete('/api/posts/:id', (req, res) => {
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id);
  res.json({ message: 'Post deleted successfully' });
});

// ── Start ───────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
