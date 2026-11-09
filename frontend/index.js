const API_URL = "http://localhost:4000/api/todos";
const todoForm = document.querySelector(".todo-form");
const inputTodo = document.querySelector("#inputTodo");
const lists = document.querySelector("#lists");
const message = document.querySelector("#message");


function showMessage(text, status) {
    message.textContent = text;

    message.classList.remove("bg-success", "bg-danger");

    message.classList.add(
        status === "success" ? "bg-success" : "bg-danger"
    );

    setTimeout(() => {
        message.textContent = "";
        message.classList.remove("bg-success", "bg-danger");
    }, 3000);
}


function createTodo(todo) {

    
    const li = document.createElement("li");
    li.classList.add("li-style");

    
    const span = document.createElement("span");
    span.textContent = todo.title;

    
    if (todo.completed) {
        span.style.textDecoration = "line-through";
    }

    span.style.cursor = "pointer";

    span.addEventListener("click", async () => {

        const previousStatus = todo.completed;
        const newStatus = !todo.completed;

        try {
            const response = await fetch(`${API_URL}/${todo._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    completed: newStatus
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Could not update Todo");
            }

            todo.completed = data.todo.completed;

            span.style.textDecoration = todo.completed
                ? "line-through"
                : "none";

            showMessage("Todo updated successfully!", "success");

        } catch (error) {
            todo.completed = previousStatus;

            showMessage(error.message, "error");
        }
    });


    const deleteButton = document.createElement("button");

    deleteButton.type = "button";
    deleteButton.classList.add("btn");

    
    const icon = document.createElement("i");
    icon.classList.add("fa-solid", "fa-trash");

    deleteButton.appendChild(icon);


    deleteButton.addEventListener("click", async () => {

        try {
            const response = await fetch(`${API_URL}/${todo._id}`, {
                method: "DELETE"
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Could not delete Todo");
            }

            li.remove();

            showMessage("Todo deleted successfully!", "success");

        } catch (error) {
            showMessage(error.message, "error");
        }
    });


    li.appendChild(span);
    li.appendChild(deleteButton);

    lists.appendChild(li);
}


async function loadTodos() {

    try {
        lists.innerHTML = "";

        const response = await fetch(API_URL);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Could not load Todos");
        }

        data.todos.forEach((todo) => {
            createTodo(todo);
        });

    } catch (error) {
        showMessage(error.message, "error");
    }
}


async function addTodo(event) {

    event.preventDefault();

    const todoValue = inputTodo.value.trim();

    if (!todoValue) {
        showMessage("Please enter a task!", "error");
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                title: todoValue
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Could not add Todo");
        }

        
        createTodo(data.todo);

        inputTodo.value = "";

        showMessage("Todo added successfully!", "success");

    } catch (error) {
        showMessage(error.message, "error");
    }
}



todoForm.addEventListener("submit", addTodo);

document.addEventListener("DOMContentLoaded", loadTodos);