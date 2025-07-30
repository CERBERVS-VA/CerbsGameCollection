import type { SubmissionWrite } from "../models/submission";
import { syncElements } from "../controller/Controller";
import { addSubmission } from "./events";

const titleInput: HTMLInputElement = document.getElementById("add-title") as HTMLInputElement;
const submitterInput: HTMLInputElement = document.getElementById("add-name") as HTMLInputElement;
const relYearInput: HTMLInputElement = document.getElementById("add-release-year") as HTMLInputElement;
const publisherInput: HTMLInputElement = document.getElementById("add-publisher") as HTMLInputElement;
const submitButton: HTMLButtonElement = document.getElementById("submit-game-button") as HTMLButtonElement;

submitButton.addEventListener("click", handleSubmit);
export function validateFormData(submission: SubmissionWrite) {
  var validKey = 0;

  // No need to evaluate the if with { } if it is a one liner
  // Game status can not have any invalid values anymore. So need to check for valid status
  if (submission.title !== "") validKey++;
    else console.log("Game title Validation failed: Title empty");
  if (submission.submitter !== "") validKey++;
    else console.log("User Validation failed: Username empty");
  if (submission.releaseYear !== null) validKey++;
    else console.log("User Validation failed: Release Year empty");
  if (submission.publisher !== "") validKey++;
    else console.log("User Validation failed: Publisher empty");
  //TODO add extra Validations and improve logs
  return validKey
}

export async function handleSubmit() {
  const submission: SubmissionWrite = _read();
  const result: boolean = await addSubmission(submission);
  if (result) {
    syncElements();
    _clear();
  } else {
    console.log("Submission failed");
  }
}

function _read(): SubmissionWrite {
  let submission: SubmissionWrite = {
    title: titleInput.value.trim(),
    submitter: submitterInput.value.trim(),
    releaseYear: Number(relYearInput.value.trim()),
    publisher: publisherInput.value.trim(),
  }
  return submission;
}

function _clear() {
  titleInput.value = "";
  submitterInput.value = "";
  relYearInput.value = "";
  publisherInput.value = "";
}
