

document.addEventListener('DOMContentLoaded', function () {
    if (window.location.pathname === '/sign-in.html') {
        const loginForm = document.getElementById('loginForm');

        loginForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent the default form submission behavior

            // Get the form data
            const formData = new FormData(loginForm);

            // Convert form data to JSON
            const jsonData = {};
            formData.forEach((value, key) => {
                jsonData[key] = value;
            });

            // Send form data to the server
            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jsonData)
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    alert("Wrong credentials, please try again")
                    throw new Error('Login failed');
                }
            })
            .then(data => {
                if (data && data.employeeID) {
                    window.location.href = `/index.html?employeeID=${data.employeeID}`;
                } else {
                    console.log("No employeeID found in response");
                }
            })
            .catch(error => {
                console.error('Error:', error);

            });
        });
    } else if(window.location.pathname === '/index.html'){
        UpdateOverview();
        UpdatePreviews();
    } else if(window.location.pathname === '/alerts.html'){
        updateAlertPage();
    }

    // function is loaded when user opens a new page
    console.log("addEmployeeIDToLinks initiated");
    addEmployeeIDToLinks();

});








function addEmployeeIDToLinks() {
    // Get the employeeID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const employeeID = urlParams.get('employeeID');

    // If employeeID exists, add it to all other links on the webpage
    if (employeeID) {
        const allLinks = document.querySelectorAll('a');
        allLinks.forEach(link => {
            let href = link.getAttribute('href');
            // Check if href already contains parameters
            if (href.includes('?')) {
                href += `&employeeID=${employeeID}`;
            } else {
                href += `?employeeID=${employeeID}`;
            }
            link.setAttribute('href', href);
        });
    }
}




fetch('/employeeData')
    .then(response => response.json())
    .then(data => {

        console.log('Employee data:', data);
        localStorage.setItem('EmplData', JSON.stringify(data));
        if(window.location.pathname === '/index.html'){ UpdateOverview();}
    })
    .catch(error => {
        console.error('Error fetching employee data:', error);
    });

fetch('/reportData')
    .then(response => response.json())
    .then(data => {

        console.log('Report data:', data);
        localStorage.setItem('repData', JSON.stringify(data));
    })
    .catch(error => {
        console.error('Error fetching employee data:', error);
    });

fetch('/alertData')
    .then(response => response.json())
    .then(data => {

        console.log('Alert data:', data);
    })
    .catch(error => {
        console.error('Error fetching alert data:', error);
    });

fetch('/availData')
    .then(response => response.json())
    .then(data => {

        console.log('Avail data:', data);
    })
    .catch(error => {
        console.error('Error fetching avail data:', error);
    });

fetch('/shiftData')
    .then(response => response.json())
    .then(data => {

        console.log('Shift data:', data);
    })
    .catch(error => {
        console.error('Error fetching shift data:', error);
    });



export function filepass() {
    return new Promise((resolve, reject) => {

        setTimeout(() => {
            fetch('/shiftData')
            .then(response => response.json())
            .then(data => {
                // console.log("filepass summoned, message received from client.js")
                resolve(data);
            })
            .catch(error => console.error('Error fetching data:', error));
        }, 1000); 
    });
}

export function filepassRequests() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            fetch('/availData')
            .then(response => response.json())
            .then(data => {
                // console.log("filepass summoned, message received from client.js")
                resolve(data);
            })
            .catch(error => console.error('Error fetching data:', error));
        }, 1000); 
    });
}

export function sendEvents() {
    // console.log("sendEvents documemnting: " + JSON.stringify(localStorage.getItem('events')));
    fetch('http://localhost:3000/api/saveEvents', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: localStorage.getItem('events')
        })
        .then(response => response.text())
        .then(data => {
        // console.log(data); 
        })
        .catch(error => {
        console.error('Error:', error);
    });

}


export async function deleteAvailability() {

    let EmployeeID = localStorage.getItem('EmployeeID');
    let StartTime = localStorage.getItem('StartTime');
    console.log("got items from localstorage!");
    try {
        const response = await fetch(`/deleteAvailability?EmployeeID=${EmployeeID}&StartTime=${encodeURIComponent(StartTime)}`, {
            method: 'DELETE'
        });
  
      if (response.ok) {
        const message = await response.text();
        console.log(message);

      } else {
        const errorMessage = await response.text();
        console.error(errorMessage);
        alert(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }





function UpdateOverview(){

    const urlParams = new URLSearchParams(window.location.search);
    const employeeID = urlParams.get('employeeID');

    const EmplData = JSON.parse(localStorage.getItem('EmplData'));

    for(const emp of EmplData){
        console.log(emp.EmployeeID + " " + employeeID);
        if((emp.EmployeeID.toString()) === employeeID){

            const Fullname = (emp.FirstName + " " + emp.LastName);
            document.getElementById('overview-username').innerHTML = Fullname; // Adjust the ID if needed
            document.getElementById('overview-empid').innerHTML = "Employee ID: " + emp.EmployeeID;
        }
    }
}


function UpdatePreviews(){
    const alerts = document.querySelector(".alert-inner-wrapper");
    const shifts = document.querySelector(".shift-inner-wrapper");
    // const alertPage = document.querySelector(".alert-container");


    fetch('/alertData')
    .then(response => response.json())
    .then(ALRdata => {

        fetch('/employeeData')
        .then(response => response.json())
        .then(EMPdata => {

            let counter = 0;
            let info = '';
            let alertPageinfo = '';
            for(const i of ALRdata){
                for(const j of EMPdata){
                    if(i.EmployeeID === j.EmployeeID){

                        if(counter < 4){

                            const Fullname = j.FirstName + " " + j.LastName;

                            info += `<div class="index-alert">
                            <p>${i.ReportText}</p>
                            <p style="color:grey">${Fullname}</p>
                            </div>`;
                            counter += 1;
                        }
                    }
                }
            }
            alerts.innerHTML = info;


        })
        .catch(error => {
            console.error('Error fetching employee data:', error);
        });

    })
    .catch(error => {
        console.error('Error fetching alert data:', error);
    });

    fetch('/shiftData')
    .then(response => response.json())
    .then(SFTdata => {

        fetch('/employeeData')
        .then(response => response.json())
        .then(EMPdata => {
             
            let info = '';
            let counter = 0;
            for(const i of SFTdata){
                for(const j of EMPdata){
                    if(i.EmployeeID === j.EmployeeID){
                        if(counter < 4){

                            const Fullname = j.FirstName + " " + j.LastName;

                            info += `<div class="index-alert">
                            <p>${i.StartTime} - ${i.EndTime}</p>
                            <p style="color:grey">${Fullname}</p>
                            </div>`;
                            counter += 1;
                        }
                    }
                }
            }
            shifts.innerHTML = info;

        })
        .catch(error => {
            console.error('Error fetching employee data:', error);
        });

    })
    .catch(error => {
        console.error('Error fetching shift data:', error);
    });

}

function updateAlertPage(){
    const alertPage = document.querySelector(".alert-container");

    fetch('/alertData')
    .then(response => response.json())
    .then(ALRdata => {

        fetch('/employeeData')
        .then(response => response.json())
        .then(EMPdata => {

            let alertPageinfo = '';

        for (let i = ALRdata.length; i > 0; i--) {
            for (const j of EMPdata) {
                if (ALRdata[i - 1].EmployeeID === j.EmployeeID) {
                    const Fullname = j.FirstName + " " + j.LastName;

                    alertPageinfo += `<div class="alert">
                        <p class="alert-time">${Fullname}</p>
                        <p>${ALRdata[i - 1].ReportText}</p>
                        </div>`;
                }
            }
        }
//            for(const i of ALRdata){
//                for(const j of EMPdata){
//                    if(i.EmployeeID === j.EmployeeID){
//
//                        const Fullname = j.FirstName + " " + j.LastName;
//
//                        alertPageinfo += `<div class="alert">
//                        <p class="alert-time">${Fullname}</p>
//                        <p>${i.ReportText}</p>
//                        </div>`;
//                    }
//                }
//            }

            alertPage.innerHTML = alertPageinfo; 

        })
        .catch(error => {
            console.error('Error fetching employee data:', error);
        });

    })
    .catch(error => {
        console.error('Error fetching alert data:', error);
    });
}