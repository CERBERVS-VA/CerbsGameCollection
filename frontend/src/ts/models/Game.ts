import type { ShapeToType } from "../core/type_validation";
import { POCStatus } from "./base";
import { isShapeMatch } from "../core/type_validation";
import { submissionShape } from "./shared";


const gameShape = {
  ...submissionShape,
  status: { enum: Object.values(POCStatus) },
  appid: 'number',
} as const;

export type Game = ShapeToType<typeof gameShape>;

export const isGame = (x: unknown): x is Game =>
  isShapeMatch(x, gameShape);