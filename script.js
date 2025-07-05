document.addEventListener('DOMContentLoaded', () => {
    const todoList = document.getElementById('todo-list');
    const addTodoBtn = document.getElementById('add-todo-btn');
    const newTodoInput = document.getElementById('new-todo-input');
    const storageKey = 'todos-asifnotes-sorted';

    const academicCalendarData = [
        { month: 'July', date: '8-12', text: 'New Teachers’ Orientation*' },
        { month: 'July', date: '8-10', text: 'New Teachers’ Orientation*' },
        { month: 'July', date: '12', text: 'Freshman Students’ Orientation*' },
        { month: 'July', date: '13-19', text: 'First Week of Classes' },
        { month: 'July', date: '13', text: 'First Day of Classes' },
        { month: 'July', date: '16', text: 'Last date of Registration Payment and Validating Registration.' },
        { month: 'July', date: '17 & 20', text: 'Adding/Dropping*' },
        { month: 'July', date: '20-26', text: 'Week 2' },
        { month: 'July', date: '21', text: 'Registration Closed for Summer 2024-25' },
        { month: 'July', date: '24', text: 'Submission of TSF and Course Description' },
        { month: 'July', date: '26', text: 'Makeup of Sunday Classes' },
        { month: 'July', date: '27-31', text: 'Week 3 (July)' }, // Corrected range
        { month: 'August', date: '1-2', text: 'Week 3 (August)' }, // Corrected range
        { month: 'August', date: '2', text: 'Makeup of Monday Classes' },
        { month: 'August', date: '3-9', text: 'Week 4' },
        { month: 'August', date: '3', text: 'Automatic conversion of UW, I, blank grades of Spring 2023-24 Semester to F' },
        { month: 'August', date: '5', text: 'Last Date of 2nd Installment of Registration Payment (3 Installment scheme)' },
        { month: 'August', date: 'TBD', text: 'Midterm Laboratory Exams' },
        { month: 'August', date: 'TBD', text: 'Permit Collection for Midterm Exam *' },
        { month: 'August', date: '9-16', text: 'Midterm Exam*' },
        { month: 'August', date: 'TBD', text: 'TPE Open' },
        { month: 'August', date: '16', text: 'Jonmashtomi*' },
        { month: 'August', date: '17-23', text: 'Week 6' },
        { month: 'August', date: '23', text: 'Deadline for Submitting Midterm Grades' },
        { month: 'August', date: '24-30', text: 'Week 7' },
        { month: 'August', date: '28', text: 'Midterm Grades Locked' },
        { month: 'August', date: '31', text: 'Week 8 (August)' }, // Corrected range
        { month: 'September', date: '1-6', text: 'Week 8 (September)' }, // Corrected range
        { month: 'September', date: '5', text: 'Eid-e-Miladunnabi**' },
        { month: 'September', date: '6', text: 'Makeup of Tuesday Classes' },
        { month: 'September', date: '7-13', text: 'Week 9' },
        { month: 'September', date: 'TBD', text: 'Pre-registration for Fall 2025-26*' },
        { month: 'September', date: '11', text: 'Deadline for the Last Installment of Registration Payment' },
        { month: 'September', date: '13', text: 'Makeup of Wednesday Classes' },
        { month: 'September', date: '14-20', text: 'Week 10' },
        { month: 'September', date: 'TBD', text: 'Laboratory Final exams' },
        { month: 'September', date: 'TBD', text: 'Permit Collection for Final Exam*' },
        { month: 'September', date: '20-27', text: 'Final Exam*' },
        { month: 'September', date: '28-30', text: 'Finals Period (September)' }, // Corrected range
        { month: 'October', date: '1-11', text: 'Finals Period (October)' }, // Corrected range
        { month: 'October', date: '1 & 2', text: 'Durga Puja*' },
        { month: 'October', date: 'TBD', text: 'Set B Examinations*' },
        { month: 'October', date: '4', text: 'Deadline of Final Grade Submission' },
        { month: 'October', date: '11', text: 'Final Grades Locked' },
        { month: 'October', date: 'TBD', text: 'Semester Break | Release of Grades | Final Registration for Fall 2025-26*' },
        { month: 'November', date: '4', text: 'Automatic Conversion of UW, I Grade of this Semester to F' }
    ];

    const monthOrder = { 'July': 1, 'August': 2, 'September': 3, 'October': 4, 'November': 5, 'My Notes': 6 };

    const expandCalendarDates = (data) => {
        const expanded = [];
        data.forEach(item => {
            const { month, date, text } = item;
            if (date.includes('-')) {
                const [start, end] = date.split('-').map(d => parseInt(d));
                for (let i = start; i <= end; i++) {
                    expanded.push({ month, date: i.toString(), text, completed: false });
                }
            } else if (date.includes('&')) {
                const days = date.split('&').map(d => d.trim());
                days.forEach(day => {
                    expanded.push({ month, date: day, text, completed: false });
                });
            } else {
                expanded.push({ ...item, completed: false });
            }
        });

        return expanded.sort((a, b) => {
            const monthA = monthOrder[a.month] || 99;
            const monthB = monthOrder[b.month] || 99;
            if (monthA !== monthB) return monthA - monthB;

            if (a.date === 'TBD') return 1;
            if (b.date === 'TBD') return -1;
            
            const dateA = parseInt(a.date);
            const dateB = parseInt(b.date);
            if (dateA !== dateB) return dateA - dateB;

            return a.text.localeCompare(b.text); // Sort by text if dates are the same
        });
    };

    let currentTodos = [];

    const saveTodos = () => {
        localStorage.setItem(storageKey, JSON.stringify(currentTodos));
    };

    const loadTodos = () => {
        const savedTodos = localStorage.getItem(storageKey);
        if (savedTodos) {
            currentTodos = JSON.parse(savedTodos);
        } else {
            currentTodos = expandCalendarDates(academicCalendarData);
            saveTodos();
        }
    };

    const renderTodos = () => {
        todoList.innerHTML = '';
        let currentMonth = '';

        if (currentTodos.length === 0) {
            todoList.innerHTML = `<p class="text-gray-500">No tasks yet. Add one above!</p>`;
            return;
        }

        currentTodos.forEach((todo, index) => {
            if (todo.month && todo.month !== currentMonth) {
                currentMonth = todo.month;
                const monthHeader = document.createElement('h3');
                monthHeader.className = 'text-lg font-semibold text-gray-600 mt-4 mb-2';
                monthHeader.textContent = currentMonth;
                todoList.appendChild(monthHeader);
            }

            const li = document.createElement('li');
            li.className = 'flex items-center justify-between bg-gray-50 p-3 rounded-md shadow-sm transition-all duration-300';
            if (todo.completed) li.classList.add('bg-green-50');
            
            const isAcademic = todo.month !== 'My Notes';

            li.innerHTML = `
                <div class="flex-grow flex items-center">
                    <input type="checkbox" id="todo-${index}" class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" ${todo.completed ? 'checked' : ''}>
                    <div class="ml-3 flex-grow">
                        <label for="todo-${index}" class="text-gray-900 ${todo.completed ? 'line-through text-gray-500' : ''}">
                            ${isAcademic ? `<span class="font-medium text-blue-700 w-20 inline-block">${todo.date}:</span>` : ''}
                            <span class="task-text ml-2">${todo.text}</span>
                        </label>
                        <input type="text" class="task-edit-input hidden w-full p-1 border rounded" value="${todo.text}">
                    </div>
                </div>
                <div class="flex items-center">
                    <button data-index="${index}" class="edit-btn text-blue-500 hover:text-blue-700 font-bold py-1 px-2 rounded">Edit</button>
                    <button data-index="${index}" class="delete-btn text-red-500 hover:text-red-700 text-xl font-bold py-1 px-2 rounded">&times;</button>
                </div>
            `;
            todoList.appendChild(li);
        });
        addEventListeners();
    };

    const addEventListeners = () => {
        document.querySelectorAll('.edit-btn').forEach(button => button.addEventListener('click', handleEdit));
        document.querySelectorAll('.delete-btn').forEach(button => button.addEventListener('click', handleDelete));
        document.querySelectorAll('input[type="checkbox"]').forEach((checkbox, index) => checkbox.addEventListener('change', () => toggleComplete(index)));
    };

    const handleEdit = (e) => {
        const index = e.target.dataset.index;
        const li = e.target.closest('li');
        const label = li.querySelector('label');
        const input = li.querySelector('.task-edit-input');
        const isEditing = li.classList.contains('editing');

        if (isEditing) {
            currentTodos[index].text = input.value;
            li.classList.remove('editing');
            e.target.textContent = 'Edit';
            saveTodos();
            renderTodos();
        } else {
            document.querySelectorAll('li.editing').forEach(item => {
                const otherIndex = item.querySelector('.edit-btn').dataset.index;
                item.classList.remove('editing');
                item.querySelector('.edit-btn').textContent = 'Edit';
                item.querySelector('label').classList.remove('hidden');
                item.querySelector('.task-edit-input').classList.add('hidden');
            });
            li.classList.add('editing');
            label.classList.add('hidden');
            input.classList.remove('hidden');
            input.focus();
            e.target.textContent = 'Save';
            input.onkeydown = (event) => {
                if (event.key === 'Enter') handleEdit(e);
                else if (event.key === 'Escape') renderTodos();
            };
        }
    };
    
    const handleDelete = (e) => {
        const index = e.target.dataset.index;
        currentTodos.splice(index, 1);
        saveTodos();
        renderTodos();
    };

    const toggleComplete = (index) => {
        currentTodos[index].completed = !currentTodos[index].completed;
        saveTodos();
        renderTodos();
    };
    
    const addTodo = () => {
        const text = newTodoInput.value.trim();
        if (text) {
            currentTodos.push({ text: text, completed: false, month: 'My Notes', date: 'Note' });
            newTodoInput.value = '';
            saveTodos();
            renderTodos();
        }
    };

    addTodoBtn.addEventListener('click', addTodo);
    newTodoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });

    loadTodos();
    renderTodos();
});
