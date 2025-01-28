import { toast } from "sonner"
import { z } from "zod"

export function isRedirectError(err: unknown): boolean {
  // Identify if the error is a redirect error
  return typeof err === "object" && err !== null && "url" in err
}

export function getErrorMessage(err: unknown): string {
  const unknownError = "Something went wrong, please try again later."

  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => issue.message)
    return errors.join("\n")
  } else if (err instanceof Error) {
    return err.message
  } else if (isRedirectError(err)) {
    throw err // Re-throwing to handle redirection higher up
  } else {
    return unknownError
  }
}

export function showErrorToast(err: unknown): void {
  const errorMessage = getErrorMessage(err)
  toast.error(errorMessage) // Assuming Sonner supports this
}