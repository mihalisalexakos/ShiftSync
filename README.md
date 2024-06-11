<h1>ShiftSync Website</h1>

<img width="1889" alt="Screenshot 2024-06-12 at 01 08 37" src="https://github.com/mixalissan/ShiftSync/assets/93053477/022b13a2-7498-4a92-8251-f51b08e19ac2">
<img width="1891" alt="Screenshot 2024-06-12 at 01 04 06" src="https://github.com/mixalissan/ShiftSync/assets/93053477/02666a3c-bc75-4595-996f-599c611847ad">
<img width="1890" alt="Screenshot 2024-06-12 at 01 08 10" src="https://github.com/mixalissan/ShiftSync/assets/93053477/a1b83314-2a6b-4004-bd5c-9563ed14117b">
<img width="1892" alt="Screenshot 2024-06-12 at 01 03 53" src="https://github.com/mixalissan/ShiftSync/assets/93053477/15f54a34-2f7c-4e5c-b67e-1509b5a9d56f">
<img width="1891" alt="Screenshot 2024-06-12 at 01 08 18" src="https://github.com/mixalissan/ShiftSync/assets/93053477/25ffa212-5e43-49c0-af06-d4ecea2451ee">


HOW TO RUN:

The following are needed for website to function:<br>
Node js<br>
express<br>
body-parser<br>
express-session<br>
mysql2<br>
<br>
and then run: "node server.js" at the location of the shiftsync folder.


HTML 

<h3>Sign-in.html</h3>
Includes form that lets user type in their username and passoword information. Form data is sent to
client.js and then to server.js who confirms the login information

<h3>Index.html</h3>
Acts as landing page of website, the overview and profile page of the logged in user.
Contains relevant information like the latest upcoming shifts and latest alerts from employees

<h3>Calendar.html</h3>
Is split into left and right parts. The left part contains the calendar which shows an entire month
and has indicators on days that have shifts occuring. On the right part there are 3 buttons. 

1) First button allows users to create new shifts and assign them to specific employees.

2) Second button shows shifts that occur on a day that has been selected on the calendar.
   Shifts are clickable and expand on the left side of the screen to display further information.

3) Third button shows a list of employees that are available for a shift. 
   The user can click one button and the shift will be assigned to that employees

<h3>Alerts.html</h3>
Displays a stack of alerts sent in from employees, sorted in chronological order

<h3>Support.html</h3>
Shows legal info and contact information about the website and shiftsync


<h2>CSS</h2>

style.css contains general css rules that apply to all pages, the rest of the css files are responsible for styling
one html page each


<h2>JAVASCRIPT</h2>

<h3>Server.js</h3>
Responsible for creating the node js server of the website, connecting to the SQL database, 
and verifying log in information of website visitors.
Downloads tables from the database and sends them to client.js. 
Receives new data from client.js and uploads it to database

<h3>Client.js</h3>
Client side of node js server, responsible for sending log in form data to server.js,
keeping the user logged in as they switch to different pages of the website (is done by using the ID of the user as an URL parameter that 
is passed on from page to page), updating index.html with html elements that contain data from the database, and communicating
with the script.js file

<h3>Script.js</h3>
Javascript file that is tied only to calendar.html. Responsible for handling the backend of the calendar itself on the left side of the page,
assigns events to specific days, makes sure the correct events are displayed when a date is selected, handles the creation of new shifts,
automatically assigns shifts from the requests tab. Script.js does not directly communicate with the server.js file, and therefore does not
directly communicate with the SQL database. When transpotation of data is needed, script.js communicates either directly with client.js using
export functions, or indirectly by uploading/downloading data to/from localStorage.
