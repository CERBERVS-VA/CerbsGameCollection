import type { Submission, SubmissionWrite } from "../models/submission";
import { DB_URL } from "../core/config";
import type { Game } from "../models/game";


export async function readGames(): Promise<Game[]> {
  const headers: Headers = new Headers();
  const uri = `${DB_URL}/games`;

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
    return json as Game[];
  } catch (error: any) {
    throw(error.message);
  }
}


export async function createGameFromSubmission(submission: Submission): Promise<boolean> {
  const submissionWrite: SubmissionWrite = {} as SubmissionWrite;
  
  // map submission to strip the id property to create a new Game
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


export async function updateGame(newGame: Game, oldGameId: string): Promise<Game> {
  const headers: Headers = new Headers();
  const uri = `${DB_URL}/games/${oldGameId}`;
  const bodyData = JSON.stringify(newGame);

  headers.set('Content-Type', 'application/json');

  const request: RequestInfo = new Request(uri, {
    method: 'PUT',
    headers: headers,
    body: bodyData,
  });

  try {
    const response = await fetch(request);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    return json as Game;
  } catch (error: any) {
    throw(error.message);
  }
}
