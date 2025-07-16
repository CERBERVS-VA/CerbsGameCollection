var gameList = document.getElementById("all");

//defines the Source for the form Data
const formRadioInput = document.querySelector("form");
const formTitleInput = document.getElementById("add-title");
const formUserInput = document.getElementById("add-name");

//reads Data from form Inputs
function readForm() {
  const formStatus = new FormData(formRadioInput);
  for (const entry of formStatus){
      var status = entry[1];
    }
    if (status == null) {
      console.log("400: Status cannot be empty");
    }
  var formTitle = formTitleInput.value;
  var formUser = formUserInput.value;
  return{status, formTitle, formUser}
}

//queries data from API
async function getData() {
  const url = "http://127.0.0.1:8080/games/list";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
   // const text = await response.text();
    //console.log(json);
    return json;
  } catch (error) {
    console.error(error.message);
  }
}

//sends Elements added to poc list to the database and returns status(plus content??)
function sendData(formTitle, formUser, status){
  const bodyData = JSON.stringify({"title": formTitle, "releaseyear": null, "publisher": null, "appid": null, "submittername": formUser, "status": status});
  const request = new Request("http://127.0.0.1:8080/games", {
    method: "POST",
    headers: {"Content-Type" : "application/json"},
    body: bodyData
  });
  fetch(request);
  const reqStat = new Response(request);
  return reqStat.ok;
}

//adds Elements from query to list
function addElement(values) {
    const newElement = document.createElement("li");
    const newContent = document.createTextNode(values);
    newElement.append(newContent);
    gameList.appendChild(newElement);
}

//validates the Input from the Form
function validateFormData() {
  // CONTINUE HERE WITH VALIDATION STUFF
  return 1
}

//"Add" button functionality for processing form data and adding data to api and such
function buttonAdd() {
    const {status, formUser, formTitle} = readForm();

    //validate data
    if(validateFormData() != true) return console.log("Validation failed");        // in Python "if function" checks if something exists, in JS it instead checks if it returns something other than 0 (aka false)
    dataSentSuccessfully = sendData(formTitle, formUser, status);
    
    if(dataSentSuccessfully != true) return console.log("400: couldn't send Data to API");
    console.log("200: Game added");
    addElement(formTitle);
    formTitleInput.value = "";
    formUserInput.value = "";
    //snackbar?? pop up for error/success codes :3
}


//anonymous function to do shit with data before giving it to multiple functions for example
getData().then(async data =>
    {
        console.log(data);
        var i = 0;
        while (i < data.length) {
          addElement(data[i].title);
          i++;
        }
    });