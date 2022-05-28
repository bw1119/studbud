// Modules
import { prefix, set, get, flush } from 'Lockr';
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
  var dueDateInput = document.getElementById("dueDateInput");
  var estimatedTimeInputMins = document.getElementById("estimatedTimeInput-Mins");
  var estimatedTimeInputHours = document.getElementById("estimatedTimeInput-Hours");
  var priorityInput = document.getElementById("priorityInput");

var taskList = document.getElementById("tasklist");

// Kanban DOM
const board = document.getElementById("kanban-board");

// Kanban data
var kanbanBoard;
var kanbanEntries;

var taskListArray = []; // DEV: delete this

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
    // Push local storage to array
    kanbanBoard = get('kanban_board');
    //kanbanEntries = ; // DEV: unfinished
  // If local storage is empty
  } else {  
    // Set default board state in local storage
    set('kanban_board', ['To-do', 'In-progress', 'Done','Future']);
    // Push local storage to array
    kanbanBoard = get('kanban_board');
  };
  // Now, initialise board
  kanbanInit();
});

// Initialise board
function kanbanInit(){
  // Called when page has been completely loaded
  window.addEventListener("load", function() {
    //flush();
    console.log(kanbanBoard);
    // Creates a kanban column for every entry in the array
    for (i=0; i < kanbanBoard.length; i++) {
      console.log('adding column ' + i + ', title:');

      // Column div
      let column = document.createElement('div',);

      // Unnecessary as we use css selectors to select these divs
      //column.setAttribute('class','kanban-column'); 

      // Title taken from array
      let columnTitle = document.createElement("h1");
      columnTitle.textContent = kanbanBoard[i];
      console.log('  ' + kanbanBoard[i]);

      // Append column to board
      board.appendChild(column);
      // Append title to column
      column.appendChild(columnTitle);
    };
  });
};


/////////////////////////
// Handling task add functions
// - EventListeners for form buttons
// - Taskadd form sends values to the taskListArray[]
// - Renders a new task in the board (REWRITE NEEDED)
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
  let dueDate = dueDateInput.value;
  let estimatedTimeMins = estimatedTimeInputMins.value;
  let estimatedTimeHours = estimatedTimeInputHours.value;
  let priorityRating = priorityInput.options[priorityInput.selectedIndex].value;
  
  // Call addTask() - add recorded task elements to GUI list and array
  addTask(task, dueDate, estimatedTimeMins, estimatedTimeHours, priorityRating, false);
});

// Push new task to array, render on client
function addTask(taskTitle, dueDate, estimatedTimeMins, estimatedTimeHours, priorityRating, completionStatus) {
  let d = new Date();
  let dateCreated = d.getFullYear();

  let task = {
    // Assign unique id to task
    id: Date.now(), 
    // User datapoints
    taskTitle,
    dueDate,
    dateCreated,
    estimatedTimeMins,
    estimatedTimeHours,
    priorityRating,
    completionStatus
  };
  taskListArray.push(task);
  
  // DEV: log array list
    console.log(taskListArray);
  
  renderTask(task);
};

/////////////////////////
// Handling general kanban render functionality
// - 
/////////////////////////

// Add the new task to the html, with DOM
// DEV: NEEDS REWRITE FOR KANBAN BOARD
function renderTask(task){
  // Create HTML elements
  let item = document.createElement("li");
  item.setAttribute('data-id', task.id);
  item.innerHTML = "<p>" + task.taskTitle + "</p>";

  // Append new item to task list on the document
  taskList.appendChild(item);

  // Extra Task DOM elements
  let delButton = document.createElement("button");
  let delButtonText = document.createTextNode("Delete Task");
  delButton.appendChild(delButtonText);
  item.appendChild(delButton);

  // Event Listeners for DOM elements
  delButton.addEventListener("click", function(event){
    event.preventDefault();
    let id = event.target.parentElement.getAttribute('data-id');
    let index = taskListArray.findIndex(task => task.id === Number(id));
    removeItemFromArray(taskListArray,index);
    item.remove();
  });

  // Clear the input form
  form.reset();
}

// Remove deleted task from array
function removeItemFromArray(arr, index) {
  if (index > -1){
    arr.splice(index, 1);
  }
  return arr;
}