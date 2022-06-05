// Modules
  // Lockr, makes it easier to handle localStorage for tasks
  import { set, get, rm } from 'Lockr';
  // Easytimer, for the pomodoro timer
  import { Timer } from "easytimer.js";
  const pomTimer = new Timer();
  const stopWatch = new Timer();
  const timerToComplete = new Timer();
  // Interact, for notes
  import interact from 'interactjs'
  console.log(localStorage);


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
    // Make date input not accept past dates
    dueDateInput.setAttribute('min', `${new Date().toISOString().substring(0,10)}`);
  var estimatedTimeInputMins = document.getElementById("estimatedTimeInput-Mins");
  var estimatedTimeInputHours = document.getElementById("estimatedTimeInput-Hours");
  var priorityInput = document.getElementById("priorityInput");

// Kanban DOM
const board = document.getElementById("kanban-board");
var instructionsTxt = document.querySelector(".instructions");

// Active task DOM
var activeTaskMainTitle = document.querySelector(".activetaskmain-h1");
var activeTaskMainTopType = document.querySelector(".activetaskpanel-topbig > h4");
var activeTaskMainTitleSub = document.querySelector(".activetaskmainh1-priority");
  var activeTaskMainList = document.querySelector("#activetaskmain-entrypoint");
  var listItemAddButton = document.querySelector("#activetaskmain-addbutton");

var activeTaskTimerDueDate = document.querySelector("#activetasktimer-due > p");

var activeTaskTopBig = document.querySelectorAll('.activetaskpanel-topbig');
var activeTaskTopSmall = document.querySelectorAll('.activetaskpanel-topsmall');

var pomodoroStartBtn = document.querySelector('#timerbuttons-container > .startButton');
var pomodoroPauseBtn = document.querySelector('#timerbuttons-container > .pauseButton');
var pomodoroResetBtn = document.querySelector('#timerbuttons-container > .resetButton');

var timerAdd1HrBtn = document.querySelector('#activetasktimerreadout-buttonadd1h');
var timerAdd10MinsBtn = document.querySelector('#activetasktimerreadout-buttonadd10m');

// Kanban data
var kanbanBoard = [];
var kanbanEntries = [];
var kanbanLists = [];

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
      // Show instructions if first time on site
      instructionsTxt.style.display = "none";

    // Push kanbanEntries from locStorage to global array, ignoring list and board data
    for (let i=0; i < localStorage.length; i++) {
      if (localStorage.key(i) != "kanban_board" && (localStorage.key(i)).substring(0,4) != "list") {
        kanbanEntries.push(get(localStorage.key(i)));
      } 
    }

    // Push kanbanLists from locStorage to global array, if has list prefix
    for (let i=0; i < localStorage.length; i++) {
      if ((localStorage.key(i)).substring(0,4) == "list") {
        kanbanLists.push(get(localStorage.key(i)));
      } 
    }
    console.log(kanbanEntries)
    console.log(kanbanLists)

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
// Handling kanban functionality
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
      console.log(kanbanEntries[i]);
      // Find corresponding entry in checklist array, searching for the pure id (without 'task' prefix)
      const correspondingList = kanbanLists.find(({ id }) => 
      id.substring(4) === `${kanbanEntries[i].id}`
      );

      // Render
      renderTask(kanbanEntries[i], correspondingList);
    }
  });
};

// Render columns, testIfNew determintes if we're initialising or adding a new one
function kanbanRenderColumn(i, testIfNew){
  // Create HTML elements
  // Column div
  let column = document.createElement('div');
  column.setAttribute('class','kanban-column'); 

  // Title taken from array
  let columnTitle = document.createElement("h1");
  columnTitle.setAttribute("contenteditable", "true");

  // Test if this is a new column...
  if(testIfNew) {
    // ... If true, add a temp header ...
    columnTitle.textContent = `New #${kanbanBoard.length + 2}`;
    kanbanBoard.push(columnTitle.textContent);
    set('kanban_board', kanbanBoard);
  } else {
    // ... If false, pull from array
    columnTitle.textContent = kanbanBoard[i];
  }
  // Editable header pushes to global array and local storage on type
    columnTitle.addEventListener("input", function(){
      kanbanBoard[i] = columnTitle.textContent;
      set('kanban_board', kanbanBoard);
    });
  console.log('  ' + kanbanBoard[i]);

  // Add button and container
  let columnDiv = document.createElement("div");
  let columnAddBtn = document.createElement("button");
  columnAddBtn.className="kanban-column-addbtn";
  columnAddBtn.textContent="+";

    // On add button click, add new column (setting 'new' check to true)
    columnAddBtn.addEventListener("click", function(){
      if (document.getElementById("kanban-board").childElementCount < 9) {
        // Update array + local storage
        kanbanRenderColumn(kanbanBoard[i] + 1, true);
        set('kanban_board', kanbanBoard);
      }
    });

  // Delete button
  let columnDelBtn = document.createElement("button");
  columnDelBtn.className="kanban-column-delbtn";
  columnDelBtn.textContent="✕";
    
    // On delete button click, delete column
    columnDelBtn.addEventListener("click", function(){
      if (document.getElementById("kanban-board").childElementCount > 2) {
        // Update array + local storage, kill html column
        kanbanBoard.splice(kanbanBoard.indexOf(columnTitle.textContent), 1)
        column.remove();
        set('kanban_board', kanbanBoard);
      };
    });

  column.appendChild(columnDelBtn);
  column.appendChild(columnTitle);
  column.appendChild(columnDiv);
    columnDiv.appendChild(columnAddBtn);

  // Append column to board
  board.appendChild(column);
}

// Add the new task to the html, with DOM
function renderTask(task, taskBreakdown){
  // Create HTML elements
  // Base container div
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

  // Header div
  let itemHead = document.createElement("div");
  itemHead.setAttribute('style', `background-color: hsl(${task.colourCode}, 75%)`);
    itemHead.className = 'kanban-entryheader';

  // Text div
  let itemTxtContainer = document.createElement("div");
    itemTxtContainer.className = 'kanban-entry-textcontainer';

      // Title 
      let title = document.createElement("h4");
        title.className = 'kanban-entry-title';
        title.textContent = task.taskTitle; 

      // Due date
      let duedate = document.createElement("p");
        duedate.className = 'kanban-entry-duedate';
        duedate.innerHTML = `<span style="font-weight:500">Due</span>: ${task.dueDate.substring(5)}`;

      // Priority
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
  activateButton.addEventListener("click", function(event){
    event.preventDefault();
    //let id = event.target.parentElement.getAttribute('data-id');
    activetaskInit(task, taskBreakdown);
    task.active = true;
  });

  // Append new item to task list on the document
  board.appendChild(item);

  // Clear the input form
  form.reset();
}

// Remove deleted task from array
function removeItem(task, index) {
    if (index > -1){
    kanbanEntries.splice(index, 1);
  }
  rm(task.id);
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
        min: { width: 125, height: 125 }
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
  let estimatedTimeMins = parseInt(estimatedTimeInputMins.value);
  let estimatedTimeHours = parseInt(estimatedTimeInputHours.value);
  let priorityRating = priorityInput.options[priorityInput.selectedIndex].value;
  
  // Call addTask() - add recorded task elements to GUI list and array
  addTask(task, taskType, dueDate, estimatedTimeHours, estimatedTimeMins,  priorityRating, false);

  //taskAddForm.style.display = "none";
});

// Push new task to array, render on client
function addTask(taskTitle, taskType, dueDate, estimatedTimeHours, estimatedTimeMins, priorityRating, completionStatus) {
  let task = {
    // Assign unique id to task
    id: Date.now(), 
    // Assign unique colour
    colourCode: `${Math.random() * 360}, ${Math.random() * 100}%`,
    // User datapoints frm form
    taskTitle,
    taskType,
    dueDate,
    estimatedTimeHours,
    estimatedTimeMins,
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
    let taskBreakdown = {
      id: `list${task.id}`,
    };

    console.log(taskBreakdown);
    console.log(task);
  // Save in localStorage
  set(task.id, task);
  console.log(localStorage);
    set(taskBreakdown.id, taskBreakdown);


  kanbanEntries.push(task);
  kanbanLists.push(taskBreakdown);
  console.log(kanbanLists);
    // DEV: log array list
    console.log(kanbanEntries);
    console.log(kanbanLists);
  
  renderTask(task, taskBreakdown);
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
function activetaskInit(task, taskBreakdown){
  // Local scope vars
  let checklistCount = Object.keys(taskBreakdown).length;
  console.log(checklistCount);

  //DOM
  let mainEditButton = document.querySelector("#activetaskmain-editbutton");
  let timerButtons = document.querySelectorAll("#timerbuttons-container > button, #activetasktimer-buttoncontainer > button");
  let backgroundsLvl1 = document.querySelectorAll(".activetaskpanel-lvl1");
    let backgroundsLvl1a = document.querySelector(".activetaskpanel-lvl1a");

  // Change text elements
  activeTaskMainTitle.textContent = task.taskTitle;
  activeTaskMainTopType.textContent = task.taskType;
  activeTaskMainTitleSub.innerHTML = `<span style="font-weight:500">${task.priority}</span> priority`

  // Set colours
  mainEditButton.style.backgroundColor = `hsl(${task.colourCode}, 65%)`
  backgroundsLvl1a.style.backgroundColor  = `hsl(${task.colourCode}, 99%)`

    // For loops to set colours for multiple elements
    for (let i = 0; i < activeTaskTopSmall.length; i++) {
      activeTaskTopSmall[i].style.backgroundColor = `hsl(${task.colourCode}, 80%)`
    };
    for (let i = 0; i < activeTaskTopBig.length; i++) {
      activeTaskTopBig[i].style.backgroundColor = `hsl(${task.colourCode}, 80%)`
    };
    for (let i = 0; i < timerButtons.length; i++) {
      timerButtons[i].style.backgroundColor = `hsl(${task.colourCode}, 65%)`
    };
    for (let i = 0; i < backgroundsLvl1.length; i++) {
      backgroundsLvl1[i].style.backgroundColor = `hsl(${task.colourCode}, 98%)`
    };

  activeTaskTimerDueDate.innerHTML = `<span style="font-weight:500">Due</span>: ${task.dueDate.substring(5)}`;

  // Scroll down to section
  document.getElementById('activetask-container').scrollIntoView();

  pomodoroInit(task);
  taskListInit(taskBreakdown);
  
  listItemAddButton.addEventListener("click", function(){
    taskBreakdown[checklistCount] = "";
    console.log(taskBreakdown[checklistCount]);
    taskListRender(taskBreakdown, checklistCount, false);
    checklistCount = Object.keys(taskBreakdown).length;
    // Push new elapsed time to array and push updated object to localStorage
  }); 
};

// Initialise Pomodoro timer
function pomodoroInit(task) {
  pomodoroStartBtn.addEventListener('click', function(e) {
    // Pomodoro
    pomTimer.start({precision: 'seconds', countdown: true, startValues: {minutes: 25}});
    document.querySelector('#activetaskstopwatch-readout > .values').textContent = `${stopWatch.getTimeValues()}`;
    document.querySelector('#activetasktimer-readout > .values').textContent = `${timerToComplete.getTimeValues()}`;
  });
  pomodoroPauseBtn.addEventListener('click', function(e) {
    // Pomodoro
    pomTimer.pause();
      // Stopwatch
      stopWatch.pause();
      // Time to complete
      timerToComplete.pause();
  });
  pomodoroResetBtn.addEventListener('click', function(e) {
    // Pomodoro
    pomTimer.reset();
    pomTimer.pause();
      // Stopwatch
      stopWatch.pause();
      // Time to complete
      timerToComplete.pause();
  });

  pomTimer.addEventListener('secondsUpdated', function (e) {
    // Pomodoro
    document.querySelector('#maintimer > .values').textContent = `${pomTimer.getTimeValues()}`;
  });

  pomTimer.addEventListener('started', function (e) {
      // Stopwatch
      stopWatch.start({precision: 'minutes', startValues: {minutes: task.timeElapsed}});  
        // Time to complete
        timerToComplete.start({precision: 'minutes', countdown: true, startValues: {hours:task.estimatedTimeHours, minutes: task.estimatedTimeMins}});  

        if (timerToComplete.getTimeValues().days > 0) {
          console.log(timerToComplete.getTimeValues().days);
          document.querySelector('#activetasktimer-readout-days').textContent = `${timerToComplete.getTimeValues().days} days`;
        } 
  });

  pomTimer.addEventListener('reset', function (e) {
    // Pomodoro
    document.querySelector('#maintimer > .values').textContent = `${pomTimer.getTimeValues()}`;
  });

  otherTimersInit(task);
}

// Initialise other timers
function otherTimersInit(task) {

  stopWatch.addEventListener('minutesUpdated', function (e) {
    // Stopwatch
    document.querySelector('#activetaskstopwatch-readout > .values').textContent = `${stopWatch.getTimeValues()}`;
    task.timeElapsed++;
      // Push new elapsed time to array and push updated object to localStorage
      searchAndReplace(kanbanEntries, task, "timeElapsed");
  });
  timerToComplete.addEventListener('minutesUpdated', function (e) {
    // Time to complete timer
    document.querySelector('#activetasktimer-readout > .values').textContent = `${timerToComplete.getTimeValues()}`;
    task.estimatedTimeMins--;
      // Push new elapsed time to array and push updated object to localStorage
      searchAndReplace(kanbanEntries, task, "estimatedTimeMins");
  });

  timerAdd10MinsBtn.addEventListener('click', function(e) {

    task.estimatedTimeMins += 10;
    // Push new elapsed time to array and push updated object to localStorage
    searchAndReplace(kanbanEntries, task, "estimatedTimeMins");
    timerToComplete.start({precision: 'minutes', countdown: true, startValues: {hours:task.estimatedTimeHours, minutes: task.estimatedTimeMins}});  
    document.querySelector('#activetasktimer-readout > .values').textContent = `${timerToComplete.getTimeValues()}`;
  });

  timerAdd1HrBtn.addEventListener('click', function(e) {

    task.estimatedTimeHours++;
    // Push new elapsed time to array and push updated object to localStorage
    searchAndReplace(kanbanEntries, task, "estimatedTimeMins");
    timerToComplete.start({precision: 'minutes', countdown: true, startValues: {hours:task.estimatedTimeHours, minutes: task.estimatedTimeMins}});  
    document.querySelector('#activetasktimer-readout > .values').textContent = `${timerToComplete.getTimeValues()}`;
  });
};

function taskListInit(taskBreakdown) {
  activeTaskMainList.innerHTML="";
  console.log(Object.keys(taskBreakdown).length);
  // Check if we have entries
  if(Object.keys(taskBreakdown).length > 1) {
    // Check for existing kanban entries
    for (let i=1; i < Object.keys(taskBreakdown).length; i++) {
      // Render and log id
      taskListRender(taskBreakdown, i, true);
    };
  }
};

// Render a list entry
function taskListRender(taskBreakdown, pos, testPreExist) {
  console.log(taskBreakdown[pos]);
  //console.log(task);
  // Create HTML elements
  let listItem = document.createElement("li");
  listItem.className = "tasklist-item";
    listItem.setAttribute('role', 'option');
    listItem.setAttribute('tabindex', -1);
    listItem.setAttribute('aria-checked', 'false');

  let listItemInput = document.createElement("input");
  listItemInput.className = "tasklistitem-input";
    listItemInput.setAttribute('type', 'checkbox');
    listItemInput.setAttribute('tabindex', -1);

  let listItemInputContent = document.createElement("h1");
  listItemInputContent.className = "tastklistitem-content";
  if( testPreExist) {
    listItemInputContent.textContent = taskBreakdown[pos];
  } else {
    listItemInputContent.textContent = "New list item";
  }
    listItemInputContent.setAttribute("contenteditable", "true");

  // Event Listeners for DOM elements
  listItemInput.addEventListener("click", function() {
    console.log("test");
  });
  listItemInput.addEventListener("click", function() {
    console.log("test");
  });
  listItemInputContent.addEventListener("input", function(e){
    taskBreakdown[pos] = listItemInputContent.textContent;
    searchAndReplace(kanbanLists, taskBreakdown, pos);
  });

  listItem.appendChild(listItemInput);
  listItem.appendChild(listItemInputContent);
  activeTaskMainList.appendChild(listItem);
}


/////////////////////////
// MISC
/////////////////////////

// Search in local array for matching id, and replace in localStorage
function searchAndReplace(arr, task, target) {
  for (let i=0; i < arr.length; i++) {
    if (arr[i].id == task.id) {
      `arr[i].${target} = task.${target}`;

      set(task.id, arr[i]);
    };
  };
};