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
    upcomingGames: UpcomingGame[] | null
}

const formatDate = (date: Date | null) => {
    if (date) {
      return format(date, 'MMM dd, yyyy at h:mm a');
    }
    return 'No date available';
}

const UpcomingGamesCard = ({ upcomingGames }: UpcomingGamesCardProps): React.ReactElement => {
    return (
        <Card>
      <CardHeader>
        <CardTitle>Upcoming Games</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          {upcomingGames && upcomingGames.length > 0 ? (
            upcomingGames.map((game) => (
              <li key={game.id}>
                <strong>{game.title}</strong> on {formatDate(game.scheduled_for)}
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