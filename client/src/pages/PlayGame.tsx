import ScoreBoard from "../components/scoreBoard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Controller, useForm } from "react-hook-form";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

type AnswerEntry = {
  id: number;
  username: string;
  celebrity: string;
  createdAt: string;
};

type GameRoom = {
  id: number;
  roomCode: string;
  letter: string;
  createdAt: string;
  answers: AnswerEntry[];
};

type GamesResponse = {
  games: GameRoom[];
};

type AnswerForm = {
  roomCode: string;
  username: string;
  answer: string;
};

const getLastName = (name: string) => {
  const parts = name.trim().split(" ");
  return parts[parts.length - 1];
};

const showNameWithLastInitial = (name: string) => {
  const lastName = getLastName(name);
  const lastNameIndex = name.lastIndexOf(lastName);

  return (
    <>
      {name.slice(0, lastNameIndex)}
      <IonText color="primary">
        <strong>{lastName.charAt(0)}</strong>
      </IonText>
      {lastName.slice(1)}
    </>
  );
};

const PlayGame: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedRoomCode, setSelectedRoomCode] = useState("");
  const { control, handleSubmit, resetField, setValue } = useForm<AnswerForm>({
    defaultValues: {
      roomCode: "",
      username: "",
      answer: "",
    },
  });

  const { data, isLoading, error } = useQuery<GamesResponse>({
    queryKey: ["games"],
    queryFn: () =>
      fetch(`${API_URL}/games`, {
        cache: "no-store",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }).then((res) => res.json()),
    refetchInterval: 1500,
  });

  const submitAnswer = useMutation({
    mutationFn: (data: AnswerForm) =>
      fetch(`${API_URL}/answers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(data),
      }).then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
      resetField("answer");
    },
  });

  const onSubmit = (data: AnswerForm) => {
    submitAnswer.mutate(data);
  };

  const games = data?.games || [];
  const currentGame = games.find((game) => game.roomCode === selectedRoomCode);
  const recentAnswers = currentGame?.answers.slice(-3) || [];

  const chooseGame = (game: GameRoom) => {
    setSelectedRoomCode(game.roomCode);
    setValue("roomCode", game.roomCode);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Play Game</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        {isLoading && <p>Loading...</p>}
        {error && <p>Could not reach the server.</p>}

        {!currentGame && (
          <>
            <h2>Active Games</h2>

            <IonList>
              {games.map((game) => (
                <IonItem button key={game.id} onClick={() => chooseGame(game)}>
                  <IonLabel>
                    <h2>{game.roomCode}</h2>
                    <p>Required letter: {game.letter}</p>
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>

            {games.length === 0 && <p>No games yet.</p>}
          </>
        )}

        {currentGame && (
           <div style={{ 
            display: "flex", 
            gap: "20px",
            alignItems: "flex-start",
            }}>
            <div style={{ flex: 2 }}>
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>{currentGame.roomCode}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <p>
                  Current Letter:{" "}
                  <IonText color="primary">
                    <strong>{currentGame.letter}</strong>
                  </IonText>
                </p>

                {recentAnswers.length > 0 && (
                  <p>
                    {recentAnswers.map((answer, index) => (
                      <span key={answer.id}>
                        {showNameWithLastInitial(answer.celebrity)}
                        {index < recentAnswers.length - 1 && " > "}
                      </span>
                    ))}{" "}
                    &gt;{" "}
                    <IonText color="primary">
                      <strong>{currentGame.letter}</strong>
                    </IonText>
                  </p>
                )}
              </IonCardContent>
            </IonCard>

            <form onSubmit={handleSubmit(onSubmit)}>
              <IonItem>
                <Controller
                  name="roomCode"
                  control={control}
                  render={({ field }) => (
                    <IonInput
                      label="Room code"
                      labelPlacement="stacked"
                      placeholder="TEST01"
                      value={field.value}
                      onIonChange={(e) => field.onChange(e.detail.value)}
                    />
                  )}
                />
              </IonItem>

              <IonItem>
                <Controller
                  name="username"
                  control={control}
                  render={({ field }) => (
                    <IonInput
                      label="Username"
                      labelPlacement="stacked"
                      placeholder="Player name"
                      value={field.value}
                      onIonChange={(e) => field.onChange(e.detail.value)}
                    />
                  )}
                />
              </IonItem>

              <IonItem>
                <Controller
                  name="answer"
                  control={control}
                  render={({ field }) => (
                    <IonInput
                      label="Answer"
                      labelPlacement="stacked"
                      placeholder="Elvis Presley"
                      value={field.value}
                      onIonChange={(e) => field.onChange(e.detail.value)}
                    />
                  )}
                />
              </IonItem>

              <IonButton type="submit" expand="block">
                Submit
              </IonButton>
            </form>

            <IonButton
              fill="clear"
              expand="block"
              onClick={() => setSelectedRoomCode("")}
            >
              Choose another game
            </IonButton>
            </div>

              <div style={{ flex: 1 }}>
                <ScoreBoard />
                </div>

          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default PlayGame;
