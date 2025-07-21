import { readData } from "./api/game";
import { addElement, createListElement } from "./dom/form";
import { buttonAddSubmission } from "./dom/events";
import type { Submission, Game } from "./models/Game";


// querries the HTML Elements from the DOM Tree for manipulation and reading data
const gameAddingButton: HTMLButtonElement = document.getElementById("add-game-button") as HTMLButtonElement;
const routeSubmit: string = "/submit/list";
const routeGame: string = "/game/list";



gameAddingButton.addEventListener("click", () => buttonAddSubmission());

async function loadInitialElements() {
  const games: Game[] = await readData(routeGame);
  const submits: Submission[] = await readData(routeSubmit);
  
  for (const game of games) {
    const gameListElement: HTMLElement = createListElement(game);
    addElement(gameListElement, "all-games");
  }
  for (const submit of submits) {
    const submitListElement: HTMLElement = createListElement(submit);
    addElement(submitListElement, "all-submits");
  }
}

loadInitialElements();