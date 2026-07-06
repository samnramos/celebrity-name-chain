import "dotenv/config";
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import express from "express";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
const PORT = 3000;
const app = express();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, ngrok-skip-browser-warning",
  );
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  return next();
});
app.use(express.json());
const getRandomLetter = () =>
  String.fromCharCode(65 + Math.floor(Math.random() * 26));

const getLastName = (name: string) => {
  const parts = name.trim().split(" ");
  return parts[parts.length - 1];
};

const getNextLetter = (name: string) => {
  return getLastName(name).charAt(0).toUpperCase();
};

// Celebrity API scaffold for later:
// TVMaze People Search to check if an answer is real.
// No API key needed.
// API docs: https://www.tvmaze.com/api#people-search
//
// const isRealCelebrity = async (name: string) => {
//   const response = await fetch(
//     `https://api.tvmaze.com/search/people?q=${encodeURIComponent(name)}`,
//   );
//   const celebrities = await response.json();
//   return celebrities.length > 0;
// };

//---- To create a new game record in the games table ----
const insertGame = async (roomID: string, celebrity?: string) => {
  try {
    const room = await prisma.game.findUnique({
      select: {
        roomCode: true,
      },
      where: {
        roomCode: roomID,
      },
    });
    if (room?.roomCode) {
      throw new Error("Room code already exists");
    }
    return await prisma.game.create({
      data: {
        roomCode: roomID,
        letter: celebrity ? getNextLetter(celebrity) : getRandomLetter(),
        answers: celebrity
          ? {
              create: {
                roomCodeID: roomID,
                username: "starter",
                celebrity: celebrity,
              },
            }
          : undefined,
      },
    });
  } catch (error) {
    console.error("Failed to insert game: ", error);
    return null;
  }
};

const insertAnswer = async (
  roomID: string,
  answer: string,
  username: string,
) => {
  try {
    const game = await prisma.game.findUnique({
      where: {
        roomCode: roomID,
      },
    });

    if (!game) {
      throw new Error("Game not found");
    }

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
    const { roomCode, celebrity } = req.body;
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

    const newGame = await insertGame(roomCode, celebrity);
    if (!newGame) {
      return res.status(409).json({
        message: "This room code already exists",
      });
    }
    return res.status(201).json({
      message: "New game created successfully!",
      game: newGame,
    });
  } catch (error: any) { 
    console.log("User did not provide a req json body...");
    return res.status(500).json({
      message: "Please provide a roomCode in a json body.",
    });
  }
});

app.get("/games", async (req, res) => {
  try {
    const games = await prisma.game.findMany({
      include: {
        answers: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log("Games:", games);
    if (!games || games.length === 0) {
      console.log("Games table empty...");
      return res.status(200).json({
        message: "No games created yet. Please create a game first...",
        games: [],
      });
    }

    return res
      .status(200)
      .json({ message: "Retrieving game data...", games: games });
  } catch (e) {
    console.log("Database connection error...");
    return res.status(500).json({ message: "Internal server error ..." });
  }
});

// Answers Route (room code, username, answer)
app.post("/answers", async (req, res) => {
  try {
    const { roomCode, username, answer } = req.body;
    let index = 0;
    let gameFound = false;
    const games = await prisma.game.findMany();
    if (games.length === 0) {
      return res.status(400).json({ message: "No games created yet" });
    }
    console.log(games[0].roomCode);
    for (let i = 0; i < games.length; i++) {
      if (games[i].roomCode === roomCode) {
        index = i;
        gameFound = true;
        break;
      }
    }

    if (!gameFound) {
      console.log("The game doesn't exist");
      return res.status(400).json({ message: "No game with this room code" });
    }

    const letter = games[index].letter;
    const secondLetter: string = letter;
    if (answer.includes(" ")) {
      console.log("Answer has spaces");
    }
    const lower = answer.toUpperCase();

    if (!lower.startsWith(secondLetter)) {
      console.log("answer doesn't start with required letter");
      return res
        .status(400)
        .json({ message: `Answer must start with ${secondLetter}` });
    }
    
    const existingAnswers = await prisma.answer.findMany ({
      where: {
        roomCodeID: roomCode,
    },
  });
  
  const duplicate = existingAnswers.find(
    (item: any) => item.celebrity.toLowerCase() === answer.toLowerCase() 
  );
  if (duplicate) {
    return res.status(400).json ({
    message: "This celebrity already has been used in this room.",
  });
}

    const nextLetter = getNextLetter(answer);
    const newAnswer = await insertAnswer(roomCode, answer, username);

    await prisma.game.update({
      where: {
        roomCode: roomCode,
      },
      data: {
        letter: nextLetter,
      },
    });
    return res.status(200).json({
      message: "The answer is created successfully",
      answer: newAnswer,
      nextLetter: nextLetter,
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
