// Main server in Node.js with Express
const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// PostgreSQL database settings
const pool = new Pool({
  user: 'postgres',
  host: '0.0.0.0',  // Server listens all the IPs
  database: 'todoapp',
  password: '333333',
  port: 5432,
});

// API for tasks (CRUD)
app.get('/todos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/todos', async (req, res) => {
  const { text, status = 'Added', date = null, time = null, recurrence = null } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO todos (text, status, date, time, recurrence) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [text, status, date, time, recurrence]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { text, status, date, time, recurrence } = req.body;
  try {
    const result = await pool.query(
      'UPDATE todos SET text = $1, status = $2, date = $3, time = $4, recurrence = $5 WHERE id = $6 RETURNING *',
      [text, status, date, time, recurrence, id]
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

// Start server
app.listen(port, () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});

