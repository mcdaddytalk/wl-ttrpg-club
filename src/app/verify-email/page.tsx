import { Suspense } from "react"
import VerifyEmail from "./VerifyEmail"

const VerifyEmailPage = (): React.ReactElement => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmail />
    </Suspense>
  )
}

export default VerifyEmailPage