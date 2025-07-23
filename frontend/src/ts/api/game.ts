import type { Submission } from "../models/submission";

//queries data from API
/**
 * Querries game data from API.
 * 
 * @returns {Game} List of the fetched games.    
 */
export async function readData(route: string): Promise<any> {
  const headers: Headers = new Headers();
  const url = "http://127.0.0.1:8080";
  const uri = `${url}${route}`;

  headers.set('Content-Type', 'application/json');

  const request: RequestInfo = new Request(uri, {
    method: 'GET',
    headers: headers
  });

  try {
    const response = await fetch(request);
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
export async function createSubmissionData(game: Submission): Promise<boolean> {
  const bodyData = JSON.stringify(game);
  console.log(bodyData);
  const headers = new Headers();

  headers.set("Content-Type", "application/json");

  const request = new Request("http://127.0.0.1:8080/submit", {
    method: "POST",
    headers: headers,
    body: bodyData
  });
 
  try {
    const response = await fetch(request); 
    const text = await response.text();
    console.log(`Response after sending Game: ${submission.title}\nStatus: ${response.status}\nBody: ${JSON.parse(text)}`)
    return response.ok;
  } catch (error: any) {
    console.error(error.message);
    return false;
  }
}


//reads data from submits per game ID, useful for buttons
export async function readDataPerID(gameID: string): Promise<any> {
  const headers: Headers = new Headers();
  const url = `http://127.0.0.1:8080/submit/list?_id=${gameID}`;

  headers.set('Content-Type', 'application/json');

  const request: RequestInfo = new Request(url, {
    method: 'GET',
    headers: headers
  });

  try {
    const response = await fetch(request);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    return json;
  } catch (error: any) {
    console.error(error.message);
  }
}


//POSTs Elements to poc
export async function createPOCData(game: Submission): Promise<boolean> {
  const bodyData = JSON.stringify(game);
  console.log(bodyData);
  const headers = new Headers();

  headers.set("Content-Type", "application/json");

  const request = new Request("http://127.0.0.1:8080/game", {
    method: "POST",
    headers: headers,
    body: bodyData
  });
 
  try {
    const response = await fetch(request); 
    const text = await response.text();
    console.log(`Response after sending Game: ${game.title}\nStatus: ${response.status}\nBody: ${JSON.parse(text)}`)
    return response.ok;
  } catch (error: any) {
    console.error(error.message);
    return false;
  }
}