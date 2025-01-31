import { useQueryClient } from "@/hooks/useQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import GMLocationsDashboard from "./GMLocationsDashboard";

const GMLocationsPage = (): React.ReactElement => {
    const queryClient = useQueryClient();
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <GMLocationsDashboard />
        </HydrationBoundary>
    )
}

export default GMLocationsPage;