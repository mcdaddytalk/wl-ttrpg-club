import { useQueryClient } from "@/hooks/useQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import LocationsDashboard from "./LocationsDashboard";

const LocationsPage = (): React.ReactElement => {
    const queryClient = useQueryClient();
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <LocationsDashboard />
        </HydrationBoundary>
    )
}

export default LocationsPage;