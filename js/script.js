const form = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const dateInput = document.getElementById("date-input");
const todoList = document.getElementById("todo-list");
const filterButtons = document.querySelectorAll("[data-filter]");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const task = todoInput.value.trim();
    const date = dateInput.value;

    if (!task || !date) {
        alert("Please fill in both task and date!");
        return;
    }

    const todo = {
        id: Date.now(),
        task,
        date,
        completed: false
    };

    todos.push(todo);
    saveToLocal();
    renderTodos();
    form.reset();
});

function renderTodos() {
    todoList.innerHTML = "";

    const today = new Date().toISOString().split("T")[0];

    let filtered = todos;

    if (currentFilter === "today") {
        filtered = todos.filter(t => t.date === today);
    } else if (currentFilter === "upcoming") {
        filtered = todos.filter(t => t.date > today);
    } else if (currentFilter === "completed") {
        filtered = todos.filter(t => t.completed);
    }

    filtered.forEach(todo => {
        const li = document.createElement("li");
        if (todo.completed) li.classList.add("completed");

        li.innerHTML = `
            <span>${todo.task} (${todo.date})</span>
            <div class="actions">
                <button class="complete-btn" onclick="toggleComplete(${todo.id})">✔</button>
                <button class="delete-btn" onclick="deleteTodo(${todo.id})">✖</button>
            </div>
        `;

        todoList.appendChild(li);
    });
}

function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    saveToLocal();
    renderTodos();
}

function toggleComplete(id) {
    todos = todos.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
    );
    saveToLocal();
    renderTodos();
}

filterButtons.forEach(button => {
    button.addEventListener("click", function () {
        document.querySelector(".active").classList.remove("active");
        this.classList.add("active");

        currentFilter = this.getAttribute("data-filter");
        renderTodos();
    });
});

function saveToLocal() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

renderTodos();