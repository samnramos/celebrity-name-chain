--
-- PostgreSQL database dump
--

\restrict UcHfXcOMzzfgw1p3tT8LfONOkd9fkRzbbiHkuQikndlgK7pnaTfPvdk7CoRTl6c

-- Dumped from database version 16.14 (Homebrew)
-- Dumped by pg_dump version 16.14 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public."Answer" DROP CONSTRAINT IF EXISTS "Answer_gameId_fkey";
DROP INDEX IF EXISTS public."Game_roomCode_key";
ALTER TABLE IF EXISTS ONLY public."Game" DROP CONSTRAINT IF EXISTS "Game_pkey";
ALTER TABLE IF EXISTS ONLY public."Answer" DROP CONSTRAINT IF EXISTS "Answer_pkey";
ALTER TABLE IF EXISTS public."Game" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."Answer" ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public."Game_id_seq";
DROP TABLE IF EXISTS public."Game";
DROP SEQUENCE IF EXISTS public."Answer_id_seq";
DROP TABLE IF EXISTS public."Answer";
DROP SCHEMA IF EXISTS public;
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Answer; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Answer" (
    id integer NOT NULL,
    "gameId" integer NOT NULL,
    username text NOT NULL,
    celebrity text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "roomCodeID" text NOT NULL
);


--
-- Name: Answer_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Answer_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Answer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Answer_id_seq" OWNED BY public."Answer".id;


--
-- Name: Game; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Game" (
    id integer NOT NULL,
    "roomCode" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    letter text NOT NULL
);


--
-- Name: Game_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Game_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Game_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Game_id_seq" OWNED BY public."Game".id;


--
-- Name: Answer id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Answer" ALTER COLUMN id SET DEFAULT nextval('public."Answer_id_seq"'::regclass);


--
-- Name: Game id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Game" ALTER COLUMN id SET DEFAULT nextval('public."Game_id_seq"'::regclass);


--
-- Name: Answer Answer_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Answer"
    ADD CONSTRAINT "Answer_pkey" PRIMARY KEY (id);


--
-- Name: Game Game_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Game"
    ADD CONSTRAINT "Game_pkey" PRIMARY KEY (id);


--
-- Name: Game_roomCode_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Game_roomCode_key" ON public."Game" USING btree ("roomCode");


--
-- Name: Answer Answer_gameId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Answer"
    ADD CONSTRAINT "Answer_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES public."Game"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict UcHfXcOMzzfgw1p3tT8LfONOkd9fkRzbbiHkuQikndlgK7pnaTfPvdk7CoRTl6c

