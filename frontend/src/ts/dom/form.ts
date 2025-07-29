import type { Submission } from "../models/submission";
import type { Game } from "../models/game";
import { isGame } from "../models/game";
import { moveEntry, editEntry } from "./events";


const titleInput = document.getElementById("add-title") as HTMLInputElement;
const userInput = document.getElementById("add-name") as HTMLInputElement;
const relYearInput = document.getElementById("add-release-year") as HTMLInputElement;
const publisherInput = document.getElementById("add-publisher") as HTMLInputElement;


// Reads data from the form
export function readForm(): Submission {
  const title = titleInput.value.trim();
  const submitter = userInput.value.trim();
  const relYear: number = Number(relYearInput.value); //TODO make date
  const publisher = publisherInput.value.trim();

  //@ts-ignore
  let gameSubmission: Submission = {
    //_id: "",   TS will id drin haben, weil Submission so definiert ist, das macht aber die submission funktion kaputt.
    title: title,
    submitter: submitter,
    releaseYear: relYear,
    publisher: publisher,
  };
  return gameSubmission;
}

// Appends a game title to the list
export function addElement(htmlElement: HTMLElement, parentElementID: string): void {
  const parentElement: HTMLElement = document.getElementById(parentElementID) as HTMLElement;
  //TODO: make Keys not be DB keys, but actual display text | remove _id
  parentElement.appendChild(htmlElement);
}

// Clear the form inputs
export function clearForm(): void {
  titleInput.value = "";
  userInput.value = "";
  relYearInput.value = "";
  publisherInput.value = "";
}

//creates List Elements, including button
export function createListElement(element: Game | Submission): HTMLElement {
  const listElement: HTMLElement = document.createElement("li") as HTMLElement;
  listElement.className = "game-element";
  listElement.id = element._id;
  for(const key of Object.keys(element)) {
    if(key != "_id"){
      //@ts-ignore
      const value = element[key];
      const gameProperty: HTMLParagraphElement = document.createElement("p");
      gameProperty.textContent = `${key}: ${value}`;
      listElement.appendChild(gameProperty);
    }
  }
  if(!isGame(element)) {
    const moveButton: HTMLButtonElement = document.createElement("button");
    moveButton.textContent = "Move Entry";
    moveButton.onclick = () => moveEntry(element._id);
    listElement.appendChild(moveButton)
  }
  if(isGame(element)) {
    const editButton: HTMLButtonElement = document.createElement("button");
    editButton.textContent = "Edit Entry";
    editButton.onclick = () => editEntry(element, listElement);
    listElement.appendChild(editButton)
  }
  return listElement
}