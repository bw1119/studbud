// DOM variable setups
const form = document.getElementById("taskadd-form");
var taskAddBtn = document.getElementById("taskadd-button");
var taskAddForm = document.getElementById("taskadd-form");
  var taskAddCnclBtn = document.getElementById("taskadd-form-cancel");

var taskInput = document.getElementById("taskInput");
var taskList = document.getElementById("tasklist");

  // Task elements
  var dueDateInput = document.getElementById("dueDateInput");
  var estimatedTimeInputMins = document.getElementById("estimatedTimeInput-Mins");
  var estimatedTimeInputHours = document.getElementById("estimatedTimeInput-Hours");
  var priorityInput = document.getElementById("priorityInput");


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

var taskListArray = [];

function addTask(taskDescription, dueDate, estimatedTimeMins, estimatedTimeHours, priorityRating, completionStatus) {
  let d = new Date();
  let dateCreated = d.getFullYear();
  let task = {
    id: Date.now(),
    taskDescription,
    dueDate,
    dateCreated,
    estimatedTimeMins,
    estimatedTimeHours,
    priorityRating,
    completionStatus
  };
  taskListArray.push(task);
    console.log(taskListArray);
  renderTask(task);
};

function renderTask(task){
  // Create HTML elements
  let item = document.createElement("li");
  item.setAttribute('data-id', task.id);
  item.innerHTML = "<p>" + task.taskDescription + "</p>";

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
    let index = taskListArray.findIndex(task => task.id === Number(id))
    removeItemFromArray(taskListArray,index)
    item.remove();
  });


  // Clear the input form
  form.reset();
}

function removeItemFromArray(arr, index) {
  if (index > -1){
    arr.splice(index, 1);
  }
  return arr;
}