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
       <p> Albert Einstein</p> 
        <IonItem>
       <IonInput
       label="Room code"
         labelPlacement="stacked"
            placeholder="Enter room code"
            />
        </IonItem>
       <IonItem>
        <IonInput
       label="Username"
         labelPlacement="stacked"
            placeholder="Enter username"
            />
        </IonItem>
        <IonItem>
        <IonInput
       label="Answer"
         labelPlacement="stacked"
            placeholder="Enter celebrity name"
            />
        </IonItem>
      </IonCardContent>
      <IonButton expand="block">
                Submit
        </IonButton>
    </IonCard>
  );
};

export default Game;