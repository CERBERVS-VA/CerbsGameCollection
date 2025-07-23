import { createData } from "../api/game";
import { readForm, addElement, clearForm, createListElement } from "../dom/form";
import { validateFormData } from "../core/validate";
import type { Submission } from "../models/Game";


//"Add" button functionality for processing form data and adding data to api and such
export async function buttonAddSubmission(): Promise<boolean> {
  const submit: Submission = readForm();              //reads the Form and "gets" the input data

  if(validateFormData(submit) != 4) return false      //validates input data
  if(!await createData(submit)) return false          //sends data to "submit" DB

  console.log(`200: Game ${submit.title} added`);
  const element = createListElement(submit)           //
  addElement(element, "all-submits");
  clearForm();
  return true
  //snackbar?? pop up for error/success codes :3
}


export function moveEntry(gameID: string){ 
  console.log("Entry "+gameID+" theoretically moved, FINISH THIS AND MOVE THE FUNCTION TO events.ts")
  //GET data from submit
  //POST data to poc
  //DELETE data from submit
  //sync/reload webpage
}

