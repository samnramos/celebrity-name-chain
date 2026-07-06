import {
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
} from "@ionic/react";

const ScoreBoard: React.FC = () => {
    const players = [
    { name: "Nusrat", score: 10 },
    { name: "Sam", score: 8 },
    { name: "John", score: 5 },
  ];


    
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
}

 export default ScoreBoard;