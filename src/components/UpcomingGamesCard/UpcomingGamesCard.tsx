import {
    Card,
    CardHeader,
    CardTitle,
    // CardDescription,
    CardContent,
    // CardFooter
} from "@/components/ui/card"
//import { Button } from "@/components/ui/button"
//import { DataTable } from "./DataTable"
//import { columns } from "./columns"
import { UpcomingGame } from "@/lib/types/custom"
import { format } from "date-fns"

type UpcomingGamesCardProps = {
    upcomingGames: UpcomingGame[]
}

const UpcomingGamesCard = ({ upcomingGames }: UpcomingGamesCardProps): React.ReactElement => {
    return (
        <Card>
      <CardHeader>
        <CardTitle>Upcoming Games</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          {upcomingGames.length > 0 ? (
            upcomingGames.map((game) => (
              <li key={game.id}>
                <strong>{game.title}</strong> on {format(new Date(game.scheduled_for), 'MMM dd, yyyy at h:mm a')}
              </li>
            ))
          ) : (
            <p>No upcoming games.</p>
          )}
        </ul>
      </CardContent>
    </Card>
    )
}

export default UpcomingGamesCard