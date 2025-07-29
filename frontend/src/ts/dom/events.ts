import type { Submission } from "../models/submission";
import type { Game } from "../models/game";
import { createGameFromSubmission, createSubmission, readSubmit, deleteSubmission } from "../api/game";
import { readForm, addElement, clearForm, createListElement } from "../dom/form";
import { validateFormData } from "../core/validate";
import { SyncElements } from "../main";


//"Add" button functionality for processing form data and adding data to api and such 
export async function buttonAddSubmission(): Promise<boolean> {
  const submit: Submission = readForm();              //reads the Form and "gets" the input data

  if(validateFormData(submit) != 4) return false      //validates input data
  if(!await createSubmission(submit)) return false          //sends data to "submit" DB

  console.log(`200: Game ${submit.title} added`);
  const element = createListElement(submit)           //creates HTML list of data keys
  addElement(element, "all-submits");                 //adds HTML list to homepage   TODO: don't fakeadd data, sync with DB instead
  SyncElements();
  clearForm();                                        //clears the form inputs
  return true
  //snackbar?? pop up for error/success codes :3
}


export async function moveEntry(submitID: string) { 
  const submit: Submission = await readSubmit(submitID);
  let success = await createGameFromSubmission(submit);
  if(success) {
    await deleteSubmission(submitID);
    SyncElements();
    console.log("Entry "+submitID+" moved successfully");
  }
}


export async function editEntry(game: Game, listElement: HTMLElement) { //TODO make it be a key/value pair instead of string | GAME NEEDS TO BE OBJECT OR SMTH
  console.log("Editing Entry "+game._id);
  if(listElement.hasChildNodes()){
    for(let child of listElement.children){
      const inputElement: HTMLInputElement = document.createElement("input");
      inputElement.type = 'text';
      inputElement.value = child.textContent as string;
      inputElement.placeholder = child.textContent as string;

      const statusInput: HTMLSelectElement = document.createElement("select");
      statusInput.add(new Option("planned", "planned"), undefined);
      statusInput.add(new Option("ongoing", "ongoing"), undefined);
      statusInput.add(new Option("completed", "completed"), undefined);

      const breakElement: HTMLBRElement = document.createElement("br");

      if(child.nodeName == "P"){
        if(child.textContent?.includes("status:")){
          child.appendChild(statusInput);
        } else{
          listElement.replaceChild(inputElement, child);
          listElement.insertBefore(breakElement, inputElement.nextSibling);
        }
      }
      if(child.nodeName == "BUTTON"){
        const confirmButton: HTMLButtonElement = child as HTMLButtonElement;
        confirmButton.textContent = "Confirm Edit";
        confirmButton.onclick = () => console.log("YIPPIE add function here later");
      }
    }
  }
  //TODO: make api function to read poc entry, add input fields and jazz to each datapoint of the entry and add "confirm edit" button that updates the game in poc
}