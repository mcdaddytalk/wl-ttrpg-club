import { AdventurePageDetails } from "./AdventureDetailsPage";


interface AdventurePageParams {
    game_id: string;
}

const AdventurePage = async ({ params }: { params: Promise<AdventurePageParams> }) => {
    const { game_id } = await params;
    
    return (
        <section className="flex flex-col">
            <AdventurePageDetails game_id={game_id} />
        </section>
    )
}

export default AdventurePage