


const RulesList = (): React.JSX.Element => {
    return (
        <div className="flex flex-col gap-4">
            <p className="mb-4">
                By completing this form for the TTRPG Group, you agree to abide by the following rules and responsibilities to ensure a safe, respectful, and enjoyable experience for everyone:
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-2">General Rules:</h3>
            <ul className="list-disc list-inside space-y-2">
                <li><strong>Respect All Participants:</strong> Treat your fellow players and the Game Master (GM) with respect and courtesy, both in and out of character.</li>
                <li><strong>Zero Tolerance for Discrimination or Harassment:</strong> Discrimination or harassment of any kind will not be tolerated.</li>
                <li><strong>Consent and Safety:</strong> Respect boundaries and content limits agreed upon by the group.</li>
                <li><strong>Stay in Character:</strong> Keep your focus on the game, and minimize out-of-character distractions unless necessary.</li>
                <li><strong>Avoid Metagaming:</strong> Use only the knowledge your character would reasonably have. Don’t let out-of-game information influence your decisions.</li>
                <li><strong>Share the Spotlight:</strong> Everyone deserves their time to shine. Support your fellow players and avoid monopolizing the game.</li>
                <li><strong>Follow the GM&apos;s Decisions:</strong> The GM has the final say on all rules and disputes during gameplay. Save any disagreements or questions for after the session.</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-2">Player Responsibilities:</h3>
            <ul className="list-disc list-inside space-y-2">
                <li><strong>Be Prepared:</strong> Bring your character sheet, dice, and other materials. Familiarize yourself with your character’s abilities and the basic rules of they system you are playing in.</li>
                <li><strong>Arrive on Time:</strong> Respect the group’s time by arriving promptly. If you expect to be late or absent, notify the GM as soon as possible.</li>
                <li><strong>Stay Focused and Engaged:</strong> Avoid using your phone or engaging in unrelated side conversations during the game.</li>
                <li><strong>Work as a Team:</strong> D&D and other RPGs are collaborative games. Cooperate with the party and contribute to the group’s goals, even if your character has personal motivations.</li>
                <li><strong>Respect the Game World and NPCs:</strong> The DM works hard to create an immersive world. Engage with the story respectfully, and treat NPCs as part of that world.</li>
                <li><strong>Resolve Conflicts Maturely:</strong> Address any disagreements or issues calmly and respectfully, preferably outside of game time.</li>
            </ul>
        </div>
    )
}

export default RulesList;