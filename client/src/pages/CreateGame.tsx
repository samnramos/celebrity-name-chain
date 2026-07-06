import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Controller, useForm } from "react-hook-form";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

type CreateGameForm = {
  roomCode: string;
  celebrity: string;
};

const CreateGame: React.FC = () => {
  const queryClient = useQueryClient();
  const { control, handleSubmit, reset } = useForm<CreateGameForm>({
    defaultValues: {
      roomCode: "",
      celebrity: "",
    },
  });

  const createGame = useMutation({
    mutationFn: (data: CreateGameForm) =>
      fetch(`${API_URL}/games`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(data),
      }).then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
      reset();
    },
  });

  const onSubmit = (data: CreateGameForm) => {
    createGame.mutate(data);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Create Game</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <form onSubmit={handleSubmit(onSubmit)}>
          <IonItem>
            <Controller
              name="roomCode"
              control={control}
              render={({ field }) => (
                <IonInput
                  label="Room code"
                  labelPlacement="stacked"
                  placeholder="STAR01"
                  value={field.value}
                  onIonChange={(e) => field.onChange(e.detail.value)}
                />
              )}
            />
          </IonItem>

          <IonItem>
            <Controller
              name="celebrity"
              control={control}
              render={({ field }) => (
                <IonInput
                  label="Starting celebrity"
                  labelPlacement="stacked"
                  placeholder="Albert Einstein"
                  value={field.value}
                  onIonChange={(e) => field.onChange(e.detail.value)}
                />
              )}
            />
          </IonItem>

          <IonButton type="submit" expand="block">
            Create
          </IonButton>
        </form>

        {createGame.data?.message && <IonText>{createGame.data.message}</IonText>}
      </IonContent>
    </IonPage>
  );
};

export default CreateGame;
