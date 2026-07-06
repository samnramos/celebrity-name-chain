import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from "@ionic/react";

type ScoreBoard = {
  players: {
    name: string;
    score: number;
  }[];
};

const ScoreBoard: React.FC<ScoreBoard> = ({ players }) => {
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Scoreboard</IonCardTitle>
      </IonCardHeader>

      <IonCardContent>
        {players.map((player, index) => (
          <p key={index}>
            {player.name}: {player.score} points
          </p>
        ))}
      </IonCardContent>
    </IonCard>
  );
};

export default ScoreBoard;
