import { TooltipProvider } from "@/components/ui/tooltip";

export default function ToolTipProvider({ children }: { children: React.ReactNode }) {
    return (
        <TooltipProvider delayDuration={300}>
            {children}
        </TooltipProvider>
    );
}