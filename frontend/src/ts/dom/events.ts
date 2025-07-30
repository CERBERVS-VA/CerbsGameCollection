import type { Game } from "../models/game";
import type { Submission, SubmissionWrite } from "../models/submission";
import type { GameStatus } from "../models/base"
import { createGameFromSubmission, updateGame } from "../api/games";
import { createSubmission, deleteSubmission, readSubmit } from "../api/submits";
import { validateFormData } from "./submissionFrom";
import { addGameToDisplay, createGameDisplayElement } from "./games";


//"Add" button functionality for processing form data and adding data to api and such 
export async function addSubmission(submission: SubmissionWrite): Promise<boolean> {
  // TODO Magic number
  if (validateFormData(submission) != 4) return false;
  let newSubmission: Submission = await createSubmission(submission);
  console.log(`200: Game ${submission.title} added`);

  if (!newSubmission) return false;
  return true;
}


export async function moveEntry(submitID: string): Promise<boolean> { 
  const submit: Submission = await readSubmit(submitID);
  let success = await createGameFromSubmission(submit);
  if (success) {
    await deleteSubmission(submitID);
    console.log("Entry " + submitID + " moved successfully");
    return true;
  }
  return false;
}


async function updateGameEntry(game: Game): Promise<Game> {
  let newGame: Game = { } as Game;
  let updatedGame: Game;

  for (const [key, _] of Object.entries(game)) {
    if(key === "_id") continue;

    // More error handling. Can't read input of an non existing Element!
    const input: HTMLInputElement = document.getElementById(`input-${key}-${game._id}`) as HTMLInputElement
    let inputValue: string | number | GameStatus;

    if (key === "releaseYear" || key ===  "appid") {
      inputValue = Number(input.value.trim());
    } else if(key === "status") {
      inputValue = input.value.trim() as GameStatus;
    } else {
      inputValue = input.value.trim();
    }

    // @ts-ignore
    newGame[key] = inputValue;
  }
  updatedGame = await updateGame(newGame, game._id);
  if (updatedGame) return updatedGame;
  else return { } as Game;
}

function updateGameDisplayEntry(game: Game, parent: HTMLElement): void {
  const newGameListElement: HTMLElement = createGameDisplayElement(game);
  addGameToDisplay(newGameListElement, parent)
}

export function editEntry(game: Game, parent: HTMLElement) {
  const confirmButton: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;
  confirmButton.textContent = "Confirm";
  confirmButton.onclick = async () => { 
    let updatedGame = await updateGameEntry(game);
    updateGameDisplayEntry(updatedGame, parent);
  };

  console.log("Editing Entry " + game._id);

  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }

  for (const [key, value] of Object.entries(game)) {
    if(key === "_id") continue;

    const label: HTMLLabelElement = document.createElement("label");
    const input: HTMLInputElement = document.createElement("input");
    const br: HTMLBRElement = document.createElement("br");

    label.textContent = `${key}:`;
    label.htmlFor = `input-${key}-${game._id}`;

    input.id = `input-${key}-${game._id}`;
    input.type = (key === "releaseYear" || key ===  "appid") ? 'number' : 'text';
    input.value = String(value);
    input.placeholder = String(value);
    input.dataset.key = key;  // use the key to query the input data 
    
    parent.append(label);
    parent.append(input);
    parent.append(br);
  }
  parent.append(confirmButton);
}