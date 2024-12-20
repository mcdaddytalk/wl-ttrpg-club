
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import GameList from "@/components/GameList/GameList"
import { GMGameData } from "@/lib/types/custom";

interface SelectedGameCardProps {
    game: GMGameData | null;
}

const SelectedGameCard = ({ game }: SelectedGameCardProps): React.ReactElement => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Selected Game</CardTitle>
            </CardHeader>
            <CardContent>
                { 
                    game 
                    ? <GameList games={[game]} />
                    : <p>No game selected</p>
                }
            </CardContent>
        </Card>
    )
}

export default SelectedGameCard;