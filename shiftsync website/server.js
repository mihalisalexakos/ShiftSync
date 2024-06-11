
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql2');

const app = express();
const port = 3000;

app.use(express.static('public'));


// Create MySQL connection
const con = mysql.createConnection({
  host: "localhost",
  user: "root",        // change according to your database info
  password: "mixalis19101985",    // change according to your database info
  database: "sys"  // change according to your database info
});


// Arrays that store data from tables
var employeeData = [];  // employeedetails table
var alertData = [];     // alert table
var availData = [];     // availability table
var shiftData = [];     // shifts table


// Establish a connection to the MySQL database
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected to MySQL!");

  // EMPLOYEE-DETAILS data

  con.query("SELECT * FROM employeedetails", function(err, result, fields) {
    if (err) throw err;

    if (result.length === 0) {
      console.log("No data found in table employeedetails :D");
    } else {
      result.forEach(function(employee) {
        const emplObject = {
          EmployeeID: employee.EmploeyID,
          FirstName: employee.FirstName,
          LastName: employee.LastName,
          PhoneNumber: employee.PhoneNumber,
          employee_username: employee.employee_username,
          employee_password: employee.employee_passowrd
        };
        employeeData.push(emplObject);
      });
      // console.log(employeeData); 
    }
  });

  // ALERT data

  con.query("SELECT * FROM alert", function(err, result, fields) {
    if (err) throw err;

    if (result.length === 0) {
      console.log("No data found in table alert :D");
    } else {
      result.forEach(function(alert) {
        const emplObject = {
          EmployeeID: alert.EmploeyID,
          ReportID: alert.reportID,
          ReportText: alert.reportText
        };
        alertData.push(emplObject);
      });
      // console.log(alertData); 
    }
  });

  // AVAILABILITY data
  
  con.query("SELECT * FROM availability", function(err, result, fields) {
    if (err) throw err;

    if (result.length === 0) {
      console.log("No data found in table availability :D");
    } else {
      result.forEach(function(avail) {
        const emplObject = {
          EmployeeID: avail.EmploeyID,
          Date: avail.date,
          StartTime: avail.StartTime,
          EndTime: avail.EndTime
        };
        availData.push(emplObject);
      });
    }
  });

  // SHIFT data

  con.query("SELECT * FROM shifts", function(err, result, fields) {
    if (err) throw err;

    if (result.length === 0) {
      console.log("No data found in table shifts :D");
    } else {
      result.forEach(function(shift) {
        const emplObject = {
          EmployeeID: shift.EmploeyID,
          Date: shift.data,
          ShiftID: shift.ShiftID,
          StartTime: shift.StartTime,
          EndTIme: shift.EndTime
        };
        shiftData.push(emplObject);
      });
      // console.log(shiftData); 
    }
  });


  // after data from database has been retrieved we start up server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}\n type in: http://localhost:3000/sign-in.html`);
  });
        
});


// Session middleware
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

// Login route
app.post('/login', (req, res) => {
  const { uname, psw } = req.body;

  // Check if the username and password match with any user data previously fetched from the database
  const user = employeeData.find(user => user.employee_username === uname && user.employee_password === psw);
  console.log("username provided:" + uname + " password provided: " + psw);
  
  if (user) {
    // User authenticated
    req.session.user = user;
    console.log(`/index.html?employeeID=${user.EmployeeID}`);
    res.status(200).json({ employeeID: user.EmployeeID });
  } else {
    // Authentication failed
    console.log("invalid credentials!")
    res.status(401).send('Invalid username or password');
  }
});


app.get('/employeeData', (req, res) => {
  // Fetch employee data from the database
  con.query("SELECT * FROM employeedetails", function(err, result, fields) {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    const employeeData = result.map(employee => ({
      EmployeeID: employee.EmploeyID,
      FirstName: employee.FirstName,
      LastName: employee.LastName,
      PhoneNumber: employee.PhoneNumber,
      employee_username: employee.employee_username,
      employee_password: employee.employee_passowrd
    }));
    res.json(employeeData);
  });
});

// Route to send alert data to client
app.get('/alertData', (req, res) => {
  // Fetch alert data from the database
  con.query("SELECT * FROM alert", function(err, result, fields) {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    const alertData = result.map(alert => ({
      EmployeeID: alert.EmploeyID,
      ReportID: alert.reportID,
      ReportText: alert.reportText
    }));
    res.json(alertData);
  });
});

// Route to send availability data to client
app.get('/availData', (req, res) => {
  // Fetch availability data from the database
  con.query("SELECT * FROM availability", function(err, result, fields) {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    const availData = result.map(avail => ({
      EmployeeID: avail.EmploeyID,
      Date: avail.date,
      StartTime: avail.StartTime,
      EndTime: avail.EndTime
    }));
    res.json(availData);
  });
});

// Route to send shift data to client
app.get('/shiftData', (req, res) => {
  // Fetch shift data from the database
  con.query("SELECT * FROM shifts", function(err, result, fields) {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    const shiftData = result.map(shift => ({
      EmployeeID: shift.EmploeyID,
      Date: shift.Data,
      ShiftID: shift.ShiftID,
      StartTime: shift.StartTime,
      EndTime: shift.EndTime
    }));
    res.json(shiftData);
  });
});

// Route to send report data to client
app.get('/reportData', (req, res) => {
  // Fetch report data from the database
  con.query("SELECT * FROM report", function(err, result, fields) {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    const reportData = result.map(report => ({
      EmployeeID: report.EmploeyID,
      CommentID: report.CommentID,
      CommentText: report.CommentText,
      Date: report.CommentDate,
      stock: report.stock,
      sales: report.sales,
      ShiftID: report.ShiftID
    }));
    res.json(reportData);
  });
});


app.delete('/deleteAvailability/:availID', (req, res) => {
  const availID = req.params.availID;

  con.query("DELETE FROM availability WHERE availID = ?", [availID], function(err, result) {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    if (result.affectedRows > 0) {
      res.status(200).send(`Availability with ID ${availID} deleted successfully`);
    } else {
      res.status(404).send(`Availability with ID ${availID} not found`);
    }
  });
});

app.delete('/deleteAvailability', (req, res) => {
  const { EmployeeID, StartTime } = req.query;

  console.log("we have entered here in the delete")
  if (!EmployeeID || !StartTime) {
    res.status(400).send('EmploeyID and StartTime are required');
    return;
  }

  const query = "DELETE FROM availability WHERE EmploeyID = ? AND StartTime = ?";
  const values = [EmployeeID, StartTime];
  console.log("i am here idk");
  con.query(query, values, function(err, result) {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    if (result.affectedRows > 0) {
      res.status(200).send(`Availability for EmploeyID ${EmployeeID} and StartTime ${StartTime} deleted successfully`);
    } else {
      res.status(404).send(`Availability for EmploeyID ${EmployeeID} and StartTime ${StartTime} not found`);
    }
  });
});

// Route to send all data to the client
app.get('/allData', (req, res) => {
  con.query("SELECT * FROM employeedetails", function(err, resultEmployee, fieldsEmployee) {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    con.query("SELECT * FROM alert", function(err, resultAlert, fieldsAlert) {
      if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
        return;
      }

      con.query("SELECT * FROM availability", function(err, resultAvail, fieldsAvail) {
        if (err) {
          console.log(err);
          res.status(500).send('Internal Server Error');
          return;
        }

        con.query("SELECT * FROM shifts", function(err, resultShift, fieldsShift) {
          if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
            return;
          }

          const allData = {
            employeeData: resultEmployee,
            alertData: resultAlert,
            availData: resultAvail,
            shiftData: resultShift
          };
          res.json(allData);
        });
      });
    });
  });
});


// API endpoint to save events
app.post('/api/saveEvents', async (req, res) => {
  const events = req.body;
  console.log("\nProcess of saving event to Database: ");
  try {
    const flattenedEvents = events.flat();
    for (const event of flattenedEvents) {

      const checkIfExistsQuery = 'SELECT * FROM shifts WHERE ShiftID = ?';
      const checkIfExistsValues = [event.events[0].ShiftID];

      const [existingEvent] = await new Promise((resolve, reject) => {
        con.query(checkIfExistsQuery, checkIfExistsValues, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });


      // If the event already exists, event is undefined, or event has null elements, skip inserting it into the database
      if(existingEvent != undefined || event === undefined || hasNullElements(event) === true) {
        console.log("[FAILURE] Following event was not added:\n");
        if(existingEvent != undefined){
          console.log("[EVENT ALREADY EXISTS]:\n");
        } else if(event === undefined){
          console.log("[UNDEFINED EVENT]:\n")
        }
        console.log(JSON.stringify(event));
        continue;
      } 
      


      // If the event does not exist already, insert it into the database
      const insertQuery = 'INSERT INTO shifts (ShiftID, EmploeyID, Data, StartTime, EndTime) VALUES (?, ?, ?, ?, ?)';
      const insertValues = [event.events[0].ShiftID, event.events[0].EmployeeID, event.events[0].Date, event.events[0].StartTime, event.events[0].EndTime];
      // debug print
      console.log("[SUCCESS] Following event is being inserted into database:" + "\nShiftID: " + event.events[0].ShiftID + "\nEmployeeID: " + event.events[0].EmployeeID + "\nDate: " + event.events[0].Date + "\nStartTime: " + event.events[0].StartTime +  "\nEndTime: " + event.events[0].EndTime);
      await new Promise((resolve, reject) => {
        con.query(insertQuery, insertValues, (err, result) => {
          if (err) {
            reject(err);
            console.log("[FINAL FAILURE] Event was not inserted into database");
          } else {
            console.log("[FINAL SUCCESS] Event was successfully inserted into database");
            resolve();
          }
        });
      });
    }

    res.send('Events saved to database');
  } catch (error) {
    console.error(error); 
    res.status(500).send('Internal Server Error');
  }
});


// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/sign-in.html');
    }
  });
});


// checks if any event element is null
function hasNullElements(event) {
  
  if(event === undefined){
    return true;
  } else if(event.events[0].ShiftID === null || event.events[0].EmployeeID === null || event.events[0].Date === null || event.events[0].StartTime === null || event.events[0].EndTime === null){
    console.log("[NULL ELEMENT(S)]");
    return true;
  } else {
    
    return false;
  }

}
