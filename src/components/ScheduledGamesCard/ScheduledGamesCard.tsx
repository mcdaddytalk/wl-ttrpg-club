// import { Button } from "@/components/ui/button"
import { DataTable } from "./DataTable"
import { columns } from './columns';
import { GMGameData } from "@/lib/types/custom";
import NewGameModal from "@/components/NewGameModal";
import { useState } from "react";
import { EditGameModal } from "../EditGameModal";


type ScheduledGamesCardProps = {
    scheduledGames: GMGameData[];
    onShowDetails: (game: GMGameData) => void;
    onGameEdit: (game: GMGameData) => void;
    onGameAdded: () => void;
    gamemaster_id: string
}

const ScheduledGamesCard= ({ scheduledGames, onShowDetails, onGameEdit, onGameAdded, gamemaster_id }: ScheduledGamesCardProps): React.ReactElement => {
    const [isNewGameModalOpen, setNewGameModalOpen] = useState(false);
    const [isEditGameModalOpen, setEditGameModalOpen] = useState(false);
    const [selectedGame, setSelectedGame] = useState<GMGameData | null>(null);

    const openNewGameModal = () => setNewGameModalOpen(true); 
    const closeNewGameModal = () => setNewGameModalOpen(false);
    
    const handleEditGameConfirm = () => {
      if (selectedGame) {
        onGameEdit(selectedGame);
        setEditGameModalOpen(false);
      }
    }

    const enhancedScheduledGames = scheduledGames.map((game) => ({
      ...game,
      onEditGame: (game: GMGameData) => {
        setSelectedGame(game);
        setEditGameModalOpen(true);
      },
      onShowDetails: () => onShowDetails(game)
    }));

    return (
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Scheduled Games</h3>
          <button
            onClick={openNewGameModal}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add New Game
          </button>
        </div>
        { scheduledGames && scheduledGames.length > 0
          ? 
            <DataTable<GMGameData, unknown>
              columns={columns}
              data={enhancedScheduledGames}
            />
          :
          <div className="text-center p-4">No scheduled games found.  Click the &ldquo;Add New Game&rdquo; button to create a new game.</div>
        }
        {isEditGameModalOpen && selectedGame && (
          <EditGameModal
            isOpen={isEditGameModalOpen}
            game={selectedGame}
            onConfirm={handleEditGameConfirm}
            onCancel={ () => setEditGameModalOpen(false) }
            gamemaster_id={gamemaster_id}
          />
        )}
        {isNewGameModalOpen && (
          <NewGameModal
            isOpen={isNewGameModalOpen}
            onClose={closeNewGameModal}
            onGameAdded={onGameAdded}
            gamemaster_id={gamemaster_id} // Trigger refresh after adding a game
          />
        )}
      </div>
    )
}

export default ScheduledGamesCard;