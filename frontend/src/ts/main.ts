import type { GameForm, GameStatus } from "./models/GameForm";
import { readGames, createGame } from "./api";
import { POCStatus } from "./models/GameForm";

// querries the HTML Elements from the DOM Tree for manipulation and reading data
const radioFrom: HTMLFormElement = document.querySelector("form") as HTMLFormElement;
const titleInput: HTMLInputElement = document.getElementById("add-title") as HTMLInputElement;
const userInput: HTMLInputElement = document.getElementById("add-name") as HTMLInputElement;
const gameUList: HTMLUListElement = document.getElementById("all") as HTMLUListElement;


function readForm(): GameForm {
  const formData = new FormData(radioFrom);
  
  const title = titleInput.value.trim();
  const submitter = userInput.value.trim();
  let gameStatus = formData.get("game-status") as GameStatus | null;

  if (!gameStatus || !Object.values(POCStatus).includes(gameStatus)) {
    console.log("Could not read the game status from the radio button")
    gameStatus = POCStatus.Completed;
  }

  return {
    title: title,
    submitterName: submitter,
    status: gameStatus
  };
}


//adds Elements from query to list
function addElement(values: string) {
    const newElement = document.createElement("li");
    const newContent = document.createTextNode(values);
    newElement.append(newContent);
    gameUList.appendChild(newElement);
}

//validates the Input from the Form
function validateFormData(game: GameForm) {
  var validKey = 0;

  // No need to evaluate the if with { } if it is a one liner
  // Game status can not have any invalid values anymore. So need to check for valid status
  if (game.status) validKey ++;
    else console.log("Status Validation failed: empty")
  if (game.title !== "") validKey ++;
    else console.log("Game title Validation failed: Title empty")
  if (game.submitterName !== "") validKey ++;
    else console.log("User Validation failed: Username empty")
  
  return validKey
}

//"Add" button functionality for processing form data and adding data to api and such
function buttonAdd() {
    const game: GameForm = readForm();
 
    // in Python "if function" checks if something exists, in JS it instead checks if it returns something other than 0 (aka false)
    if(validateFormData(game) != 3) return console.log("Validation failed");
    var dataSentSuccessfully = createGame(game);
    
    if(dataSentSuccessfully != true) return console.log("400: couldn't send Data to API");
    console.log("200: Game added");
    addElement(game.title);
    titleInput.value = "";
    userInput.value = "";
    //snackbar?? pop up for error/success codes :3
}

//anonymous function to do shit with data before giving it to multiple functions for example
readGames().then(async data => 
  {
    console.log(data);
    var i = 0;
    while (i < data.length) {
      addElement(data[i].title);
      i++;
    }
  }
);