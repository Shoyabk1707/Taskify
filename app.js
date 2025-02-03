document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('task-list');
    const taskTitle = document.getElementById('task-title');
    const taskDescription = document.getElementById('task-description');
    const taskCategory = document.getElementById('task-category');
    const taskPriority = document.getElementById('task-priority');
    const taskDueDate = document.getElementById('task-due-date');
    const addTaskButton = document.getElementById('add-task');
    const voiceInputButton = document.getElementById('voice-input');
    const clearAllButton = document.getElementById('clear-all');
    const toggleThemeButton = document.getElementById('toggle-theme');
    const progressBar = document.querySelector('.progress');
    const filters = document.querySelectorAll('.filters button');
  
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  
    // Render tasks
    function renderTasks(filter = 'all') {
      taskList.innerHTML = '';
      const filteredTasks = filter === 'all' ? tasks : tasks.filter(task => filter === 'completed' ? task.completed : !task.completed);
      filteredTasks.forEach((task, index) => {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item');
        if (task.completed) taskItem.classList.add('completed');
        if (new Date(task.dueDate) < new Date() && !task.completed) taskItem.classList.add('overdue');
  
        taskItem.innerHTML = `
          <div>
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <small>Category: ${task.category} | Priority: ${task.priority} | Due: ${task.dueDate}</small>
          </div>
          <div class="actions">
            <button onclick="toggleComplete(${index})">${task.completed ? '❌' : '✔️'}</button>
            <button onclick="editTask(${index})">✏️</button>
            <button onclick="deleteTask(${index})">🗑️</button>
          </div>
        `;
        taskList.appendChild(taskItem);
      });
      updateProgress();
    }
  
    // Add task
    addTaskButton.addEventListener('click', () => {
        const title = taskTitle.value.trim();
        const description = taskDescription.value.trim();
        const category = taskCategory.value;
        const priority = taskPriority.value;
        const dueDate = taskDueDate.value || new Date().toISOString().split('T')[0]; // Default to today's date
      
        if (title) {
          tasks.push({ title, description, category, priority, dueDate, completed: false });
          localStorage.setItem('tasks', JSON.stringify(tasks));
          renderTasks();
          taskTitle.value = '';
          taskDescription.value = '';
        }
      });
  
    // Voice input
    voiceInputButton.addEventListener('click', () => {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = 'en-US';
      recognition.start();
      recognition.onresult = (event) => {
        taskTitle.value = event.results[0][0].transcript;
      };
    });
  
    // Toggle complete
    window.toggleComplete = (index) => {
      tasks[index].completed = !tasks[index].completed;
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks();
    };
  
    // Edit task
    window.editTask = (index) => {
      const task = tasks[index];
      taskTitle.value = task.title;
      taskDescription.value = task.description;
      taskCategory.value = task.category;
      taskPriority.value = task.priority;
      taskDueDate.value = task.dueDate;
      tasks.splice(index, 1);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks();
    };
  
    // Delete task
    window.deleteTask = (index) => {
      tasks.splice(index, 1);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks();
    };
  
    // Clear all tasks
    clearAllButton.addEventListener('click', () => {
      tasks = [];
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks();
    });
  
    // Filter tasks
    filters.forEach(button => {
      button.addEventListener('click', () => {
        renderTasks(button.dataset.filter);
      });
    });
  
    // Toggle dark mode
    toggleThemeButton.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
    });
  
    // Update progress bar
    function updateProgress() {
      const completedTasks = tasks.filter(task => task.completed).length;
      const progress = (completedTasks / tasks.length) * 100 || 0;
      progressBar.style.width = `${progress}%`;
    }
  
    renderTasks();
  });