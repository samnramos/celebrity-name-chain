import { IonCard, IonCardContent } from "@ionic/react";
import {
    IonContent,
    IonCardHeader,
    IonCardTitle
} from "@ionic/react";
const Game: React.FC = () => {
  return (
    <IonCard>
        <IonCardHeader>
            <IonCardTitle>Celebrity Celebrity</IonCardTitle>
        </IonCardHeader>
      <IonCardContent>
        Albert Einstein
      </IonCardContent>
    </IonCard>
  );
};

export default Game;