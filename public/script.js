// DOM variable setups
const form = document.getElementById("taskform");
const button = document.querySelector("#taskform > button")
var taskInput = document.getElementById("taskInput");
var taskList = document.getElementById("tasklist");
  // Task elements
  var dueDateInput = document.getElementById("dueDateInput");
  var completionTimeInput = document.getElementById("completionTimeInput");
  var estimatedTimeInput = document.getElementById("estimatedTimeInput");
  var priorityInput = document.getElementById("priorityInput");

// On submit button click
form.addEventListener("submit", function(event){
  event.preventDefault();
  let task = taskInput.value;
  let dueDate = dueDateInput.value;
  let completionTime = completionTimeInput.value;
  let estimatedTime = estimatedTimeInput.value;
  let priorityRating = priorityInput.options[priorityInput.selectedIndex].value;
  // Call addTask() - add recorded task elements to GUI list and array
  addTask(task, dueDate, estimatedTime, priorityRating, completionTime, false);
});

var taskListArray = [];

function addTask(taskDescription, dueDate, estimatedTime, priorityRating, completionTime, completionStatus) {
  let d = new Date();
  let dateCreated = d.getFullYear();
  let task = {
    taskDescription,
    dueDate,
    dateCreated,
    estimatedTime,
    completionTime,
    priorityRating,
    estimatedTime,
    completionStatus
  };
  taskListArray.push(task);
    console.log(taskListArray);
  renderTask(task);
};

function renderTask(task){
  // Create HTML elements
  let item = document.createElement("li");
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
    item.remove();
  });


  // Clear the input form
  form.reset();
}
