import { Suspense } from "react"
import AcceptInvite from "./AcceptInvite"

const AcceptInvitePage = (): React.ReactElement => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AcceptInvite />
    </Suspense>
  )
}

export default AcceptInvitePage