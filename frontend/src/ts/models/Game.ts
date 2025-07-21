// Instead of using an const enum, declare an object as const tl;dr: erasableSyntaxOnly
export const POCStatus = {
  Planned: "planned",
  Completed: "completed",
  Ongoing: "ongoing"
} as const;
export type GameStatus = typeof POCStatus[keyof typeof POCStatus];

export type Submission = {
  title: string;
  submitter: string;
  releaseYear: number;
  publisher: string;
};

export type Game = Submission& {
  status: GameStatus;
  appid: number;
};