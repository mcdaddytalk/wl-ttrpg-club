// import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/DataTable/data-table";
import { getColumns } from "./columns";
import { Location, GMGameData, DataTableFilterField, MemberDO } from "@/lib/types/custom";
import NewGameModal from "@/components/Modal/NewGameModal";
import { useState } from "react";
import { EditGameModal } from "@/components/Modal/EditGameModal";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTableToolbar } from "@/components/DataTable/data-table-toolbar";
import { ConfirmationModal } from "@/components/Modal/ConfirmationModal";
import { SetGameTimeModal } from "@/components/Modal/SetGameTimeModal";
import { TransferGameModal } from "@/components/Modal/TransferGameModal";
import { GameInviteModal } from "@/components/Modal/GameInviteModal";

type ScheduledGamesCardProps = {
    scheduledGames: GMGameData[];
    locations: Location[];
    members: MemberDO[];
    gamemasters: MemberDO[];
    onShowDetails: (game: GMGameData) => void;
    onGameAdded: () => void;
    onGameEdit: () => void;
    onGameDelete: (id: string) => void;
    gamemaster_id: string
}

const ScheduledGamesCard= ({ scheduledGames, onShowDetails, onGameAdded, onGameEdit, onGameDelete, gamemaster_id, locations,members, gamemasters }: ScheduledGamesCardProps): React.ReactElement => {
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [isNewGameModalOpen, setNewGameModalOpen] = useState(false);
    const [isInvitesGameModalOpen, setInvitesGameModalOpen] = useState(false);
    const [isEditGameModalOpen, setEditGameModalOpen] = useState(false);
    const [isTimeGameModalOpen, setTimeGameModalOpen] = useState(false);
    const [isTransferGameModalOpen, setTransferGameModalOpen] = useState(false);
    const [isDeleteGameModalOpen, setDeleteGameModalOpen] = useState(false);
    const [selectedGame, setSelectedGame] = useState<GMGameData | null>(null);
    
    const openModal = (modal: string, game?: GMGameData) => {
      if (game) setSelectedGame(game);
      switch(modal) {
        case 'addNew':
          setNewGameModalOpen(true);
          break;
        case 'invites':
          setInvitesGameModalOpen(true);
          break;
        case 'edit':
          setEditGameModalOpen(true);
          break;
        case 'time':
          setTimeGameModalOpen(true);
          break;
        case 'transfer':
          setTransferGameModalOpen(true);
          break;
        case 'delete':
          setDeleteGameModalOpen(true);
          break;
      }
      setActiveModal(modal);
    }

    const closeModal = () => {
      switch(activeModal) {
        case 'addNew':
          setNewGameModalOpen(false);
          break;
        case 'invites':
          setInvitesGameModalOpen(false);
          break;
        case 'edit':
          setEditGameModalOpen(false);
          break;
        case 'time':
          setTimeGameModalOpen(false);
          break;
        case 'transfer':
          setTransferGameModalOpen(false);
          break;
        case 'delete':
          setDeleteGameModalOpen(false);
          break;
      }
      setActiveModal(null);
    }
    
    const handleEditGameConfirm = () => {
      onGameEdit();
      closeModal();
    }

    const handleGameTimeChange = () => {
      onGameEdit();
      closeModal();
    }

    const handleTransferGame = () => {
      onGameEdit();
      closeModal();
    }

    const handleRemoveGameConfirm = () => {
      if (selectedGame)
        onGameDelete(selectedGame.id);
      closeModal();
    }

    const enhancedScheduledGames = scheduledGames.map((game) => ({
      ...game,      
      onShowDetails: () => onShowDetails(game)
    }));

    const pageSize = 5;
    const pageCount = Math.ceil((scheduledGames?.length || 0) / pageSize);
    const filterFields: DataTableFilterField<GMGameData>[] = [];

    const { table } = useDataTable({
      data: enhancedScheduledGames,
      columns: getColumns({ onOpenModal: openModal }),
      pageCount: pageCount || -1,
      filterFields,
      enableAdvancedFilter: false,
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize,
        },
        sorting: [],
        columnPinning: {
          right: ['actions']
        }
      },
      getRowId: (originalRow) => originalRow.id,
      shallow: true,
      clearOnDefault: true,
    })

    return (
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Scheduled Games</h3>
          <button
            onClick={() => openModal('addNew')}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add New Game
          </button>
        </div>
        { scheduledGames && scheduledGames.length > 0
          ? 
            <DataTable
                table={table}
            >
                <DataTableToolbar table={table} filterFields={filterFields}>
                    
                </DataTableToolbar>
            </DataTable>
          :
          <div className="text-center p-4">No scheduled games found.  Click the &ldquo;Add New Game&rdquo; button to create a new game.</div>
        }
        {activeModal === 'addNew' && (
          <NewGameModal
            isOpen={isNewGameModalOpen}
            onClose={closeModal}
            onGameAdded={onGameAdded}
            gamemaster_id={gamemaster_id}
            locations={locations}
          />
        )}
        {activeModal === 'invites' && selectedGame && (
          <GameInviteModal
            isOpen={isInvitesGameModalOpen}
            gameId={selectedGame.id}
            members={members}
            gamemasterId={gamemaster_id}
            onConfirm={ () => closeModal() }
            onCancel={ () => closeModal() }
          />
        )}
        {activeModal === 'edit' && selectedGame && (
          <EditGameModal
            isOpen={isEditGameModalOpen}
            game={selectedGame}
            onConfirm={handleEditGameConfirm}
            onClose={ () => closeModal() }
            gamemaster_id={gamemaster_id}
            locations={locations}
          />
        )}
        {activeModal === 'time' && selectedGame && (
          <SetGameTimeModal
            isOpen={isTimeGameModalOpen}
            game={selectedGame}
            gamemaster_id={gamemaster_id}
            onConfirm={handleGameTimeChange}
            onClose={ () => closeModal() }
          />
        )}
        {activeModal === 'transfer' && selectedGame && (
          <TransferGameModal
            isOpen={isTransferGameModalOpen}
            game={selectedGame}
            gamemaster_id={gamemaster_id}
            gamemasters={gamemasters}
            onConfirm={handleTransferGame}
            onClose={ () => closeModal() }
          />
        )}        
        {activeModal === 'delete' && selectedGame && (
          <ConfirmationModal
            isOpen={isDeleteGameModalOpen}
            onCancel={closeModal}
            onConfirm={handleRemoveGameConfirm}
            title="Delete Game"
            description={`Are you sure you want to delete the game "${selectedGame.title}"?`}
          />
        )}
      </div>
    )
}

export default ScheduledGamesCard;