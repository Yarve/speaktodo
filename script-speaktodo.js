    // const apiBaseUrl = 'http://itgermany.net:3000'; // API URL
    const apiBaseUrl = window.location.origin.replace(/^https/, 'http') + ':3000';

    async function fetchTodos() {
        const response = await fetch(`${apiBaseUrl}/todos`);
        const todos = await response.json();
        const todoList = document.getElementById('todoList');
        todoList.innerHTML = '';
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.textContent = todo.text;
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'delete-btn';
            deleteBtn.onclick = () => deleteTodo(todo.id);
            li.appendChild(deleteBtn);
            todoList.appendChild(li);
        });
    }

    async function addTodo() {
        const todoText = document.getElementById('todoText').value.trim();
        if (!todoText) return;
        await fetch(`${apiBaseUrl}/todos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: todoText })
        });
        document.getElementById('todoText').value = ''; // Clears input
        fetchTodos(); // Refreshes task list
    }

    async function deleteTodo(id) {
        await fetch(`${apiBaseUrl}/todos/${id}`, { method: 'DELETE' });
        fetchTodos();
    }

    document.addEventListener('DOMContentLoaded', fetchTodos);
    setInterval(fetchTodos, 5000); // auto-refresh every 5 seconds

