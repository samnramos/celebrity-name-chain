import Game from "../components/Game";
import ScoreBoard from "../components/scoreBoard";
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Celebrity Name Chain</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <Game />
        <ScoreBoard />
      </IonContent>
    </IonPage>
  );
};

export default Home;
