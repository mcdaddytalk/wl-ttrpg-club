import transformObjectToParams, { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EmailOptions } from "@/lib/types/social-share";
import { Tooltip } from "@radix-ui/react-tooltip";
import { TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface EmailShareButtonProps {
    url: string;
    options?: EmailOptions;
    className?: string;
    children?: React.ReactNode;
}

const emailLink = (url: string, options?: EmailOptions) => {
    const { subject, body, separator = '\n\n' } = options ?? {};
    const fullUrl = window.location.origin + url;
    return `mailto:` + transformObjectToParams({
        subject,
        body: [body, fullUrl].filter(Boolean).join(separator)
    })
}

const EmailShareButton = ({ url, options, className, children }: EmailShareButtonProps) => {
    return (
        <Tooltip>
            <TooltipContent>Share by Email</TooltipContent>
            <TooltipTrigger asChild>
                <Button asChild
                    aria-label="Email"
                    onClick={() => {
                        window.location.href = emailLink(url, options);
                    }}
                    className={cn("cursor-pointer", className)}
                >
                    {children}
                </Button>
            </TooltipTrigger>
        </Tooltip>        
    )
}

export default EmailShareButton;