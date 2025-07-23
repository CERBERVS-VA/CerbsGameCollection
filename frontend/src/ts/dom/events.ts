import { createPOCData, createSubmissionData, readDataPerID } from "../api/game";
import { readForm, addElement, clearForm, createListElement } from "../dom/form";
import { validateFormData } from "../core/validate";
import type { Submission } from "../models/submission";


//"Add" button functionality for processing form data and adding data to api and such
export async function buttonAddSubmission(): Promise<boolean> {
  const submit: Submission = readForm();              //reads the Form and "gets" the input data

  if(validateFormData(submit) != 4) return false      //validates input data
  if(!await createSubmissionData(submit)) return false          //sends data to "submit" DB

  console.log(`200: Game ${submit.title} added`);
  const element = createListElement(submit)           //creates HTML list of data keys
  addElement(element, "all-submits");                 //adds HTML list to homepage
  clearForm();                                        //clears the form inputs
  return true
  //snackbar?? pop up for error/success codes :3
}


export async function moveEntry(gameID: string){ 
  console.log("Entry "+gameID+" theoretically moved, FINISH THIS AND MOVE THE FUNCTION TO events.ts")
  //GET data from submit
  const submitData: Game = await readDataPerID(gameID);
  console.log(submitData);
  //POST data to poc
  await createPOCData(submitData);
  //DELETE data from submit
  //sync/reload webpage
}

