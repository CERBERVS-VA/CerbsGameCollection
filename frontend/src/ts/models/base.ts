// Instead of using an const enum, declare an object as const tl;dr: erasableSyntaxOnly
export const GameStatusEnum = {
  Planned: "planned",
  Completed: "completed",
  Ongoing: "ongoing"
} as const;
export type GameStatus = typeof GameStatusEnum[keyof typeof GameStatusEnum];
