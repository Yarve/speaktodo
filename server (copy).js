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
  host: 'yarve.com' ,  // before it were: '0.0.0.0' Server listens all the IPs
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

// Just for test
app.get('/todo', (req, res) => {
  res.send('TODO route is working!');
});


// Start server
app.listen(port, () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});

app.get('/', (req, res) => {
  res.send('API is working. Use /todos to get data.');
});

app.use((req, res) => {
  res.status(404).send('Not Found');
});
