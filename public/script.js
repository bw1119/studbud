// Modules
  // Lockr, makes it easier to handle localStorage for tasks
  import { set, get, rm } from 'Lockr';
  // Easytimer, for the pomodoro timer
  import { Timer } from "easytimer.js";
  // Interact, for notes
  import interact from 'interactjs'

///
// Variables
///

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
  // Panel head decorations
  var activeTaskTopBig = document.querySelectorAll('.activetaskpanel-topbig');
  var activeTaskTopSmall = document.querySelectorAll('.activetaskpanel-topsmall');

  // Main panel
  var activeTaskMainTitle = document.querySelector(".activetaskmain-h1");
  var activeTaskMainTopType = document.querySelector(".activetaskpanel-topbig > h4");
  var activeTaskMainTitleSub = document.querySelector("#activetaskmainh1-priority");
  var activeTaskMainListContainer = document.querySelector("#activetaskmain-checklist");
    var activeTaskMainListEmptySpace = document.querySelector("#activetaskmain-checklistemptyspace");
  var activeTaskMainList = document.querySelector("#activetaskmain-entrypoint");
    // List
    var listItemOpenAllButton = document.querySelector("#activetaskmain-openallbutton");

  // Pomodoro timer
  var pomodoroStartBtn = document.querySelector('#timerbuttons-container > .startButton');
  var pomodoroPauseBtn = document.querySelector('#timerbuttons-container > .pauseButton');
  var pomodoroResetBtn = document.querySelector('#timerbuttons-container > .resetButton');

  // Time elapsed panel
  var stopwatchStartBtn = document.querySelector('#activetaskstopwatch-buttoncontainer > .startButton');
  var stopwatchPauseBtn = document.querySelector('#activetaskstopwatch-buttoncontainer > .pauseButton');
  var stopwatchResetBtn = document.querySelector('#activetaskstopwatch-buttoncontainer > .resetButton');

  // Time to complete panel
  var activeTaskTimerDueDate = document.querySelector("#activetasktimer-due > p");
    var timerAdd1HrBtn = document.querySelector('#activetasktimerreadout-buttonadd1h');
    var timerAdd10MinsBtn = document.querySelector('#activetasktimerreadout-buttonadd10m');

// Kanban data
  var kanbanBoard = [];
  var kanbanEntries = [];
  //var kanbanLists = [];

// Timers
  var pomTimer;
  var stopWatch;
  var timerToComplete;


///
// Page functionality
///

/////////////////////////
// Handling on page load functions
// - Check if local storage is populated (if user has visited before, it will be)
//   - If so, populate kanban board array with local storage
//   - If not, populate local storage + kanban board array with default setup
/////////////////////////

console.log(localStorage);

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
      if (localStorage.key(i) != "kanban_board") {
        kanbanEntries.push(get(localStorage.key(i)));
      }; 
    };

    // Deprecated
      // Push kanbanLists from locStorage to global array, if has list prefix
      //for (let i=0; i < localStorage.length; i++) {
      //  if ((localStorage.key(i)).substring(0,4) == "list") {
      //    kanbanLists.push(get(localStorage.key(i)));
      //  };
      //};
    console.log(kanbanEntries)

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
// - Initialise kanban from global vars, cycle through board array and entries array of objects and run for every entry the following: 
//   - kanbanRenderColumns() draws a column to the page and saves changes to array + local storage
//     - Buttons for deleting and adding new columns
//   - renderTask() draws an entry to the page and saves changes to array of objects + local storage
//     - Buttons for deleting and activating
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
      //Deprecated
        // Find corresponding obj in checklist array, searching for the pure id (i.e. without 'task' prefix)
        //console.log(kanbanLists);
        //for(let y=0; y < kanbanLists.length; y++) {
        //  if(kanbanLists[y].id = `list${kanbanEntries[i].id}`) {
        //    correspondingArr = kanbanLists[y];
        //  };
        //};
      console.log(kanbanEntries[i]);
      // Render entry and inherit object
      renderTask(kanbanEntries[i]);
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
function renderTask(task){
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
    let index = kanbanEntries.findIndex(
      task => task.id === Number(id)
      );
    console.log(index)
    console.log(task.items)
    removeItem(task, index);
    item.remove();
  });
  activateButton.addEventListener("click", function(event){
    activeTaskMainList.innerHTML="";
    activeTaskMainListEmptySpace.innerHTML="";
    task.active = true;
    taskListInit(task);
  });

  // Append new entry to board
  board.appendChild(item);

  // Clear the input form
  form.reset();
}

// Remove deleted task from array + local storage, and do the same for corresponding checklist 
function removeItem(task, index) {
  if (index > -1){
    kanbanEntries.splice(index, 1);
  }
  rm(task.id);
}


/////////////////////////
// Interact.js for kanban "entries"
// - Resizable
// - Draggable in bounds of board
//   - Saves state in element, array and local storage
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
    timeElapsed: 0,
    items: {

    }
  };

  // Save in localStorage
  set(task.id, task);
  kanbanEntries.push(task);
  
  renderTask(task);
};


/////////////////////////
// Handling general activetask section render functionality
// - 
/////////////////////////

// Initialise activetask section
function activetaskInit(task, isTypeReading){
  //DOM
  let mainEditButton = document.querySelector("#activetaskmain-editbutton");
  let timerButtons = document.querySelectorAll("#timerbuttons-container > button, #activetasktimer-buttoncontainer > button");
  let backgroundsLvl1 = document.querySelectorAll(".activetaskpanel-lvl1");
    let backgroundsLvl1a = document.querySelector(".activetaskpanel-lvl1a");

  let listItemAddButton = document.createElement("button")
  listItemAddButton.id = "activetaskmain-addbutton";
  listItemAddButton.textContent = "+";

  // Change text elements
  activeTaskMainTitle.textContent = task.taskTitle;
  activeTaskMainTopType.textContent = task.taskType;
  activeTaskMainTitleSub.innerHTML = `<span style="font-weight:600">${task.priorityRating}</span> priority`

  // Set colours
  mainEditButton.style.backgroundColor = `hsl(${task.colourCode}, 65%)`
  backgroundsLvl1a.style.backgroundColor  = `hsl(${task.colourCode}, 99%)`
  listItemAddButton.style.backgroundColor = `hsl(${task.colourCode}, 85%)`

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
  activeTaskMainListEmptySpace.appendChild(listItemAddButton);

  // Scroll down to section
  document.getElementById('activetask-container').scrollIntoView();
  // Event listeners
  // Add list item button
  listItemAddButton.addEventListener("click", function(){
    addList(task, isTypeReading);
  });

  pomodoroInit(task);
};

function addList(task, isTypeReading) {
  let identifier = Date.now().toString();
  let subId = identifier.substring((identifier.length)/2);
    console.log(subId);
    console.log(task);
  task.items[subId] = "New list item"; 
  set(task.id, task);
    console.log(task.items);
  const checklistCount = Object.keys(task.items).length;
    console.log(checklistCount);
    console.log(kanbanEntries);
  taskListRender(task, subId, isTypeReading);
};

// Initialise Pomodoro timer
function pomodoroInit(task) {
  pomTimer = new Timer({precision: 'seconds', countdown: true, startValues: {minutes: 25}});
  stopWatch = new Timer({precision: 'seconds', startValues: {minutes: task.timeElapsed}});  
  timerToComplete = new Timer({precision: 'minutes', countdown: true, startValues: {hours:task.estimatedTimeHours, minutes: task.estimatedTimeMins}});  
  
  // DOM
  // Pomodoro
  pomodoroStartBtn.addEventListener('click', function(e) {
    // Pomodoro
    pomTimer.start();
    stopWatch.start();
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
      stopWatch.start();
        // Time to complete
        timerToComplete.start();

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
  // DOM

  // Stopwatch
  stopWatch.addEventListener('secondsUpdated', function (e) {
    // Stopwatch
    document.querySelector('#activetaskstopwatch-readout > .values').textContent = `${stopWatch.getTimeValues()}`;
    task.timeElapsed++;
      // Push new elapsed time to array and push updated object to localStorage
      searchAndReplace(kanbanEntries, task, "timeElapsed");
  });
    stopwatchStartBtn.addEventListener('click', function(e) {
      // Pomodoro
      stopWatch.start();
      document.querySelector('#activetasktimer-readout > .values').textContent = `${stopWatch.getTimeValues()}`;
    });
    stopwatchPauseBtn.addEventListener('click', function(e) {
      // Stopwatch
      stopWatch.pause();
    });
    stopwatchResetBtn.addEventListener('click', function(e) {
      // Pomodoro
      stopWatch.reset();
      stopWatch.pause();
    });


  // Time to complete
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
      timerToComplete = new Timer({precision: 'minutes', countdown: true, startValues: {hours:task.estimatedTimeHours, minutes: task.estimatedTimeMins}});  
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

function taskListInit(task) {
  let isTypeReading = false;

  if(task.taskType == "Reading") {
    isTypeReading = true;
  }

  console.log(Object.keys(task.items).length);
  let increment = 0;
  // Check if we have entries
  if(Object.keys(task.items).length > 0) {
    const taskKey = Object.keys(task.items);
    console.log(taskKey);
    // Check for existing kanban entries
    for (let i=0; i < Object.keys(task.items).length; i++) {
      // Render and log id
      increment++;
      console.log(`loop no${increment}`)
      console.log(taskKey[i]);
      taskListRender(task, taskKey[i], isTypeReading);
    };
  } else {
    console.log("none found. returning to base!");
  };

  activetaskInit(task, isTypeReading);
};

// Render a list entry
function taskListRender(task, taskKey, isTypeReading) {
  console.log(task.items[taskKey]);

  // Create HTML elements
  let listItem = document.createElement("li");
  listItem.className = "tasklist-item";
    listItem.setAttribute('role', 'option');
    listItem.setAttribute('aria-checked', 'false');

  let listItemInput = document.createElement("input");
  listItemInput.className = "tasklistitem-input";
    listItemInput.setAttribute('type', 'checkbox');

  let listItemDelBtn = document.createElement("button");
  listItemDelBtn.className = "tasklistitem-delbutton";
  listItemDelBtn.textContent="✕";


  // Init vars for type reading
    let listItemInputContent;
    let listItemInputContentOpenBtn;
  // Check if this is type reading
  if( isTypeReading ) {
    // Underlined link
    listItemInputContent = document.createElement("a");
    listItemInputContent.className = "tastklistitem-content_underline";
    listItemInputContent.setAttribute('href', '');
      // Open link button
      listItemInputContentOpenBtn = document.createElement("button");
      listItemInputContentOpenBtn.className = "tasklistitem-openbutton";
      listItemInputContentOpenBtn.textContent="Open";

    // Open link on click
    listItemInputContentOpenBtn.addEventListener("click", function() {
      window.open(task.items[taskKey]);
    });
    // Open all links on click (pop-up blockers block this!!!)
    listItemOpenAllButton.addEventListener("click", function() {
      const taskKey = Object.values(task.items)
      console.log(taskKey);
      for (let i=0; i < taskKey.length; i++) {
        window.open(taskKey[i]);
      };
    });

    // Append
    listItem.appendChild(listItemInputContentOpenBtn);

    // Unhide open all button
    listItemOpenAllButton.style.display = "block";
    let allLinks = document.querySelectorAll(".tastklistitem-content_subtitle");
      
    listItemOpenAllButton.style.backgroundColor=`hsl(${task.colourCode}, 65%)`;
  } else {
    // Note instead of link
    listItemInputContent = document.createElement("h1");
    listItemInputContent.className = "tastklistitem-content";

    // Hide open all button
    listItemOpenAllButton.style.display = "none";
  };

    listItemInputContent.textContent = task.items[taskKey];
    listItemInputContent.setAttribute("contenteditable", "true");

  listItem.appendChild(listItemInput);
  listItem.appendChild(listItemInputContent);
  listItem.appendChild(listItemDelBtn);
  activeTaskMainList.appendChild(listItem);

  // Event Listeners for DOM elements
  listItemInput.addEventListener("click", function() {
    console.log("test");
  });
  listItemInput.addEventListener("click", function() {
    console.log("test");
  });
  listItemInputContent.addEventListener("input", function(){
    task.items[taskKey] = listItemInputContent.textContent;
    // Update array + local storage
    searchAndReplace3D(kanbanEntries,task,taskKey);
  });
  listItemDelBtn.addEventListener("click", function(event) {
    listItem.remove();
    delete task.items[taskKey];
    searchAndReplace(kanbanEntries, task, "items");  });

  task.items[taskKey] = listItemInputContent.textContent;
  // Update array + local storage
  searchAndReplace3D(kanbanEntries,task,taskKey);
}

/////////////////////////
// MISC
/////////////////////////

// Search in local array for matching task id, and replace in arr + localStorage
  // Only for 2D arrays
function searchAndReplace(arr, task, target) {
  for (let i=0; i < arr.length; i++) {
    if (arr[i].id == task.id) {
      arr[i][target] = task[target];
      
      set(task.id, arr[i]);
    };
  };
};
// 3D version for list.items
function searchAndReplace3D(arr, task, target) {
  for (let i=0; i < arr.length; i++) {
    if (arr[i].id == task.id) {
      arr[i].items[target] = task.items[target];

      set(task.id, arr[i]); 
    };
  };
};