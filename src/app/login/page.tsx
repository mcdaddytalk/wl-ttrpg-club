import { Suspense } from "react"
import Login from "./Login"


const LoginPage = (): React.ReactElement => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Login />
    </Suspense>
  )
}

export default LoginPage