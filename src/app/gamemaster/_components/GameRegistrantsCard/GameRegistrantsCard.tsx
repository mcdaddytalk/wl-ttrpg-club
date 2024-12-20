// import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/DataTable/data-table"
import { getColumns } from './columns';
import { ContactListDO, Player } from "@/lib/types/custom";
import { useDataTable } from "@/hooks/use-data-table";
import MessageModal from "@/components/MessageModal";
import { User } from "@supabase/supabase-js";
import { ApprovalModal } from "@/components/ApprovalModal";
import PlayerViewModal from "@/components/PlayerViewModal";


type GameRegistrantsCardProps = {
    user: User;
    contactList: ContactListDO[];
    gameId: string;
    registrants: Player[];
    className?: string;
}

const GameRegistrantsCard= ({ user, contactList, gameId, registrants, className }: GameRegistrantsCardProps): React.ReactElement => {

    const [isMessageModalOpen, setMessageModalOpen] = useState<boolean>(false); 
    const [isApprovalModalOpen, setApprovalModalOpen] = useState<boolean>(false);
    const [isPlayerViewModalOpen, setPlayerViewModalOpen] = useState<boolean>(false);
    const [approvalMode, setApprovalMode] = useState<'pending' | 'approved' | 'rejected'>('pending');
    const [fixedRecipient, setRecipient] = useState<Player | string>("");
    const [selectedPlayer, setSelectedPlayer] = useState<Player>();

    const [activeModal, setActiveModal] = useState<string | null>(null);

    const openModal = (modal: string, player: Player) => {
      setSelectedPlayer(player);
      switch (modal) {
        case 'sendMessage':
          setRecipient(player);
          setMessageModalOpen(true);
          break;
        case 'approvePlayer':
          setApprovalMode(player.status === 'pending' ? 'approved' : 'pending');
          setApprovalModalOpen(true);
          break;
        case 'kickPlayer':
          setApprovalMode('rejected');
          setApprovalModalOpen(true);
          break;
        case 'viewPlayer':
          setPlayerViewModalOpen(true);
          break;
        default:
          break;
      }
      setActiveModal(modal);
    }

    const closeModal = () => {
      switch(activeModal) {
        case 'sendMessage':
          setMessageModalOpen(false);
          break;
        case 'approvePlayer':
          setApprovalModalOpen(false);
          break;
        case 'kickPlayer':
          setApprovalModalOpen(false);
          break;
        case 'playerView':
          setPlayerViewModalOpen(false);
          break;
        default:
          break;
      }
      setActiveModal(null);
    }

    const handleMessageSubmit = () => {
      setMessageModalOpen(false);
      closeModal();
    };

    const handleApprovalSubmit = () => {
      setApprovalModalOpen(false);
      closeModal();
    }

    const enhancedRegistrants = registrants.map((player) => {
      return {
        ...player,
        status_icon: player.status === 'pending' ? "🔴" : player.status === 'approved' ? "🟢" : "🔴",        
      };
    });
   
    const { table } = useDataTable({
        data: enhancedRegistrants || [],
        columns: getColumns({ onOpenModal: openModal }),
        pageCount: 1,
        filterFields: [],
        enableAdvancedFilter: false,
        initialState: {
            sorting: [
              { id: "status", desc: true },
            ],
            pagination: {
                pageIndex: 0,
                pageSize: 5
            },
            columnPinning: {
              right: ["actions"]
            }
        },
        getRowId: (row) => row.id,
        shallow: false,
        clearOnDefault: true
    })

    return (
        <section className="flex flex-col">
          <Card className={className}>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Players</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable table={table} />
            </CardContent>
          </Card>
          {/* MODALS GO HERE */}
          {activeModal === 'sendMessage' && selectedPlayer &&
            <MessageModal 
              isOpen={isMessageModalOpen} 
              onConfirm={() => handleMessageSubmit()}
              onCancel={() => closeModal()}
              user={user}
              members={contactList}
              mode={"player"}
              fixedRecipient={fixedRecipient}
              useFixedRecipient={fixedRecipient !== ""}
            />
          }
          {(activeModal === 'approvePlayer' || activeModal === 'kickPlayer') && selectedPlayer &&
          <ApprovalModal
            isOpen={isApprovalModalOpen}
            onCancel={() => closeModal()}
            onConfirm={() => handleApprovalSubmit()}
            player={selectedPlayer}
            gmId={user.id}
            gameId={gameId}
            approvalMode={approvalMode}
          />}
          {activeModal === 'viewPlayer' && selectedPlayer &&
          <PlayerViewModal
            isOpen={isPlayerViewModalOpen}
            onCancel={() => closeModal()}
            player={selectedPlayer}
          />}
      </section>
    )
}

export default GameRegistrantsCard;