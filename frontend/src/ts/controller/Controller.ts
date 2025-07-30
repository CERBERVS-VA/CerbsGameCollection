import type { Submission } from "../models/submission";
import type { Game } from "../models/game";
import { readGames } from "../api/games";
import { readSubmits } from "../api/submits";
import { createGameDisplayElement, resetGameDisplay, addGameToDisplay } from "../dom/games";
import { createSubmissionDisplayElement, resetSubmissionDisplay, addSubmissionToDisplay } from "../dom/submissions";


export async function syncElements() {
  resetSubmissionDisplay();
  resetGameDisplay();

  const games: Game[] = await readGames();
  const submits: Submission[] = await readSubmits();

  for (const game of games) {
    const gameListElement: HTMLElement = createGameDisplayElement(game);
    addGameToDisplay(gameListElement);
  }

  for (const submit of submits) {
    const submitListElement: HTMLElement = createSubmissionDisplayElement(submit);
    addSubmissionToDisplay(submitListElement);
  }
}
