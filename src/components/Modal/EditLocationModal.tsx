import { Location, LocationType } from "@/lib/types/custom";
import React, { useState } from "react";
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner"


interface EditLocationProps {
    isOpen: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    location: Location;
}

export const EditLocationModal: React.FC<EditLocationProps> = ({ isOpen, onCancel, onConfirm, location }) => {
    const [locationName, setLocationName] = useState(location.name);
    const [locationAddress, setLocationAddress] = useState(location.address || '');
    const [locationUrl, setLocationUrl] = useState(location.url || '');
    const [locationType, setLocationType] = useState<LocationType>(location.type);
    const [error, setError] = useState<string | null>(null);
    const [isPending, setPending] = useState(false);

    const handleEditSubmit = async () => {
        try {
            setError(null);
            setPending(true);

            if (!locationName || !locationAddress || !locationType) {
                setError('All fields are required.');
                return;
            }

            const response = await fetch(`/api/locations/${location.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: locationName, address: locationAddress, url: locationUrl, type: locationType }),
            });

            if (!response.ok) {
                throw new Error('Failed to update location');
            }
            toast.success('Location updated successfully');
            onConfirm();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to update location');
            toast.error('Failed to update location');
        } finally {
            setPending(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onCancel}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Location</DialogTitle>
                    <DialogDescription>
                        Edit location details.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" value={locationName} onChange={(e) => setLocationName(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="address" className="text-right">Address</Label>
                        <Input id="address" value={locationAddress} onChange={(e) => setLocationAddress(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="url" className="text-right">URL</Label>
                        <Input id="url" value={locationUrl} onChange={(e) => setLocationUrl(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">Type</Label>
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
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <DialogFooter>
                    <Button onClick={handleEditSubmit} disabled={isPending}>
                        {isPending ? <span className="mr-2">Saving...</span> : <span className="mr-2">Save</span>}
                    </Button>
                    <Button variant="outline" onClick={onCancel} disabled={isPending}>Cancel</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}