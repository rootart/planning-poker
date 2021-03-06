-- upgrade --
CREATE TABLE IF NOT EXISTS "user" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "name" VARCHAR(50) NOT NULL,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS "game" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "name" VARCHAR(50) NOT NULL,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "author_id" UUID NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "player" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "joined" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
    "game_id" UUID NOT NULL REFERENCES "game" ("id") ON DELETE CASCADE,
    CONSTRAINT "uid_player_user_id_c03f1c" UNIQUE ("user_id", "game_id")
);
CREATE TABLE IF NOT EXISTS "task" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "complexity" VARCHAR(100),
    "game_id" UUID NOT NULL REFERENCES "game" ("id") ON DELETE CASCADE,
    "author_id" UUID NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE
);
COMMENT ON COLUMN "task"."complexity" IS 'ZERO: 0\nHALF: 1/2\nONE: 1\nTWO: 2\nTHREE: 3\nFIVE: 5\nEIGHT: 8\nTHIRTEEN: 13';
CREATE TABLE IF NOT EXISTS "vote" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "complexity" VARCHAR(100),
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
    "task_id" INT NOT NULL REFERENCES "task" ("id") ON DELETE CASCADE,
    CONSTRAINT "uid_vote_user_id_21ac5c" UNIQUE ("user_id", "task_id")
);
COMMENT ON COLUMN "vote"."complexity" IS 'ZERO: 0\nHALF: 1/2\nONE: 1\nTWO: 2\nTHREE: 3\nFIVE: 5\nEIGHT: 8\nTHIRTEEN: 13';
CREATE TABLE IF NOT EXISTS "aerich" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "version" VARCHAR(255) NOT NULL,
    "app" VARCHAR(20) NOT NULL,
    "content" TEXT NOT NULL
);
