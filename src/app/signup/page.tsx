import { Suspense } from "react"
import Signup from "./Signup"


const SignupPage = (): React.ReactElement => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Signup />
    </Suspense>
  )
}

export default SignupPage