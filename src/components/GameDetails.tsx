// components/GameDetails.tsx
import { Button } from "@/components/ui/button";
import { GameData, MessageUserDO } from "@/lib/types/custom";
import { toast } from "sonner";
import { MdOutlineEventRepeat } from "react-icons/md";
import { LuCalendar, LuUsers } from "react-icons/lu";
import { SiStatuspal } from "react-icons/si";
import { Badge } from "@/components/ui/badge";
import { useToggleFavorite } from "@/hooks/useToggleFavorite";
import { User } from "@supabase/supabase-js";
import { StarOff } from "lucide-react";
import MessageModal from "@/components/Modal/MessageModal";
import { useState } from "react";
import { useToggleRegistration } from "@/hooks/useToggleRegistration";
import EmailShareButton from "@/components/EmailShareButton";
import { usePathname } from "next/navigation";
import { EmailOptions } from "@/lib/types/social-share";
import EmailShareIcon from "@/components/EmailShareIcon";
import { ConfirmationModal } from "@/components/Modal/ConfirmationModal";
import GameLocation from "@/components/GameLocation";
import GameImage from "@/components/GameImage";

const enhanceStatus = (game: GameData) => {
    const { status, currentSeats, startingSeats } = game;
    if (status === 'awaiting-players') {
        const seatsNeeded = startingSeats > 0 ? startingSeats - currentSeats : startingSeats;
        if (seatsNeeded <= 0) return 'Active';
        return (
            <Badge variant="default" className="bg-blue-300 text-slate-700 rounded-lg" >
                <LuUsers />
                <span>{seatsNeeded} NEEDED TO START</span>
            </Badge>        
        )
    }
    return status.charAt(0).toString().toUpperCase() + status.slice(1);
}

const seatsAvailable = (game: GameData) => {
    if (game.currentSeats === null) return "N/A";
    if (game.maxSeats === null) return "N/A";
    if (game.maxSeats - game.currentSeats === 0) return "Full";
    return `${game.currentSeats} / ${game.maxSeats}`;
};

interface GameDetailsProps {
    user: User;
    game: GameData | null;
}
export default function GameDetails({ user, game }: GameDetailsProps): React.ReactElement {
    const pathname = usePathname();

    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const [confirmModalAction, setConfirmModalAction] = useState<(() => void) | null>(null);
    const [confirmModalTitle, setConfirmModalTitle] = useState("");
    const [confirmModalDescription, setConfirmModalDescription] = useState("");
    
    const [isMessageModalOpen, setMessageModalOpen] = useState<boolean>(false); 
    
    const { mutate: toggleFavorite } = useToggleFavorite();
    const { mutate: toggleRegistration } = useToggleRegistration();
    if (!game) return <div className="text-slate-500">Select a game to view details</div>;

    const handleToggleFavorite = (gameId: string, currentFavorite: boolean) => {
        toggleFavorite({userId: user?.id, gameId, favorite: currentFavorite});
    }

    const handleRemoveRegistration = (gameId: string, currentRegistered: boolean) => {
        confirmAction(
            () => {
                toggleRegistration({userId: user?.id, gameId, gamemasterId: game.gamemaster_id, registered: currentRegistered})
                toast.success("Game removed from your Calendar");                                    
            },
            'Are you sure?',
            'This will resign you from the game.'
        )        
    }

    const handleAddRegistration = (gameId: string, currentRegistered: boolean) => {
        toggleRegistration({userId: user?.id, gameId, gamemasterId: game.gamemaster_id, registered: currentRegistered})
        toast.success("Game added to your Calendar");
    }
        
    const handleMessageSubmit = () => {
        setMessageModalOpen(false);
        toast.success("Message sent to Gamemaster")
    };

    const confirmAction = (action: () => void, title: string, description: string) => {
        setConfirmModalAction(() => action);
        setConfirmModalTitle(title);
        setConfirmModalDescription(description);
        setConfirmModalOpen(true);
    };

    const handleModalConfirm = () => {
        if (confirmModalAction) {
            confirmModalAction();
        }
        setConfirmModalOpen(false);
    }

    const gamemaster: MessageUserDO = {
        id: game.gamemaster_id,
        given_name: game.gm_given_name,
        surname: game.gm_surname
    }

    const emailOptions = (game: GameData): EmailOptions => {
        return {
            subject: `I found a game you may have an interest in:  ${game.title}`,
            body: `Hi!  Its me ${user.user_metadata?.given_name} ${user.user_metadata?.surname}.\n\nI found a game you may be interested in:\n\nTitle: ${game.title}.\n\nSytem: ${game.system}.\n\nFind out more at the link below`,
            separator: "\n\n",
        }
    }
    
    return ( game 
        ?
        <div className="flex flex-col lg:gap-4 p-4 lg:grid lg:grid-cols-3 lg:auto-rows-auto">
            <div id="game-image" className="flex justify-center items-center mb-4 lg:mb-0 lg:col-span-3">
                    <GameImage 
                        src={game.coverImage}
                        alt={game.title}
                        system={game.system}
                        width={256}
                        height={256} 
                        className="rounded-md shadow w-full lg:max-w-none" 
                    />
            </div>
            {/* <div id="game-info"className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-4 p-4 border border-green-500"> */}
                <div id="game-title" 
                    className="flex flex-col order-1 lg:order-1 lg:col-span-2 lg:row-start-2 lg:row-span-1 "
                    style={{ flexGrow: 1, minHeight: "25%" }}
                >
                    <h6 className="text-3xl font-bold text-slate-900">{game.title}</h6>
                    <p className="text-lg font-light text-slate-500">{game.system} | Campaign</p>
                </div>
                <div id="game-details" className="flex flex-col order-2 lg:order-2 lg:row-span-2 lg:col-start-3 lg:gap-4 lg:pl-4 ">
                    <div className="flex flex-col">
                        <div id="game-badges" className="flex flex-row gap-2">
                            {/* Clickable Favorite Badge */}
                            <Badge
                                key={`favorite-${game.id}`} // Add a unique key for each badge based on game.id}
                                className="right-2 cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent selecting the card when toggling favorite
                                    handleToggleFavorite(game.game_id, game.favorite);
                                }}
                            >
                                {game.favorite ? '🌟 Favorite' : <div className="flex items-center gap-2"><StarOff size={12} /><span className="text-slate-300"> Favorite</span></div>}
                            </Badge>
                            {game.pending && <Badge key={`pending-${game.id}`} className="right-2 cursor-pointer">🫂 Pending Approval</Badge>}
                            {game.registered && <Badge key={`registered-${game.id}`} className="right-2 cursor-pointer">🎉 Registered</Badge>}
                        </div>
                        <p className="mt-4"><strong>Gamemaster:</strong> {game.gm_given_name} {game.gm_surname}</p>
                        <div className="flex items-center gap-2">
                            {/* Icon and Text on the Same Line */}
                            <MdOutlineEventRepeat className="text-xl" />
                            <span>{game.interval} / {game.dayOfWeek}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Icon and Text on the Same Line */}
                            <LuCalendar className="text-xl" />
                            <span>{new Date(game.nextGameDate).toLocaleDateString()} @{' '}
                            {new Date(game.nextGameDate).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            })}</span>
                        </div>
                        <GameLocation location={game.location}/>
                        <div className="flex items-center gap-2">
                            <SiStatuspal className="text-xl" />
                            <span>{ enhanceStatus(game) }</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Icon and Text on the Same Line */}
                            <LuUsers className="text-xl" />
                            <span>{seatsAvailable(game)} Seats Filled</span>
                        </div>
                    </div>
                    <div className="flex flex-col w-full gap-4 mt-4">
                        { game.registered || game.pending
                            ? (
                            <Button
                                className="w-full"
                                onClick={(e) => {
                                    e.preventDefault();
                                    // TODO: Remove game from calendar
                                    handleRemoveRegistration(game.game_id, game.registered);
                                }}
                            >
                                {game.registered ? "Cancel Registration" : "Pending"}
                            </Button>
                            ): (
                                <Button
                                    className="w-full"
                                    disabled={seatsAvailable(game) === "Full"}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleAddRegistration(game.game_id, game.registered);                                        
                                    }}
                                >
                                    {seatsAvailable(game) === "Full" ? "Full" : "Add Game"}
                                </Button>

                        )}
                        <Button
                            className="w-full"
                            onClick={(e) => {
                                e.preventDefault(); 
                                setMessageModalOpen(true);
                            }}
                        >
                            Message Gamemaster
                        </Button>
                        <EmailShareButton className="cursor-pointer w-full" url={pathname} options={emailOptions(game)}>
                            <EmailShareIcon size={64} round />
                        </EmailShareButton>
                    </div>
                </div>
                <div id="game-description" 
                    className="order-3 lg:order-3 lg:col-span-2 lg:row-start-3 lg:row-span-3 mt-4 lg:mt-0 "
                    style={{ flexGrow: 3, minHeight: "75%" }}
                >
                    <h2 className="text-2xl font-bold mb-2 text-slate-700">About the Adventure</h2>
                    <p>{game.description}</p>
                </div>
                {/* MODALS GO HERE */}
                <MessageModal 
                    isOpen={isMessageModalOpen} 
                    onConfirm={() => handleMessageSubmit()}
                    onCancel={() => setMessageModalOpen(false)}
                    members={[]}
                    user={user}
                    mode='gm'
                    fixedRecipient={gamemaster}
                    useFixedRecipient={true}
                />
            {/* </div> */}
            {/* Confirmation Modal */}
            <ConfirmationModal
                title={confirmModalTitle}
                description={confirmModalDescription}
                isOpen={isConfirmModalOpen}
                onConfirm={handleModalConfirm}
                onCancel={() => setConfirmModalOpen(false)}
            />
        </div>
        :
        <div className="text-gray-500">Select a game to view details</div>
    );
}
