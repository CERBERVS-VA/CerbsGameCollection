import type { ShapeToType } from "../core/type_validation";
import { submissionShape } from "./shared";
import { isShapeMatch } from "../core/type_validation";


export const isSubmission = (x: unknown): x is Submission =>
  isShapeMatch(x, submissionShape);

export type Submission = ShapeToType<typeof submissionShape>;