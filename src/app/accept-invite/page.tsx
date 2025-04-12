import { Suspense } from "react"
import AcceptInvite from "./_components/AcceptInvite"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getQueryClient } from "@/server/getQueryClient"

const AcceptInvitePage = async (): Promise<React.ReactElement> => {
  const queryClient = getQueryClient();
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading...</div>}>
        <AcceptInvite />
      </Suspense>
    </HydrationBoundary>
  )
}

export default AcceptInvitePage