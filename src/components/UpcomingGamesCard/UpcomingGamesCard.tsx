import {
    Card,
    CardHeader,
    CardTitle,
    CardContent
} from "@/components/ui/card"
import { UpcomingGame } from "@/lib/types/custom"
import { formatDate } from "@/utils/helpers"

type UpcomingGamesCardProps = {
    upcomingGames: UpcomingGame[] | null
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