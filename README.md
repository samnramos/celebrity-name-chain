# Celebrity Name Chain — Starter

Boilerplate for the **Celebrity Name Chain** full-stack group project
(CityTech TTP 2026 Summer). See the
[project spec](https://github.com/jonathan-chin/citytech-ttpr-2026-summer/blob/main/project_specs/celebrity-name-chain.md)
for the game rules, routes, and requirements.

```text
├── api/     # Express + Prisma + PostgreSQL game server (TypeScript)
├── client/  # Ionic React app (React Hook Form + TanStack Query)
├── data/    # database dump (dump.sql) to share between teammates
└── README.md
```

## Using this repo

Click **"Use this template"** on GitHub (not Fork). **One** teammate creates
the repo, then **adds the others as collaborators**. One team = one repo.

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

Copy the client env file:

```bash
cp client/.env.example client/.env
```

For local testing, `client/.env` should use:

```text
VITE_API_URL=http://localhost:3000
```

Push the Prisma schema to your database:

```bash
yarn db:push
```

## Running locally

Start the API and Ionic frontend together from the project root:

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
