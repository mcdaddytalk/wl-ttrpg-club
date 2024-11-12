import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter
} from "@/components/ui/card"
import { RegisteredCharacter } from "@/lib/types/custom"
import React from "react"
import { DataTable } from "./DataTable"
import { columns } from "./columns"

type RegisteredCharactersCardProps = {
    registeredCharacters: RegisteredCharacter[]
}

const RegisteredCharactersCard = ({ registeredCharacters }: RegisteredCharactersCardProps): React.ReactNode => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Registered Characters</CardTitle>
                <CardDescription>
                    View all registered characters
                </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
            <DataTable
                columns={columns}
                data={registeredCharacters || []}
            />
            </CardContent>
            <CardFooter>            </CardFooter>
        </Card>
    )
}

export default RegisteredCharactersCard