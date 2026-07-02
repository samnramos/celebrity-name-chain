import {useForm} from "react-hook-form";
import { 
    IonCard, 
    IonCardContent, 
    IonInput, 
    IonCardHeader,
    IonCardTitle,
    IonButton,
    IonItem,
    IonText

 } from "@ionic/react";


const Game: React.FC = () => {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <IonCard>
        <IonCardHeader>
            <IonCardTitle>Celebrity Celebrity</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
           <h2>Current Celebrity</h2>
              <p>Albert Einstein</p> 

            <form onSubmit={handleSubmit(onSubmit)}>
                  <IonItem>
                    <IonInput
                      label="Room code"
                        labelPlacement="stacked"
                          placeholder="Enter room code"
                          {...register("roomCode")}
            />
                   </IonItem>
                     <IonItem>
                       <IonInput
                        label="Username"
                         labelPlacement="stacked"
                          placeholder="Enter username"
                          {...register("username")}
            />
                   </IonItem>
                 
                 <IonItem>
                   <IonInput
                     label="Answer"
                      labelPlacement="stacked"
                        placeholder="Enter celebrity name"
                        {...register("answer")}
                  />
                
                    </IonItem>

                 <IonButton type="submit" expand="block">
                         Submit
                 </IonButton>

            </form>
        
       
        
      </IonCardContent>
      

        <IonText>
            <p>Game Status: Waiting for players...</p>
        </IonText>
    </IonCard>
  );
};

export default Game;