import { syncElements } from "../controller/Controller";
import type { Submission } from "../models/submission";
import { moveEntry } from "./events";


const submitList: HTMLUListElement = document.getElementById("all-submits") as HTMLUListElement;


export function createSubmissionDisplayElement(submission: Submission): HTMLLIElement {
  const listElement: HTMLLIElement = document.createElement("li") as HTMLLIElement;
  const moveButton: HTMLButtonElement = document.createElement("button");
  
  listElement.className = "submit-element";
  listElement.id = submission._id;

  for(const key of Object.keys(submission)) {
    if(key != "_id"){
      // @ts-ignore
      const value = submission[key];
      const gameProperty: HTMLParagraphElement = document.createElement("p");

      gameProperty.textContent = `${key}: ${value}`;
      listElement.appendChild(gameProperty);
    }
  }

  moveButton.textContent = "Move Entry";
  moveButton.onclick = async () => {await moveEntry(submission._id).then((success: boolean) => {if(success) syncElements()})};
  listElement.appendChild(moveButton);
  submitList.appendChild(listElement)

  return listElement
}


export function resetSubmissionDisplay(): boolean {
  try {
    while(submitList.firstChild) {
      submitList.removeChild(submitList.firstChild);
    }
  } catch (e) {
    console.log(e);
    return false;
  }
  return true; 
}

export function addSubmissionToDisplay(child: HTMLElement): void;
export function addSubmissionToDisplay(child: HTMLElement, oldChild: HTMLElement): void;

export function addSubmissionToDisplay(child: HTMLElement, oldChild?: HTMLElement): void {
  const parentElement: HTMLElement = document.getElementById("all-submits") as HTMLElement;
  if(oldChild && oldChild.parentElement === parentElement) {
    parentElement.replaceChild(child, oldChild);
  } else {
    parentElement.appendChild(child);
  }
}