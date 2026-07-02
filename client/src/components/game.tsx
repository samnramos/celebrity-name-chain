import { 
    IonCard, 
    IonCardContent, 
    IonInput, 
    IonContent,
    IonCardHeader,
    IonCardTitle,
    IonButton,
    IonItem

 } from "@ionic/react";

const Game: React.FC = () => {
  return (
    <IonCard>
        <IonCardHeader>
            <IonCardTitle>Celebrity Celebrity</IonCardTitle>
        </IonCardHeader>
      <IonCardContent>
        Albert Einstein
        <IonItem>
       <IonInput
       label="Room code"
         labelPlacement="stacked"
            placeholder="Enter room code"
            />
        </IonItem>
        <IonInput
       label="Username"
         labelPlacement="stacked"
            placeholder="Enter username"
            />

        <IonInput
       label="Answer"
         labelPlacement="stacked"
            placeholder="Enter celebrity name"
            />
      </IonCardContent>
      <IonButton expand="block">
                Submit
        </IonButton>
    </IonCard>
  );
};

export default Game;