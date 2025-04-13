import { GameResourceDO } from "@/lib/types/custom";
import { Badge } from "@/components/ui/badge";

interface GameResourceProps {
  resources: GameResourceDO[];
  onSelect: (resource: GameResourceDO) => void;
}

export const GameResourceList = ({ resources, onSelect }: GameResourceProps) => (
  <div className="grid gap-4">
    {resources.map((res) => (
      <div 
        key={res.id} 
        className={`p-4 border rounded-md shadow
          ${res.pinned ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-950" : ""}
        `} 
        onClick={() => onSelect(res)}
      >
        {res.pinned && <Badge variant="outline">Pinned</Badge>}
        <h2 className="font-bold text-lg">{res.title}</h2>
        <p className="text-sm text-muted-foreground">{res.category}</p>
        <div className="prose mt-2" dangerouslySetInnerHTML={{ __html: res.body || "" }} />
        {res.external_url && (
          <a
            href={res.external_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline mt-2 block"
          >
            External Link
          </a>
        )}
      </div>
    ))}
  </div>
);