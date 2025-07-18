import type { GameSubmission } from "../models/Game";

//validates the Input from the Form
export function validateFormData(game: GameSubmission) {
  var validKey = 0;

  // No need to evaluate the if with { } if it is a one liner
  // Game status can not have any invalid values anymore. So need to check for valid status
  if (game.status) validKey++;
    else console.log("Status Validation failed: empty");
  if (game.title !== "") validKey++;
    else console.log("Game title Validation failed: Title empty");
  if (game.submitter !== "") validKey++;
    else console.log("User Validation failed: Username empty");
  //TODO add extra Validations
  return validKey
}