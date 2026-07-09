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
    boxShadow: "0 4px 12px rgba(0,0,0,.2)",
  }}
>
  <IonCardHeader>
    <IonCardTitle
      style={{
        textAlign: "center",
        fontSize: "24px",
      }}
    >
      🏆 Leaderboard
    </IonCardTitle>
  </IonCardHeader>

  <IonCardContent>
    {sortedPlayers.length === 0 ? (
      <p style={{ textAlign: "center" }}>
        Waiting for players...
      </p>
    ) : (
      sortedPlayers.map((player, index) => (
        <div
          key={player.name}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "12px 0",
            borderBottom:
              index !== sortedPlayers.length - 1
                ? "1px solid #444"
                : "none",
          }}
        >
          <strong>
            {index === 0
              ? "🥇"
              : index === 1
              ? "🥈"
              : index === 2
              ? "🥉"
              : `${index + 1}.`}{" "}
            {player.name}
          </strong>

          <strong>{player.score} pts</strong>
        </div>
      ))
    )}
  </IonCardContent>
</IonCard>
  );
};

export default ScoreBoard;