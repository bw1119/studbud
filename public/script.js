// Modules
  // Lockr, makes it easier to handle localStorage for tasks
  import { set, get, rm, sadd, smembers } from 'Lockr';
  // Easytimer, for the pomodoro timer
  import { Timer } from "easytimer.js";
  const timer = new Timer();

// Variables

// DOM variable setups
// Taskadd form DOM
const form = document.getElementById("taskadd-form");
var taskAddBtn = document.getElementById("taskadd-button");
var taskAddForm = document.getElementById("taskadd-form");
  var taskAddCnclBtn = document.getElementById("taskadd-form-cancel");
  // Taskadd data inputs
  var taskInput = document.getElementById("taskInput");
  var tasktypeInput = document.getElementById("tasktypeInput");
  var dueDateInput = document.getElementById("dueDateInput");
  var estimatedTimeInputMins = document.getElementById("estimatedTimeInput-Mins");
  var estimatedTimeInputHours = document.getElementById("estimatedTimeInput-Hours");
  var priorityInput = document.getElementById("priorityInput");

// Kanban DOM
const board = document.getElementById("kanban-board");

var taskEntryPoint;

// Kanban data
var kanbanBoard = [];
var kanbanEntries = [];

/////////////////////////
// Handling on page load functions
// - Check if local storage is populated (if user has logged in before)
//   - If so, populate kanban board array with local storage
//   - If not, populate local storage + kanban board array with default setup
/////////////////////////

// Local storage check, populate with default keys if not already existing
// ... called when initial HTML has been completely loaded and parsed
document.addEventListener("DOMContentLoaded", function() {

  // If local storage has content
  if (localStorage.length > 0) { 
    console.log("Local storage exists: y");
    // Push local storage to array
    kanbanBoard = get('kanban_board');

    for (let i=0; i < localStorage.length; i++) {
      if (smembers(i) == 42) {
        kanbanEntries.push(get(i)); // DEV: unfinished
        renderTask(get(i));
      }
    }

  // If local storage is empty
  } else {  
    console.log("Local storage exists: n");
    // Set default board state in local storage
    set('kanban_board', ['To-do', 'In-progress', 'Done', 'Future']);
    // Push local storage to array
    kanbanBoard = get('kanban_board');
  };
  
  // Now, initialise board
  kanbanInit();
});


/////////////////////////
// Handling kanban render functionality
// 
/////////////////////////

// Initialise board
function kanbanInit(){
  // Called when page has been completely loaded
  window.addEventListener("load", function() {
    //flush();
    console.log(kanbanBoard);
    console.log(kanbanEntries);
    
    // Creates a kanban column for every entry in the array
    for (let i=0; i < kanbanBoard.length; i++) {
      console.log('adding column ' + i + ', title:');
      kanbanRenderColumn(i);
    }; 

  });
};

function kanbanRenderColumn(i){
  // Column div
  let column = document.createElement('div');
  column.setAttribute('class','kanban-column'); 

  
  /* // Old
  let columnGrid = document.createElement('div');
  columnGrid.setAttribute('class','kanban-column_grid');
  // Assigns a unique name for each grid area
  columnGrid.style.gridTemplateAreas = `"${kanbanBoard[i].name + 1} ${kanbanBoard[i].name + 2}" "${kanbanBoard[i].name + 3} ${kanbanBoard[i].name + 4}" "${kanbanBoard[i].name + 5} ${kanbanBoard[i].name + 6}" "${kanbanBoard[i].name + 7} ${kanbanBoard[i].name + 8}" "${kanbanBoard[i].name + 9} ${kanbanBoard[i].name + 10}"`; 
  */

  // Title taken from array
  let columnTitle = document.createElement("h1");
  columnTitle.textContent = kanbanBoard[i];
  console.log('  ' + kanbanBoard[i]);

  // Append column to board
  board.appendChild(column);
  // Append title to column
  column.appendChild(columnTitle);
  //column.appendChild(columnGrid);

  taskEntryPoint = document.querySelector(".kanban-column");
}

// Add the new task to the html, with DOM
// DEV: NEEDS REWRITE FOR KANBAN BOARD
function renderTask(task){
  // Create HTML elements
  let item = document.createElement("div");
  item.setAttribute('data-id', task.id);
  item.className = 'kanban-entry';
  item.style.zIndex = kanbanEntries.length;

  let itemHead = document.createElement("div");
  itemHead.className = 'kanban-entryheader';
    let title = document.createElement("h4");
    title.className = 'kanban-entry-title';
    title.textContent = task.taskTitle; 

  let duedate = document.createElement("p");
  duedate.className = 'kanban-entry-duedate';
  duedate.innerHTML = `<span style="font-weight:500">Due</span>: ${task.dueDate.substring(5)}`;

  let priority = document.createElement("p");
  priority.className = 'kanban-entry-priority';
  priority.innerHTML = `<span style="font-weight:500">Priority</span>: ${task.priorityRating}`;

  // Extra Task DOM elements
  let delButton = document.createElement("button");
  let delButtonText = document.createTextNode("✕");
  
  item.appendChild(itemHead);
    item.appendChild(title);

  delButton.appendChild(delButtonText);
  item.appendChild(delButton);
  item.appendChild(duedate);
  item.appendChild(priority);


  // Event Listeners for DOM elements
  delButton.addEventListener("click", function(event){
    event.preventDefault();
    let id = event.target.parentElement.getAttribute('data-id');
    let index = kanbanEntries.findIndex(task => task.id === Number(id));
    removeItem(task, index);
    item.remove();
  });

  // Append new item to task list on the document
  taskEntryPoint.appendChild(item);
  reCheckEntries(task);

  // Clear the input form
  form.reset();
}

// Remove deleted task from array
function removeItem(task, index) {
  console.log(kanbanEntries);
  console.log(localStorage);
  if (index > -1){
    kanbanEntries.splice(index, 1);
  }
  rm(task.id);
  console.log(kanbanEntries);
  console.log(localStorage);
}


/////////////////////////
// Handling draggable kanban notes
// - Code from https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_draggable
// - (Modified)
/////////////////////////

// Make the DIV element draggagle:
function reCheckEntries(task) {
  dragElement(document.querySelector(`div[data-id="${task.id}"`));
};

function dragElement(elmnt) {
  console.log("test1");
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (elmnt.querySelector(".kanban-entryheader")) {
    console.log("test2");
    // if present, the header is where you move the DIV from:
    elmnt.querySelector(".kanban-entryheader").onmousedown = dragMouseDown;
  } else {
    console.log("test2a");
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  };

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    console.log(pos3);
    pos4 = e.clientY;
    console.log(pos4);
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  };

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  };

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  };
}


/////////////////////////
// Handling task add functions
// - EventListeners for form buttons
// - Taskadd form sends values to the kanbanEntries[]
/////////////////////////

// On task add button click, reveal task add form
taskAddBtn.addEventListener("click", function(){
  taskAddForm.style.display = "flex";
});
// On task add cancel button click, reset form and hide it
taskAddCnclBtn.addEventListener("click", function(){
  form.reset();
  taskAddForm.style.display = "none";
});

// On submit button click
form.addEventListener("submit", function(event){
  event.preventDefault();
  let task = taskInput.value;
  let taskType = tasktypeInput.options[tasktypeInput.selectedIndex].value;
  let dueDate = dueDateInput.value;
  let estimatedTimeMins = estimatedTimeInputMins.value;
  let estimatedTimeHours = estimatedTimeInputHours.value;
  let priorityRating = priorityInput.options[priorityInput.selectedIndex].value;
  
  // Call addTask() - add recorded task elements to GUI list and array
  addTask(task, taskType, dueDate, estimatedTimeMins, estimatedTimeHours, priorityRating, false);
});

// Push new task to array, render on client
function addTask(taskTitle, taskType, dueDate, estimatedTimeMins, estimatedTimeHours, priorityRating, completionStatus) {

  let task = {
    // Assign unique id to task
    id: Date.now(), 
    // User datapoints
    taskTitle,
    taskType,
    dueDate,
    estimatedTimeMins,
    estimatedTimeHours,
    priorityRating,
    completionStatus
  };
  // Save in localStorage under id, add hash used for all tasks (42)
  set(task.id, task);
  sadd(task.id, 42);

  console.log(task);
  //console.log(localStorage(task.id));

  kanbanEntries.push(task);
    // DEV: log array list
    console.log(kanbanEntries);
  
  renderTask(task);
};


/////////////////////////
// Handling general activetask section render functionality
// - 
/////////////////////////