import { getQueryClient } from "@/server/getQueryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import GamemasterGameForm from "../_components/GamemasterGameForm";


export default async function CreateGamePage() {
    const queryClient = getQueryClient();
  
    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
          <GamemasterGameForm />
      </HydrationBoundary>
    );
  }