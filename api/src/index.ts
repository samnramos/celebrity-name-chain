//@ts-nocheck
import "dotenv/config";
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import express from "express";


// --------------API CALL HERE------------------
const res = await fetch('https://api.api-ninjas.com/v1/celebrity', {
  method: 'GET',
  headers: { 'X-API-Key': process.env.API_SECRET_KEY },})

const data = await res.json()
console.log(data)

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
const PORT = 3000;
const app = express();
app.use(express.json());
const getRandomLetter = () =>
  String.fromCharCode(65 + Math.floor(Math.random() * 26));
const getRandomCeleb = (res: any[]) => {
  const randomIndex = Math.floor(Math.random() * res.length);
  return res[randomIndex].name;
};


//---- To create a new game record in the games table ----
const insertGame = async (roomID: string) => {
  try {
    const room = await prisma.game.findUnique({
      select:{
        roomCode: true
      },
      where: {
        roomCode: roomID
      }
    })
  if(room?.roomCode){
    throw new Error("Room code already exists")
  }
    return await prisma.game.create({
      data: {
        roomCode: roomID,
        letter: getRandomLetter(),
        celebrity: getRandomCeleb(data),
      },
    });
  } catch (error) {
    console.error("Failed to insert game: ", error);
    return null;
  }
};

const insertAnswer = async (roomID: string, answer: string, username: string) => {
  try {
    return await prisma.answer.create({
      data: {
        username: username,
        celebrity: answer,
        roomCodeID: roomID,
        game: {
          connect: {
            roomCode: roomID,
          },
        },
      },
    });
  } catch (error) {
    console.error("Failed to insert answer: ", error);
  }
};

const activeRooms = async (roomID: string, username: any) => {
  try {
    return await prisma.game.findUnique({
      where: { roomCode: roomID },
    });
  } catch (error) {
    console.error("Failed to fetch active game: ", error);
    return null;
  }
};

//------ROUTES-------
app.get("/", (req, res) => {
  res.send("Welcome to 'Guess That Celeb!!'👋😊");
});

app.post("/games", async (req, res) => {
  try {
    const { roomCode } = req.body;
    if (!roomCode || roomCode.trim() === "") {
      console.log("No roomCode provided...");
      return res.status(400).json({
        message: "Please enter a room code to start. (i.e. json body)",
      });
    }
    if (typeof roomCode !== "string") {
      console.log("provided roomCode is not a string...");
      return res.status(400).json({
        message:
          "Please enter a valid room code containing a combination of numbers and characters. (e.g. Test123)",
      });
    }
    if (roomCode.length < 4 || roomCode.length > 6) {
      console.log("roomCode length is <= 3...");
      return res.status(400).json({
        message: "roomCode must be between 4 and 6 characters.",
      });
    }

    const newGame = await insertGame(roomCode);
    if(!newGame){
      return res.status(409).json({
        message: "This room code already exists"})
    }
    return res.status(201).json({
      message: "New Game created successfully!",
      game: newGame,
    });
  } catch (error) {
    console.log("User did not provide a req json body...");
    return res.status(500).json({
      message: "Please provide a roomCode in a json body.",
    });
  }
});

app.get("/games", async (req,res) => {
 try {
   const games = await prisma.game.findMany();
  console.log("Games:", games); 
  if(!games || games.length === 0){
    console.log("Games table empty...");
    return res.status(404).json({message: "No games created yet. Please create a game first..."});

  }

 return res.status(200).json({message: "Retreiving game data...", games:games});
 }
 catch(e){
  console.log("Database connection error...");
  return res.status(500).json({message: "Internal server error ..."});
 }

})

// Answers Route (room code, username, answer)
app.post("/answers", async (req, res) => {
  try {
    const {roomCode, username, answer} = req.body;
    let index = 0;
    const games = await prisma.game.findMany();
    console.log(games[0].roomCode);
    for (let i = 0; i < games.length; i ++){
      if (!games[i].roomCode === roomCode) {
        console.log("The game doesn't exist");
        return res.status(400).json({message:"no game with this room code"});
  
      }
      if (games[i].roomCode === roomCode) {
        index = i;
        break ; 
    }}

    const letter = games[index].letter;
    const secondLetter: string = letter.split(" ")[1];
    if(answer.includes(" ")){
      console.log("answer has spaces");
    }
    const lower = answer.toUpperCase();

    if (!lower.startsWith(secondLetter)) {
      console.log("answer doesn't start with required letter");
      return res.status(400).json({message:`Answer must start with ${secondLetter}`});
    }
    const newAnswer = await insertAnswer(roomCode, answer, username);
    const active_rooms = await activeRooms(roomCode, username);
    return res.status(200).json({message:"the answer is created successfully", answer: newAnswer, confirmation: activeRooms})


  } catch (error) {
    console.log (error);
  }

});
    





app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});


