// Modules
  // Lockr, for easier localStorage handling
  import { set, get, rm } from 'Lockr';
  // Easytimer, for the pomodoro timer
  import { Timer } from "easytimer.js";
  // Interact, for notes
  import interact from 'interactjs'

///
// Variables
///

// DOM variable setups
  // Dashboard
  // Archived tasks
  const dashDeldTasksList = document.querySelector("#dashdeldtasks-list");

  // Active tasks
  const dashActiveTasksList = document.querySelector("#dashactivetasks-list");

  // Taskadd form DOM
  const form = document.getElementById("taskadd-form");
  const taskAddBtn = document.getElementById("taskadd-button");
  const taskAddForm = document.getElementById("taskadd-form");
    const taskAddCnclBtn = document.getElementById("taskadd-form-cancel");
    // Taskadd data inputs
    const taskInput = document.getElementById("taskInput");
    const tasktypeInput = document.getElementById("tasktypeInput");
    const dueDateInput = document.getElementById("dueDateInput");
      // Make date input not accept past dates
      dueDateInput.setAttribute('min', `${new Date().toISOString().substring(0,10)}`);
    const estimatedTimeInputMins = document.getElementById("estimatedTimeInput-Mins");
    const estimatedTimeInputHours = document.getElementById("estimatedTimeInput-Hours");
    const priorityInput = document.getElementById("priorityInput");

  // Kanban DOM
  const board = document.getElementById("kanban-board");
  const instructionsTxt = document.querySelector(".instructions");

  // Active task DOM
  // Panel head decorations
  const activeTaskTopBig = document.querySelectorAll('.activetaskpanel-topbig');
  const activeTaskTopSmall = document.querySelectorAll('.activetaskpanel-topsmall');

  // Main panel
  const activeTaskMainTitle = document.querySelector(".activetaskmain-h1");
  const activeTaskMainTopType = document.querySelector(".activetaskpanel-topbig > h4");
  const activeTaskMainTitleSub = document.querySelector("#activetaskmainh1-priority");
  const activeTaskMainListContainer = document.querySelector("#activetaskmain-checklist");
    const activeTaskMainListEmptySpace = document.querySelector("#activetaskmain-checklistemptyspace");
  const activeTaskMainList = document.querySelector("#activetaskmain-entrypoint");
    // List
    const listItemOpenAllButton = document.querySelector("#activetaskmain-openallbutton");

  // Pomodoro timer
  const pomodoroStartBtn = document.querySelector('#timerbuttons-container > .startButton');
  const pomodoroPauseBtn = document.querySelector('#timerbuttons-container > .pauseButton');
  const pomodoroResetBtn = document.querySelector('#timerbuttons-container > .resetButton');

  // Time elapsed panel
  const stopwatchStartBtn = document.querySelector('#activetaskstopwatch-buttoncontainer > .startButton');
  const stopwatchPauseBtn = document.querySelector('#activetaskstopwatch-buttoncontainer > .pauseButton');
  const stopwatchResetBtn = document.querySelector('#activetaskstopwatch-buttoncontainer > .resetButton');

  // Time to complete panel
  const activeTaskTimerDueDate = document.querySelector("#activetasktimer-due > p");
    const timerAdd1HrBtn = document.querySelector('#activetasktimerreadout-buttonadd1h');
    const timerAdd10MinsBtn = document.querySelector('#activetasktimerreadout-buttonadd10m');

  // Pomodoro edit panel
  const activeTaskPomEditList = document.querySelector("#activetaskmainpomedit-entrypoint");
    
  // Kanban data
  var kanbanBoard = [];
  var kanbanEntries = [];
  var kanbanArchivedEntries = [];

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

  // Create some hide/reveal dropdown buttons
  // Pomodoro edit panel
  let activeTaskPomEditBtnTest = true;
  const activeTaskPomEditBtn = document.querySelector("#activetaskmainpomedit-revealbutton")
  const activeTaskMainPomEdit = document.querySelector("#activetaskmain-pomeditlist")
    activeTaskPomEditBtn.addEventListener("click", function() {
    if(activeTaskPomEditBtnTest == true) {
      activeTaskMainPomEdit.style.height = "15px"
      activeTaskMainPomEdit.style.overflowY = "hidden"
      activeTaskPomEditBtnTest = false;
      activeTaskPomEditBtn.textContent = "◂"
    } else {
      activeTaskMainPomEdit.style.height = "200px"
      activeTaskMainPomEdit.style.overflowY = "scroll"
      activeTaskPomEditBtnTest = true;
      activeTaskPomEditBtn.textContent = "▾"
    }
  });
  // Dashboard active tasks
  let dashActiveTasksBtnTest = true;
  const dashActiveTasksBtn = document.querySelector("#dashactivetasks-revealbutton");
  const dashActiveTasks = document.querySelector("#dashactivetasks")
    dashActiveTasksBtn.addEventListener("click", function() {
      if(dashActiveTasksBtnTest == true) {
        dashActiveTasks.style.height = "15px"
        dashActiveTasks.style.overflowY = "hidden"
        dashActiveTasksBtnTest = false;
        dashActiveTasksBtn.textContent = "◂"
      } else {
        dashActiveTasks.style.height = "250px"
        dashActiveTasks.style.overflowY = "scroll"
        dashActiveTasksBtnTest = true;
        dashActiveTasksBtn.textContent = "▾"
      }
    });
  // Dashboard archived tasks
  let dashDeldTasksBtnTest = true;
  const dashDeldTasksBtn = document.querySelector("#dashdeldtasks-revealbutton")
  const dashDeldTasks= document.querySelector("#dashdeldtasks")
    dashDeldTasksBtn.addEventListener("click", function() {
      if(dashDeldTasksBtnTest == true) {
        dashDeldTasks.style.height = "15px"
        dashDeldTasks.style.overflowY = "hidden"        
        dashDeldTasksBtnTest = false;
        dashDeldTasksBtn.textContent = "◂"
      } else {
        dashDeldTasks.style.height = "150px"
        dashDeldTasks.style.overflowY = "scroll"        
        dashDeldTasksBtnTest = true;
        dashDeldTasksBtn.textContent = "▾"
      }
    });
  // Header contextmenu
  let headerBtnTest = false;
  const headerBtn = document.querySelector("#header-contextmenu")
  const dashBoard = document.querySelector("#dashboard")
  headerBtn.addEventListener("click", function() {
    if(headerBtnTest == true) {
      dashBoard.style.display = "none"       
      headerBtnTest = false;
      //dashDeldTasksBtn.textContent = "◂"
    } else {
      dashBoard.style.display = "block"
      headerBtnTest = true;
      //dashDeldTasksBtn.textContent = "▾"
    }
  });
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
      console.log(kanbanEntries[i]);
      if(kanbanEntries[i].active == true) {
        addActiveItem(kanbanEntries[i]);
      }
      // Render entry and inherit object
      renderTask(kanbanEntries[i]);
    }
  });
};



// Render columns, testIfNew determintes if we're initialising or adding a new one
function kanbanRenderColumn(i, testIfNew){
  // Create HTML elements
  // Column div
  const column = document.createElement('div');
  column.setAttribute('class','kanban-column'); 

  // Title taken from array
  const columnTitle = document.createElement("h1");
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
  const columnDiv = document.createElement("div");
  const columnAddBtn = document.createElement("button");
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
  const columnDelBtn = document.createElement("button");
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
  const item = document.createElement("div");
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
  const itemHead = document.createElement("div");
  itemHead.setAttribute('style', `background-color: hsl(${task.colourCode}, 75%)`);
    itemHead.className = 'kanban-entryheader';

  // Text div
  const itemTxtContainer = document.createElement("div");
    itemTxtContainer.className = 'kanban-entry-textcontainer';

      // Title 
      const title = document.createElement("h4");
        title.className = 'kanban-entry-title';
        title.textContent = task.taskTitle; 

      // Due date
      const duedate = document.createElement("p");
        duedate.className = 'kanban-entry-duedate';
        duedate.innerHTML = `<span style="font-weight:500">Due</span>: ${(task.dueDate).substring(5)}`;

      // Priority
      const priority = document.createElement("p");
        priority.className = 'kanban-entry-priority';
        priority.innerHTML = `<span style="font-weight:500">Priority</span>: ${task.priorityRating}`;

  // Extra Task DOM elements
  const delButton = document.createElement("button");
  delButton.textContent = "✕";
    delButton.classname = 'kanban-entrybutton';

  const activateButton = document.createElement("button");
  activateButton.textContent = "activate";
    activateButton.classname = 'kanban-entrybutton';
  
  item.appendChild(itemHead);
  item.appendChild(itemTxtContainer);
    itemTxtContainer.appendChild(title);
    itemTxtContainer.appendChild(duedate);
    itemTxtContainer.appendChild(priority);

  itemHead.appendChild(delButton);
  itemHead.appendChild(activateButton);

  // Event Listeners for DOM elements
  delButton.addEventListener("click", function(event){
    event.preventDefault();
    const id = event.target.parentElement.getAttribute('data-id');
    const index = kanbanEntries.findIndex(
      task => task.id === Number(id)
    );

    //console.log(isTaskInActiveList(id, true))
    isTaskInActiveList(task.id, true);

    item.remove();
    removeItem(task, index);
  });
  activateButton.addEventListener("click", function(event){
    console.log("test")
    activeTaskMainList.innerHTML="";
    activeTaskMainListEmptySpace.innerHTML="";
    task.active = true;
    if(isTaskInActiveList(task.id, false) == false) {
      addActiveItem(task);
    }

    taskListInit(task);

    searchAndReplace(kanbanEntries, task, "active");
  });

  // Append new entry to board
  board.appendChild(item);

  // Clear the input form
  form.reset();
}

// Add active task to active list (unfinished)
function addActiveItem(task) {
  // DOM
  const activeListItem = document.createElement("li");
  activeListItem.className = "dashactivetasks-item"
    activeListItem.setAttribute('data-id', task.id);
    activeListItem.style.backgroundColor = `hsl(${task.colourCode}, 80%)`;

  const activeListItemHead = document.createElement("h4");
    activeListItemHead.textContent = task.taskTitle;
    const activeListItemDueDate = document.createElement("p");
    activeListItemDueDate.innerHTML = `<span style="font-weight:500">Due</span>: ${task.dueDate.substring(5)}`;
    const activeListItemTimeElapsed = document.createElement("h7");
    activeListItemTimeElapsed.textContent = `${Math.floor(task.timeElapsed / 3600)}:${Math.floor(task.timeElapsed / 60)} elapsed`;

  const activeListItemDelBtn = document.createElement("button");
  activeListItemDelBtn.textContent = "✕";

  // Add event listener
  activeListItemDelBtn.addEventListener("click", function(event){
    event.preventDefault();
    activeListItem.remove();
    task.active = false;
    searchAndReplace(kanbanEntries, task, "active");
  });

  activeListItem.appendChild(activeListItemHead);
  activeListItem.appendChild(activeListItemDelBtn);
  activeListItem.appendChild(activeListItemDueDate);
  activeListItem.appendChild(activeListItemTimeElapsed);
  dashActiveTasksList.appendChild(activeListItem);
}

// Remove deleted task from array + local storage, and do the same for corresponding checklist 
function removeItem(task, index) {
  if (index > -1){
    kanbanEntries.splice(index, 1);
  }
  rm(task.id);
  archiveItem(task);
}

// Add deleted task to archived list 
function archiveItem(task) {
  task.active = false;
  // DOM
  const archiveListItem = document.createElement("li");
  archiveListItem.className = "dashdeldtasks-item"
  archiveListItem.style.backgroundColor = `hsl(${task.colourCode}, 80%)`;

  const archiveListItemHead = document.createElement("h4");
    archiveListItemHead.textContent = task.taskTitle;
    const archiveListItemDueDate = document.createElement("p");
    archiveListItemDueDate.innerHTML = `<span style="font-weight:500">Due</span>: ${task.dueDate.substring(5)}`;

  const archiveListItemRestoreBtn = document.createElement("button");
  archiveListItemRestoreBtn.textContent = "Restore";
    archiveListItemRestoreBtn.style.backgroundColor = `hsl(${task.colourCode}, 65%)`;

  // Add event listener
  archiveListItemRestoreBtn.addEventListener("click", function(event){
    event.preventDefault();
    archiveListItem.remove();
    renderTask(task);
  });

  archiveListItem.appendChild(archiveListItemHead);
  archiveListItem.appendChild(archiveListItemDueDate);
  archiveListItem.appendChild(archiveListItemRestoreBtn);
  dashDeldTasksList.appendChild(archiveListItem);
}


/////////////////////////
// Handling interact.js code for interactables
// - Code from demos (https://interactjs.io/)
/////////////////////////



// Interact for sticky notes, resizable and draggable
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
// Double tap changes colour
interact('.kanban-entry-textcontainer')
  .on('doubletap', function (event) {
    console.log(localStorage)

    event.preventDefault()
    // Push new coords to array and push updated object to localStorage
    for (let i=0; i < kanbanEntries.length; i++) {
      if (kanbanEntries[i].id == event.target.parentNode.getAttribute('data-id')) {
        kanbanEntries[i].colourCode = `${Math.random() * 360}, ${Math.random() * 100}%`,
          event.target.parentNode.style.backgroundColor = `hsl(${kanbanEntries[i].colourCode}, 80%)`;
          event.target.parentNode.querySelector('.kanban-entryheader').style.backgroundColor = `hsl(${kanbanEntries[i].colourCode}, 75%)`;
        
        const activetaskList = document.querySelectorAll(".dashactivetasks-item")
        if(kanbanEntries[i].active == true) {
          for (let i=0; i < activetaskList.length; i++) {
            if (activetaskList[i].getAttribute('data-id') == event.target.parentNode.getAttribute('data-id')) {
              activetaskList[i].style.backgroundColor = `hsl(${kanbanEntries[i].colourCode}, 80%)`;
            }
          }
        }
        set(event.target.parentNode.getAttribute('data-id'), kanbanEntries[i]);
      };
    };
    console.log(localStorage)
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
    // Checklist items
    items: {

    },
    pomodoroSetup: [
      {type:'work', time:25},
      {type:'break', time:5},
      {type:'work', time:25},
      {type:'break', time:5},
      {type:'work', time:25},
      {type:'break', time:5},
      {type:'work', time:25},
      {type:'break', time:30},
    ]
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

// Initialise Pomodoro Edit box
function initPomEdit(task, pos) {
  const pomListItem = document.createElement("li");
  const pomListItemHead = document.createElement("h4");
  const pomListItemMins = document.createElement("input");
    pomListItemMins.setAttribute("type", "number");
    pomListItemMins.setAttribute("min", "0");
    pomListItemMins.setAttribute("max", "59");
    pomListItemMins.className = "pomedititem-input"
  const pomListItemMinsTxt = document.createElement("p");
    pomListItemMinsTxt.textContent = "mins";

    if((task.pomodoroSetup[pos]).type == "work") {
      pomListItem.className = "pomedititem-work";
      pomListItem.style.boxShadow = "inset 0px 3px 8px #00000029"
      pomListItemHead.textContent = "Work";
    } else {
      pomListItem.className = "pomedititem-break";
      pomListItemHead.style.fontStyle = "italic";
      pomListItemHead.textContent = "Break";
    };

  // Add event listeners
  pomListItemMins.addEventListener("input", function(event){
    event.preventDefault();
    (task.pomodoroSetup[pos]).time = parseInt(pomListItemMins.value);
    //console.log(parseInt(pomListItemMins.value))

    for (let i=0; i < kanbanEntries.length; i++) {
      if (kanbanEntries[i].id == task.id) {
        kanbanEntries[i].pomodoroSetup = task.pomodoroSetup;
          
        set(task.id, kanbanEntries[i]);
      };
    };
    console.log((task.pomodoroSetup[pos]).time);
  });

  pomListItemMins.setAttribute("placeholder", (task.pomodoroSetup[pos]).time);
  pomListItem.appendChild(pomListItemHead);
  pomListItem.appendChild(pomListItemMins);
  pomListItem.appendChild(pomListItemMinsTxt);
  activeTaskPomEditList.appendChild(pomListItem);
};

// Initialise activetask section
function activetaskInit(task, isTypeReading){
  //DOM
  const mainEditButton = document.querySelector("#activetaskmain-editbutton");
  const timerButtons = document.querySelectorAll("#timerbuttons-container > button, #activetasktimer-buttoncontainer > button,#activetaskstopwatch-buttoncontainer > button");
  const backgroundsLvl1 = document.querySelectorAll(".activetaskpanel-lvl1");
    const backgroundsLvl1a = document.querySelector(".activetaskpanel-lvl1a");

  const listItemAddButton = document.createElement("button")
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

  for (let i=0; i < (task.pomodoroSetup).length; i++){
    //console.log((task.pomodoroSetup).length);
    initPomEdit(task, i);
  }

  // Begin pomodoro with first timeslot
  let activePomSlot = 0;
  pomodoroInit(task, activePomSlot);
  // Then the other timers
  otherTimersInit(task);
};

function addList(task, isTypeReading) {
  const identifier = Date.now().toString();
  const subId = identifier.substring((identifier.length)/2);
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
function pomodoroInit(task, activePomSlot) {
  const pomSlots = document.querySelectorAll("#activetaskmainpomedit-entrypoint > .pomedititem-work, .pomedititem-break");

  // Initialise timer func, update textContent
  pomTimer = new Timer({precision: 'seconds', countdown: true, startValues: {minutes: (task.pomodoroSetup[activePomSlot]).time}});
    const pomTimerValues = document.querySelector('#maintimer > .values');
    pomTimerValues.textContent = `${pomTimer.getTimeValues()}`;
    pomSlots[activePomSlot].style.backgroundColor = "#dbdbdb";
  
  // DOM
  // Pomodoro
  pomodoroStartBtn.addEventListener('click', function(e) {
    // Pomodoro
    pomTimer.start();
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
    pomTimerValues.textContent = `${pomTimer.getTimeValues()}`;
  });

  pomTimer.addEventListener('started', function (e) {
      // Stopwatch
      stopWatch.start();
        // Time to complete
        timerToComplete.start();
  });
  
  pomTimer.addEventListener('reset', function (e) {
    // Pomodoro
    pomTimerValues.textContent = `${pomTimer.getTimeValues()}`;
  });

  // Cycle through to next slot
  pomTimer.addEventListener('targetAchieved', function (e) {
    pomSlots[activePomSlot].style.backgroundColor = "#ffffff";

    // Increment timeslot, reset if it's bigger than the amount of slots
    activePomSlot++;
    if(activePomSlot > (task.pomodoroSetup).length) {
      activePomSlot = 0
    }
    // Refresh pomodoro
    pomodoroInit(task,activePomSlot)

    // Set textContent and background colour
    pomTimerValues.textContent = `${pomTimer.getTimeValues()}`;
    pomSlots[activePomSlot].style.backgroundColor = "#dbdbdb";
  });
}

// Initialise other timers
function otherTimersInit(task) {
  // Initalise timer funcs, update textContent
  stopWatch = new Timer({precision: 'seconds', startValues: {minutes: task.timeElapsed}});  
  const stopWatchValues = document.querySelector('#activetaskstopwatch-readout > .values');
    document.querySelector('#activetaskstopwatch-readout > .values').textContent = `${stopWatch.getTimeValues()}`;
  timerToComplete = new Timer({precision: 'minutes', countdown: true, startValues: {hours:task.estimatedTimeHours, minutes: task.estimatedTimeMins}});  
    const timerToCompleteValues = document.querySelector('#activetasktimer-readout > .values');
    timerToCompleteValues.textContent = `${timerToComplete.getTimeValues()}`;
    // If our time to complete amounts to days, add 'x' days above the readout
    if (timerToComplete.getTimeValues().days > 0) {
      console.log(timerToComplete.getTimeValues().days);
      document.querySelector('#activetasktimer-readout-days').textContent = `${timerToComplete.getTimeValues().days} days`;
    } 

  // DOM
  // Stopwatch
  stopWatch.addEventListener('secondsUpdated', function (e) {
    // Stopwatch
    stopWatchValues.textContent = `${stopWatch.getTimeValues()}`;
    task.timeElapsed++;
      // Push new elapsed time to array and push updated object to localStorage
      searchAndReplace(kanbanEntries, task, "timeElapsed");
  });
    stopwatchStartBtn.addEventListener('click', function(e) {
      // Pomodoro
      stopWatch.start();
    });
    stopwatchPauseBtn.addEventListener('click', function(e) {
      // Stopwatch
      stopWatch.pause();
    });
    stopwatchResetBtn.addEventListener('click', function(e) {
      // Pomodoro
      stopWatch.reset();
      stopWatch.pause();
      stopWatchValues.textContent = `${stopWatch.getTimeValues()}`;
      task.timeElapsed = 0;
        // Push new elapsed time to array and push updated object to localStorage
        searchAndReplace(kanbanEntries, task, "timeElapsed");
    });


  // Time to complete
  timerToComplete.addEventListener('minutesUpdated', function (e) {
    // Update
    timerToCompleteValues.textContent = `${timerToComplete.getTimeValues()}`;

    // Check if our timer has run out
    // First see if we're at 0 mins
    if(task.estimatedTimeMins <= 0) {
      // If we're not at 0 hours
      if(task.estimatedTimeHours > 0) {
        // Subtract an hour and get mins to 59
        task.estimatedTimeHours--;
        task.estimatedTimeMins = 59;
        // Push new elapsed time to array and push updated object to localStorage
        searchAndReplace(kanbanEntries, task, "estimatedTimeHours");
        searchAndReplace(kanbanEntries, task, "estimatedTimeMins");
      }
    // If we're not at 0 mins, subtract a min
    } else {
      task.estimatedTimeMins--;
      // Push new elapsed time to array and push updated object to localStorage
      searchAndReplace(kanbanEntries, task, "estimatedTimeMins");
    };
  });

    timerAdd10MinsBtn.addEventListener('click', function(e) {
      task.estimatedTimeMins += 10;
      // Push new elapsed time to array and push updated object to localStorage
      searchAndReplace(kanbanEntries, task, "estimatedTimeMins");
      timerToComplete = new Timer({precision: 'minutes', countdown: true, startValues: {hours:task.estimatedTimeHours, minutes: task.estimatedTimeMins}});  
      timerToCompleteValues.textContent = `${timerToComplete.getTimeValues()}`;
    });
    timerAdd1HrBtn.addEventListener('click', function(e) {
      task.estimatedTimeHours++;
      // Push new elapsed time to array and push updated object to localStorage
      searchAndReplace(kanbanEntries, task, "estimatedTimeMins");
      timerToComplete.start({precision: 'minutes', countdown: true, startValues: {hours:task.estimatedTimeHours, minutes: task.estimatedTimeMins}});  
      timerToCompleteValues.textContent = `${timerToComplete.getTimeValues()}`;
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
      console.log(`loop no${increment}`);
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
  const listItem = document.createElement("li");
  listItem.className = "tasklist-item";
    listItem.setAttribute('role', 'option');
    listItem.setAttribute('aria-checked', 'false');

  const listItemInput = document.createElement("input");
  listItemInput.className = "tasklistitem-input";
    listItemInput.setAttribute('type', 'checkbox');

  const listItemDelBtn = document.createElement("button");
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
    searchAndReplace(kanbanEntries, task, "items");  
  });

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

function isTaskInActiveList(id, removeNode) {
  const currentActiveTasks = document.querySelectorAll("#dashactivetasks-list > .dashactivetasks-item");
  let isTaskInActiveList = false;

  for(i=0;i<currentActiveTasks.length;i++) {
    //console.log(currentActiveTasks[i])
    if(currentActiveTasks[i].getAttribute('data-id') == id) {
      isTaskInActiveList = true;
      if(removeNode==true) {
        currentActiveTasks[i].remove();
      }      
    }; 
  };



  return isTaskInActiveList;
};