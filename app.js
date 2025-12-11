//获取DOM元素
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const totalSpan = document.getElementById('total');
const completedSpan = document.getElementById('completed');

//当前筛选状态
let currentFilter = 'all';  //记录当前筛选

//从本地存储读取数据
let todos = JSON.parse(localStorage.getItem('todos')) || [];

//初始渲染
renderTodos();

//添加待办
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
    
    //添加后自动切回"全部"视图
    currentFilter = 'all';
    document.querySelector('.filter-btn').click(); //模拟点击"全部"按钮
    
    todoInput.value = '';
}

//渲染列表
function renderTodos() {
    todoList.innerHTML = '';

    //第一步：先根据筛选按钮过滤（全部/未完成/已完成）
    let filtered = todos.filter(todo => {
        if (currentFilter === 'all') return true;
        if (currentFilter === 'active') return !todo.completed;
        if (currentFilter === 'completed') return todo.completed;
    });
    
    //第二步：再根据搜索框关键词过滤
    const keyword = document.getElementById('searchInput').value;
    if (keyword) {  // 如果搜索框有内容，继续过滤
        filtered = filtered.filter(todo => todo.text.includes(keyword));
    }
    
    //第三步：渲染最终过滤结果
    filtered.forEach(todo => {
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

//切换完成状态
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();  //重新渲染，保持当前筛选视图
    }
}

//删除待办
function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    saveTodos();
    renderTodos();  //重新渲染，保持当前筛选视图
}

//更新统计
function updateStats() {
    totalSpan.textContent = todos.length;
    completedSpan.textContent = todos.filter(t => t.completed).length;
}

//保存到本地存储
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

//筛选函数
function filterTodos(filter, event) {
    //清空搜索框，避免互相干扰
    //document.getElementById('searchInput').value='';
    //更新按钮状态
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    //更新当前筛选状态
    currentFilter = filter;
    
    //重新渲染
    renderTodos();
}
function searchTodos() {
    const keyword = document.getElementById('searchInput').value;
    const filtered = todos.filter(todo => {
        return todo.text.includes(keyword);
    });
    todoList.innerHTML = '';
    filtered.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo-item' + (todo.completed ? ' completed' : '');
        li.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                   onchange='toggleTodo(${todo.id})'>
            <span>${todo.text}</span>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})">删除</button>
        `;
        todoList.appendChild(li);
    });
    updateStats();
}