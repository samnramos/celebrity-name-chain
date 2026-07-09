import "./ScoreBoard.css";

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
<IonCard className="leaderboard-card">

<IonCardHeader className="leaderboard-header">
  <IonCardTitle className="leaderboard-title">
    🏆 Leaderboard
  </IonCardTitle>
</IonCardHeader>

  <IonCardContent>
    {sortedPlayers.length === 0 ? (
     <p className="waiting-text">
           🎮 Waiting for players...
    </p>
    ) : (
      sortedPlayers.map((player, index) => (
      
      
      
        <div className={`player-row ${
            index === 0
                   ? "gold"
            : index === 1
                   ? "silver"
            : index === 2
                   ? "bronze"
            : ""
}`}
        key={player.name}
  >
       <span className="player-name">
           {index === 0
            ? "🥇"
           : index === 1
          ? "🥈"
           : index === 2
           ? "🥉"
           : `${index + 1}.`}{" "}
           {player.name}
            </span>

          <span className="player-score">
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