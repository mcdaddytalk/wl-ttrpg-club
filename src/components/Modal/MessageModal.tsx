import { ContactListDO, MessageDO, MessageUserDO, Player } from "@/lib/types/custom";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";

interface MessageModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    members: ContactListDO[];
    user: User;
    mode: 'gm' | 'player' | 'new' | 'reply' | 'forward';
    message?: MessageDO | undefined;
    useFixedRecipient?: boolean;
    fixedRecipient?: string | MessageUserDO | Player;
}

export default function MessageModal({
    isOpen,
    onConfirm,
    onCancel,
    members,
    user,
    mode,
    message,
    useFixedRecipient = false,
    fixedRecipient = "",
}: MessageModalProps): React.ReactElement {
    const [content, setContent] = useState("");
    const [subject, setSubject] = useState("");
    const [recipient, setRecipient] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const { mutate: sendMessage, isPending } = useMutation({
        mutationFn: async () => {
            return await fetch("/api/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ sender: user.id, recipient, subject, content }),
            });
        },
        onMutate: () => {
            setError(null);
        },
        onSuccess: () => {
            toast.success("Message sent successfully.");
            setContent("");
            setSubject("");
            setRecipient("");
            onConfirm();
        },
        onError: (err) => {
            setError((err as Error).message || "Failed to send message.");
            toast.error("Failed to send message.");
        },
    })

    useEffect(() => {
        if (useFixedRecipient) {
            if (typeof fixedRecipient === "string")
                setRecipient(fixedRecipient);
            else {
                setRecipient(fixedRecipient.id || "unknown");
            }
            if(mode === 'reply' && message) {
                setSubject(`Re: ${message.subject || ""}`);
                setContent(`> ${message.content || ""}`);
            }
        } else if (mode === 'forward' && message) {
                setRecipient("");
                setSubject(`Fwd: ${message.subject || ""}`);
                setContent(message.content || "");
        } else {
            setRecipient("");
            setSubject("");
            setContent("");
        }
    }, [useFixedRecipient, fixedRecipient, mode, message]);
    
    
    const getDialogTitle = () => {
        switch (mode) {
            case 'gm':
                return "Message Gamemaster";
            case 'player':
                return "Message Player";
            case 'reply':
                return "Reply";
            case 'forward':
                return "Forward";
            default:
                return "New Message";
        }
    }

    
    return (
        <Dialog open={isOpen} onOpenChange={onCancel}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{getDialogTitle()}</DialogTitle>
                    <DialogDescription>
                        {mode === 'gm' ? "Send message about game to the Gamemaster." : mode === 'player' ? "Send message about game to a player." : mode === "new" ? "Send a new message to a contact." : mode === "reply" ? "Reply to the sender." : "Forward this message to a contact."}
                    </DialogDescription>
                </DialogHeader>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="recipient" className="text-right">
                            Recipient
                        </Label>
                        {useFixedRecipient && (mode !== 'gm' && mode !== 'player') && typeof fixedRecipient === 'string'
                        ? (
                            <Input
                                id="recipient"
                                value={`${members.find((member) => member.id === fixedRecipient)?.given_name} ${members.find((member) => member.id === fixedRecipient)?.surname}`}
                                placeholder={`${members.find((member) => member.id === fixedRecipient)?.given_name} ${members.find((member) => member.id === fixedRecipient)?.surname}`}
                                disabled
                                className="col-span-2"
                            />
                        ) : useFixedRecipient && (mode === 'gm' || mode === 'player') && typeof fixedRecipient !== 'string'
                        ? (
                            <Input
                                id="recipient"
                                value={`${(fixedRecipient as MessageUserDO).given_name} ${(fixedRecipient as MessageUserDO).surname}`}
                                placeholder={`${(fixedRecipient as MessageUserDO).given_name} ${(fixedRecipient as MessageUserDO).surname}`}
                                disabled
                                className="col-span-2"
                            />                            
                        ) : (
                            <Select 
                                value={recipient as string}
                                onValueChange={setRecipient}                       
                            >   
                                <SelectTrigger className="col-span-2">
                                    <SelectValue placeholder="Select a recipient" />
                                </SelectTrigger>
                                <SelectContent>
                                    {members.filter((member) => member.id !== user.id).map((member) => (
                                        <SelectItem 
                                            key={member.id} 
                                            value={member.id}
                                            className=""
                                        >
                                            {member.given_name} {member.surname}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>    
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="subject" className="text-right">
                            Subject
                        </Label>
                        <Input 
                            id="subject" 
                            value={subject} 
                            onChange={(e) => setSubject(e.target.value)} 
                            className="col-span-2"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="content" className="text-right">
                            Message
                        </Label>
                        <Textarea 
                            id="content" 
                            value={content} 
                            onChange={(e) => setContent(e.target.value)} 
                            className="col-span-2 min-h-[150px] resize-none"
                        />
                    </div>    
                </div>
                <DialogFooter>
                    <Button 
                        onClick={onCancel}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={() => sendMessage()}
                        disabled={isPending}
                    >
                        {isPending ? "Sending..." : "Send"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}