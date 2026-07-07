import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  IonButton,
  IonCard,
  IonCardContent,
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
  const { control, handleSubmit, reset, formState: {errors}} = useForm<CreateGameForm>({
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
        <div
          style={{
            maxWidth: "620px",
            margin: "0 auto",
          }}
        >
          <IonCard
            style={{
              margin: "0",
              borderRadius: "8px",
            }}
          >
            <IonCardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <IonItem>
                  <Controller
                    name="roomCode"
                    control={control}

                    //added so that the roomcode only be 6 characters being the limit
                    //and an error code so that it doesnt exceed past that

                    rules = {{
                      maxLength: {
                        value: 6,
                        message: "Room code cannot exceed 6 characters.",
                      },
                    }}
                    render={({ field }) => (
                      <IonInput
                        label="Room code"
                        labelPlacement="stacked"
                        placeholder="STAR01"
                        maxlength = {6}
                        value={field.value}
                        onIonChange={(e) => field.onChange(e.detail.value)}
                      />
                    )}
                  />
                </IonItem>

                {errors.roomCode && (
                  <IonText color = "danger">
                    <p>
                      {errors.roomCode.message}
                    </p>
                  </IonText>
                )}

                <IonItem>
                  <Controller
                    name="celebrity"
                    control={control}

                    //added so that the celebrity answer must be 32 characters long 
                    // and an error code so that it doesnt exceed past that 

                    rules = {{
                      maxLength: {
                        value: 32,
                        message: "Celebrity name cannot exceed 32 characters.",
                      },
                    }}
                    render={({ field }) => (
                      <IonInput
                        label="Starting celebrity"
                        labelPlacement="stacked"
                        placeholder="Albert Einstein"
                        maxlength = {32}
                        value={field.value}
                        onIonChange={(e) => field.onChange(e.detail.value)}
                      />
                    )}
                  />
                </IonItem>
                
                {errors.celebrity && (
                  <IonText color = "danger">
                    <p>
                      {errors.celebrity.message}
                    </p>
                  </IonText>
                )}

                <IonButton
                  type="submit"
                  expand="block"
                  style={{ marginTop: "16px" }}
                >
                  Create
                </IonButton>
              </form>

              {createGame.data?.message && (
                <IonText>{createGame.data.message}</IonText>
              )}
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CreateGame;
