import ScoreBoard from "../components/scoreBoard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import {
  alertCircleOutline,
  arrowBackOutline,
  gameControllerOutline,
  timeOutline,
} from "ionicons/icons";
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
  players: {
    name: string;
    score: number;
  }[];
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
  const [answerMessage, setAnswerMessage] = useState("");
  const [roomCodeInput, setRoomCodeInput] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [answerInput, setAnswerInput] = useState("");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const { control, handleSubmit, resetField, setValue } = useForm<AnswerForm>({
    defaultValues: {
      roomCode: "",
      username: "",
      answer: "",
    },
  });

  const { data, isLoading, error } = useQuery<GamesResponse>({
    queryKey: ["games"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/games`, {
        cache: "no-store",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message ?? `Could not load games (${response.status}).`,
        );
      }

      return result as GamesResponse;
    },
    refetchInterval: 1500,
  });

  const submitAnswer = useMutation({
    mutationFn: async (data: AnswerForm) => {
      const response = await fetch(`${API_URL}/answers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(data),
      });

      return response.json();
    },
    onSuccess: (data) => {
      setAnswerMessage(data.message);
      queryClient.invalidateQueries({ queryKey: ["games"] });

      if (data.answer) {
        setAnswerInput("");
        resetField("answer");
      }
    },
  });

  const onSubmit = (data: AnswerForm) => {
    submitAnswer.mutate(data);
  };

  const games = data?.games || [];
  const currentGame = games.find((game) => game.roomCode === selectedRoomCode);
  const recentAnswers = currentGame?.answers.slice(-3) || [];
  const gameDuration = 5 * 60 * 1000;
  const scoreboardDuration = 60 * 1000;
  const totalDuration = gameDuration + scoreboardDuration;

  const elapsedTime = currentGame
    ? now - new Date(currentGame.createdAt).getTime()
    : 0;

  const answerTimeRemaining = currentGame
    ? Math.max(0, gameDuration - elapsedTime)
    : 0;

  const roomTimeRemaining = currentGame
    ? Math.max(0, totalDuration - elapsedTime)
    : 0;

  const gameIsOver = answerTimeRemaining === 0;

  const timerToShow = gameIsOver ? roomTimeRemaining : answerTimeRemaining;
  const minutes = Math.floor(timerToShow / 60000);
  const seconds = Math.floor((timerToShow % 60000) / 1000);
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  const chooseGame = (game: GameRoom) => {
    setSelectedRoomCode(game.roomCode);
    setRoomCodeInput(game.roomCode);
    setValue("roomCode", game.roomCode);
    setAnswerMessage("");
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
        {error && (
          <IonText color="danger">
            <p role="alert">
              {error instanceof Error
                ? error.message
                : "Could not reach the server."}
            </p>
          </IonText>
        )}

        {!currentGame && (
          <>
            <h2>
              <IonIcon icon={gameControllerOutline} /> Active Games
            </h2>

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
          <div
            style={{
              display: "flex",
              gap: "24px",
              maxWidth: "1200px",
              margin: "0 auto",
            }}
          >
            <div style={{ flex: 2 }}>
              <IonCard
                style={{
                  margin: "0",
                  marginBottom: "16px",
                  borderRadius: "8px",
                }}
              >
                <IonCardHeader>
                  <IonCardTitle>
                    <IonIcon icon={gameControllerOutline} /> {currentGame.roomCode}
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>
                    Current Letter:{" "}
                    <IonText color="primary">
                      <strong>{currentGame.letter}</strong>
                    </IonText>
                  </p>

                  <p>
                    <IonIcon icon={timeOutline} />{" "}
                    {gameIsOver ? "Room closes in: " : "Time left: "}
                    <IonText color={gameIsOver ? "danger" : "primary"}>
                      <strong>{formattedTime}</strong>
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

              <IonCard
                style={{
                  margin: "0",
                  borderRadius: "8px",
                }}
              >
                <IonCardContent>
                  {gameIsOver && (
                    <IonText color="danger">
                      <p>
                        <IonIcon icon={alertCircleOutline} /> Game over. Answers
                        are closed.
                      </p>
                    </IonText>
                  )}

                  {answerMessage && <p>{answerMessage}</p>}

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
                            value={roomCodeInput}
                            onIonInput={(e) => {
                              const value = e.detail.value ?? "";
                              setRoomCodeInput(value);
                              field.onChange(value);
                            }}
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
                            value={usernameInput}
                            onIonInput={(e) => {
                              const value = e.detail.value ?? "";
                              setUsernameInput(value);
                              field.onChange(value);
                            }}
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
                            value={answerInput}
                            disabled={gameIsOver}
                            onIonInput={(e) => {
                              const value = e.detail.value ?? "";
                              setAnswerInput(value);
                              field.onChange(value);
                            }}
                          />
                        )}
                      />
                    </IonItem>

                    <IonButton
                      type="submit"
                      expand="block"
                      disabled={gameIsOver}
                      style={{ marginTop: "16px" }}
                    >
                      Submit
                    </IonButton>
                  </form>
                </IonCardContent>
              </IonCard>

              <IonButton
                fill="clear"
                expand="block"
                onClick={() => setSelectedRoomCode("")}
                style={{ marginTop: "16px" }}
              >
                <IonIcon icon={arrowBackOutline} slot="start" />
                Choose another game
              </IonButton>
            </div>

            <div style={{ flex: 1 }}>
              <ScoreBoard players={currentGame.players} />
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default PlayGame;
