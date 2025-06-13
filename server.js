// Main server in Node.js with Express
const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors({
    origin: ['http://yarve.com', 'https://yarve.com', 'http://yarve.com:3000'],
    credentials: true
}));
app.use(bodyParser.json());

// PostgreSQL database settings
const pool = new Pool({
  user: '_postgresql',
  host: '127.0.0.1', // was 'localhost'
  database: 'todoapp',
  password: '333333',  
 port: 5432,
  ssl: false 
});

// API for tasks (CRUD)
app.get('/todos', async (req, res) => {
  const { status } = req.query;
  try {
    if (status) {
      const result = await pool.query(
        'SELECT * FROM get_tasks_by_status($1)',
        [status]
      );
      res.json(result.rows);
    } else {
      const result = await pool.query('SELECT * FROM todos ORDER BY id DESC');
      res.json(result.rows);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/todos', async (req, res) => {
  const { text, status = 'Added', date = null, time = null, recurrence = null } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM add_task($1, $2, $3, $4, $5)',
      [text, status, date, time, recurrence]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM update_task_status($1, $2)',
      [id, status]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put('/todos/:id/details', async (req, res) => {
  const { id } = req.params;
  const { text, date, time, recurrence } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM update_task_details($1, $2, $3, $4, $5)',
      [id, text, date, time, recurrence]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM todos WHERE id = $1', [id]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Test routes
app.get('/todo', (req, res) => {
  res.send('TODO route is working!');
});

  app.get('/', (req, res) => {
  res.sendFile('/var/www/htdocs/todo/index.html');
 });

// 404 handler - MUST be last!
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Start server - MUST be at the very end!
  app.listen(port, '0.0.0.0', () => { // was: app.listen(port, () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
