# studbud

### Mockups

## Desktop

![Mockup - desktop](/doc/images/mockup/Desktop_Active.png)

![Mockup - desktop](/doc/images/mockup/Desktop_Board.png)

## Mobile

![Mockup - mobile](/doc/images/mockup/Mobile_Active.png)

![Mockup - mobile](/doc/images/mockup/Mobile_Board.png)


## Prototype 1

*Initial HTML + CSS*

### Colours

This was the first prototype I decided to assess, essentially a reproduction of the board mockup without functionality. At around this stage, I tested many different colour schemes, however I found that the 'pin-up board' orange-yellow hues of the mockup were the most appropriate. 

![Protoype 1A, kanban board with columns and add task menu](/doc/images/Proto4.png)

One thing I was particularly intent on keeping was the idea of a gradient that would fade between brown to white, to indicate the change in section from the kanban board to the active task

![Protoype 1B, active task section showing the gradient](/doc/images/Proto4a.png)

### Feedback

I sat one user down to guage their opinions on both the mockup and the prototype. Although scripting and CSS were far from complete at this stage, the mockup gave them a sense of how the website app would function. Feedback was very positive, they liked the colour scheme and freedom although they noted that they strongly indicated that the music panel was "filler", and that they would always prefer to use their own music app rather than the panel. One thing they asked I hadn't considered was where tasks that were deleted would go. So, I came up with the archived task list, in case users wanted to get back deleted tasks (e.g. if they accidentally clicked close).

## Prototype 2

*Further refinement and beginnings of JS*

### Dropdown buttons, headers & more

A problem with the mockup I realised during development was that, with all the differently coloured active or archived task entries, the dashboard could create serious visual clutter for the user. To alleviate this, I added dropdown buttons for the lists to minimise them on press.

![Prototype 2A](/doc/images/Proto5.png)

To maintain visual consistency (as the active task panels already had them) as well as differentiation of information sections, I added coloured bar headers to each of the panels.

![Prototype 2B](/doc/images/Proto6.png)

In addition to this, when I was starting the JS around this time I also gave the the task 'sticky note' a header bar, which would hold a delete (in the mockup design, the delete button would appear on hover, which in hindsight could have resulted in accidental clicks) and activate button. This differentiated the draggable part of the note and the controls, and removed the ambiguity of clicking on the panel to activate vs dragging on the panel to move. And To reduce clutter, I excised elapsed time from the note box (present in the mockup), and added a line at the bottom which would help guide reading between the priority and task info information parts.

Note the instructions text to teach the user which appears on first logon. 

### The notes

It was around this time that I experimented with a few different methods for dragging notes and reorganising the board. Initially in the mockup, notes would have stuck to a column, but I realised in hindsight this didn't track with the concentration on freedom I had outlined in the brief, so I allowed the notes to be completely free in movement, in the bounds of the board. This would create a few different design considerations later.

# Final

*Completed prototype*

## Desktop

At some stage, I decided to add buttons for adding 1h/10m to the time-to-completion timer, to give the users more control over their tasks. 

![Final - desktop](/doc/images/Proto11a.png)

![Final - desktop](/doc/images/Proto11b.png)

## Mobile

One necessary change I had to take into account with the freer note system was that the mockup's grouped notes were no longer possible on mobile, as positions could not be saved by column, and so instead I opted for a scrollable board.

![Final - mobile](/doc/images/Proto11aM.png)

![Final - mobile](/doc/images/Proto11bM.png)


# References
González, A. (2022). Easytimer.js source code (Version 4.5.3) [JavaScript library]. https://github.com/albert-gonzalez/easytimer.js/ [Modified]

Tsironis, D. (2018). Lockr source code (Version 0.8.5) [JavaScript library]. https://github.com/tsironis/lockr 

Adeyemi, T. (2022). Interact.js source code [JavaScript library]. https://github.com/taye/interact.js/ 

Comeau, J. (2021). My Custom CSS Reset [CSS Reset]. https://www.joshwcomeau.com/css/custom-css-reset/

MacLeod, K. (2015). Relaxing Piano Music. [MP3]. Germany: Filmmusic. Retrieved from https://incompetech.filmmusic.io/song/4273-relaxing-piano-music License: https://filmmusic.io/standard-license