import type { Game } from "../models/game";
import { editEntry } from "./events";

const gameList: HTMLUListElement = document.getElementById("all-games") as HTMLUListElement;


export function createGameDisplayElement(game: Game): HTMLLIElement {
  const listElement: HTMLLIElement = document.createElement("li") as HTMLLIElement;
  const editButton: HTMLButtonElement = document.createElement("button");
  
  listElement.className = "game-element";
  listElement.id = game._id;

  for(const key of Object.keys(game)) {
    if(key != "_id"){
      // @ts-ignore
      const value = game[key];
      const gameProperty: HTMLParagraphElement = document.createElement("p");

      gameProperty.textContent = `${key}: ${value}`;
      listElement.appendChild(gameProperty);
    }
  }

  editButton.textContent = "Edit Entry";
  editButton.onclick = () => editEntry(game, listElement);
  listElement.appendChild(editButton);

  gameList.appendChild(listElement);

  return listElement
}

export function resetGameDisplay() {
  try {
    while(gameList.firstChild) {
      gameList.removeChild(gameList.firstChild);
    }
  } catch (e) {
    console.log(e);
    return false;
  }
  return true; 
}

export function addGameToDisplay(child: HTMLElement): void;
export function addGameToDisplay(child: HTMLElement, oldChild: HTMLElement): void;

export function addGameToDisplay(child: HTMLElement, oldChild?: HTMLElement): void {
  const parentElement: HTMLElement = document.getElementById("all-games") as HTMLElement;
  if(oldChild && oldChild.parentElement === parentElement) {
    parentElement.replaceChild(child, oldChild);
  } else {
    parentElement.appendChild(child);
  }
}