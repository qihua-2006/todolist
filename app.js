// 获取DOM元素
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const totalSpan = document.getElementById('total');
const completedSpan = document.getElementById('completed');

// 从本地存储读取数据
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// 初始渲染
renderTodos();

// 添加待办
addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
});

function addTodo() {
    const text = todoInput.value.trim();
    if (!text) return;

    const todo = {
        id: Date.now(),
        text: text,
        completed: false
    };
    
    todos.push(todo);
    saveTodos();
    renderTodos();
    todoInput.value = '';
}

// 渲染列表
function renderTodos() {
    todoList.innerHTML = '';

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo-item' + (todo.completed ? ' completed' : '');
        
        li.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                   onchange="toggleTodo(${todo.id})">
            <span>${todo.text}</span>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})">删除</button>
        `;
        
        todoList.appendChild(li);
    });
    
    updateStats();
}

// 切换完成状态
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
    }
}

// 删除待办
function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    saveTodos();
    renderTodos();
}

// 更新统计
function updateStats() {
    totalSpan.textContent = todos.length;
    completedSpan.textContent = todos.filter(t => t.completed).length;
}

// 保存到本地存储
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}