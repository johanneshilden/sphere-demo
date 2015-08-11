--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET search_path = public, pg_catalog;

ALTER TABLE ONLY public.transaction DROP CONSTRAINT transaction_node_id_fkey;
ALTER TABLE ONLY public.target DROP CONSTRAINT target_node_id_fkey;
ALTER TABLE ONLY public.target DROP CONSTRAINT target_key_fkey;
ALTER TABLE ONLY public.range DROP CONSTRAINT range_transaction_id_fkey;
ALTER TABLE ONLY public.range DROP CONSTRAINT range_node_id_fkey;
ALTER TABLE ONLY public.device DROP CONSTRAINT device_node_id_fkey;
ALTER TABLE ONLY public.transaction DROP CONSTRAINT transaction_pkey;
ALTER TABLE ONLY public.target DROP CONSTRAINT target_pkey;
ALTER TABLE ONLY public.range DROP CONSTRAINT range_pkey;
ALTER TABLE ONLY public.node DROP CONSTRAINT node_pkey;
ALTER TABLE ONLY public.device DROP CONSTRAINT device_pkey;
ALTER TABLE public.transaction ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.target ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.range ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.node ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.device ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE public.transaction_id_seq;
DROP TABLE public.transaction;
DROP SEQUENCE public.target_id_seq;
DROP TABLE public.target;
DROP SEQUENCE public.range_id_seq;
DROP TABLE public.range;
DROP SEQUENCE public.node_id_seq;
DROP TABLE public.node;
DROP SEQUENCE public.device_id_seq;
DROP TABLE public.device;
DROP EXTENSION plpgsql;
DROP SCHEMA public;
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: device; Type: TABLE; Schema: public; Owner: antenna; Tablespace: 
--

CREATE TABLE device (
    id integer NOT NULL,
    node_id bigint NOT NULL,
    secret character varying NOT NULL
);


ALTER TABLE device OWNER TO antenna;

--
-- Name: device_id_seq; Type: SEQUENCE; Schema: public; Owner: antenna
--

CREATE SEQUENCE device_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE device_id_seq OWNER TO antenna;

--
-- Name: device_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: antenna
--

ALTER SEQUENCE device_id_seq OWNED BY device.id;


--
-- Name: node; Type: TABLE; Schema: public; Owner: antenna; Tablespace: 
--

CREATE TABLE node (
    id integer NOT NULL,
    name character varying NOT NULL,
    family character varying NOT NULL,
    sync_point bigint NOT NULL,
    saturated boolean NOT NULL,
    locked boolean NOT NULL
);


ALTER TABLE node OWNER TO antenna;

--
-- Name: node_id_seq; Type: SEQUENCE; Schema: public; Owner: antenna
--

CREATE SEQUENCE node_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE node_id_seq OWNER TO antenna;

--
-- Name: node_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: antenna
--

ALTER SEQUENCE node_id_seq OWNED BY node.id;


--
-- Name: range; Type: TABLE; Schema: public; Owner: antenna; Tablespace: 
--

CREATE TABLE range (
    id integer NOT NULL,
    transaction_id bigint NOT NULL,
    node_id bigint NOT NULL
);


ALTER TABLE range OWNER TO antenna;

--
-- Name: range_id_seq; Type: SEQUENCE; Schema: public; Owner: antenna
--

CREATE SEQUENCE range_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE range_id_seq OWNER TO antenna;

--
-- Name: range_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: antenna
--

ALTER SEQUENCE range_id_seq OWNED BY range.id;


--
-- Name: target; Type: TABLE; Schema: public; Owner: antenna; Tablespace: 
--

CREATE TABLE target (
    id integer NOT NULL,
    node_id bigint NOT NULL,
    key bigint NOT NULL
);


ALTER TABLE target OWNER TO antenna;

--
-- Name: target_id_seq; Type: SEQUENCE; Schema: public; Owner: antenna
--

CREATE SEQUENCE target_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE target_id_seq OWNER TO antenna;

--
-- Name: target_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: antenna
--

ALTER SEQUENCE target_id_seq OWNED BY target.id;


--
-- Name: transaction; Type: TABLE; Schema: public; Owner: antenna; Tablespace: 
--

CREATE TABLE transaction (
    id integer NOT NULL,
    node_id bigint NOT NULL,
    commit_id bigint NOT NULL,
    batch_index bigint NOT NULL,
    up_method character varying NOT NULL,
    up_resource character varying NOT NULL,
    up_payload character varying NOT NULL,
    down_method character varying NOT NULL,
    down_resource character varying NOT NULL,
    down_payload character varying NOT NULL,
    "timestamp" bigint NOT NULL
);


ALTER TABLE transaction OWNER TO antenna;

--
-- Name: transaction_id_seq; Type: SEQUENCE; Schema: public; Owner: antenna
--

CREATE SEQUENCE transaction_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE transaction_id_seq OWNER TO antenna;

--
-- Name: transaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: antenna
--

ALTER SEQUENCE transaction_id_seq OWNED BY transaction.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: antenna
--

ALTER TABLE ONLY device ALTER COLUMN id SET DEFAULT nextval('device_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: antenna
--

ALTER TABLE ONLY node ALTER COLUMN id SET DEFAULT nextval('node_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: antenna
--

ALTER TABLE ONLY range ALTER COLUMN id SET DEFAULT nextval('range_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: antenna
--

ALTER TABLE ONLY target ALTER COLUMN id SET DEFAULT nextval('target_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: antenna
--

ALTER TABLE ONLY transaction ALTER COLUMN id SET DEFAULT nextval('transaction_id_seq'::regclass);


--
-- Data for Name: device; Type: TABLE DATA; Schema: public; Owner: antenna
--

COPY device (id, node_id, secret) FROM stdin;
1	1	sha256|17|TXhnNFlOME9hRTN4YWVobWczdXA=|9h3qKTJQE385oPy0H6MKTRTOIrBXoUYon1ab6j2wLfU=
2	2	sha256|17|TXhnNFlOME9hRTN4YWVobWczdXA=|+Nr1mDpvaScP9d5KICIJN2yb1QSrkWnPapgppJ6UpAg=
3	3	sha256|17|TXhnNFlOME9hRTN4YWVobWczdXA=|+Nr1mDpvaScP9d5KICIJN2yb1QSrkWnPapgppJ6UpAg=
4	4	sha256|17|TXhnNFlOME9hRTN4YWVobWczdXA=|+Nr1mDpvaScP9d5KICIJN2yb1QSrkWnPapgppJ6UpAg=
5	5	sha256|17|TXhnNFlOME9hRTN4YWVobWczdXA=|MQtx0HfxB+hqFiEVaO3cdTe7f0b++AAH7AAcwYGJEQU=
6	6	sha256|17|TXhnNFlOME9hRTN4YWVobWczdXA=|MQtx0HfxB+hqFiEVaO3cdTe7f0b++AAH7AAcwYGJEQU=
7	7	sha256|17|TXhnNFlOME9hRTN4YWVobWczdXA=|+awoM+XgV4BErgPiO+zlD4xmbGR6V8nqhN4dtiMp8i4=
\.


--
-- Name: device_id_seq; Type: SEQUENCE SET; Schema: public; Owner: antenna
--

SELECT pg_catalog.setval('device_id_seq', 7, true);


--
-- Data for Name: node; Type: TABLE DATA; Schema: public; Owner: antenna
--

COPY node (id, name, family, sync_point, saturated, locked) FROM stdin;
6	fieldstaff-user2	device	0	f	f
7	callcenter-user1	device	0	f	f
8	sink	virtual	0	f	f
1	root	device	0	f	t
2	test-user1	device	0	t	f
3	test-user2	device	0	f	f
4	test-user3	device	0	f	f
5	fieldstaff-user1	device	0	f	f
\.


--
-- Name: node_id_seq; Type: SEQUENCE SET; Schema: public; Owner: antenna
--

SELECT pg_catalog.setval('node_id_seq', 8, true);


--
-- Data for Name: range; Type: TABLE DATA; Schema: public; Owner: antenna
--

COPY range (id, transaction_id, node_id) FROM stdin;
\.


--
-- Name: range_id_seq; Type: SEQUENCE SET; Schema: public; Owner: antenna
--

SELECT pg_catalog.setval('range_id_seq', 5485, true);


--
-- Data for Name: target; Type: TABLE DATA; Schema: public; Owner: antenna
--

COPY target (id, node_id, key) FROM stdin;
36	6	1
37	6	2
38	6	3
39	6	4
40	6	5
41	6	7
42	6	8
43	7	1
44	7	2
45	7	3
46	7	4
47	7	5
48	7	6
49	7	8
50	8	1
51	8	2
52	8	3
53	8	4
54	8	5
55	8	6
56	8	7
57	1	2
58	1	3
59	1	4
60	1	5
61	1	6
62	1	7
63	1	8
64	2	5
65	2	3
66	2	4
67	2	6
68	2	7
69	2	8
70	2	1
71	3	5
72	3	4
73	3	6
74	3	7
75	3	8
76	3	1
77	3	2
78	4	5
79	4	6
80	4	7
81	4	8
82	4	1
83	4	2
84	4	3
85	5	6
86	5	7
87	5	8
88	5	1
89	5	2
90	5	3
91	5	4
\.


--
-- Name: target_id_seq; Type: SEQUENCE SET; Schema: public; Owner: antenna
--

SELECT pg_catalog.setval('target_id_seq', 91, true);


--
-- Data for Name: transaction; Type: TABLE DATA; Schema: public; Owner: antenna
--

COPY transaction (id, node_id, commit_id, batch_index, up_method, up_resource, up_payload, down_method, down_resource, down_payload, "timestamp") FROM stdin;
\.


--
-- Name: transaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: antenna
--

SELECT pg_catalog.setval('transaction_id_seq', 1841, true);


--
-- Name: device_pkey; Type: CONSTRAINT; Schema: public; Owner: antenna; Tablespace: 
--

ALTER TABLE ONLY device
    ADD CONSTRAINT device_pkey PRIMARY KEY (id);


--
-- Name: node_pkey; Type: CONSTRAINT; Schema: public; Owner: antenna; Tablespace: 
--

ALTER TABLE ONLY node
    ADD CONSTRAINT node_pkey PRIMARY KEY (id);


--
-- Name: range_pkey; Type: CONSTRAINT; Schema: public; Owner: antenna; Tablespace: 
--

ALTER TABLE ONLY range
    ADD CONSTRAINT range_pkey PRIMARY KEY (id);


--
-- Name: target_pkey; Type: CONSTRAINT; Schema: public; Owner: antenna; Tablespace: 
--

ALTER TABLE ONLY target
    ADD CONSTRAINT target_pkey PRIMARY KEY (id);


--
-- Name: transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: antenna; Tablespace: 
--

ALTER TABLE ONLY transaction
    ADD CONSTRAINT transaction_pkey PRIMARY KEY (id);


--
-- Name: device_node_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: antenna
--

ALTER TABLE ONLY device
    ADD CONSTRAINT device_node_id_fkey FOREIGN KEY (node_id) REFERENCES node(id);


--
-- Name: range_node_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: antenna
--

ALTER TABLE ONLY range
    ADD CONSTRAINT range_node_id_fkey FOREIGN KEY (node_id) REFERENCES node(id);


--
-- Name: range_transaction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: antenna
--

ALTER TABLE ONLY range
    ADD CONSTRAINT range_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES transaction(id);


--
-- Name: target_key_fkey; Type: FK CONSTRAINT; Schema: public; Owner: antenna
--

ALTER TABLE ONLY target
    ADD CONSTRAINT target_key_fkey FOREIGN KEY (key) REFERENCES node(id);


--
-- Name: target_node_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: antenna
--

ALTER TABLE ONLY target
    ADD CONSTRAINT target_node_id_fkey FOREIGN KEY (node_id) REFERENCES node(id);


--
-- Name: transaction_node_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: antenna
--

ALTER TABLE ONLY transaction
    ADD CONSTRAINT transaction_node_id_fkey FOREIGN KEY (node_id) REFERENCES node(id);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

