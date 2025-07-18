import { GameForm } from "./models/GameForm";

//queries data from API
/**
 * Querries game data from API.
 * 
 * @returns {Game} List of the fetched games.    
 */
export async function readGames() {
  const url = "http://127.0.0.1:8080/games/list";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    return json;
  } catch (error: any) {
    console.error(error.message);
  }
}


//sends Elements added to poc list to the database and returns status(plus content??)
export function createGame(game: GameForm) {
  const bodyData = JSON.stringify({"title": game.title, "releaseyear": null, "publisher": null, "appid": null, "submittername": game.submitterName, "status": game.status});
  const request: Request = new Request("http://127.0.0.1:8080/games", {
    method: "POST",
    headers: {"Content-Type" : "application/json"},
    body: bodyData
  });
  fetch(request);
  const reqStat = new Response(request);    //Tobi will fix <33
  return reqStat.ok;
}