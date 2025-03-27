import { RegisteredGameDO } from "@/lib/types/custom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import GameImage from "@/components/GameImage";


type Props = {
  game: RegisteredGameDO;
  children?: React.ReactNode;
  onClick?: () => void;
};

export const GameCard: React.FC<Props> = ({ game, children, onClick }) => {
  const router = useRouter();

  return (
    <Card className="shadow-md hover:shadow-lg transition-all cursor-pointer" onClick={onClick}>
      <CardHeader>
        <CardTitle>{game.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <GameImage 
          src={game.coverImage} 
          alt={game.title}
          system={game.system} 
          width={400} 
          height={200} 
          className="rounded-lg object-cover cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/games/adventure/${game.id}`);
          }} 
        />
        <p className="text-sm text-gray-500">Gamemaster: {game.gm_given_name + " " + game.gm_surname}</p>
        {game.location && <p className="text-sm text-gray-500">Location: {game.location.name}</p>}
        {game.scheduled_for
          ? (
            <p className="text-sm text-gray-500">Date: {new Date(game.scheduled_for).toLocaleDateString()}</p>
          ) : (
            <p className="text-sm text-gray-500">Date: TBD</p>
          )}
        {children}
      </CardContent>
    </Card>
  );
};
