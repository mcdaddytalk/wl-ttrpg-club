import Image from "next/image";
import { RegisteredGameDO } from "@/lib/types/custom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  game: RegisteredGameDO;
  children?: React.ReactNode;
};

export const GameCard: React.FC<Props> = ({ game, children }) => {
  return (
    <Card className="shadow-md hover:shadow-lg transition-all">
      <CardHeader>
        <CardTitle>{game.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Image src={game.coverImage || "/placeholder.jpg"} alt={game.title} width={400} height={200} className="rounded-lg object-cover" />
        <p className="text-sm text-gray-500">Gamemaster: {game.gamemasterId}</p>
        {game.scheduled_for && <p className="text-sm text-gray-500">Next Session: {game.scheduled_for.toISOString()}</p>}
        {game.location && <p className="text-sm text-gray-500">Location: {game.location.name}</p>}
        {children}
      </CardContent>
    </Card>
  );
};
