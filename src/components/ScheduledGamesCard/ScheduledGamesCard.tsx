// import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "./DataTable"
import { columns } from './columns';
import { GMGameSchedule } from "@/lib/types/custom";


type ScheduledGamesCardProps = {
    scheduledGames: GMGameSchedule[];
}

const ScheduledGamesCard= ({ scheduledGames }: ScheduledGamesCardProps): React.ReactElement => {
    console.log('scheduledGames', scheduledGames)
    return (
        <Card>
        <CardHeader>
          <CardTitle>Scheduled Games</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={scheduledGames || []}
          />         
        </CardContent>
      </Card>
    )
}

export default ScheduledGamesCard;