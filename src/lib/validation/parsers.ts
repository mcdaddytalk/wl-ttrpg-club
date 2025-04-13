import { z } from "zod";

export const StrictBooleanString = z
  .string()
  .default("true")
  .transform((value) => {
    if (value === "true") return true;
    if (value === "false") return false;
    throw new Error("Expected 'true' or 'false'");
  });