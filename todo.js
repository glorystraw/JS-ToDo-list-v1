let addButton = document.getElementById('add');
let inputTaskTitle = document.getElementById('new-task-title');
let inputTask = document.getElementById('new-task');
let uncompletedTasks = document.getElementById('uncompleted-tasks');
let completedTasks = document.getElementById('completed-tasks');


//Method for creation of new Task
function createNewElement(title, task, done)
{
  let listItem = document.createElement('li');
  let checkbox = document.createElement('button');

if (done)
{
  checkbox.className = 'far-icons checkbox';
  checkbox.innerHTML = '<i class="far fa-check-square"></i>';
}
else
{
  checkbox.className = 'far-icons checkbox';
  checkbox.innerHTML = '<i class="far fa-square"></i>';
}


  let taskTitle = document.createElement('div');
  taskTitle.className = 'todo-title';
  taskTitle.innerHTML = title;
  let inputTitle = document.createElement('input');
  inputTitle.type = 'text';
  inputTitle.name = 'title';
  let taskToDo = document.createElement('div');
  taskToDo.className = 'todo-item';
  taskToDo.innerText = task;
  let inputTaskDescription = document.createElement('input');
  inputTaskDescription.type = 'text';
  inputTaskDescription.name = 'task';
  let editButton = document.createElement('button');
  editButton.className = 'far-icons edit';
  editButton.innerHTML = '<i class="far fa-edit">edit</i>';
  let deleteButton = document.createElement('button');
  deleteButton.className = 'far-icons delete';
  deleteButton.innerHTML = '<i class="far fa-trash-alt">delete</i>';

  listItem.appendChild(checkbox);
  listItem.appendChild(taskTitle);
  listItem.appendChild(inputTitle);
  listItem.appendChild(taskToDo);
  listItem.appendChild(inputTaskDescription);
  listItem.appendChild(editButton);
  listItem.appendChild(deleteButton);

  return listItem;
}

//Adding addTask method
function addTask() {
  if (inputTaskTitle.value && inputTask.value) {
    let listItem = createNewElement(inputTaskTitle.value, inputTask.value, false);
    uncompletedTasks.appendChild(listItem);
    bindTaskEvents(listItem, completeTask);
    inputTaskTitle.value = '';
    inputTask.value = '';
  }

  save();
}

// Adding addTask method to button addButton
addButton.onclick = addTask;

function deleteTask(){
      let listItem = this.parentNode;
      let ul = listItem.parentNode;
      ul.removeChild(listItem);
      save();
}
//Edit Tasks method
function editTask(){
      let editButton = this;
    let listItem = this.parentNode;
    let taskTitle = listItem.querySelector('.todo-title');
    let taskToDo = listItem.querySelector('.todo-item');
    let inputTitle = listItem.querySelector('input[name=title]');
    let inputTaskDescription = listItem.querySelector('input[name=task]');
    let containsClass = listItem.classList.contains('editMode');

if (containsClass) {
        taskTitle.innerText = inputTitle.value;
        taskToDo.innerText = inputTaskDescription.value;
        editButton.className = 'far-icons edit';
        editButton.innerHTML = '<i class="far fa-edit">edit</i>';
save();
    }
    else {
        inputTitle.value = taskTitle.innerText;
        inputTaskDescription.value = taskToDo.innerText;
        editButton.className = "far-icons save";
        editButton.innerHTML = '<i class="far fa-save">save</i>';

    }
    listItem.classList.toggle('editMode');

}
//Move task from incomplete to complete
function completeTask()
{
      let listItem = this.parentNode;
      let checkbox = listItem.querySelector('button.checkbox');
      checkbox.className = 'far-icons checkbox';
      checkbox.innerHTML = '<i class="far fa-check-square"></i>';
      completedTasks.appendChild(listItem);
      bindTaskEvents(listItem, incompleteTask);
      save();
}
//Move task from complete to incomplete
function incompleteTask()
{
      let listItem = this.parentNode;
      let checkbox = listItem.querySelector('button.checkbox');
      checkbox.className = "far-icons checkbox";
      checkbox.innerHTML = "<i class='far fa-square'></i>";
      uncompletedTasks.appendChild(listItem);
      bindTaskEvents(listItem, completeTask);
      save();
}

  function bindTaskEvents(listItem, checkboxEvent)
{
      let checkbox = listItem.querySelector('button.checkbox');
      let editButton = listItem.querySelector('button.edit');
      let deleteButton = listItem.querySelector('button.delete');

//Buttons
      checkbox.onclick = checkboxEvent;
      editButton.onclick = editTask;
      deleteButton.onclick = deleteTask;
}
//Save to localstorage
function save() {
//push incompleted tasks array for localstorage
      let uncompletedTasksArr = [];
      for (let i = 0; i < uncompletedTasks.children.length; i++) {
      let taskTitle = uncompletedTasks.children[i].getElementsByClassName('todo-title')[0].innerText;
      let taskToDo = uncompletedTasks.children[i].getElementsByClassName('todo-item')[0].innerText;
      let myObj = {taskTitle, taskToDo};
        uncompletedTasksArr.push(Object.values(myObj));
    }

//push completed tasks array to localstorage
      let completedTasksArr = [];
      for (let i = 0; i < completedTasks.children.length; i++) {
      let taskTitle = completedTasks.children[i].getElementsByClassName('todo-title')[0].innerText;
      let taskToDo = completedTasks.children[i].getElementsByClassName('todo-item')[0].innerText;
      let myObj = {taskTitle, taskToDo};
        completedTasksArr.push(Object.values(myObj));
}

//all tasks To localstorage in JSON
      localStorage.removeItem('todo');
      localStorage.setItem('todo', JSON.stringify({
        uncompletedTasks: uncompletedTasksArr,
        completedTasks: completedTasksArr
    }));

}
//Load from localstorage
function load(){
      if (localStorage.getItem('todo') === null) return;
      return JSON.parse(localStorage.getItem('todo'));
}
//
let data = load();

for(let i = 0; i < data.uncompletedTasks.length; i++){
    let listItem = createNewElement(data.uncompletedTasks[i][0], data.uncompletedTasks[i][1], false);
    uncompletedTasks.appendChild(listItem);
    bindTaskEvents(listItem, completeTask);

}

for(let i = 0; i < data.completedTasks.length; i++){
    let listItem = createNewElement(data.completedTasks[i][0], data.completedTasks[i][1], true);
    completedTasks.appendChild(listItem);
    bindTaskEvents(listItem, incompleteTask);
}

//Jquery Sorting ToDo Tasks, we're sorting only incompleted tasks
$(document).ready(function() {
$('.link-sort-list, button, checkbox, #add').click(function(e) {
  //To work without sort buttons for revers sorting on every change
//$( "body" ).on( "click", function(e) {
        var $sort = this;
        var $list = $('ul#uncompleted-tasks');
        var $listLi = $('li',$list);
        $listLi.sort(function(a, b){
            var keyA = $(a).text();
            var keyB = $(b).text();
            if($($sort).hasClass('asc')){
                return (keyA > keyB) ? 1 : 0;
            } else {
                return (keyA < keyB) ? 1 : 0;
            }
        });
        $.each($listLi, function(index, row){
            $list.append(row);
            save();
        });
        e.preventDefault();
   });
});
