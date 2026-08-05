# Celebrity Name Chain

```text
├── api/     # Express + Prisma + PostgreSQL game server (TypeScript)
├── client/  # Ionic React app (React Hook Form + TanStack Query)
├── data/    # database dump (dump.sql) to share between teammates
└── README.md
```

## Prerequisites

- **Node 22+** and **Yarn 4** (via Corepack: `corepack enable`)
- **PostgreSQL** running locally
- **ngrok** (only needed to play together across machines)

### Node version (nvm)

Make sure you're on Node 22 before installing anything:

```bash
node --version
nvm install 22
nvm use 22
nvm alias default 22
```

## Installation

Run these commands from the project root:

```bash
cd celebrity-name-chain
corepack enable
yarn install
```

Copy the API env file:

```bash
cp api/.env.example api/.env
```

Edit `api/.env` and set `DATABASE_URL` to your local PostgreSQL database.
Example:

```text
DATABASE_URL="postgresql://YOUR_USER@localhost:5432/celebrity_name_chain?schema=public"
PORT=3000
```

If the database does not exist yet, create it:

```bash
createdb celebrity_name_chain
```

Copy the client env file:

```bash
cp client/.env.example client/.env
```

For local testing, `client/.env` should use:

```text
VITE_API_URL=http://localhost:3000
```

Initialize the Prisma client and database schema:

```bash
yarn prisma:generate
yarn db:push
```

## Running locally

After the database setup above succeeds, start the API and Ionic frontend from
the project root:

```bash
yarn dev
```

Open the Ionic app at:

```text
http://localhost:5173
```

The API runs at:

```text
http://localhost:3000
```

Players should use the Ionic frontend, not the API

## How to play

1. Go to the Create tab.
2. Create a room with a starting celebrity.
3. Go to the Play tab.
4. Click an active game.
5. Enter a username and an answer.
6. The next answer must start with the first letter of the previous answer's
   last name.

----Game Start for Insomnia----

After running `yarn dev` in the root terminal:

1. To check any active games, use the `/games` extension in GET.
2. To start a game, use the `/games` extension in POST and add a celebrity using `"celebrity": "<celebrityname>"`.
3. To play, use the `/answers` extension in POST and enter your answer as:
   ```json
   {
     "roomCode": "<roomCode>",
     "answer": "<celebrity>",
     "username": "<username>"
   }
   ```
4. To finish and logout of the game, use the `/games/:roomCode/logout` extension in GET.

Extra: To check the status of the current room, use the `/games/:roomCode/status` extension in GET.

Room codes are automatically provided once a celebrity name is added.

----Game Start for Browser----

After running `yarn dev` in the root terminal:

1. Copy the localhost link into the browser.
2. Type in a celebrity name. The room code should be generated automatically.
3. Click on the "Play" tab, and your current game should be active. Click on the active game and play. You have 5 minutes to play a round.
4. Once the 5 minutes are over, the game will automatically close after a certain time. All data related to the game will be lost.

----AI Disclosure----

Our team used AI as a coding partner for planning, debugging, and explanations. Final changes were reviewed, tested, and understood by the project contributors.
