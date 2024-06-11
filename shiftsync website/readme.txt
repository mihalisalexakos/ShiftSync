ShiftSync Website

HOW TO RUN:

The following are needed for website to function:
Node js 
express
body-parser
express-session
mysql2

and then run: "node server.js" at the location of the shiftsync folder.


HTML 

Sign-in.html
Includes form that lets user type in their username and passoword information. Form data is sent to
client.js and then to server.js who confirms the login information

Index.html
Acts as landing page of website, the overview and profile page of the logged in user.
Contains relevant information like the latest upcoming shifts and latest alerts from employees

Calendar.html
Is split into left and right parts. The left part contains the calendar which shows an entire month
and has indicators on days that have shifts occuring. On the right part there are 3 buttons. 

1) First button allows users to create new shifts and assign them to specific employees.

2) Second button shows shifts that occur on a day that has been selected on the calendar.
   Shifts are clickable and expand on the left side of the screen to display further information.

3) Third button shows a list of employees that are available for a shift. 
   The user can click one button and the shift will be assigned to that employees

Alerts.html
Displays a stack of alerts sent in from employees, sorted in chronological order

Support.html
Shows legal info and contact information about the website and shiftsync


CSS

style.css contains general css rules that apply to all pages, the rest of the css files are responsible for styling
one html page each


JAVASCRIPT

Server.js
Responsible for creating the node js server of the website, connecting to the SQL database, 
and verifying log in information of website visitors.
Downloads tables from the database and sends them to client.js. 
Receives new data from client.js and uploads it to database

Client.js
Client side of node js server, responsible for sending log in form data to server.js,
keeping the user logged in as they switch to different pages of the website (is done by using the ID of the user as an URL parameter that 
is passed on from page to page), updating index.html with html elements that contain data from the database, and communicating
with the script.js file

Script.js
Javascript file that is tied only to calendar.html. Responsible for handling the backend of the calendar itself on the left side of the page,
assigns events to specific days, makes sure the correct events are displayed when a date is selected, handles the creation of new shifts,
automatically assigns shifts from the requests tab. Script.js does not directly communicate with the server.js file, and therefore does not
directly communicate with the SQL database. When transpotation of data is needed, script.js communicates either directly with client.js using
export functions, or indirectly by uploading/downloading data to/from localStorage.