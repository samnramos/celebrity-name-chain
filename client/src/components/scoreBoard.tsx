import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from "@ionic/react";

type ScoreBoardProps = {
  players: {
    name: string;
    score: number;
  }[];
};

const ScoreBoard: React.FC<ScoreBoardProps> = ({ players }) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <IonCard
      style={{
        borderRadius: "12px",
      }}
    >
      <IonCardHeader>
        <IonCardTitle>🏆 Scoreboard</IonCardTitle>
      </IonCardHeader>

      <IonCardContent>
        {sortedPlayers.length === 0 ? (
          <p>No scores yet.</p>
        ) : (
          sortedPlayers.map((player, index) => (
            <div
              key={player.name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 0",
                borderBottom:
                  index !== sortedPlayers.length - 1
                    ? "1px solid #3a3a3a"
                    : "none",
              }}
            >
              <strong>
                {index + 1}. {player.name}
              </strong>

              <span style={{ fontWeight: "bold" }}>
                {player.score} pts
              </span>
            </div>
          ))
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default ScoreBoard;