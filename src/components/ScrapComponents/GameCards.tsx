import { Link } from "lucide-react"
import { Button } from "@/components/ui/button"
import GameList from "../GameList/GameList"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { GMGameData } from "@/lib/types/custom"


const GameCardSample = () => {

    const mockScheduledGames: GMGameData[] = [
        
    ]  
    return (
        <div>
            <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold">GM Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
                <Button asChild >
                    <Link href="/gamemaster/add-game">Create New Game</Link>
                </Button>
                <GameList games={mockScheduledGames} />
            </CardContent>
            </Card>                 
            <Card>
            <CardHeader>
                <CardTitle className="text-3xl font-bold">Upcoming Games</CardTitle>
            </CardHeader>
            <CardContent>
                <GameList games={mockScheduledGames} />
            </CardContent>
            </Card>
        </div>
    )
}

export default GameCardSample