import type { GameSubmission, GameStatus } from "../models/Game";
import { POCStatus } from "../models/Game";


const radioForm = document.querySelector("form") as HTMLFormElement;
const titleInput = document.getElementById("add-title") as HTMLInputElement;
const userInput = document.getElementById("add-name") as HTMLInputElement;
const gameUList = document.getElementById("all") as HTMLUListElement;


// Reads data from the form
export function readForm(): GameSubmission {
  const formData = new FormData(radioForm);
  const title = titleInput.value.trim();
  const submitter = userInput.value.trim();
  let gameStatus = formData.get("game-status") as GameStatus | null;

  if (!gameStatus || !Object.values(POCStatus).includes(gameStatus)) {
    console.log("Could not read the game status from the radio button");
    gameStatus = POCStatus.Completed;
  }

  return { title, submitter, status: gameStatus };
}

// Appends a game title to the list
export function addElement(gameTitle: string): void {
  const newElement = document.createElement("li");
  newElement.innerHTML = `
    <div id="game-element">
      <p>Title:</p>
      ${gameTitle}
    </div>
  `;
  gameUList.appendChild(newElement);
}

// Clear the form inputs
export function clearForm(): void {
  titleInput.value = "";
  userInput.value = "";
}