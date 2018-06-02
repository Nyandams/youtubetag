--
-- PostgreSQL database dump
--

-- Dumped from database version 10.3 (Ubuntu 10.3-1.pgdg16.04+1)
-- Dumped by pg_dump version 10.1

-- Started on 2018-06-01 23:34:03

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET search_path = public, pg_catalog;

--
-- TOC entry 215 (class 1255 OID 59536)
-- Name: my_trigger_date_inscription(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION my_trigger_date_inscription() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.date_inscription_user IS NULL THEN
  	NEW.date_inscription_user = now();
  END IF;
  RETURN NEW;
END$$;


--
-- TOC entry 208 (class 1255 OID 59537)
-- Name: my_trigger_dateinscription(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION my_trigger_dateinscription() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.dateInscriptionUser IS NULL THEN
  	NEW.dateInscriptionUser = now();
  END IF;
  RETURN NEW;
END$$;




CREATE OR REPLACE FUNCTION list_favoris() RETURNS void AS $$
DECLARE
    user_cur CURSOR FOR SELECT * FROM public.user;
    userRow public.user%ROWTYPE;
	pseudo varchar;
	
    comment_cur CURSOR FOR SELECT * FROM public.comment;
    exist integer;
	comment_row public.comment%ROWTYPE;
	
    BEGIN

	OPEN user_cur;
	
	LOOP
		FETCH user_cur INTO userRow;
		SELECT pseudo_user INTO pseudo
        FROM public.user
        WHERE id_user = userRow.id_user;
		raise notice 'User : %', pseudo;
		
		
		OPEN comment_cur;
		
		LOOP
			FETCH comment_cur INTO comment_row;
		
			SELECT COUNT(*) INTO exist
           	FROM public.comment
            WHERE pseudo_user = pseudo
            AND id_comment = comment_row.id_comment;

            IF exist>0 THEN
                raise notice 'a commenté: %', comment_row.content;
            END IF;
		
		END LOOP;
		
		
	END LOOP;
	CLOSE comment_cur;
	CLOSE user_cur;
END;
$$ LANGUAGE 'plpgsql';

SET default_with_oids = false;

--
-- TOC entry 202 (class 1259 OID 61409)
-- Name: comment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE comment (
    id_comment integer NOT NULL,
    content character varying(1000),
    channel_id character varying,
    pseudo_user character varying
);


--
-- TOC entry 201 (class 1259 OID 61407)
-- Name: comment_id_comment_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE comment_id_comment_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3864 (class 0 OID 0)
-- Dependencies: 201
-- Name: comment_id_comment_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE comment_id_comment_seq OWNED BY comment.id_comment;


--
-- TOC entry 203 (class 1259 OID 81307)
-- Name: favoris; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE favoris (
    id_user integer NOT NULL,
    id_channel character varying NOT NULL
);


--
-- TOC entry 196 (class 1259 OID 59538)
-- Name: tag; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE tag (
    id_tag integer NOT NULL,
    libelle_tag character varying NOT NULL
);


--
-- TOC entry 197 (class 1259 OID 59544)
-- Name: tag_id_tag_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE tag_id_tag_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3865 (class 0 OID 0)
-- Dependencies: 197
-- Name: tag_id_tag_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE tag_id_tag_seq OWNED BY tag.id_tag;


--
-- TOC entry 198 (class 1259 OID 59546)
-- Name: tag_link; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE tag_link (
    id_user integer NOT NULL,
    id_tag integer NOT NULL,
    id_channel character varying NOT NULL
);


--
-- TOC entry 199 (class 1259 OID 59552)
-- Name: user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "user" (
    id_user integer NOT NULL,
    email_user character varying NOT NULL,
    pseudo_user character varying NOT NULL,
    is_admin_user boolean,
    password_user character varying NOT NULL,
    date_inscription_user date
);


--
-- TOC entry 200 (class 1259 OID 59558)
-- Name: user_id_user_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE user_id_user_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3866 (class 0 OID 0)
-- Dependencies: 200
-- Name: user_id_user_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE user_id_user_seq OWNED BY "user".id_user;


--
-- TOC entry 3715 (class 2604 OID 61412)
-- Name: comment id_comment; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY comment ALTER COLUMN id_comment SET DEFAULT nextval('comment_id_comment_seq'::regclass);


--
-- TOC entry 3713 (class 2604 OID 59560)
-- Name: tag id_tag; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY tag ALTER COLUMN id_tag SET DEFAULT nextval('tag_id_tag_seq'::regclass);


--
-- TOC entry 3714 (class 2604 OID 59561)
-- Name: user id_user; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "user" ALTER COLUMN id_user SET DEFAULT nextval('user_id_user_seq'::regclass);


--
-- TOC entry 3857 (class 0 OID 61409)
-- Dependencies: 202
-- Data for Name: comment; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO comment VALUES (3, 'LoL tornament replay etc ...', 'UCvqRdlKsE5Q8mf8YXbdIJLw', NULL);
INSERT INTO comment VALUES (4, 'test of the comment', 'UCvqRdlKsE5Q8mf8YXbdIJLw', NULL);
INSERT INTO comment VALUES (5, 'lol', 'UCvqRdlKsE5Q8mf8YXbdIJLw', NULL);
INSERT INTO comment VALUES (6, 'test', 'UCvqRdlKsE5Q8mf8YXbdIJLw', 'test');
INSERT INTO comment VALUES (7, 'test', 'UC48rkTlXjRd6pnqqBkdV0Mw', 'test');
INSERT INTO comment VALUES (8, 'une bonne chaine qui file tous les replays', 'UCvqRdlKsE5Q8mf8YXbdIJLw', 'test2');
INSERT INTO comment VALUES (9, '', 'UCvqRdlKsE5Q8mf8YXbdIJLw', 'test2');
INSERT INTO comment VALUES (10, 'test of the comment', 'UC9EZGiMrK8-OYbLH3Yfj_QQ', 'test');
INSERT INTO comment VALUES (11, 'Random, I love random', 'UC1zZE_kJ8rQHgLTVfobLi_g', 'randomUser95');
INSERT INTO comment VALUES (12, 'prenez le temps d&apos;y penser', 'UCcziTK2NKeWtWQ6kB5tmQ8Q', 'test');
INSERT INTO comment VALUES (13, 'SUPER CHENE MINECRAFT JE LIKE', 'UCAMukdd6wzetKkuZ9gPS5uA', 'lechatte');
INSERT INTO comment VALUES (14, 'Très bonne qualité de peinture, la pose est facile et la peinture sèche en moins de 2h', 'UCzTKskwIc_-a0cGvCXA848Q', 'Remi');
INSERT INTO comment VALUES (15, 'Zeraporc', 'UCZ_oIYI9ZNpOfWbpZxWNuRQ', 'Remi');
INSERT INTO comment VALUES (16, 'De la science de la vulgarisation, du fun', 'UCWnfDPdZw6A23UtuBpYBbAg', 'admin');
INSERT INTO comment VALUES (17, 'Des explosions', 'UCvGag7MyHR8H9oRm9iL9Ifw', 'admin');
INSERT INTO comment VALUES (18, 'La meyeure dé chêne ', 'UCxc5Hsu5mdgcMzNxzVE38Nw', 'admin');


--
-- TOC entry 3858 (class 0 OID 81307)
-- Dependencies: 203
-- Data for Name: favoris; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO favoris VALUES (14, 'UCcziTK2NKeWtWQ6kB5tmQ8Q');
INSERT INTO favoris VALUES (14, 'UCvqRdlKsE5Q8mf8YXbdIJLw');


--
-- TOC entry 3851 (class 0 OID 59538)
-- Dependencies: 196
-- Data for Name: tag; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO tag VALUES (6, 'vulgarization');
INSERT INTO tag VALUES (7, 'top');
INSERT INTO tag VALUES (8, 'geography');
INSERT INTO tag VALUES (9, 'tutorial');
INSERT INTO tag VALUES (10, 'short film');
INSERT INTO tag VALUES (11, 'makeup');
INSERT INTO tag VALUES (12, 'humor');
INSERT INTO tag VALUES (13, 'sport');
INSERT INTO tag VALUES (14, 'magic');
INSERT INTO tag VALUES (15, 'music');
INSERT INTO tag VALUES (16, 'painting');
INSERT INTO tag VALUES (17, 'animation');
INSERT INTO tag VALUES (18, 'critic');
INSERT INTO tag VALUES (19, 'tasting');
INSERT INTO tag VALUES (20, 'cinema');
INSERT INTO tag VALUES (21, 'board game');
INSERT INTO tag VALUES (4, 'gaming');
INSERT INTO tag VALUES (2, 'animal');
INSERT INTO tag VALUES (3, 'vlog');
INSERT INTO tag VALUES (1, 'travel');
INSERT INTO tag VALUES (25, 'history');
INSERT INTO tag VALUES (26, 'science');
INSERT INTO tag VALUES (27, 'documentary');


--
-- TOC entry 3853 (class 0 OID 59546)
-- Dependencies: 198
-- Data for Name: tag_link; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO tag_link VALUES (14, 4, 'UCvqRdlKsE5Q8mf8YXbdIJLw');
INSERT INTO tag_link VALUES (14, 2, 'UC3SIm-UNl4Ou381-PYKzU8w');
INSERT INTO tag_link VALUES (14, 3, 'UC3SIm-UNl4Ou381-PYKzU8w');
INSERT INTO tag_link VALUES (14, 2, 'UCXSCm3S2XZHLBz8kH0N5Heg');
INSERT INTO tag_link VALUES (14, 4, 'UCPKgIhTC3BdkAwMw6s-GEug');
INSERT INTO tag_link VALUES (14, 15, 'UCPKgIhTC3BdkAwMw6s-GEug');
INSERT INTO tag_link VALUES (14, 12, 'UCPKgIhTC3BdkAwMw6s-GEug');
INSERT INTO tag_link VALUES (16, 6, 'UCcziTK2NKeWtWQ6kB5tmQ8Q');
INSERT INTO tag_link VALUES (16, 26, 'UCcziTK2NKeWtWQ6kB5tmQ8Q');
INSERT INTO tag_link VALUES (14, 26, 'UCcziTK2NKeWtWQ6kB5tmQ8Q');
INSERT INTO tag_link VALUES (14, 6, 'UCcziTK2NKeWtWQ6kB5tmQ8Q');
INSERT INTO tag_link VALUES (14, 10, 'UCcziTK2NKeWtWQ6kB5tmQ8Q');
INSERT INTO tag_link VALUES (16, 10, 'UCcziTK2NKeWtWQ6kB5tmQ8Q');
INSERT INTO tag_link VALUES (16, 25, 'UCcziTK2NKeWtWQ6kB5tmQ8Q');
INSERT INTO tag_link VALUES (14, 12, 'UCo0U1tbk3YbqiLDhkeWOviQ');
INSERT INTO tag_link VALUES (14, 4, 'UCo0U1tbk3YbqiLDhkeWOviQ');
INSERT INTO tag_link VALUES (14, 4, 'UCwa-qCAFghXwkcQvLadzRxQ');
INSERT INTO tag_link VALUES (19, 2, 'UC3SIm-UNl4Ou381-PYKzU8w');
INSERT INTO tag_link VALUES (16, 4, 'UCvqRdlKsE5Q8mf8YXbdIJLw');
INSERT INTO tag_link VALUES (21, 11, 'UCzTKskwIc_-a0cGvCXA848Q');
INSERT INTO tag_link VALUES (21, 4, 'UCCFqUJYKT97UerMmb6DM0bw');
INSERT INTO tag_link VALUES (21, 4, 'UCZ_oIYI9ZNpOfWbpZxWNuRQ');
INSERT INTO tag_link VALUES (21, 2, 'UC3SIm-UNl4Ou381-PYKzU8w');
INSERT INTO tag_link VALUES (16, 27, 'UCL_cZf5sHKQHMRIEax5o3sg');
INSERT INTO tag_link VALUES (16, 8, 'UCL_cZf5sHKQHMRIEax5o3sg');
INSERT INTO tag_link VALUES (16, 25, 'UCL_cZf5sHKQHMRIEax5o3sg');
INSERT INTO tag_link VALUES (16, 27, 'UC50uCdUubc04xXZz7bqv5ng');
INSERT INTO tag_link VALUES (16, 26, 'UCWnfDPdZw6A23UtuBpYBbAg');
INSERT INTO tag_link VALUES (16, 6, 'UCWnfDPdZw6A23UtuBpYBbAg');
INSERT INTO tag_link VALUES (16, 26, 'UCvGag7MyHR8H9oRm9iL9Ifw');
INSERT INTO tag_link VALUES (16, 6, 'UCvGag7MyHR8H9oRm9iL9Ifw');
INSERT INTO tag_link VALUES (16, 4, 'UCxc5Hsu5mdgcMzNxzVE38Nw');


--
-- TOC entry 3854 (class 0 OID 59552)
-- Dependencies: 199
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO "user" VALUES (14, 'test@mailfr', 'test', false, '$2a$10$2lypJkboU0yu8s5IG3o6OeqLIDOl3na/oSwvY5P1d7jSdA4dLsv7W', '2018-05-27');
INSERT INTO "user" VALUES (15, 'test@mail.fr', 'test2', false, '$2a$10$TE.PtjKOuLLpKr5TqPTu9O5EAgK26T.WVnrYyQnItAWYnzXeDf/uu', '2018-05-27');
INSERT INTO "user" VALUES (16, 'admin@youtubetag.com', 'admin', true, '$2a$10$QLBj6DDVeKjGecs6bwzwTueZiC3YdsmqDt9EolQ/iZkMR3pmDYKTq', '2018-05-29');
INSERT INTO "user" VALUES (17, 'randomUser95@mail.com', 'randomUser95', false, '$2a$10$TLf1wCPOW9JVFCP0KmkvzehClwMXDaNZaezOcoCBxdhuWG./BQE/m', '2018-05-30');
INSERT INTO "user" VALUES (18, 'alexis@alexis.fr', 'Alexis', false, '$2a$10$uocahAlSRIVDsXsxYqv7R.NhNr88E.xdLSG8P7j9nFBFijYrfo9HS', '2018-05-31');
INSERT INTO "user" VALUES (19, 'lol@lol.fr', 'lol', false, '$2a$10$PWETKZqUK4yn7R08GhF/k.A9VXdlSA2zpdaMkRfayzCDZyS/zlley', '2018-06-01');
INSERT INTO "user" VALUES (20, 'lechatte@yopmail.com', 'lechatte', false, '$2a$10$p1gX0Kza4HgSU6YaqcAZ8eXnHnti/49mzvu7QbTDjWK7vIHy7VwOa', '2018-06-01');
INSERT INTO "user" VALUES (21, 'remigestin@gmail.com', 'Remi', false, '$2a$10$MC1Frt6bN/4mExdh5uO7cegxl/D.sJfdY87RlFB3IkxUZbwPbtne6', '2018-06-01');
INSERT INTO "user" VALUES (22, 'theo.ponthieu@hotmail.fr', 'Theo', false, '$2a$10$STEAdstfxfETVOFP8n7Fqum.PHvy885rQdnv5fFRro/rzbk8BC04C', '2018-06-01');


--
-- TOC entry 3867 (class 0 OID 0)
-- Dependencies: 201
-- Name: comment_id_comment_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('comment_id_comment_seq', 18, true);


--
-- TOC entry 3868 (class 0 OID 0)
-- Dependencies: 197
-- Name: tag_id_tag_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('tag_id_tag_seq', 27, true);


--
-- TOC entry 3869 (class 0 OID 0)
-- Dependencies: 200
-- Name: user_id_user_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('user_id_user_seq', 22, true);


--
-- TOC entry 3723 (class 2606 OID 61417)
-- Name: comment comment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY comment
    ADD CONSTRAINT comment_pkey PRIMARY KEY (id_comment);


--
-- TOC entry 3725 (class 2606 OID 81314)
-- Name: favoris favoris_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY favoris
    ADD CONSTRAINT favoris_pkey PRIMARY KEY (id_user, id_channel);


--
-- TOC entry 3719 (class 2606 OID 59563)
-- Name: tag_link tag_link_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY tag_link
    ADD CONSTRAINT tag_link_pkey PRIMARY KEY (id_user, id_tag, id_channel);


--
-- TOC entry 3717 (class 2606 OID 59565)
-- Name: tag tag_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY tag
    ADD CONSTRAINT tag_pkey PRIMARY KEY (id_tag);


--
-- TOC entry 3721 (class 2606 OID 59567)
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id_user);


--
-- TOC entry 3729 (class 2620 OID 59568)
-- Name: user date_inscription_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER date_inscription_trigger BEFORE INSERT ON public."user" FOR EACH ROW EXECUTE PROCEDURE my_trigger_date_inscription();


--
-- TOC entry 3728 (class 2606 OID 81317)
-- Name: favoris fk_fav_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY favoris
    ADD CONSTRAINT fk_fav_user FOREIGN KEY (id_user) REFERENCES "user"(id_user);


--
-- TOC entry 3726 (class 2606 OID 59569)
-- Name: tag_link fk_tag; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY tag_link
    ADD CONSTRAINT fk_tag FOREIGN KEY (id_tag) REFERENCES tag(id_tag) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3727 (class 2606 OID 59574)
-- Name: tag_link fk_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY tag_link
    ADD CONSTRAINT fk_user FOREIGN KEY (id_user) REFERENCES "user"(id_user) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2018-06-01 23:34:11

--
-- PostgreSQL database dump complete
--
