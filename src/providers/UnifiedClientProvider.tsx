import NuqsAdapterProvider from "./NuqsAdapterProvider";
import QueryProviderWrapper from "./QueryProvider";
import ThemeProvider from "./ThemeProvider";
import ToolTipProvider from "./ToolTipProvider";

export default function UnifiedClientProvider({ children }: { children: React.ReactNode }) {
    return (
        <NuqsAdapterProvider>
            <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
            >
                <QueryProviderWrapper>
                    <ToolTipProvider>
                        {children}
                    </ToolTipProvider>                
                </QueryProviderWrapper>
            </ThemeProvider>
        </NuqsAdapterProvider>
    );
}