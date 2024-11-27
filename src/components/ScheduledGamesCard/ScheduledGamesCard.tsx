// import { Button } from "@/components/ui/button"
import { DataTable } from "./DataTable"
import { columns } from './columns';
import { GMGameData } from "@/lib/types/custom";
import NewGameModal from "../NewGameModal";
import { useState } from "react";


type ScheduledGamesCardProps = {
    scheduledGames: GMGameData[];
    onSelectGame: (game: GMGameData) => void;
    onGameAdded: () => void;
    gamemaster_id: string
}

const ScheduledGamesCard= ({ scheduledGames, onSelectGame, onGameAdded, gamemaster_id }: ScheduledGamesCardProps): React.ReactElement => {
    console.log('scheduledGames', scheduledGames)
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true); 
    const closeModal = () => setIsModalOpen(false); 

    return (
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Scheduled Games</h3>
          <button
            onClick={openModal}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add New Game
          </button>
        </div>
        { scheduledGames && scheduledGames.length > 0
          ? 
            <DataTable
              columns={columns}
              onSelectGame={onSelectGame}
              data={scheduledGames || []}
            />
          :
          <div className="text-center p-4">No scheduled games found.  Click the &ldquo;Add New Game&rdquo; button to create a new game.</div>
        }         
        {isModalOpen && (
          <NewGameModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onGameAdded={onGameAdded}
            gamemaster_id={gamemaster_id} // Trigger refresh after adding a game
          />
        )}
      </div>
    )
}

export default ScheduledGamesCard;