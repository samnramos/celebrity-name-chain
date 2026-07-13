import "dotenv/config";
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import express from "express";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
const PORT = Number(process.env.PORT) || 3000;
const app = express();
const game_duration = 5 * 60;
const scoreboard_duration = 60;

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

const getRoomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const getRandomLetter = () =>
  String.fromCharCode(65 + Math.floor(Math.random() * 26));

const normalizeValue = (value: string) =>
  value.trim().replace(/\s+/g, " ").toLowerCase();

// so it will take suffixes

const suffixes = new Set(["jr", "jr.", "sr", "sr.", "ii", "iii", "iv", "v"]);

const parseCelebrityName = (name: string) => {
  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return {
      firstName: parts[0],
      lastName: parts[0],
      suffix: "",
    };
  }

  let suffix = "";

  const lastPart = parts[parts.length - 1].toLowerCase();

  if (suffixes.has(lastPart)) {
    suffix = parts.pop()!;
  }

  return {
    firstName: parts[0],
    lastName: parts[parts.length - 1],
    suffix,
  };
};

const getLastName = (name: string) => {
  return parseCelebrityName(name).lastName;
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
const insertGame = async (celebrity?: string) => {
  try {
    const roomID = getRoomCode();
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
  res.send("Welcome to 'Guess That Celeb!!'");
});

app.post("/games", async (req, res) => {
  try {
    const { celebrity } = req.body;
    if (!celebrity || celebrity.trim() === "") {
      console.log("No celebrity provided...");
      return res.status(400).json({
        message: "Please enter a starting celebrity.",
      });
    }

    const newGame = await insertGame(celebrity);
    if (!newGame) {
      return res.status(409).json({
        message: "Could not create game. Please try again.",
      });
    }
    return res.status(201).json({
      message: "New game created successfully!",
      game: newGame,
    });
  } catch (error: any) {
    console.log("User did not provide a req json body...");
    return res.status(500).json({
      message: "Please provide a starting celebrity in a json body.",
    });
  }
});

app.get("/games", async (req, res) => {
  try {
    const deleteDate = new Date(
      Date.now() - (game_duration + scoreboard_duration) * 1000,
    );

    await prisma.game.deleteMany({
      where: {
        createdAt: {
          lt: deleteDate,
        },
      },
    });

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
    const gamesWithPlayers = games.map((game: any) => {
      const scores: any = {};

      game.answers.forEach((answer: any) => {
        if (answer.username !== "starter") {
          if (!scores[answer.username]) {
            scores[answer.username] = 0;
          }

          scores[answer.username] = scores[answer.username] + 2;
        }
      });

      const players = Object.keys(scores).map((name) => ({
        name: name,
        score: scores[name],
      }));

      return {
        ...game,
        players: players,
      };
    });

    console.log("Games:", gamesWithPlayers);
    if (!games || games.length === 0) {
      console.log("Games table empty...");
      return res.status(200).json({
        message: "No games created yet. Please create a game first...",
        games: [],
      });
    }

    return res
      .status(200)
      .json({ message: "Retrieving game data...", games: gamesWithPlayers });
  } catch (e) {
    console.log("Database connection error...");
    return res.status(500).json({ message: "Internal server error ..." });
  }
});

// Answers Route (room code, username, answer)
app.post("/answers", async (req, res) => {
  try {
    const { roomCode, username, answer } = req.body ?? {};

    if (
      typeof roomCode !== "string" ||
      typeof username !== "string" ||
      typeof answer !== "string" ||
      roomCode.trim() === "" ||
      username.trim() === "" ||
      answer.trim() === ""
    ) {
      return res.status(400).json({
        message: "Room code, username, and answer are required.",
      });
    }

    const cleanRoomCode = roomCode.trim().toUpperCase();
    const cleanUsername = username.trim();
    const cleanAnswer = answer.trim();

    const game = await prisma.game.findUnique({
      where: {
        roomCode: cleanRoomCode,
      },
      include: {
        answers: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!game) {
      console.log("The game doesn't exist");
      return res.status(400).json({ message: "No game with this room code" });
    }

    const elapsedSeconds = (Date.now() - game.createdAt.getTime()) / 1000;

    if (elapsedSeconds > game_duration + scoreboard_duration) {
      await prisma.game.delete({
        where: {
          roomCode: cleanRoomCode,
        },
      });

      return res.status(400).json({
        message: "Game has closed and was deleted.",
      });
    }

    if (elapsedSeconds > game_duration) {
      return res.status(400).json({
        message: "Game has ended. The Scoreboard is now being displayed.",
      });
    }

    const letter = game.letter;
    const secondLetter: string = letter;
    if (cleanAnswer.includes(" ")) {
      console.log("Answer has spaces");
    }
    const lower = cleanAnswer.toUpperCase();

    if (!lower.startsWith(secondLetter)) {
      console.log("answer doesn't start with required letter");
      return res
        .status(400)
        .json({ message: `Answer must start with ${secondLetter}` });
    }

    const lastAnswer = game.answers[game.answers.length - 1];

    if (
      lastAnswer &&
      lastAnswer.username !== "starter" &&
      normalizeValue(lastAnswer.username) === normalizeValue(cleanUsername)
    ) {
      return res.status(409).json({
        message: "You answered most recently. Wait for another player.",
      });
    }

    const duplicate = game.answers.find(
      (item) => normalizeValue(item.celebrity) === normalizeValue(cleanAnswer),
    );
    if (duplicate) {
      return res.status(400).json({
        message: "This celebrity already has been used in this room.",
      });
    }

    const nextLetter = getNextLetter(cleanAnswer);
    const newAnswer = await insertAnswer(
      cleanRoomCode,
      cleanAnswer,
      cleanUsername,
    );
    await prisma.game.update({
      where: {
        roomCode: cleanRoomCode,
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
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/games/:roomCode/status", async (req, res) => {
  const roomCode = req.params.roomCode;
  const game = await prisma.game.findUnique({
    where: {
      roomCode,
    },
    include: {
      answers: true,
    },
  });

  if (!game) {
    return res.status(404).json({
      message: "Game not found.",
    });
  }

  const elapsedSeconds = (Date.now() - game.createdAt.getTime()) / 1000;

  if (elapsedSeconds < game_duration) {
    return res.json({
      status: "Playing",
      timeRemaining: Math.ceil(game_duration - elapsedSeconds),
    });
  }

  if (elapsedSeconds < game_duration + scoreboard_duration) {
    return res.json({
      status: "Scoreboard",
      timeRemaining: Math.ceil(
        game_duration + scoreboard_duration - elapsedSeconds,
      ),
      answers: game.answers,
    });
  }

  await prisma.game.delete({
    where: {
      roomCode: roomCode,
    },
  });

  return res.json({
    status: "Closed",
  });
});

app.get("/games/:roomCode/logout", async (req, res) => {
  const { roomCode } = req.params;
  try {
    const game = await prisma.game.delete({
      where: { roomCode: roomCode },
    });
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    // perform any logout cleanup here if needed
    return res.status(200).json({ message: "Logged out", game });
  } catch (error) {
    console.error("Failed to fetch game: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
