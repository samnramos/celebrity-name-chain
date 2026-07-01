--
-- PostgreSQL database dump
--

\restrict oU7XWgHePmVyZeF2Lbwf6At54058RyEzOPn28dK7qm5nZDa2zKuodf4RVWm5LfS

-- Dumped from database version 16.14 (Homebrew)
-- Dumped by pg_dump version 18.4

-- Started on 2026-07-01 13:59:55 EDT

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE "celebrity-name-chain";
--
-- TOC entry 3840 (class 1262 OID 16455)
-- Name: celebrity-name-chain; Type: DATABASE; Schema: -; Owner: sukitoru
--

CREATE DATABASE "celebrity-name-chain" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF-8';


ALTER DATABASE "celebrity-name-chain" OWNER TO sukitoru;

\unrestrict oU7XWgHePmVyZeF2Lbwf6At54058RyEzOPn28dK7qm5nZDa2zKuodf4RVWm5LfS
\encoding SQL_ASCII
\connect -reuse-previous=on "dbname='celebrity-name-chain'"
\restrict oU7XWgHePmVyZeF2Lbwf6At54058RyEzOPn28dK7qm5nZDa2zKuodf4RVWm5LfS

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 16482)
-- Name: Answer; Type: TABLE; Schema: public; Owner: sukitoru
--

CREATE TABLE public."Answer" (
    id integer NOT NULL,
    "gameId" integer NOT NULL,
    username text NOT NULL,
    celebrity text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Answer" OWNER TO sukitoru;

--
-- TOC entry 217 (class 1259 OID 16481)
-- Name: Answer_id_seq; Type: SEQUENCE; Schema: public; Owner: sukitoru
--

CREATE SEQUENCE public."Answer_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Answer_id_seq" OWNER TO sukitoru;

--
-- TOC entry 3841 (class 0 OID 0)
-- Dependencies: 217
-- Name: Answer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sukitoru
--

ALTER SEQUENCE public."Answer_id_seq" OWNED BY public."Answer".id;


--
-- TOC entry 216 (class 1259 OID 16472)
-- Name: Game; Type: TABLE; Schema: public; Owner: sukitoru
--

CREATE TABLE public."Game" (
    id integer NOT NULL,
    "roomCode" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Game" OWNER TO sukitoru;

--
-- TOC entry 215 (class 1259 OID 16471)
-- Name: Game_id_seq; Type: SEQUENCE; Schema: public; Owner: sukitoru
--

CREATE SEQUENCE public."Game_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Game_id_seq" OWNER TO sukitoru;

--
-- TOC entry 3842 (class 0 OID 0)
-- Dependencies: 215
-- Name: Game_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sukitoru
--

ALTER SEQUENCE public."Game_id_seq" OWNED BY public."Game".id;


--
-- TOC entry 3680 (class 2604 OID 16485)
-- Name: Answer id; Type: DEFAULT; Schema: public; Owner: sukitoru
--

ALTER TABLE ONLY public."Answer" ALTER COLUMN id SET DEFAULT nextval('public."Answer_id_seq"'::regclass);


--
-- TOC entry 3678 (class 2604 OID 16475)
-- Name: Game id; Type: DEFAULT; Schema: public; Owner: sukitoru
--

ALTER TABLE ONLY public."Game" ALTER COLUMN id SET DEFAULT nextval('public."Game_id_seq"'::regclass);


--
-- TOC entry 3834 (class 0 OID 16482)
-- Dependencies: 218
-- Data for Name: Answer; Type: TABLE DATA; Schema: public; Owner: sukitoru
--

COPY public."Answer" (id, "gameId", username, celebrity, "createdAt") FROM stdin;
\.


--
-- TOC entry 3832 (class 0 OID 16472)
-- Dependencies: 216
-- Data for Name: Game; Type: TABLE DATA; Schema: public; Owner: sukitoru
--

COPY public."Game" (id, "roomCode", "createdAt") FROM stdin;
\.


--
-- TOC entry 3843 (class 0 OID 0)
-- Dependencies: 217
-- Name: Answer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sukitoru
--

SELECT pg_catalog.setval('public."Answer_id_seq"', 1, false);


--
-- TOC entry 3844 (class 0 OID 0)
-- Dependencies: 215
-- Name: Game_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sukitoru
--

SELECT pg_catalog.setval('public."Game_id_seq"', 1, false);


--
-- TOC entry 3686 (class 2606 OID 16490)
-- Name: Answer Answer_pkey; Type: CONSTRAINT; Schema: public; Owner: sukitoru
--

ALTER TABLE ONLY public."Answer"
    ADD CONSTRAINT "Answer_pkey" PRIMARY KEY (id);


--
-- TOC entry 3683 (class 2606 OID 16480)
-- Name: Game Game_pkey; Type: CONSTRAINT; Schema: public; Owner: sukitoru
--

ALTER TABLE ONLY public."Game"
    ADD CONSTRAINT "Game_pkey" PRIMARY KEY (id);


--
-- TOC entry 3684 (class 1259 OID 16491)
-- Name: Game_roomCode_key; Type: INDEX; Schema: public; Owner: sukitoru
--

CREATE UNIQUE INDEX "Game_roomCode_key" ON public."Game" USING btree ("roomCode");


--
-- TOC entry 3687 (class 2606 OID 16492)
-- Name: Answer Answer_gameId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sukitoru
--

ALTER TABLE ONLY public."Answer"
    ADD CONSTRAINT "Answer_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES public."Game"(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2026-07-01 13:59:55 EDT

--
-- PostgreSQL database dump complete
--

\unrestrict oU7XWgHePmVyZeF2Lbwf6At54058RyEzOPn28dK7qm5nZDa2zKuodf4RVWm5LfS

