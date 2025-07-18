import { createGame } from "../api/game";
import { readForm, addElement, clearForm } from "../dom/form";
import { validateFormData } from "../core/validate";
import type { GameSubmission } from "../models/Game";


//"Add" button functionality for processing form data and adding data to api and such
export async function buttonAdd(): Promise<boolean> {
  const game: GameSubmission = readForm();

  // in Python "if function" checks if something exists, in JS it instead checks if it returns something other than 0 (aka false)
  if(validateFormData(game) != 3) return false 
  if(!await createGame(game)) return false 

  console.log(`200: Game ${game.title} added`);
  addElement(game.title);
  clearForm();
  return true
  //snackbar?? pop up for error/success codes :3
}