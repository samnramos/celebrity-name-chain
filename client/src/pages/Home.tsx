
import Game from "../components/game";
// import ScoreBoard from "../components/scoreBoard"
import {useQuery} from "@tanstack/react-query";
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar,
  IonLabel,
  IonList,
  IonItem
} from '@ionic/react';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

// Defines the structure of the data returned from the API

interface Celebrity {
  "Room Code": string;
  Username: string;
  "Celebrity Name": string;
}

const Home: React.FC = () =>{
  const {data, isLoading, error} = useQuery<Celebrity[]> ({
    queryKey: ["celebrities"],
    queryFn: () => 
      fetch(`${API_URL}/`, {cache: 'no-store'}).then((res) => res.json()),
    refetchInterval: 1500,
  });


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Celebrity Name Chain</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className = "ion-padding">
        {isLoading && <p>Loading....</p>}
        {error && <p> Could not reach the server. </p>}
        <IonList>
          {data?.map((m, i) => (
            <IonItem key = {i}>
              <IonLabel>
                <h2>
                  {m["Room Code"]}
                </h2>
                <p>
                  {m["Username"]}
                </p>
                <h3>
                  {m["Celebrity Name"]}
                </h3>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
        {data?.length === 0 && <p> No guesses yet. </p>}
        <Game />
        {/* <ScoreBoard /> */}
      </IonContent>
    </IonPage>
  );
};

export default Home;
