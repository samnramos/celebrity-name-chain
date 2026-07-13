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
  celebrity: string;
};

const CreateGame: React.FC = () => {
  const queryClient = useQueryClient();
  const { control, handleSubmit, reset, formState: {errors}} = useForm<CreateGameForm>({
    defaultValues: {
      celebrity: "",
    },
  });

  const onSubmit = (data: CreateGameForm) => {
    console.log("Submitting:", data);
    createGame.mutate(data);
  };

  //makes sure the creat button works 
  
  const createGame = useMutation ({
    mutationFn: async (data: CreateGameForm) => {
      console.log("Sending request", data);

      const response = await fetch(`${API_URL}/games`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(data),
      });

      console.log("Status:", response.status);

      if (!response.ok) {
        throw new Error(`Request Failed: ${response.status}`);
    }

      return response.json();

    },

    onSuccess: () => {
      queryClient.invalidateQueries ({
        queryKey: ["games"]
      });
      reset();
    },
    onError: (error) => {
      console.error(error);
    },
  });

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
                    name="celebrity"
                    control={control}

                    //added so that the celebrity answer must be 32 characters long 
                    // and an error code so that it doesnt exceed past that 

                    rules = {{
                      required: "Starting celebrity is required.",
                      maxLength: {
                        value: 32,
                        message: "Celebrity name cannot exceed 32 characters.",
                      },
                    }}
                    render={({ field }) => (
                      <IonInput
                        label="Starting celebrity"
                        labelPlacement="stacked"
                        placeholder="Zendaya"
                        maxlength = {32}
                        value={field.value}
                        onIonInput={(e) => field.onChange(e.detail.value)}
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

              {createGame.data?.game && (
                <IonText>
                  <p>Room code: {createGame.data.game.roomCode}</p>
                </IonText>
              )}
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CreateGame;
