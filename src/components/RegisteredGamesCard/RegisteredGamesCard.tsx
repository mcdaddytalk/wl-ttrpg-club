import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "./DataTable"
import { columns } from './columns';
import { RegisteredGame } from "@/lib/types/custom";

type RegisteredGamesCardProps = {
    registeredGames: RegisteredGame[];
}
const RegisteredGamesCard= ({ registeredGames }: RegisteredGamesCardProps): React.ReactElement => {
    return (
        <Card>
        <CardHeader>
          <CardTitle>Registered Games</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={registeredGames || []}
          />
          <Button>Add New Game</Button>
        </CardContent>
      </Card>
    )
}

export default RegisteredGamesCard