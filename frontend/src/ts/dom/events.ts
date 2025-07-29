import type { Submission } from "../models/submission";
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
  console.log("Entry "+submitID+" moved successfully");
  const submit: Submission = await readSubmit(submitID);
  console.log(submit);
  let success = await createGameFromSubmission(submit);
  if(success) {
    await deleteSubmission(submitID);
    SyncElements();
  }
}

export async function editEntry(submitID: string) {
  console.log("Editing Entry "+submitID);
  //TODO: make api function to read poc entry, add input fields and jazz to each datapoint of the entry and add "confirm edit" button that updates the game in poc
}

