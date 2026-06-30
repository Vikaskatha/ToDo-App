const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");
const emptyMessage = document.getElementById("emptyMessage");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// Save tasks to local storage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display tasks
function renderTasks() {
  taskList.innerHTML = "";

  const searchText = searchInput.value.toLowerCase();

  let filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.text.toLowerCase().includes(searchText);

    if (currentFilter === "completed") {
      return task.completed && matchesSearch;
    }

    if (currentFilter === "pending") {
      return !task.completed && matchesSearch;
    }

    return matchesSearch;
  });

  if (filteredTasks.length === 0) {
    emptyMessage.style.display = "block";
  } else {
    emptyMessage.style.display = "none";
  }

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = `task-item ${task.completed ? "completed" : ""}`;

    li.innerHTML = `
      <div class="task-left">
        <input 
          type="checkbox" 
          ${task.completed ? "checked" : ""} 
          onchange="toggleTask(${task.id})"
        />
        <span class="task-text">${task.text}</span>
      </div>

      <div class="task-actions">
        <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
        <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

// Add task
taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const taskText = taskInput.value.trim();

  if (taskText === "") {
    alert("Please enter a task");
    return;
  }

  const newTask = {
    id: Date.now(),
    text: taskText,
    completed: false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  taskInput.value = "";
});

// Delete task
function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

// Edit task
function editTask(id) {
  const task = tasks.find((task) => task.id === id);

  const updatedText = prompt("Edit your task:", task.text);

  if (updatedText !== null && updatedText.trim() !== "") {
    task.text = updatedText.trim();
    saveTasks();
    renderTasks();
  }
}

// Mark task completed or pending
function toggleTask(id) {
  const task = tasks.find((task) => task.id === id);
  task.completed = !task.completed;

  saveTasks();
  renderTasks();
}

// Search tasks
searchInput.addEventListener("input", renderTasks);

// Filter tasks
filterButtons.forEach((button) => {
  button.addEventListener("click", function () {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    this.classList.add("active");

    currentFilter = this.getAttribute("data-filter");
    renderTasks();
  });
});

// Initial render
renderTasks();