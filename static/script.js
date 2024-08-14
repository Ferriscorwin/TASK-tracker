document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');

    function renderTasks(tasks) {
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.textContent = task.text;
            if (task.completed) {
                taskItem.classList.add('completed');
            }

            const completeButton = document.createElement('button');
            completeButton.textContent = 'Complete';
            completeButton.onclick = () => completeTask(task.id);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteTask(task.id);

            taskItem.appendChild(completeButton);
            taskItem.appendChild(deleteButton);
            taskList.appendChild(taskItem);
        });
    }

    function fetchTasks() {
        fetch('/tasks')
            .then(response => response.json())
            .then(tasks => renderTasks(tasks));
    }

    function addTask(text) {
        fetch('/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: Date.now(), text, completed: false })
        }).then(() => fetchTasks());
    }

    function deleteTask(id) {
        fetch(`/tasks/${id}`, { method: 'DELETE' })
            .then(() => fetchTasks());
    }

    function completeTask(id) {
        fetch(`/tasks/${id}/complete`, { method: 'PATCH' })
            .then(() => fetchTasks());
    }

    addTaskButton.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            addTask(taskText);
            taskInput.value = '';
        }
    });

    fetchTasks();
});
