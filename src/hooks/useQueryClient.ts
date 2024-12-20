import { 
    defaultShouldDehydrateQuery, 
    isServer, 
    QueryClient 
} from "@tanstack/react-query";
import logger from "@/utils/logger";

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,

            },
            dehydrate: {
                shouldDehydrateQuery: (query) => 
                    defaultShouldDehydrateQuery(query) ||
                    query.state.status === 'pending',
            },
            mutations: {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                onError: (error, _variables, _context) => {
                    logger.error(`Mutation error: ${error}`)
                },
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                onSuccess: (data, _variables, _context) => {
                    logger.info(`Mutation success: ${JSON.stringify(data)}`)
                }
            }            
        },
    })
}

let browserQueryClient: QueryClient | undefined = undefined;

export function useQueryClient() {
    if (isServer) {
        return makeQueryClient();
    } else {
        if (!browserQueryClient) {
            browserQueryClient = makeQueryClient();
        }
        return browserQueryClient;
    }
}