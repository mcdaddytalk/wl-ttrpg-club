// import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "./DataTable"
import { columns } from './columns';
import { Player } from "@/lib/types/custom";


type GameRegistrantsCardProps = {
    registrants: Player[];
    className?: string;
}

const GameRegistrantsCard= ({ registrants, className }: GameRegistrantsCardProps): React.ReactElement => {
    console.log('Registrants', registrants)
    return (
        <Card className={className}>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Players</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={registrants || []}
          />         
        </CardContent>
      </Card>
    )
}

export default GameRegistrantsCard;