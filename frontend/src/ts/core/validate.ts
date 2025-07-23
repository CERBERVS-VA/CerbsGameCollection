import type { Submission } from "../models/submission";

//validates the Input from the Form
export function validateFormData(game: Submission) {
  var validKey = 0;

  // No need to evaluate the if with { } if it is a one liner
  // Game status can not have any invalid values anymore. So need to check for valid status
  if (game.title !== "") validKey++;
    else console.log("Game title Validation failed: Title empty");
  if (game.submitter !== "") validKey++;
    else console.log("User Validation failed: Username empty");
  if (game.releaseYear !== null) validKey++;
    else console.log("User Validation failed: Release Year empty");
  if (game.publisher !== "") validKey++;
    else console.log("User Validation failed: Publisher empty");
  //TODO add extra Validations and improve logs
  return validKey
}