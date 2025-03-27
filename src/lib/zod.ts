import * as z from 'zod'
import { generateErrorMessage } from 'zod-error'
import { extendZodWithOpenApi } from 'zod-openapi'

extendZodWithOpenApi(z)

type ZodeError = z.ZodError<unknown>
type ZodInfer<T extends z.ZodType<any, any>> = z.infer<T>

export { generateErrorMessage, z, type ZodeError, type ZodInfer }