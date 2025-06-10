import React, { useState, useEffect } from "react";

function ToDoList() {
  // Load tasks from localStorage on initial render
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("todo-tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState("");

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todo-tasks", JSON.stringify(tasks));
  }, [tasks]);

  function handleInputChange(e) {
    setNewTask(e.target.value);
  }

  function addTask() {
    if (newTask.trim() !== "") {
      const newTaskObj = {
        text: newTask,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setTasks((t) => [...t, newTaskObj]);
      setNewTask("");
    }
  }

  function deleteTask(index) {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  }

  function toggleCompleted(index) {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  }

  function startEditing(index) {
    setEditingIndex(index);
    setEditText(tasks[index].text);
  }

  function saveEdit(index) {
    const updatedTasks = [...tasks];
    updatedTasks[index].text = editText;
    setTasks(updatedTasks);
    setEditingIndex(null);
    setEditText("");
  }

  function cancelEdit() {
    setEditingIndex(null);
    setEditText("");
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
    <div className="to-do-list">
      <h1>To-Do List</h1>
      <div>
        <input
          type="text"
          placeholder="Enter a Task.."
          value={newTask}
          onChange={handleInputChange}
          onKeyPress={(e) => e.key === "Enter" && addTask()}
        />
        <button className="add-button" onClick={addTask}>
          Add
        </button>
      </div>

      <div className="filter-buttons">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={filter === "active" ? "active" : ""}
          onClick={() => setFilter("active")}
        >
          Active
        </button>
        <button
          className={filter === "completed" ? "active" : ""}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>

      <ol>
        {filteredTasks.map((task, index) => {
          const originalIndex = tasks.findIndex((t) => t === task);
          return (
            <li key={originalIndex} className={task.completed ? "completed" : ""}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleCompleted(originalIndex)}
              />
              {editingIndex === originalIndex ? (
                <>
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <button className="move-button" onClick={() => saveEdit(originalIndex)}>Save</button>
                  <button className="move-button" onClick={cancelEdit}>Cancel</button>
                </>
              ) : (
                <>
                  <span className="text">{task.text}</span>
                  <small className="task-time">
                    {formatDate(task.createdAt)}
                  </small>
                  <button
                    className="edit-button"
                    onClick={() => startEditing(originalIndex)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => deleteTask(originalIndex)}
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default ToDoList;