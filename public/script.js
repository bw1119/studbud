// Variables

// DOM variable setups
// Taskadd form
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

var taskListArray = [];

/////////////////////////
// Handling on page load functions
// - Try to see if user already has tasks in local storage
//   - If so, render kanban board from storage
//   - If not, 
/////////////////////////

// Called when initial HTML has been completely loaded and parsed
//document.addEventListener("DOMContentLoaded", function() {

// 
window.addEventListener("load", function() {
  // If local storage isn't empty
  if (localStorage.length > 0) {
    // - Need default board setup, array of objects somewhere
    // - Decide on storage structure for kanban

  } else {  // If local storage has content
    // 
    // Take
    taskListArray = JSON.parse;
  }
});




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