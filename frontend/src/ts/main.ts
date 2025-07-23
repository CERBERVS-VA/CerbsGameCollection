import { readData } from "./api/game";
import { addElement, clearForm, createListElement } from "./dom/form";
import { buttonAddSubmission, moveEntry } from "./dom/events";
import type { Submission, Game } from "./models/Game";


// queries the HTML Elements from the DOM Tree for manipulation and reading data
const gameSubmittingButton: HTMLButtonElement = document.getElementById("submit-game-button") as HTMLButtonElement;
const routeSubmit: string = "/submit/list";
const routeGame: string = "/game/list";

gameSubmittingButton.addEventListener("click", () => buttonAddSubmission());


async function loadInitialElements() {
  const games: Game[] = await readData(routeGame);
  const submits: Submission[] = await readData(routeSubmit);
  
  for (const game of games) {
    const gameListElement: HTMLElement = createListElement(game);
    addElement(gameListElement, "all-games");
  }
  for (const submit of submits) {
    const submitListElement: HTMLElement = createListElement(submit);
    console.log(submitListElement)

    // TODO: Move logig to createListElement()
    const moveButton: HTMLButtonElement = document.createElement("button");
    moveButton.textContent = "Move Entry";
    moveButton.onclick = () => moveEntry(submit._id);

    submitListElement.appendChild(moveButton)
    addElement(submitListElement, "all-submits");
  }
}

loadInitialElements();
clearForm();