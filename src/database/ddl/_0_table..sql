-- public.group_criteria definition

-- Drop table

-- DROP TABLE group_criteria;

CREATE TABLE group_criteria (
	id serial4 NOT NULL,
	title varchar NOT NULL,
	"index" int4 NULL,
	CONSTRAINT group_criteria_pk PRIMARY KEY (id)
);


-- public.major definition

-- Drop table

-- DROP TABLE major;

CREATE TABLE major (
	id serial4 NOT NULL,
	name varchar NOT NULL,
	CONSTRAINT major_pk PRIMARY KEY (id)
);


-- public."period" definition

-- Drop table

-- DROP TABLE "period";

CREATE TABLE "period" (
	id serial4 NOT NULL,
	title varchar NOT NULL,
	"start" date NOT NULL,
	"end" date NOT NULL,
	CONSTRAINT period_pk PRIMARY KEY (id)
);


-- public.results definition

-- Drop table

-- DROP TABLE results;

CREATE TABLE results (
	id serial4 NOT NULL
);


-- public."role" definition

-- Drop table

-- DROP TABLE "role";

CREATE TABLE "role" (
	id serial4 NOT NULL,
	name varchar NOT NULL,
	role_code varchar NOT NULL,
	CONSTRAINT role_pk PRIMARY KEY (id)
);


-- public.status definition

-- Drop table

-- DROP TABLE status;

CREATE TABLE status (
	id serial4 NOT NULL,
	title varchar NOT NULL,
	description varchar NULL,
	created_at date NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at date NULL,
	step int4 NULL,
	CONSTRAINT status_pk PRIMARY KEY (id)
);


-- public.account definition

-- Drop table

-- DROP TABLE account;

CREATE TABLE account (
	id serial4 NOT NULL,
	email varchar NOT NULL,
	"password" varchar NOT NULL,
	register_date timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	last_login timestamp NULL,
	role_id int4 NOT NULL,
	CONSTRAINT account_pk PRIMARY KEY (id),
	CONSTRAINT account_un UNIQUE (email),
	CONSTRAINT account_fk FOREIGN KEY (role_id) REFERENCES "role"(id)
);


-- public."class" definition

-- Drop table

-- DROP TABLE "class";

CREATE TABLE "class" (
	id serial4 NOT NULL,
	full_name varchar NOT NULL,
	short_name varchar NULL,
	major_id int4 NULL,
	CONSTRAINT class_pk PRIMARY KEY (id),
	CONSTRAINT class_fk FOREIGN KEY (major_id) REFERENCES major(id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- public.criteria definition

-- Drop table

-- DROP TABLE criteria;

CREATE TABLE criteria (
	id serial4 NOT NULL,
	title varchar NOT NULL,
	max int4 NOT NULL,
	group_id int4 NOT NULL,
	CONSTRAINT criteria_pk PRIMARY KEY (id),
	CONSTRAINT criteria_fk FOREIGN KEY (group_id) REFERENCES group_criteria(id)
);


-- public.manager definition

-- Drop table

-- DROP TABLE manager;

CREATE TABLE manager (
	id serial4 NOT NULL,
	manager_id varchar NOT NULL,
	name varchar NOT NULL,
	phone varchar NULL,
	address varchar NULL,
	acc_id int4 NOT NULL,
	CONSTRAINT manager_pk PRIMARY KEY (id),
	CONSTRAINT manager_un UNIQUE (acc_id),
	CONSTRAINT manager_fk FOREIGN KEY (acc_id) REFERENCES account(id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- public.notifications definition

-- Drop table

-- DROP TABLE notifications;

CREATE TABLE notifications (
	id serial4 NOT NULL,
	title varchar NOT NULL,
	"content" varchar NOT NULL,
	status varchar NOT NULL DEFAULT 'draft'::character varying,
	created_at date NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at date NULL,
	period_id int4 NOT NULL,
	CONSTRAINT notifications_pk PRIMARY KEY (id),
	CONSTRAINT notifications_fk FOREIGN KEY (period_id) REFERENCES "period"(id) ON DELETE CASCADE
);


-- public.student definition

-- Drop table

-- DROP TABLE student;

CREATE TABLE student (
	id serial4 NOT NULL,
	student_id varchar NOT NULL,
	name varchar NOT NULL,
	birthday varchar NOT NULL,
	is_leader bool NULL DEFAULT false,
	acc_id int4 NOT NULL,
	address varchar NULL,
	class_id int4 NOT NULL,
	gender varchar NULL,
	phone varchar NULL,
	CONSTRAINT student_pk PRIMARY KEY (id),
	CONSTRAINT student_un UNIQUE (acc_id),
	CONSTRAINT student_fk FOREIGN KEY (acc_id) REFERENCES account(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT student_fk_2 FOREIGN KEY (class_id) REFERENCES "class"(id)
);


-- public.teacher definition

-- Drop table

-- DROP TABLE teacher;

CREATE TABLE teacher (
	id serial4 NOT NULL,
	teacher_id varchar NOT NULL,
	name varchar NOT NULL,
	unit varchar NULL,
	phone varchar NULL,
	acc_id int4 NOT NULL,
	address varchar NULL,
	CONSTRAINT teacher_pk PRIMARY KEY (id),
	CONSTRAINT teacher_un UNIQUE (acc_id),
	CONSTRAINT teacher_fk FOREIGN KEY (acc_id) REFERENCES account(id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- public.teacher_class definition

-- Drop table

-- DROP TABLE teacher_class;

CREATE TABLE teacher_class (
	teacher_id int4 NOT NULL,
	class_id int4 NOT NULL,
	start_date date NULL DEFAULT CURRENT_TIMESTAMP,
	end_date date NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT teacher_class_pk PRIMARY KEY (teacher_id, class_id),
	CONSTRAINT teacher_class_fk FOREIGN KEY (class_id) REFERENCES "class"(id),
	CONSTRAINT teacher_class_fk_1 FOREIGN KEY (teacher_id) REFERENCES teacher(id) ON DELETE CASCADE
);


-- public.pointsform definition

-- Drop table

-- DROP TABLE pointsform;

CREATE TABLE pointsform (
	id serial4 NOT NULL,
	period_id int4 NOT NULL,
	student_id int4 NOT NULL,
	created_at date NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at date NULL,
	status_id int4 NOT NULL DEFAULT 1,
	confirm_point int4 NULL,
	result_point int4 NULL,
	CONSTRAINT pointsform_pk PRIMARY KEY (id),
	CONSTRAINT pointsform_fk FOREIGN KEY (period_id) REFERENCES "period"(id),
	CONSTRAINT pointsform_fk2 FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT pointsform_fk3 FOREIGN KEY (status_id) REFERENCES status(id)
);


-- public.points_criteria_list definition

-- Drop table

-- DROP TABLE points_criteria_list;

CREATE TABLE points_criteria_list (
	criteria_id int4 NOT NULL,
	form_id int4 NOT NULL,
	self_point int4 NOT NULL,
	approval_point int4 NULL DEFAULT 0,
	CONSTRAINT points_criteria_list_pk PRIMARY KEY (criteria_id, form_id),
	CONSTRAINT points_criteria_list_un UNIQUE (criteria_id, form_id),
	CONSTRAINT points_criteria_list_fk FOREIGN KEY (criteria_id) REFERENCES criteria(id),
	CONSTRAINT points_criteria_list_fk_1 FOREIGN KEY (form_id) REFERENCES pointsform(id) ON DELETE CASCADE ON UPDATE CASCADE
);