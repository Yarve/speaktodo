CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    status TEXT DEFAULT 'Added',
    date DATE,
    time TIME,
    recurrence TEXT
);

CREATE TABLE reminders (
    id SERIAL PRIMARY KEY,
    todo_id INT REFERENCES todos(id) ON DELETE CASCADE,
    reminder_time TIMESTAMP NOT NULL
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    language VARCHAR(10) DEFAULT 'en',
    ai_settings JSONB DEFAULT '{}'
);
