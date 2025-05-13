"use client"

import React, { useState } from "react";
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useAddLocation } from '@/hooks/useAddLocation'
import { ContactListDO } from "@/lib/types/data-objects";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Command, CommandInput, CommandList, CommandItem, CommandGroup } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LocationType } from "@/lib/types/custom";


interface AddLocationModalProps {
    isOpen: boolean;
    gamemasters: ContactListDO[];
    scope: string;
    userId: string;
    onCancel: () => void;
    onConfirm: () => void;
}

export const AddLocationModal: React.FC<AddLocationModalProps> = ({ isOpen, onCancel, onConfirm, scope, userId, gamemasters }) => {
    const [locationName, setLocationName] = useState("");
    const [locationAddress, setLocationAddress] = useState("");
    const [locationUrl, setLocationUrl] = useState("");
    const [locationType, setLocationType] = useState<LocationType>("physical");
    const [selectedGMs, setSelectedGMs] = useState<string[]>([userId]);
    // const [error, setError] = useState<string | null>(null);
    const { mutate: addLocation, isPending } = useAddLocation();

    const handleSelectGM = (gmId: string) => {
        if (selectedGMs.includes(gmId)) {
            setSelectedGMs(selectedGMs.filter((id) => id !== gmId));
        } else {
            setSelectedGMs([...selectedGMs, gmId]);
        }
    };

    const handleSubmit = async () => {
        addLocation(
            { scope, created_by: userId, name: locationName, address: locationAddress, url: locationUrl, type: locationType, gamemasters: selectedGMs },
            {
                onSuccess: () => {
                    toast.success("Location added successfully.");
                },
                onError: () => {
                    toast.error("Failed to add location.");
                },
                onSettled: () => {
                    onConfirm(); // Close modal after adding location
                }
            }
        )
    };

    return (
        <Dialog open={isOpen} onOpenChange={onCancel}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Location</DialogTitle>
                    <DialogDescription>
                        Add a new location for assigning to games.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Name</Label>
                        <Input type="text" className="col-span-3" value={locationName} onChange={(e) => setLocationName(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Address</Label>
                        <Input type="text" className="col-span-3" value={locationAddress} onChange={(e) => setLocationAddress(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">URL</Label>
                        <Input type="text" className="col-span-3" value={locationUrl} onChange={(e) => setLocationUrl(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Type</Label>
                        <Select value={locationType} onValueChange={(value) => setLocationType(value as LocationType)}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="physical">Physical</SelectItem>
                                <SelectItem value="vtt">VTT</SelectItem>
                                <SelectItem value="discord">Discord</SelectItem>
                            </SelectContent>
                        </Select>                            
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Authorized GMs</Label>
                        <div className="col-span-3">
                            <Command>
                                <CommandInput placeholder="Search GMs..." />
                                <CommandList>
                                    <CommandGroup>
                                        {gamemasters.map((gm) => (
                                            <CommandItem
                                                key={gm.id}
                                                onSelect={() => handleSelectGM(gm.id)}
                                            >
                                                {selectedGMs.includes(gm.id) && <span>✅ </span>}
                                                {gm.given_name} {gm.surname}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {selectedGMs.map((gmId) => {
                                    const gm = gamemasters.find(g => g.id === gmId);
                                    return gm ? (
                                        <Badge key={gmId} variant="secondary">
                                            {gm.given_name} {gm.surname}
                                        </Badge>
                                    ) : null;
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button disabled={isPending} onClick={handleSubmit}>
                        {isPending ? <span className="mr-2">Adding...</span> : <span className="mr-2">Add</span>}
                    </Button>
                    <Button variant="outline" onClick={onCancel} disabled={isPending}>Cancel</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}