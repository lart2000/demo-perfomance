--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.13
-- Dumped by pg_dump version 9.5.13

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: adviser_thesis; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.adviser_thesis (
    id uuid NOT NULL,
    adviser_id uuid NOT NULL,
    thesis_id uuid NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.adviser_thesis OWNER TO postgres;

--
-- Name: advisers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.advisers (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    last_name character varying(255) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.advisers OWNER TO postgres;

--
-- Name: author_thesis; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.author_thesis (
    id uuid NOT NULL,
    author_id uuid NOT NULL,
    thesis_id uuid NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.author_thesis OWNER TO postgres;

--
-- Name: authors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.authors (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    last_name character varying(255) NOT NULL,
    school_id uuid NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.authors OWNER TO postgres;

--
-- Name: charges; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.charges (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.charges OWNER TO postgres;

--
-- Name: code_hashes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.code_hashes (
    id uuid NOT NULL,
    hash text NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.code_hashes OWNER TO postgres;

--
-- Name: faculties; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.faculties (
    id uuid NOT NULL,
    name character varying(200) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.faculties OWNER TO postgres;

--
-- Name: juries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.juries (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    last_name character varying(255) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.juries OWNER TO postgres;

--
-- Name: jury_thesis; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jury_thesis (
    id uuid NOT NULL,
    jury_id uuid NOT NULL,
    thesis_id uuid NOT NULL,
    charge_id uuid NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.jury_thesis OWNER TO postgres;

--
-- Name: log_passwords; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.log_passwords (
    id uuid NOT NULL,
    tried integer NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.log_passwords OWNER TO postgres;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id uuid NOT NULL,
    name character varying(100) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: schema_migration; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.schema_migration (
    version character varying(255) NOT NULL
);


ALTER TABLE public.schema_migration OWNER TO postgres;

--
-- Name: schools; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.schools (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    faculty_id uuid NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.schools OWNER TO postgres;

--
-- Name: theses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.theses (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    code character varying(255) NOT NULL,
    summary character varying(255) NOT NULL,
    date_lift timestamp without time zone NOT NULL,
    status character(1) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.theses OWNER TO postgres;

--
-- Name: user_thesis; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_thesis (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    thesis_id uuid NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.user_thesis OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    full_name character varying(250) NOT NULL,
    name_user character varying(100) NOT NULL,
    password character varying(100) NOT NULL,
    status text NOT NULL,
    role_id uuid NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: adviser_thesis_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adviser_thesis
    ADD CONSTRAINT adviser_thesis_pkey PRIMARY KEY (id);


--
-- Name: advisers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.advisers
    ADD CONSTRAINT advisers_pkey PRIMARY KEY (id);


--
-- Name: author_thesis_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.author_thesis
    ADD CONSTRAINT author_thesis_pkey PRIMARY KEY (id);


--
-- Name: authors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authors
    ADD CONSTRAINT authors_pkey PRIMARY KEY (id);


--
-- Name: charges_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.charges
    ADD CONSTRAINT charges_pkey PRIMARY KEY (id);


--
-- Name: code_hashes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.code_hashes
    ADD CONSTRAINT code_hashes_pkey PRIMARY KEY (id);


--
-- Name: faculties_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faculties
    ADD CONSTRAINT faculties_pkey PRIMARY KEY (id);


--
-- Name: juries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.juries
    ADD CONSTRAINT juries_pkey PRIMARY KEY (id);


--
-- Name: jury_thesis_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jury_thesis
    ADD CONSTRAINT jury_thesis_pkey PRIMARY KEY (id);


--
-- Name: log_passwords_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.log_passwords
    ADD CONSTRAINT log_passwords_pkey PRIMARY KEY (id);


--
-- Name: roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: schools_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schools
    ADD CONSTRAINT schools_pkey PRIMARY KEY (id);


--
-- Name: theses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.theses
    ADD CONSTRAINT theses_pkey PRIMARY KEY (id);


--
-- Name: user_thesis_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_thesis
    ADD CONSTRAINT user_thesis_pkey PRIMARY KEY (id);


--
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: schema_migration_version_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX schema_migration_version_idx ON public.schema_migration USING btree (version);


--
-- Name: adviser_thesis_adviser_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adviser_thesis
    ADD CONSTRAINT adviser_thesis_adviser_id FOREIGN KEY (adviser_id) REFERENCES public.advisers(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: author_thesis_author_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.author_thesis
    ADD CONSTRAINT author_thesis_author_id FOREIGN KEY (author_id) REFERENCES public.authors(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: jury_thesis_jury_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jury_thesis
    ADD CONSTRAINT jury_thesis_jury_id FOREIGN KEY (jury_id) REFERENCES public.juries(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

