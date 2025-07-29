import type { Submission, SubmissionWrite } from "../models/submission";
import { DB_URL } from "../core/config";


//queries data from API
/**
 * Querries game data from API.
 * 
 * @returns {Game} List of the fetched games.    
 */
export async function readData(endpoint: string): Promise<any> {
  const headers: Headers = new Headers();
  const uri = `${DB_URL}/${endpoint}`;

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
export async function createSubmission(game: Submission): Promise<boolean> {
  const bodyData = JSON.stringify(game);
  console.log(bodyData);
  const headers = new Headers();

  headers.set("Content-Type", "application/json");

  const request = new Request(`${DB_URL}/submits`, {
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


//reads data from submits per game ID, useful for buttons
export async function readSubmit(submitID: string): Promise<any> {
  const headers: Headers = new Headers();
  const url = `${DB_URL}/submits/${submitID}`;

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
export async function createGameFromSubmission(submission: Submission): Promise<boolean> {
  const submissionWrite: SubmissionWrite = {} as SubmissionWrite;
  
  for(const key in submission) {
    if(key != "_id") {
      (submissionWrite as any) [key] = submission [key as keyof Submission];
    }
  }

  const bodyData = JSON.stringify(submissionWrite);
  const headers = new Headers();
  headers.set("Content-Type", "application/json");

  const request = new Request(`${DB_URL}/games`, {
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


// deletes Element from Submits
export async function deleteSubmission(submitID: string): Promise<Boolean> {
  const headers: Headers = new Headers();
  const url = `${DB_URL}/submits/${submitID}`;

  headers.set('Content-Type', 'application/json');

  const request: RequestInfo = new Request(url, {
    method: 'DELETE',
    headers: headers
  });

  try {
    const response = await fetch(request);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    return response.ok;
  } catch (error: any) {
    console.error(error.message);
  }
  return false
}