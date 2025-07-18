import { readGames } from "./api/game";
import { addElement } from "./dom/form";
import { buttonAdd } from "./dom/events";


// querries the HTML Elements from the DOM Tree for manipulation and reading data
const gameAddingButton: HTMLButtonElement = document.getElementById("add-game-button") as HTMLButtonElement;


gameAddingButton.addEventListener("click", () => buttonAdd());

async function loadInitialGames() {
  const games = await readGames();
  for (const game of games) {
    addElement(game.title);
  }
}

loadInitialGames();