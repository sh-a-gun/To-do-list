let todoArray = JSON.parse(localStorage.getItem('todoArray')) || [];
let filterType = 'all';

renderTodo();

function saveToStorage() {
  localStorage.setItem('todoArray', JSON.stringify(todoArray));
}

function renderTodo() {
  let todoArrayHTML = '';

  let filteredArray = todoArray.filter(todo => {
    if (filterType === 'completed') return todo.completed;
    if (filterType === 'pending') return !todo.completed;
    return true;
  });

  filteredArray.forEach((todo, index) => {
    const isCompleted = todo.completed ? 'completed' : '';
    const nameHTML = todo.editing
      ? `<input class="edit-input" type="text" value="${todo.name}">`
      : `<div class="name">${todo.name}</div>`;

    const buttonHTML = todo.editing
      ? `<button class="save-button" data-index="${index}">Save</button>`
      : `<button class="edit-button" data-index="${index}">Edit</button>`;

    const html = `
      <div class="todo-item ${isCompleted}">
        <input type="checkbox" class="checkbox" data-index="${index}" ${todo.completed ? 'checked' : ''}>
        ${nameHTML}
        <div>${todo.dueDate}</div>
        ${buttonHTML}
        <button class="delete-button" data-index="${index}">Delete</button>
      </div>
    `;
    todoArrayHTML += html;
  });

  document.querySelector('.js-todo-list').innerHTML = todoArrayHTML;

  document.querySelectorAll('.checkbox').forEach(box => {
    box.addEventListener('change', (e) => {
      const i = e.target.dataset.index;
      todoArray[i].completed = e.target.checked;
      saveToStorage();
      renderTodo();
    });
  });

  document.querySelectorAll('.delete-button').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = btn.dataset.index;
      todoArray.splice(i, 1);
      saveToStorage();
      renderTodo();
    });
  });

  document.querySelectorAll('.edit-button').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = btn.dataset.index;
      todoArray[i].editing = true;
      renderTodo();
    });
  });

  document.querySelectorAll('.save-button').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = btn.dataset.index;
      const newName = document.querySelectorAll('.edit-input')[i].value;
      todoArray[i].name = newName;
      todoArray[i].editing = false;
      saveToStorage();
      renderTodo();
    });
  });
}

document.querySelector('.js-button').addEventListener('click', () => {
  const inputElement = document.querySelector('.js-inputArray');
  const inputValue = inputElement.value.trim();

  const dateElement = document.querySelector('.js-due-date-input');
  const dateValue = dateElement.value;

  if (!inputValue || !dateValue) return;

  todoArray.push({
    name: inputValue,
    dueDate: dateValue,
    completed: false,
    editing: false
  });

  inputElement.value = '';
  dateElement.value = '';
  saveToStorage();
  renderTodo();
});

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    filterType = btn.dataset.filter;
    renderTodo();
  });
});
