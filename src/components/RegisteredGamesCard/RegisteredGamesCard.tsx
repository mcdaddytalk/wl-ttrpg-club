// import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "./DataTable"
import { columns } from './columns';
import { RegisteredGame } from "@/lib/types/custom";

type RegisteredGamesCardProps = {
    registeredGames: RegisteredGame[] | null;
}
const RegisteredGamesCard= ({ registeredGames }: RegisteredGamesCardProps): React.ReactElement => {

    return (
        <Card>
        <CardHeader>
          <CardTitle>Registered Games</CardTitle>
        </CardHeader>
        <CardContent>
          {registeredGames === null
            ? (
              <div className='text-muted-foreground'>No registered games found.</div>
            )
            : ( 
              <DataTable
                columns={columns}
                data={registeredGames || []}
              />
          )}
        </CardContent>
      </Card>
    )
}

export default RegisteredGamesCard