import type { Submission } from "./models/submission";
import type { Game } from "./models/game";
import { readData } from "./api/game";
import { addElement, clearForm, createListElement } from "./dom/form";
import { buttonAddSubmission } from "./dom/events";


// queries the HTML Elements from the DOM Tree for manipulation and reading data
const gameSubmittingButton: HTMLButtonElement = document.getElementById("submit-game-button") as HTMLButtonElement;
const listSubmit: HTMLUListElement = document.getElementById("all-submits") as HTMLUListElement;
const listGame: HTMLUListElement = document.getElementById("all-games") as HTMLUListElement;

gameSubmittingButton.addEventListener("click", () => buttonAddSubmission());


export async function SyncElements() {
  while(listSubmit.firstChild) {
    listSubmit.removeChild(listSubmit.firstChild);
  }
  while(listGame.firstChild) {
    listGame.removeChild(listGame.firstChild);
  }
  const games: Game[] = await readData("games");
  const submits: Submission[] = await readData("submits");

  for (const game of games) {
    const gameListElement: HTMLElement = createListElement(game);
    addElement(gameListElement, "all-games");
  }
  for (const submit of submits) {
    const submitListElement: HTMLElement = createListElement(submit);
    addElement(submitListElement, "all-submits");
  }
}

SyncElements();
clearForm();