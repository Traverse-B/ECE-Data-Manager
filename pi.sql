--
-- PostgreSQL database dump
--

-- Dumped from database version 11.11 (Debian 11.11-0+deb10u1)
-- Dumped by pg_dump version 11.11 (Debian 11.11-0+deb10u1)

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

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: attendance; Type: TABLE; Schema: public; Owner: pi
--

CREATE TABLE public.attendance (
    "timestamp" timestamp without time zone NOT NULL,
    reporter character varying(20) NOT NULL,
    student_id integer NOT NULL,
    data character varying(20) NOT NULL,
    coteacher character varying(12),
    id integer NOT NULL
);


ALTER TABLE public.attendance OWNER TO pi;

--
-- Name: attendance_id_seq; Type: SEQUENCE; Schema: public; Owner: pi
--

CREATE SEQUENCE public.attendance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.attendance_id_seq OWNER TO pi;

--
-- Name: attendance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pi
--

ALTER SEQUENCE public.attendance_id_seq OWNED BY public.attendance.id;


--
-- Name: bip; Type: TABLE; Schema: public; Owner: pi
--

CREATE TABLE public.bip (
    id integer NOT NULL,
    student_id integer,
    target_behavior character varying(400) NOT NULL,
    replacement_behavior character varying(400) NOT NULL
);


ALTER TABLE public.bip OWNER TO pi;

--
-- Name: bip_data; Type: TABLE; Schema: public; Owner: pi
--

CREATE TABLE public.bip_data (
    "timestamp" timestamp without time zone NOT NULL,
    bip_id integer NOT NULL,
    incidents integer,
    id integer NOT NULL
);


ALTER TABLE public.bip_data OWNER TO pi;

--
-- Name: bip_data_id_seq; Type: SEQUENCE; Schema: public; Owner: pi
--

CREATE SEQUENCE public.bip_data_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.bip_data_id_seq OWNER TO pi;

--
-- Name: bip_data_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pi
--

ALTER SEQUENCE public.bip_data_id_seq OWNED BY public.bip_data.id;


--
-- Name: bip_id_seq; Type: SEQUENCE; Schema: public; Owner: pi
--

CREATE SEQUENCE public.bip_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.bip_id_seq OWNER TO pi;

--
-- Name: bip_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pi
--

ALTER SEQUENCE public.bip_id_seq OWNED BY public.bip.id;


--
-- Name: calendar; Type: TABLE; Schema: public; Owner: pi
--

CREATE TABLE public.calendar (
    date date NOT NULL
);


ALTER TABLE public.calendar OWNER TO pi;

--
-- Name: compile_dates; Type: TABLE; Schema: public; Owner: pi
--

CREATE TABLE public.compile_dates (
    date date NOT NULL,
    type character varying(20)
);


ALTER TABLE public.compile_dates OWNER TO pi;

--
-- Name: goal_data; Type: TABLE; Schema: public; Owner: pi
--

CREATE TABLE public.goal_data (
    "timestamp" timestamp without time zone,
    iep_goal_id integer,
    type character varying(20),
    response integer,
    responder character varying(8),
    coteacher_login character varying(12),
    id integer NOT NULL
);


ALTER TABLE public.goal_data OWNER TO pi;

--
-- Name: goal_data_id_seq; Type: SEQUENCE; Schema: public; Owner: pi
--

CREATE SEQUENCE public.goal_data_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.goal_data_id_seq OWNER TO pi;

--
-- Name: goal_data_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pi
--

ALTER SEQUENCE public.goal_data_id_seq OWNED BY public.goal_data.id;


--
-- Name: iep; Type: TABLE; Schema: public; Owner: pi
--

CREATE TABLE public.iep (
    start_date date,
    end_date date,
    student_id integer,
    id integer NOT NULL
);


ALTER TABLE public.iep OWNER TO pi;

--
-- Name: iep_goal; Type: TABLE; Schema: public; Owner: pi
--

CREATE TABLE public.iep_goal (
    iep_id integer,
    area character varying(200),
    goal character varying(1000),
    data_question character varying(1000),
    response_type character varying(50),
    id integer NOT NULL
);


ALTER TABLE public.iep_goal OWNER TO pi;

--
-- Name: iep_goal_id_seq; Type: SEQUENCE; Schema: public; Owner: pi
--

CREATE SEQUENCE public.iep_goal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.iep_goal_id_seq OWNER TO pi;

--
-- Name: iep_goal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pi
--

ALTER SEQUENCE public.iep_goal_id_seq OWNED BY public.iep_goal.id;


--
-- Name: iep_id_seq; Type: SEQUENCE; Schema: public; Owner: pi
--

CREATE SEQUENCE public.iep_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.iep_id_seq OWNER TO pi;

--
-- Name: iep_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pi
--

ALTER SEQUENCE public.iep_id_seq OWNED BY public.iep.id;


--
-- Name: meta_data; Type: TABLE; Schema: public; Owner: pi
--

CREATE TABLE public.meta_data (
    "timestamp" timestamp without time zone NOT NULL,
    reporter character varying(20) NOT NULL,
    data_type character varying(20) NOT NULL,
    student_id integer NOT NULL,
    data character varying(1000) NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public.meta_data OWNER TO pi;

--
-- Name: meta_data_id_seq; Type: SEQUENCE; Schema: public; Owner: pi
--

CREATE SEQUENCE public.meta_data_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.meta_data_id_seq OWNER TO pi;

--
-- Name: meta_data_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pi
--

ALTER SEQUENCE public.meta_data_id_seq OWNED BY public.meta_data.id;


--
-- Name: student; Type: TABLE; Schema: public; Owner: pi
--

CREATE TABLE public.student (
    id integer NOT NULL,
    first_name character varying(30) NOT NULL,
    last_name character varying(40) NOT NULL,
    disability character varying(20) NOT NULL
);


ALTER TABLE public.student OWNER TO pi;

--
-- Name: teacher; Type: TABLE; Schema: public; Owner: pi
--

CREATE TABLE public.teacher (
    login character(8) NOT NULL,
    secret character varying(16) NOT NULL,
    email character varying(100) NOT NULL,
    name character varying(50) NOT NULL,
    user_type character varying(6),
    CONSTRAINT teacher_user_type_check CHECK (((user_type)::text = ANY ((ARRAY['DATA'::character varying, 'TOR'::character varying, 'ADMIN'::character varying])::text[])))
);


ALTER TABLE public.teacher OWNER TO pi;

--
-- Name: teachers_students; Type: TABLE; Schema: public; Owner: pi
--

CREATE TABLE public.teachers_students (
    teacher_login character(8) NOT NULL,
    student_id integer NOT NULL,
    role character varying(20) NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    coteacher_login character varying(12),
    CONSTRAINT teachers_students_check CHECK ((start_date < end_date))
);


ALTER TABLE public.teachers_students OWNER TO pi;

--
-- Name: attendance id; Type: DEFAULT; Schema: public; Owner: pi
--

ALTER TABLE ONLY public.attendance ALTER COLUMN id SET DEFAULT nextval('public.attendance_id_seq'::regclass);


--
-- Name: bip id; Type: DEFAULT; Schema: public; Owner: pi
--

ALTER TABLE ONLY public.bip ALTER COLUMN id SET DEFAULT nextval('public.bip_id_seq'::regclass);


--
-- Name: bip_data id; Type: DEFAULT; Schema: public; Owner: pi
--

ALTER TABLE ONLY public.bip_data ALTER COLUMN id SET DEFAULT nextval('public.bip_data_id_seq'::regclass);


--
-- Name: goal_data id; Type: DEFAULT; Schema: public; Owner: pi
--

ALTER TABLE ONLY public.goal_data ALTER COLUMN id SET DEFAULT nextval('public.goal_data_id_seq'::regclass);


--
-- Name: iep id; Type: DEFAULT; Schema: public; Owner: pi
--

ALTER TABLE ONLY public.iep ALTER COLUMN id SET DEFAULT nextval('public.iep_id_seq'::regclass);


--
-- Name: iep_goal id; Type: DEFAULT; Schema: public; Owner: pi
--

ALTER TABLE ONLY public.iep_goal ALTER COLUMN id SET DEFAULT nextval('public.iep_goal_id_seq'::regclass);


--
-- Name: meta_data id; Type: DEFAULT; Schema: public; Owner: pi
--

ALTER TABLE ONLY public.meta_data ALTER COLUMN id SET DEFAULT nextval('public.meta_data_id_seq'::regclass);


--
-- Data for Name: attendance; Type: TABLE DATA; Schema: public; Owner: pi
--

COPY public.attendance ("timestamp", reporter, student_id, data, coteacher, id) FROM stdin;
\.


--
-- Data for Name: bip; Type: TABLE DATA; Schema: public; Owner: pi
--

COPY public.bip (id, student_id, target_behavior, replacement_behavior) FROM stdin;
1	5809457	When upset by words or actions of others, Terry will become verbally or physically abusive in order to gain status and avoid conflict.	When upset by words or actions of others, Terry will state his need or initiate a cool-down procedure to gain status and avoid the conflict
\.


--
-- Data for Name: bip_data; Type: TABLE DATA; Schema: public; Owner: pi
--

COPY public.bip_data ("timestamp", bip_id, incidents, id) FROM stdin;
2020-08-24 09:00:00	1	2	1
2020-09-03 10:00:00	1	7	2
\.


--
-- Data for Name: calendar; Type: TABLE DATA; Schema: public; Owner: pi
--

COPY public.calendar (date) FROM stdin;
2021-06-01
2021-06-02
2021-06-03
2021-06-04
2021-06-07
2021-06-08
2021-06-09
2021-06-10
2021-06-11
2021-06-14
2021-06-15
2021-06-16
2021-06-17
2021-06-18
2021-06-21
2021-06-22
2021-06-23
2021-06-24
2021-06-25
2021-06-28
2021-06-29
2021-06-30
2021-07-04
2021-05-04
2022-05-30
\.


--
-- Data for Name: compile_dates; Type: TABLE DATA; Schema: public; Owner: pi
--

COPY public.compile_dates (date, type) FROM stdin;
2020-09-11	percent
2020-09-25	percent
2020-10-09	percent
2020-10-23	percent
2020-11-06	percent
2020-11-20	percent
2020-12-04	percent
2020-12-18	percent
2021-01-15	percent
2021-01-29	percent
2021-02-11	percent
2021-02-26	percent
2021-03-12	percent
2021-03-26	percent
2021-04-16	percent
2021-04-29	percent
2021-05-14	percent
2021-05-26	percent
2020-10-06	boolean
2020-10-08	boolean
2020-10-12	boolean
2020-10-14	boolean
2020-10-19	boolean
2020-10-21	boolean
2020-10-26	boolean
2020-10-28	boolean
2020-11-02	boolean
2020-11-05	boolean
2020-11-09	boolean
2020-11-11	boolean
2020-11-16	boolean
\.


--
-- Data for Name: goal_data; Type: TABLE DATA; Schema: public; Owner: pi
--

COPY public.goal_data ("timestamp", iep_goal_id, type, response, responder, coteacher_login, id) FROM stdin;
\.


--
-- Data for Name: iep; Type: TABLE DATA; Schema: public; Owner: pi
--

COPY public.iep (start_date, end_date, student_id, id) FROM stdin;
2020-07-17	2021-09-09	534987	57
2020-07-17	2021-09-09	576548	46
2020-07-17	2021-09-09	542984	56
2021-07-21	2022-07-20	409	58
\.


--
-- Data for Name: iep_goal; Type: TABLE DATA; Schema: public; Owner: pi
--

COPY public.iep_goal (iep_id, area, goal, data_question, response_type, id) FROM stdin;
46	English	Some English stuff	What percentage of the time was doug able to read the passage and answer questions correctly?	percentage	27
56	English	Ipsum lorum goal mumbo jumbo	Does this data question make me look fat?	boolean	30
57	English	Reading	What percentage of the time was Stella able to answer questions after reading?	percentage	31
57	All	behavior	Did Stella complete her work today?	boolean	32
58	English	Chris will blah blah blah	Given a reading passage blah blah what percent?	percentage	33
\.


--
-- Data for Name: meta_data; Type: TABLE DATA; Schema: public; Owner: pi
--

COPY public.meta_data ("timestamp", reporter, data_type, student_id, data, id) FROM stdin;
\.


--
-- Data for Name: student; Type: TABLE DATA; Schema: public; Owner: pi
--

COPY public.student (id, first_name, last_name, disability) FROM stdin;
937567382	Alexander	Example	MMD
542984	Suzie	Sample	AUT
5809457	Terry	Troutman	EBD
576548	Doug	Davison	SLD R/W/M
5018867	David	Davies	SLD Reading
92847958	Pico	Degayo	OHI
5987234	Greg	Van Avemat	EBD
3480985	Tina	Turner	MMD
2354975	Blade	Ti	SLD Math
385768	Mickey	Dunaway	SLD Writing/Reading
342676	Stig	Broncacio	SLD Reading
457809	Marcus	Parker	OHI
98734576	Tom	Bombadil	EBD
3247788	Gay	Apertif	MMD
6687345	Sally	Stringmusic	SLD Math
323478	Torque	Dunaway	SLD Writing/Reading
7777	Wouter	Pouls	AUT
666	Chip	Cookman	EBD
911	Gavin	Gravy	OTHER
24	Charles	Charlesington	FMD
44	Neilson	Powless	OHI
409	Chris	Froome	MMD
534987	Stella	Student	OHI
234	Gorgonzola	Benedict	OTHER
\.


--
-- Data for Name: teacher; Type: TABLE DATA; Schema: public; Owner: pi
--

COPY public.teacher (login, secret, email, name, user_type) FROM stdin;
dlpick02	Chopshop234	dylan.pickle@teacher.com	Dylan Pickle	DATA
bslowd01	Chopshop234	dylan.pickle2@teacher.com	Basil Lowder	DATA
jkcook02	Chopshop234	dylan.pickle2@teacher.com	Jeffery Cook	DATA
nbbroo01	Chopshop234	dylan.pickle2@teacher.com	Nermal Brooks	DATA
etsalm01	Chopshop234	dylan.pickle2@teacher.com	Earnest Salmon	DATA
tmjacobs	Chopshop234	dylan.pickle2@teacher.com	Tiffany Jacobs	DATA
hlende01	Chopshop234	dylan.pickle2@teacher.com	Harpo Ender	DATA
gvgreg02	Chopshop234	dylan.pickle2@teacher.com	Greta Gregory	DATA
jjjame03	Chopshop234	dylan.pickle2@teacher.com	James Jamison	DATA
bbracw01	Chopshop234	dylan.pickle2@teacher.com	Brian Bracwood	TOR
plfavr01	Chopshop234	LaFavre	Patrick	TOR
dltuen01	Chopshop234	dylan.tuens@jefferson.kyskools.ky	Dylan Tuens	DATA
bgflan01	Chopshop234	kpepper@gmail.com	Borge Flannery	DATA
cfreed01	Chopshop234	dylan.pickle2@teacher.com	Cayden Reedle	ADMIN
tdvand01	Chopshop234	taco.vanderhorn@teacher.con	Taco Vanderhorn	TOR
tpvund01	Chopshop234	tico.vunder@teacher.con	Tico Vunder	TOR
mrcave01	Chopshop234	markie@teacher.com	Mark Cavendish	DATA
\.


--
-- Data for Name: teachers_students; Type: TABLE DATA; Schema: public; Owner: pi
--

COPY public.teachers_students (teacher_login, student_id, role, start_date, end_date, coteacher_login) FROM stdin;
hlende01	7777	English	2021-07-18	2022-07-17	cfreed01
cfreed01	666	Math	2021-07-18	2022-07-17	\N
hlende01	666	Math	2021-07-18	2022-07-17	bbracw01
gvgreg02	911	Math	2021-07-18	2022-07-17	\N
etsalm01	24	English	2021-07-18	2022-07-17	\N
dlpick02	44	English	2021-07-18	2022-07-17	bbracw01
gvgreg02	44	Math	2021-07-18	2022-07-17	\N
cfreed01	44	English	2021-07-18	2022-07-17	dlpick02
etsalm01	937567382	English	2020-07-20	2021-07-20	\N
cfreed01	937567382	English	2020-07-20	2021-07-20	\N
jkcook02	937567382	Math	2020-07-20	2021-07-20	\N
nbbroo01	937567382	Science	2020-07-20	2021-07-20	\N
gvgreg02	937567382	Social Studies	2020-07-20	2021-07-20	\N
jkcook02	542984	Math	2020-07-20	2021-07-20	\N
tmjacobs	542984	Math	2020-07-20	2021-07-20	\N
etsalm01	542984	English	2020-07-20	2021-07-20	\N
cfreed01	542984	English	2020-07-20	2021-07-20	\N
hlende01	542984	Science	2020-07-20	2021-07-20	\N
gvgreg02	542984	Social Studies	2020-07-20	2021-07-20	\N
cfreed01	542984	Social Studies	2020-07-20	2021-07-20	\N
cfreed01	576548	English	2020-07-20	2021-07-20	\N
etsalm01	576548	English	2020-07-20	2021-07-20	\N
cfreed01	5018867	English	2020-07-20	2021-07-20	\N
cfreed01	92847958	English	2020-07-20	2021-07-20	\N
cfreed01	5987234	English	2020-07-20	2021-07-20	\N
cfreed01	3480985	English	2020-07-20	2021-07-20	\N
cfreed01	2354975	English	2020-07-20	2021-07-20	\N
cfreed01	385768	English	2020-07-20	2021-07-20	\N
cfreed01	342676	English	2020-07-20	2021-07-20	\N
cfreed01	457809	English	2020-07-20	2021-07-20	\N
cfreed01	98734576	English	2020-07-20	2021-07-20	\N
cfreed01	3247788	English	2020-07-20	2021-07-20	\N
cfreed01	6687345	English	2020-07-20	2021-07-20	\N
cfreed01	323478	English	2020-07-20	2021-07-20	\N
hlende01	409	Math	2021-07-18	2022-07-17	\N
jkcook02	937567382	TOR	2020-07-20	2021-07-20	\N
jkcook02	542984	TOR	2020-07-20	2021-07-20	\N
cfreed01	534987	Math	2021-07-20	2022-07-19	\N
cfreed01	409	TOR	2021-06-20	2022-05-30	\N
cfreed01	5987234	TOR	2021-07-20	2022-07-19	\N
tdvand01	234	Other	2021-07-21	2022-05-30	\N
cfreed01	234	TOR	2021-07-21	2022-05-30	\N
\.


--
-- Name: attendance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pi
--

SELECT pg_catalog.setval('public.attendance_id_seq', 79, true);


--
-- Name: bip_data_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pi
--

SELECT pg_catalog.setval('public.bip_data_id_seq', 2, true);


--
-- Name: bip_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pi
--

SELECT pg_catalog.setval('public.bip_id_seq', 1, true);


--
-- Name: goal_data_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pi
--

SELECT pg_catalog.setval('public.goal_data_id_seq', 92, true);


--
-- Name: iep_goal_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pi
--

SELECT pg_catalog.setval('public.iep_goal_id_seq', 33, true);


--
-- Name: iep_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pi
--

SELECT pg_catalog.setval('public.iep_id_seq', 58, true);


--
-- Name: meta_data_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pi
--

SELECT pg_catalog.setval('public.meta_data_id_seq', 1, false);


--
-- Name: bip_data bip_data_pkey; Type: CONSTRAINT; Schema: public; Owner: pi
--

ALTER TABLE ONLY public.bip_data
    ADD CONSTRAINT bip_data_pkey PRIMARY KEY (id);


--
-- Name: bip bip_pkey; Type: CONSTRAINT; Schema: public; Owner: pi
--

ALTER TABLE ONLY public.bip
    ADD CONSTRAINT bip_pkey PRIMARY KEY (id);


--
-- Name: calendar calendar_pkey; Type: CONSTRAINT; Schema: public; Owner: pi
--

ALTER TABLE ONLY public.calendar
    ADD CONSTRAINT calendar_pkey PRIMARY KEY (date);


--
-- Name: compile_dates compile_dates_pkey; Type: CONSTRAINT; Schema: public; Owner: pi
--

ALTER TABLE ONLY public.compile_dates
    ADD CONSTRAINT compile_dates_pkey PRIMARY KEY (date);


--
-- Name: iep_goal iep_goal_pkey; Type: CONSTRAINT; Schema: public; Owner: pi
--

ALTER TABLE ONLY public.iep_goal
    ADD CONSTRAINT iep_goal_pkey PRIMARY KEY (id);


--
-- Name: iep iep_pkey; Type: CONSTRAINT; Schema: public; Owner: pi
--

ALTER TABLE ONLY public.iep
    ADD CONSTRAINT iep_pkey PRIMARY KEY (id);


--
-- Name: meta_data meta_data_pkey; Type: CONSTRAINT; Schema: public; Owner: pi
--

ALTER TABLE ONLY public.meta_data
    ADD CONSTRAINT meta_data_pkey PRIMARY KEY (id);


--
-- Name: student student_pkey; Type: CONSTRAINT; Schema: public; Owner: pi
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_pkey PRIMARY KEY (id);


--
-- Name: teacher teacher_pkey; Type: CONSTRAINT; Schema: public; Owner: pi
--

ALTER TABLE ONLY public.teacher
    ADD CONSTRAINT teacher_pkey PRIMARY KEY (login);


--
-- Name: teachers_students teachers_students_pkey; Type: CONSTRAINT; Schema: public; Owner: pi
--

ALTER TABLE ONLY public.teachers_students
    ADD CONSTRAINT teachers_students_pkey PRIMARY KEY (teacher_login, student_id, role);


--
-- Name: bip_data bip_data_bip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pi
--

ALTER TABLE ONLY public.bip_data
    ADD CONSTRAINT bip_data_bip_id_fkey FOREIGN KEY (bip_id) REFERENCES public.bip(id);


--
-- Name: bip bip_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pi
--

ALTER TABLE ONLY public.bip
    ADD CONSTRAINT bip_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(id);


--
-- Name: goal_data goal_data_coteacher_login_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pi
--

ALTER TABLE ONLY public.goal_data
    ADD CONSTRAINT goal_data_coteacher_login_fkey FOREIGN KEY (coteacher_login) REFERENCES public.teacher(login);


--
-- Name: goal_data goal_data_iep_goal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pi
--

ALTER TABLE ONLY public.goal_data
    ADD CONSTRAINT goal_data_iep_goal_id_fkey FOREIGN KEY (iep_goal_id) REFERENCES public.iep_goal(id);


--
-- Name: iep_goal iep_goal_iep_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pi
--

ALTER TABLE ONLY public.iep_goal
    ADD CONSTRAINT iep_goal_iep_id_fkey FOREIGN KEY (iep_id) REFERENCES public.iep(id) ON DELETE CASCADE;


--
-- Name: iep iep_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pi
--

ALTER TABLE ONLY public.iep
    ADD CONSTRAINT iep_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(id);


--
-- Name: teachers_students teachers_students_coteacher_login_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pi
--

ALTER TABLE ONLY public.teachers_students
    ADD CONSTRAINT teachers_students_coteacher_login_fkey FOREIGN KEY (coteacher_login) REFERENCES public.teacher(login);


--
-- Name: teachers_students teachers_students_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pi
--

ALTER TABLE ONLY public.teachers_students
    ADD CONSTRAINT teachers_students_student_id_fkey FOREIGN KEY (teacher_login) REFERENCES public.teacher(login) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: teachers_students teachers_students_teacher_login_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pi
--

ALTER TABLE ONLY public.teachers_students
    ADD CONSTRAINT teachers_students_teacher_login_fkey FOREIGN KEY (teacher_login) REFERENCES public.teacher(login) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

