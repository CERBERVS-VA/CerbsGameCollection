import type { Submission, SubmissionWrite } from "../models/submission";
import { DB_URL } from "../core/config";


export async function readSubmits(): Promise<Submission[]> {
  const headers: Headers = new Headers();
  const uri = `${DB_URL}/submits`;

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
    return json as Submission[];
  } catch (error: any) {
    throw(error.message);
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


export async function createSubmission(submission: SubmissionWrite): Promise<Submission> {
  const bodyData = JSON.stringify(submission);
  const headers = new Headers();

  headers.set("Content-Type", "application/json");

  const request = new Request(`${DB_URL}/submits`, {
    method: "POST",
    headers: headers,
    body: bodyData
  });
 
  try {
    const response = await fetch(request); 
    let json = await response.json();
    console.log(`Response after sending Game: ${submission.title}\nStatus: ${response.status}\nBody: ${json}`)
    return json;
  } catch (error: any) {
    throw(error.message);
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