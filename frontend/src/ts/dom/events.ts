import { createData } from "../api/game";
import { readForm, addElement, clearForm, createListElement } from "../dom/form";
import { validateFormData } from "../core/validate";
import type { Submission } from "../models/Game";


//"Add" button functionality for processing form data and adding data to api and such
export async function buttonAddSubmission(): Promise<boolean> {
  const submit: Submission = readForm();

  // in Python "if function" checks if something exists, in JS it instead checks if it returns something other than 0 (aka false)
  if(validateFormData(submit) != 4) return false 
  if(!await createData(submit)) return false 

  console.log(`200: Game ${submit.title} added`);
  const element = createListElement(submit)
  addElement(element, "all-submits");
  clearForm();
  return true
  //snackbar?? pop up for error/success codes :3
}