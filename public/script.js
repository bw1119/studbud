// Modules
  // Lockr, makes it easier to handle localStorage for tasks
  import { set, get, rm } from 'Lockr';
  // Easytimer, for the pomodoro timer
  import { Timer } from "easytimer.js";
  const pomTimer = new Timer();
  const stopWatch = new Timer();
  const timeToComplete = new Timer();
  // Interact, for notes
  import interact from 'interactjs'


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

// Active task DOM
var activeTaskMainTitle = document.querySelector(".activetaskmain-h1");
var activeTaskMainTopType = document.querySelector(".activetaskpanel-topbig > h4");

var activeTaskTimerDueDate = document.querySelector("#activetasktimer-due > p");

var activeTaskTopBig = document.querySelectorAll('.activetaskpanel-topbig');
var activeTaskTopSmall = document.querySelectorAll('.activetaskpanel-topsmall');

var pomodoroStartBtn = document.querySelector('#timerbuttons-container > .startButton');
var pomodoroPauseBtn = document.querySelector('#timerbuttons-container > .pauseButton');
var pomodoroResetBtn = document.querySelector('#timerbuttons-container > .resetButton');

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
      if (localStorage.key(i) != "kanban_board") {
        // Push to array
        kanbanEntries.push(get(localStorage.key(i)));
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
    
    // Creates a kanban column for every entry in the array
    for (let i=0; i < kanbanBoard.length; i++) {
      console.log('adding column ' + i + ', title:');
      kanbanRenderColumn(i);
    }; 

    // Check for existing kanban entries
    for (let i=0; i < kanbanEntries.length; i++) {
      // Render and log id
      renderTask(kanbanEntries[i]);
    }
  });
};

function kanbanRenderColumn(i){
  // Column div
  let column = document.createElement('div');
  column.setAttribute('class','kanban-column'); 

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
  console.log(task);

  // Create HTML elements
  let item = document.createElement("div");
    item.setAttribute('data-id', task.id);
    item.setAttribute('data-x', task.interactX);
    item.setAttribute('data-y', task.interactY);
    item.className = 'kanban-entry';
      item.style.zIndex = kanbanEntries.length;
      item.style.transform = task.translatePos;
      item.style.width = task.interactW;
      item.style.height = task.interactH;
      item.style.backgroundColor = `hsl(${task.colourCode}, 80%)`;

  let itemHead = document.createElement("div");
  itemHead.setAttribute('style', `background-color: hsl(${task.colourCode}, 75%)`);
    itemHead.className = 'kanban-entryheader';

  let itemTxtContainer = document.createElement("div");
    itemTxtContainer.className = 'kanban-entry-textcontainer';

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
    delButton.classname = 'kanban-entrybutton';

  let activateButton = document.createElement("button");
  let activateButtonText = document.createTextNode("Activate");
    activateButton.classname = 'kanban-entrybutton';
  
  item.appendChild(itemHead);
  item.appendChild(itemTxtContainer);
    itemTxtContainer.appendChild(title);
    itemTxtContainer.appendChild(duedate);
    itemTxtContainer.appendChild(priority);

  delButton.appendChild(delButtonText);
  itemHead.appendChild(delButton);
  activateButton.appendChild(activateButtonText);
  itemHead.appendChild(activateButton);

  // Event Listeners for DOM elements
  delButton.addEventListener("click", function(event){
    event.preventDefault();
    let id = event.target.parentElement.getAttribute('data-id');
    let index = kanbanEntries.findIndex(task => task.id === Number(id));
    removeItem(task, index);
    item.remove();
  });
  // Event Listeners for DOM elements
  activateButton.addEventListener("click", function(event){
    event.preventDefault();
    //let id = event.target.parentElement.getAttribute('data-id');
    activetaskInit(task);
    task.active = true;
  });

  // Append new item to task list on the document
  board.appendChild(item);

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
// Interact.js for kanban "entries"
// 
/////////////////////////

// target elements with the "kanban-entry" class
interact('.kanban-entry')
  .resizable({
    // resize from all edges and corners
    edges: { left: true, right: true, bottom: true, top: true },

    listeners: {
      move (event) {
        var target = event.target
        var x = (parseFloat(target.getAttribute('data-x')) || 0)
        var y = (parseFloat(target.getAttribute('data-y')) || 0)

        // update the element's style
        target.style.width = event.rect.width + 'px'
        target.style.height = event.rect.height + 'px'
                
        // Push new coords to array and push updated object to localStorage
        for (let i=0; i < kanbanEntries.length; i++) {
          if (kanbanEntries[i].id == event.target.getAttribute('data-id')) {

            kanbanEntries[i].interactW = event.target.style.width;
            kanbanEntries[i].interactH = event.target.style.height;

            set(event.target.getAttribute('data-id'), kanbanEntries[i]);
            //console.log(get(event.target.getAttribute('data-id')));
          };
        };
      }
    },
    modifiers: [
      // keep the edges inside the parent
      interact.modifiers.restrictEdges({
        outer: 'parent'
      }),

      // minimum size
      interact.modifiers.restrictSize({
        min: { width: 150, height: 150 }
      }),

      // maximum size
      interact.modifiers.restrictSize({
        max: { width: 300, height: 300 }
      })
    ],

    inertia: true
  })
  .draggable({
    // enable inertial throwing
    inertia: true,
    // keep the element within the area of it's parent
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: 'parent',
        endOnly: true
      })
    ],
    // enable autoScroll
    autoScroll: true,

    listeners: {
      // call this function on every dragmove event
      move: dragMoveListener,

      // call this function on every dragend event
      end (event) {
        
        // Push new coords to array and push updated object to localStorage
        for (let i=0; i < kanbanEntries.length; i++) {
          if (kanbanEntries[i].id == event.target.getAttribute('data-id')) {

            kanbanEntries[i].translatePos = event.target.style.transform;
            kanbanEntries[i].interactX = event.target.getAttribute('data-x');
            kanbanEntries[i].interactY = event.target.getAttribute('data-y');

            set(event.target.getAttribute('data-id'), kanbanEntries[i]);
          };
        };

      }
    }
  })

function dragMoveListener (event) {
  var target = event.target
  // keep the dragged position in the data-x/data-y attributes
  var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
  var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

  // translate the element
  target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

  // update the posiion attributes
  target.setAttribute('data-x', x)
  target.setAttribute('data-y', y)
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

  //taskAddForm.style.display = "none";
});

// Push new task to array, render on client
function addTask(taskTitle, taskType, dueDate, estimatedTimeMins, estimatedTimeHours, priorityRating, completionStatus) {

  let task = {
    // Assign unique id to task
    id: Date.now(), 
    // Assign unique colour
    colourCode: `${Math.random() * 360}, ${Math.random() * 100}%`,
    // User datapoints frm form
    taskTitle,
    taskType,
    dueDate,
    estimatedTimeMins,
    estimatedTimeHours,
    priorityRating,
    completionStatus,
    // Translate functions
    translatePos: "",
      interactX: "",
      interactY: "",
      interactW: "",
      interactH: "",
    // Task active status
    active: false,
    // Elapsed time
    timeElapsed: 0
  };
  console.log(board.offsetWidth);
  console.log(board.offsetHeight);
  // Save in localStorage under id, add hash used for all tasks (42)
  set(task.id, task);

  console.log(task);
  //console.log(localStorage(task.id));

  kanbanEntries.push(task);
    // DEV: log array list
    console.log(kanbanEntries);
  
  renderTask(task);
};

//function pxToPercent(axis, inputNo) {
//  let result = inputNo / axis * 100;
//  console.log(result);

//  return result;
//}

/////////////////////////
// Handling general activetask section render functionality
// - 
/////////////////////////

// Initialise activetask section
function activetaskInit(task){
  // Local scope vars
  let mainEditButton = document.querySelector("#activetaskmain-editbutton");
  let mainTimerButtons = document.querySelectorAll("#timerbuttons-container > button");
  let backgroundsLvl1 = document.querySelectorAll(".activetaskpanel-lvl1");

  // Change text elements
  activeTaskMainTitle.textContent = task.taskTitle;
  activeTaskMainTopType.textContent = task.taskType;

  // Set colours
  mainEditButton.style.backgroundColor = `hsl(${task.colourCode}, 60%)`

    // For loops to set colours
    for (let i = 0; i < activeTaskTopSmall.length; i++) {
      activeTaskTopSmall[i].style.backgroundColor = `hsl(${task.colourCode}, 80%)`
    };
    for (let i = 0; i < activeTaskTopBig.length; i++) {
      activeTaskTopBig[i].style.backgroundColor = `hsl(${task.colourCode}, 80%)`
    };
    for (let i = 0; i < mainTimerButtons.length; i++) {
      mainTimerButtons[i].style.backgroundColor = `hsl(${task.colourCode}, 60%)`
    };
    for (let i = 0; i < backgroundsLvl1.length; i++) {
      backgroundsLvl1[i].style.backgroundColor = `hsl(${task.colourCode}, 98%)`
    };
  

  activeTaskTimerDueDate.innerHTML = `<span style="font-weight:500">Due</span>: ${task.dueDate.substring(5)}`;

  // Scroll down to section
  document.getElementById('activetask-container').scrollIntoView();

  pomodoroInit(task);
};

function pomodoroInit(task) {
  pomodoroStartBtn.addEventListener('click', function(e) {
    // Pomodoro
    pomTimer.start({precision: 'seconds', countdown: true, startValues: {minutes: 25}});
  });
  pomodoroPauseBtn.addEventListener('click', function(e) {
    // Pomodoro
    pomTimer.pause();
      // Stopwatch
      stopWatch.pause();
  });
  pomodoroResetBtn.addEventListener('click', function(e) {
    // Pomodoro
    pomTimer.reset();
    pomTimer.pause();
      // Stopwatch
      stopWatch.pause();
  });

  pomTimer.addEventListener('secondsUpdated', function (e) {
    // Pomodoro
    document.querySelector('#maintimer > .values').textContent = `${pomTimer.getTimeValues()}`;
      // Stopwatch
      document.querySelector('#activetaskstopwatch-readout > .values').textContent = `${stopWatch.getTimeValues()}`;

      task.timeElapsed++;
        // Push new elapsed time to array and push updated object to localStorage
        for (let i=0; i < kanbanEntries.length; i++) {
          if (kanbanEntries[i].id == task.id) {    
            kanbanEntries[i].timeElapsed = task.timeElapsed;

            set(task.id, kanbanEntries[i]);
          };
        };
  });

  pomTimer.addEventListener('started', function (e) {
      // Stopwatch
      stopWatch.start({startValues: {seconds: task.timeElapsed}});  
  });

  pomTimer.addEventListener('reset', function (e) {
    // Pomodoro
    document.querySelector('#maintimer > .values').textContent = `${pomTimer.getTimeValues()}`;
  });
}