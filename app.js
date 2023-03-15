'use strict';

// Workshop - TODO list

// оголошуємо змінні з якими будемо працювати
const form = document.querySelector('.create-task-form');
const clearBtn = document.querySelector('.clear-tasks');
const taskInput = document.querySelector('.task-input');
const filter = document.querySelector('.filter-input');
const taskList = document.querySelector('.collection');
let taskItems;

// слухачі подій
// запускаємо функцію showPosts коли весь HTML загружений
document.addEventListener('DOMContentLoaded', showPosts);
// запускаємо функцію addTask коли відправляємо форму (клікаємо на кнопку "Додати завдання")
form.addEventListener('submit', addTask);
// запускаємо функцію deleteTask коли клік попадає на список <ul>
taskList.addEventListener('click', deleteOrEditTask);
// запускаємо функцію після кліку на кнопку "Видалити всі елементи"
clearBtn.addEventListener('click', removeAllTasks);
// запускаємо функцію filterTasks після того як ввідпускаємо клавішу (тоді, коли фокус в інпуті "Пошук завдань")
filter.addEventListener('keyup', filterTasks);



function showPosts() {
    // оголошуємо змінну яка буде використовуватись для списку завдань
    let tasks;

    // перевіряємо чи є у localStorage вже якісь завдання
    if (localStorage.getItem('tasks') !== null) {
        // якщо вони там є - витягуємо їх і присвоюємо змінній
        tasks = JSON.parse(localStorage.getItem('tasks'));
    } else {
        // якщо їх там нема - присвоюємо змінній значення порожнього масиву
        tasks = []
    }

    // для кожної задачі яка є
    tasks.forEach((task) => {
        // створюємо елемент списку
        const li = document.createElement('li');
        // додаємо йому класс
        li.classList.add('task');
        // всередині цього елементу списку додаємо опис завдання
        li.innerHTML = task;

        // сторюємо кнопку для видалення
        const button = document.createElement('button');
        // додаємо їй клас
        button.classList.add('remove-task');
        // всередину кнопку додаємо значення х
        button.innerHTML = 'x';
        // записуємо кнопку після всього, що є всередині елементу списку
        li.append(button);
        
        // записуємо цей елемент в кінець списку
        taskList.append(li);

        const btnEdit = document.createElement('button');
        btnEdit.classList.add('edit-task-btn');
        btnEdit.innerHTML = '<img src="icons/edit-icon1.ico" class="edit-task-btn" alt="edit">';
        li.append(btnEdit);
    })
}

// створюємо таску
function addTask(event) {
    // зупиняємо поведінку браузера за замовчуванням
    event.preventDefault();
    // отримуємо значення з інпута taskInput
    const value = taskInput.value;

    // якщо значення в інпуті порожнє  - то не додаємо нове завдання
    if (value.trim() === '') {
        return null;
    }

    // створюємо елемент списку
    const li = document.createElement('li');
    // додаємо йому класс
    li.classList.add('task');
    // всередині цього елементу списку додаємо опис завдання
    li.innerHTML = value;
    
    // сторюємо кнопку для видалення
    const button = document.createElement('button');
    // додаємо їй клас
    button.classList.add('remove-task');
    // всередину кнопку додаємо значення х
    button.innerHTML = 'x';
    // записуємо кнопку після всього, що є всередині елементу списку
    li.append(button);

    // створюємо кнопку для редагування
    const btnEdit = document.createElement('button');
    btnEdit.classList.add('edit-task-btn');
    btnEdit.innerHTML = '<img src="icons/edit-icon1.ico" class="edit-task-btn" alt="edit">';
    li.append(btnEdit);
    
    // записуємо цей елемент в кінець списку
    taskList.append(li);
    
    taskItems = Array.from(taskList.childNodes);
    // console.log(taskItems);
    li.dataset.number = taskItems.indexOf(li);


    // викликаємо функцію яка буде додавати завдання до Local Storage
    storeTasksInLocalStorage(value);
    // очищуємо вміст інпуту для створення завдання
    taskInput.value = '';
}

function storeTasksInLocalStorage(task) {
    // оголошуємо змінну яка буде використовуватись для списку завдань
    let tasks;

    // перевіряємо чи є у localStorage вже якісь завдання
    if (localStorage.getItem('tasks') !== null) {
        // якщо вони там є - витягуємо їх і присвоюємо змінній
        tasks = JSON.parse(localStorage.getItem('tasks'));
    } else {
        // якщо їх там нема - присвоюємо змінній значення порожнього масиву
        tasks = []
    }

    // додаємо до списку нове завдання
    tasks.push(task);

    // зберігаємо список завданнь в Local Storage
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function deleteOrEditTask(event) {
    // якщо ми клікнули по хрестику  - тоді
    if (event.target.classList.contains('remove-task')) {
        // пересвідчуємось чи юзер справді хоче видалити цей елемент
        if(confirm('Ви впевнені що хочете видалити цей елемент?')) {
            // видаляємо цей елемент списку, в якому знаходиться хрестик
            event.target.parentElement.remove();
            // викликаємо функцію яка буде видаляти завдання з Local Storage
            removeTaskFromLocalStorage(event.target.parentElement);
        }
    }
    if (event.target.classList.contains('edit-task-btn')) {
        let newNameTask = prompt("Введіть нову назву завдання:");
        let replacedName = event.target.parentElement.parentElement.childNodes[0].textContent;
        event.target.parentElement.parentElement.childNodes[0].textContent = newNameTask;

        editTaskInLocalStorage(replacedName, newNameTask);
    }
}

function removeTaskFromLocalStorage(taskElement) {

    let tasks;
    let index = taskElement.dataset.number;


   if (localStorage.getItem('tasks') !== null) {
       tasks = JSON.parse(localStorage.getItem('tasks'));
   } else {
       tasks = []
   }

    tasks.splice(index, 1);


    taskItems = Array.from(taskList.childNodes);
    taskItems.forEach((item) => {
        item.dataset.number = taskItems.indexOf(item);
    }) 

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function editTaskInLocalStorage(taskElement , newName) {
    
    let tasks;
    // console.log(taskElement);
    // console.log(newName);
    // let index = taskElement.dataset.number;
    // console.log(index);

    if (localStorage.getItem('tasks') !== null) {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    } else {
        tasks = []
    }

    let index = tasks.indexOf(taskElement);
    console.log(index);
    console.log(tasks.length);

    // let updatedTasks = tasks.map((task, i, tasks) => {
    //     if (i = index) {
    //         task = newName;
    //         return task;
    //     } else {
    //         return task
    //     }
    // })

    for (let i = 0; i < 2; i++) {
        if (i = index) {
            tasks[i] = newName;
        }
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// видалити всі таски
function removeAllTasks() {
    if(confirm('Ви впевнені що хочете видалити всі елементи?')) {
        taskList.innerHTML = '';
        removeAllTaskFromLocalStorage();
    }
}

function removeAllTaskFromLocalStorage() {
    localStorage.clear()
}

function filterTasks(event) {
    // отримуємо всі елементи списку
    const itemList = document.querySelectorAll('.task');
    // отримуємо значення інпуту "Пошук завдань" і робимо його в нижньому регістрі
    const searchQuery = event.target.value.toLowerCase();

    // проходимось по кожному елементу завдань
    itemList.forEach((item) => {
        // отримуємо текст завдання
        const itemValue = item.firstChild.textContent.toLowerCase();
        
        // перевіряємо чи текст завдання має в собі значення інпута "Пошук завдань"
        if (itemValue.includes(searchQuery)) {
            // якщо має, то display = list-item
            item.style.display = 'list-item';
        } else {
            // якщо ні - ховаємо це елемент списку
            item.style.display = 'none';
        }
    })
}