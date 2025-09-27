-- Esquema de la base de datos para la aplicación Apex para PostgreSQL
-- Autor: Heiler Nova

drop schema public cascade;
create schema public;
create extension if not exists "unaccent";
create extension if not exists "pgcrypto";


create table geo_countries
(
  "code" char(2) primary key,
  "name" varchar(100) not null,
  "phone_code" varchar(8) not null,
  "masculine_demonym" varchar(50), -- Ejemplo: 'mexicano'
  "feminine_demonym" varchar(50)   -- Ejemplo: 'mexicana'
);

create table geo_states
(
  "id" uuid primary key default gen_random_uuid(),
  "code" varchar(20),
  "country_code" char(2) not null references geo_countries("code"),
  "name" varchar(50) not null
);

create table geo_cities
(
  "id" uuid primary key default gen_random_uuid(),
  "code" varchar(20),
  "name" varchar(50) not null,
  "state_id" uuid not null references geo_states("id")
);

create type user_status as enum('active', 'inactive', 'blocked', 'banned');
create type user_role as enum('admin', 'collaborator', 'user');

create domain cellphone as varchar check (value ~* '^\+\d+ \d{3} \d{3} \d{4}$');
create domain email as varchar(254) check (value ~* '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$');
create domain username as varchar(40) check (value ~* '^[a-zA-Z0-9._%+-]{3,10}$');
create type gender as enum('M', 'F');

create type athlete_category as enum('beginner', 'intermediate', 'advanced', 'rx', 'elite', 'masters', 'teen');
create type gym_category as enum('box', 'gym');
create type judge_level as enum('L1', 'L2', 'L3', 'L4', 'L5');

-- Usuarios de la aplicación
create table users
(
  "id" uuid primary key default gen_random_uuid(),                        --> Identificador único del usuario
  "created_at" timestamp with time zone default now(),                    --> Fecha y hora de creación del usuario
  "updated_at" timestamp with time zone default now(),                    --> Fecha y hora de la última actualización del usuario
  "last_login_at" timestamp with time zone default now(),                 --> Fecha y hora del último inicio de sesión
  "status" user_status not null default 'active',                         --> Estado del usuario (activo, inactivo, bloqueado, baneado)
  "role" user_role not null default 'user',                               --> Rol del usuario (admin, colaborador, usuario)
  "is_coach" boolean not null default false,                              --> Indica si el usuario es coach
  "judge_level" judge_level default null,                                 --> Nivel de juez (null = no es juez, valor = es juez con ese nivel)
  "verified" boolean not null default false,                              --> Indica si el usuario ha verificado su cuenta
  "category" athlete_category not null default 'beginner',                --> Categoría del atleta
  "email" email not null,                                                 --> Correo electrónico
  "email_verified" boolean not null default false,                        --> Indica si el correo electrónico ha sido verificado
  "cellphone" cellphone not null,                                         --> Número de teléfono celular
  "cellphone_verified" boolean not null default false,                    --> Indica si el celular ha sido verificado
  "username" varchar(40) not null unique,                                 --> Nombre de usuario sin espacios ni caracteres especiales
  "alias" varchar(40) default null,                                       --> Nombre para mostrar
  "first_name" varchar(20) not null,                                      --> Nombre
  "last_name" varchar(20) not null,                                       --> Apellido
  "gender" gender not null,                                               --> Genero (M=masculino, F=femenino)
  "birthdate" date not null,                                              --> Fecha de nacimiento
  "height" integer not null,                                              --> Altura en cm
  "weight" integer not null,                                              --> Peso en kg
  "city_id" uuid not null references geo_cities("id"),                    --> Ciudad de residencia
  "nationality" char(2) not null references geo_countries("code"),        --> Nacionalidad
  "jwt_secret" uuid not null default gen_random_uuid(),                   --> Secreto único para invalidar tokens JWT
  "password_hash" text not null,                                          --> Hash de la contraseña
  "permissions" text[] not null default array[]::text[],                  --> Permisos adicionales
  "avatar_url" varchar(500) default null,                                 --> imagen de avatar/cara
  "cover_url" varchar(500) default null,                                  --> imagen de banner del perfil
  "body_image_url" varchar(500) default null                              --> imagen de cuerpo completo
);

-- Historial de pesos de los usuarios
create table user_weights
(
  "id" uuid primary key default gen_random_uuid(),                        --> Identificador único del registro de peso
  "created_at" timestamp with time zone default now(),                    --> Fecha y hora del registro de peso
  "user_id" uuid not null references users("id") on delete cascade,       --> Identificador del usuario
  "weight" integer not null                                               --> Peso en kg
);

create type team_gender  as enum('M', 'F', 'X'); -- M=masculino, F=femenino, X=mixto

create table teams
(
  "id" uuid primary key default gen_random_uuid(),                        --> Identificador único del equipo
  "created_at" timestamp with time zone default now(),                    --> Fecha y hora de creación del equipo
  "updated_at" timestamp with time zone default now(),                    --> Fecha y hora de última actualización del equipo
  "name" varchar(100) not null unique,                                    --> Nombre del equipo
  "category" athlete_category not null default 'beginner',                --> Categoría del equipo
  "team_size" integer not null default 1 check (team_size >= 1),          --> Tamaño del equipo (1=individual, 2=pareja, 3+=equipo) 
  "gender" team_gender not null,                                          --> Género del equipo (M=masculino, F=femenino, X=mixto)
  "slug" varchar(100) not null unique,                                    --> Slug para URLs amigables
  "description" text,                                                     --> Descripción del equipo
  "city_id" uuid references geo_cities("id"),                             --> Ciudad de origen del equipo
  "country_code" char(2) references geo_countries("code"),                --> País de origen del equipo
  "seo_title" varchar(70),                                                --> Título SEO
  "seo_description" varchar(160),                                         --> Descripción SEO
  "seo_keywords" text[] not null default array[]::text[],                 --> Palabras clave SEO
  "seo_open_graph_images" jsonb[] not null default array[]::jsonb[],      --> Imágenes para Open Graph
  "images" text[] not null default array[]::text[]                        --> Imágenes del equipo
);

create table team_members
(
  "user_id" uuid not null references users("id") on delete cascade,        --> ID del usuario
  "team_id" uuid not null references teams("id") on delete cascade,        --> ID del equipo
  "is_captain" boolean not null default false,                             --> Es el capitán del equipo
  "joined_at" timestamp with time zone default now()                       --> Fecha de ingreso al equipo
);

-- Gimnasios
create type gym_status as enum('active', 'inactive', 'closed');
create table disciplines
(
  "id" uuid primary key default gen_random_uuid(),
  "name" varchar(100) not null unique
);

create table gyms
(
  "id" uuid primary key default gen_random_uuid(),                           --> Identificador único del gimnasio
  "created_at" timestamp with time zone default now(),                       --> Fecha y hora de creación del gimnasio
  "updated_at" timestamp with time zone default now(),                       --> Fecha y hora de la última actualización del gimnasio
  "status" gym_status not null default 'active',                             --> Estado del gimnasio (activo, inactivo, cerrado)
  "type" gym_category not null,                                              --> Tipo de gimnasio (box, gym)
  "name" varchar(100) not null unique,                                       --> Nombre del gimnasio
  "cellphone" cellphone not null,                                            --> Número de contacto
  "email" email not null,                                                    --> Correo de contacto
  "social_networks" jsonb not null default '{}'::jsonb,                      --> Redes sociales del gimnasio en formato JSON
  "address" varchar(100) not null,                                           --> Dirección del gimnasio
  "city_id" uuid not null references geo_cities("id"),                   --> Ciudad donde se encuentra el gimnasio
  "slug" varchar(100) not null,                                              --> Slug del gimnasio
  "url_google_maps" varchar(200) not null,                                   --> URL de Google Maps
  "geo_latitude" numeric(9,6) not null,                                      --> Latitud geográfica
  "geo_longitude" numeric(9,6) not null,                                     --> Longitud geográfica
  "seo_title" varchar(70),                                                   --> Título SEO
  "seo_description" varchar(160),                                            --> Descripción SEO
  "seo_keywords" text[] not null default array[]::text[],                    --> Palabras clave SEO
  "seo_open_graph_images" jsonb[] not null default array[]::jsonb[],         --> Imágenes para Open Graph
  "images" text[] not null default array[]::text[]                           --> Imágenes del gimnasio
);

create table gym_disciplines
(
  "gym_id" uuid not null references gyms("id") on delete cascade,
  "discipline_id" uuid not null references disciplines("id") on delete cascade
);

create type gym_member_status as enum('active', 'inactive', 'suspended');
create type gym_member_role as enum('admin', 'coach', 'member');

-- Miembros de los gimnasios (clientes, dueños, coaches)
create table gym_members
(
  "id" uuid primary key default gen_random_uuid(),                           --> Identificador único del miembro
  "created_at" timestamp with time zone default now(),                       --> Fecha y hora de creación del miembro
  "updated_at" timestamp with time zone default now(),                       --> Fecha y hora de la última actualización del miembro
  "gym_id" uuid not null references gyms("id") on delete cascade,            --> ID del gimnasio
  "user_id" uuid not null references users("id") on delete cascade,          --> ID del usuario
  "role" gym_member_role not null default 'member',                          --> rol del miembro (admin, coach, member)
  "status" gym_member_status not null default 'active',                      --> estado del miembro (activo, inactivo, suspendido)
  "joined_date" date not null default current_date                           --> fecha de ingreso al gimnasio
);

-- Membresías de los gimnasios
create table gym_memberships
(
  "id" uuid primary key default gen_random_uuid(),                            --> Identificador único de la membresía
  "created_at" timestamp with time zone default now(),                        --> Fecha y hora de creación de la membresía
  "user_id" uuid not null references users("id") on delete cascade,           --> Identificador del usuario
  "gym_id" uuid not null references gyms("id") on delete cascade,             --> Identificador del gimnasio
  "start_date" date not null,                                                 --> Fecha de inicio de la membresía
  "end_date" date not null                                                    --> Fecha de finalización de la membresía
);

-- Ejercicios
create table exercises
(
  "id" uuid primary key default gen_random_uuid(),                              --> Identificador único del ejercicio
  "created_at" timestamp with time zone default now(),                          --> Fecha y hora de creación del ejercicio
  "updated_at" timestamp with time zone default now(),                          --> Fecha y hora de la última actualización del ejercicio
  "status" text not null,                                                       --> Estado del ejercicio (active, inactive)
  "name" varchar(100) not null,                                                 --> Nombre del ejercicio
  "slug" varchar(100) not null unique,                                          --> Slug para URLs amigables
  "description" varchar(1000) not null,                                         --> Descripción del ejercicio
  "tags" text[] not null default array[]::text[],                               --> Etiquetas del ejercicio
  "primary_muscle_groups" text[] not null default array[]::text[],              --> Grupos musculares primarios
  "url_youtube" varchar(200) not null,                                          --> URL de un video de YouTube
  "seo_title" varchar(70),                                                      --> Título SEO
  "seo_description" varchar(160),                                               --> Descripción SEO
  "seo_keywords" text[] not null default array[]::text[],                       --> Palabras clave SEO
  "seo_open_graph_images" jsonb[] not null default array[]::jsonb[],            --> Imágenes para Open Graph
  "images" text[] not null default array[]::text[]                              --> Imágenes del ejercicio
);

create table exercise_rms
(
  "id" uuid primary key default gen_random_uuid(),                             --> Identificador único del registro de RM
  "created_at" timestamp with time zone default now(),                         --> Fecha y hora de creación del registro de RM
  "user_id" uuid not null references users("id") on delete cascade,            --> Identificador del usuario
  "exercise_id" uuid not null references exercises("id") on delete cascade,    --> Identificador del ejercicio
  "weight" integer not null,                                                   --> peso en kg
  "notes" varchar(200)                                                         --> Notas del registro de RM
);

create type workout_type as enum('AMRAP', 'EMOM', 'RFT', 'TABATA', 'BENCHMARK', 'FOR_TIME', 'STRENGTH', 'CHIPPER', 'LADDER');

-- Rutinas de entrenamiento
create table workouts
(
  "id" uuid primary key default gen_random_uuid(),                                     --> Identificador único de la rutina
  "created_at" timestamp with time zone default now(),                                 --> Fecha y hora de creación de la rutina
  "updated_at" timestamp with time zone default now(),                                 --> Fecha y hora de la última actualización de la rutina
  "status" text not null default 'active',                                             --> Estado de la rutina (active, inactive, draft)
  "gym_id" uuid references gyms("id"),                                                 --> ID del gimnasio (opcional)
  "name" varchar(100) not null unique,                                                 --> Nombre de la rutina
  "description" text not null,                                                         --> Descripción detallada de la rutina
  "type" workout_type not null,                                                        --> Tipo de rutina (AMRAP, EMOM, RFT, TABATA, BENCHMARK, FOR_TIME, STRENGTH, CHIPPER, LADDER)
  "time_cap" interval,                                                                 --> límite de tiempo en horas o minutos (opcional)
  "score_order" varchar(4) not null check (score_order in ('asc', 'desc')),            --> orden de puntuación (ascendente o descendente)
  "exercises" jsonb not null,                                                          --> lista de ejercicios en formato JSON
  "slug" varchar(100) not null unique,                                                 --> Slug para URLs amigables
  "seo_title" varchar(70),                                                             --> Título SEO
  "seo_description" varchar(160),                                                      --> Descripción SEO
  "seo_keywords" text[] not null default array[]::text[],                              --> Palabras clave SEO
  "seo_open_graph_images" jsonb[] not null default array[]::jsonb[],                   --> Imágenes para Open Graph
  "images" text[] not null default array[]::text[]                                     --> Imágenes de la rutina
);

-- Historial de los resultados de rutinas realizadas por los usuarios
create table user_workouts
(
  "id" uuid primary key default gen_random_uuid(),                                     --> Identificador único del registro de la rutina
  "created_at" timestamp with time zone default now(),                                 --> Fecha y hora de creación del registro
  "user_id" uuid not null references users("id") on delete cascade,                    --> Identificador del usuario
  "workout_id" uuid not null references workouts("id") on delete cascade,              --> Identificador de la rutina
  "date" date not null,                                                                --> Fecha en que se realizó la rutina
  "time" interval not null,                                                            --> Tiempo total en que se completó la rutina
  "reps_completed" integer not null,                                                   --> Repeticiones completadas (para rutinas con repeticiones)
  "notes" varchar(500)                                                                 --> Notas adicionales
);

-- Patrocinadores
create table sponsors
(
  "id" uuid primary key default gen_random_uuid(),                                  --> Identificador único del patrocinador
  "created_at" timestamp with time zone default now(),                              --> Fecha y hora de creación del patrocinador
  "updated_at" timestamp with time zone default now(),                              --> Fecha y hora de la última actualización del patrocinador
  "status" text not null,                                                           --> Estado del patrocinador (active, inactive)
  "name" varchar(100) not null unique,                                              --> Nombre del patrocinador
  "description" varchar(500) not null,                                              --> Descripción del patrocinador
  "website_url" varchar(200) not null,                                              --> URL del sitio web del patrocinador
  "social_networks" jsonb not null default '{}'::jsonb,                             --> Redes sociales del patrocinador en formato JSON
  "seo_title" varchar(70),                                                          --> Título SEO para el patrocinador
  "seo_description" varchar(160),                                                   --> Descripción SEO para el patrocinador
  "seo_keywords" text[] not null default array[]::text[],                           --> Palabras clave SEO para el patrocinador
  "seo_open_graph_images" jsonb[] not null default array[]::jsonb[],                --> Imágenes Open Graph en formato JSON
  "logo_url" varchar(500) not null,                                                 --> Logo del patrocinador
  "images" text[] not null default array[]::text[]                                  --> Imágenes relacionadas con el patrocinador
);

-- Competencias
create table competitions
(
  "id" uuid primary key default gen_random_uuid(),                                  --> Identificador único de la competencia
  "created_at" timestamp with time zone default now(),                              --> Fecha y hora de creación de la competencia
  "updated_at" timestamp with time zone default now(),                              --> Fecha y hora de la última actualización de la competencia
  "status" text not null,                                                           --> Estado de la competencia (draft, announced, registration_open, registration_closed, ongoing, completed, cancelled)
  "name" varchar(100) not null unique,                                              --> Nombre de la competencia
  "description" varchar(500) not null,                                              --> Descripción detallada de la competencia
  "city_id" uuid not null references geo_cities("id"),                              --> Ciudad donde se realiza la competencia
  "slug" varchar(100) not null unique,                                              --> Slug para URLs amigables
  "cellphone" cellphone not null,                                                   --> Número de contacto
  "email" email not null,                                                           --> Correo de contacto
  "social_networks" jsonb not null default '{}'::jsonb,                             --> Redes sociales de la competencia en formato JSON
  "seo_title" varchar(70),                                                          --> Título SEO para la competencia
  "seo_description" varchar(160),                                                   --> Descripción SEO para la competencia
  "seo_keywords" text[] not null default array[]::text[],                           --> Palabras clave SEO para la competencia
  "seo_open_graph_images" jsonb[] not null default array[]::jsonb[],                --> Imágenes Open Graph en formato JSON
  "images" text[] not null default array[]::text[]                                  --> Imágenes relacionadas con la competencia
);

-- Ediciones de las competencias
create table competition_editions
(
  "id" uuid primary key default gen_random_uuid(),                                 --> Identificador único de la edición
  "created_at" timestamp with time zone default now(),                             --> Fecha y hora de creación de la edición
  "updated_at" timestamp with time zone default now(),                             --> Fecha y hora de la última actualización de la edición
  "published" boolean not null default false,                                      --> Indica si la edición está publicada
  "competition_id" uuid not null references competitions("id") on delete cascade,  --> Identificador de la competencia
  "year" integer not null,                                                         --> Año de la edición
  "start_date" date not null,                                                      --> Fecha de inicio de la competencia
  "end_date" date not null,                                                        --> Fecha de finalización de la competencia
  "registration_open_date" date not null,                                          --> Fecha de apertura de inscripciones
  "registration_close_date" date not null,                                         --> Fecha de cierre de inscripciones
  "city_id" uuid not null references geo_cities("id")                          --> Ciudad donde se realiza la competencia
);
create index idx_competition_editions_competition_year on competition_editions(competition_id, year);

create table competition_sponsors
(
  "competition_id" uuid not null references competitions("id") on delete cascade,
  "sponsor_id" uuid not null references sponsors("id") on delete cascade
);
create unique index idx_competition_sponsors on competition_sponsors(competition_id, sponsor_id);

create table competition_judges
(
  "competition_edition_id" uuid not null references competition_editions("id") on delete cascade,
  "user_id" uuid not null references users("id") on delete cascade,
  "name" varchar(100) not null
);
create unique index idx_competition_judges on competition_judges(competition_edition_id, user_id);


--------------------------------------------------------------------------------------------------a
-- Competencias individuales
create table competition_individual_divisions
(
  "id" uuid primary key default gen_random_uuid(),
  "created_at" timestamp with time zone default now(),
  "updated_at" timestamp with time zone default now(),
  "competition_edition_id" uuid not null references competition_editions("id") on delete cascade,
  "category" athlete_category not null,
  "gender" gender not null,
  "name" varchar(100) not null, -- Ejemplo: "Individual"
  "max_age" integer, --> limite de edades para la categoría (para masters, teens)
  "min_age" integer, --> limite de edades para la categoría (para masters, teens)
  "max_participants" integer not null
);
create unique index idx_competition_individual_divisions on competition_individual_divisions(competition_edition_id, category, gender);
create index idx_competition_individual_divisions_competition on competition_individual_divisions(competition_edition_id);

create table competition_division_individual_participants
(
  "id" uuid primary key default gen_random_uuid(),
  "created_at" timestamp with time zone default now(),
  "competition_individual_division_id" uuid not null references competition_individual_divisions("id") on delete cascade,
  "user_id" uuid not null references users("id"),
  "registration_date" date not null,
  "status" text not null -- registered, confirmed, withdrawn, disqualified
);
create unique index idx_competition_division_individual_participants on competition_division_individual_participants(competition_individual_division_id, user_id);


-- Eventos/pruebas dentro de una competencia
create table competition_individual_division_events
(
  "id" uuid primary key default gen_random_uuid(),                                     --> Identificador único del evento
  "created_at" timestamp with time zone default now(),                                 --> Fecha y hora de creación del evento
  "updated_at" timestamp with time zone default now(),                                 --> Fecha y hora de la última actualización del evento
  "competition_id" uuid not null references competitions("id"),                        --> Identificador de la competencia
  "name" varchar(100) not null,                                                        --> Nombre del evento
  "description" text not null,                                                         --> Descripción detallada del evento
  "workout" jsonb not null,                                                            --> Descripción del workout en formato JSON
  "event_order" integer not null,                                                      --> orden del evento en la competencia
  "score_order" varchar(4) not null check (score_order in ('asc', 'desc')),            --> orden de puntuación (ascendente o descendente) -- time, reps, weight
  "time_cap" interval not null,                                                        --> límite límite de tiempo
  "status" text not null                                                               --> active, completed, cancelled
);

create index idx_competition_individual_division_events_competition on competition_individual_division_events(competition_id);

-- Resultados de los participantes en cada evento
create table competition_individual_division_event_results
(
  "id" uuid primary key default gen_random_uuid(),                                                   --> Identificador único del resultado
  "created_at" timestamp with time zone default now(),                                               --> Fecha y hora de creación del resultado
  "updated_at" timestamp with time zone default now(),                                               --> Fecha y hora de la última actualización del resultado
  "event_id" uuid not null references competition_individual_division_events("id"),                  --> ID del evento
  "participant_id" uuid not null references competition_division_individual_participants("id"),      --> ID del participante (usuario)
  "judge_id" uuid references users("id"),                                                            --> ID del juez que validó el resultado
  "hit" integer not null,                                                                            --> Numero del HIT del evento
  "time" interval,                                                                                   --> tiempo en segundos (para eventos de tiempo)
  "reps" integer,                                                                                    --> repeticiones completadas
  "weight" int,                                                                                      --> peso levantado
  "score" decimal(8,2),                                                                              --> puntuación calculada
  "notes" text                                                                                       --> notas adicionales (penalties, etc.)
);
create unique index idx_competition_event_results on competition_individual_division_event_results(event_id, participant_id, hit);
create index idx_competition_event_results_participant on competition_individual_division_event_results(participant_id);
create index idx_competition_event_results_event on competition_individual_division_event_results(event_id);
create index idx_competition_event_results_judge on competition_individual_division_event_results(judge_id);


-- -- Clasificación general de la competencia individual
create table competition_leaderboard_individuals
(
  "id" uuid primary key default gen_random_uuid(),
  "created_at" timestamp with time zone default now(),
  "updated_at" timestamp with time zone default now(),
  "division_id" uuid not null references competition_individual_divisions("id"),
  "participant_id" uuid not null references users("id"),
  "total_points" decimal(8,2) not null
);

------------------------------------------------------------------- 
-- Competencias por equipos

create table competition_division_teams
(
  "id" uuid primary key default gen_random_uuid(),
  "created_at" timestamp with time zone default now(),
  "updated_at" timestamp with time zone default now(),
  "competition_edition_id" uuid not null references competition_editions("id") on delete cascade,
  "category" athlete_category not null,
  "team_size" integer not null check (team_size >= 2), --> Tamaño del equipo (2=pareja, 3+=equipo) mínimo 2
  "team_gender" team_gender not null,
  "max_teams" integer not null, --> Máximo de equipos permitidos en esta división
  "max_age" integer, --> limite de edades para la categoría (para masters, teens)
  "min_age" integer --> limite de edades para la categoría (para masters, teens)
);
create unique index idx_competition_division_teams on competition_division_teams(competition_edition_id, category, team_size, team_gender);
create index idx_competition_division_teams_competition on competition_division_teams(competition_edition_id);


create table competition_division_team_participants
(
  "id" uuid primary key default gen_random_uuid(),
  "created_at" timestamp with time zone default now(),
  "competition_division_team_id" uuid not null references competition_division_teams("id") on delete cascade,
  "team_id" uuid not null references teams("id"),
  "registration_date" date not null,
  "status" text not null -- registered, confirmed, withdrawn, disqualified
);


-- Eventos/pruebas dentro de una competencia (equipos)
create table competition_division_team_events
(
  "id" uuid primary key default gen_random_uuid(),                                     --> Identificador único del evento
  "created_at" timestamp with time zone default now(),                                 --> Fecha y hora de creación del evento
  "updated_at" timestamp with time zone default now(),                                 --> Fecha y hora de la última actualización del evento
  "competition_id" uuid not null references competitions("id"),                        --> Identificador de la competencia
  "name" varchar(100) not null,                                                        --> Nombre del evento
  "description" text not null,                                                         --> Descripción detallada del evento
  "workout" jsonb not null,                                                            --> Descripción del workout en formato JSON
  "event_order" integer not null,                                                      --> orden del evento en la competencia
  "score_order" varchar(4) not null check (score_order in ('asc', 'desc')),            --> orden de puntuación (ascendente o descendente) -- time, reps, weight
  "time_cap" interval not null,                                                        --> límite límite de tiempo
  "status" text not null                                                               --> active, completed, cancelled
);

-- Resultados de los equipos en cada evento
create table competition_division_team_event_results
(
  "id" uuid primary key default gen_random_uuid(),                                                   --> Identificador único del resultado
  "created_at" timestamp with time zone default now(),                                               --> Fecha y hora de creación
  "updated_at" timestamp with time zone default now(),                                               --> Fecha y hora de la última actualización del resultado
  "event_id" uuid not null references competition_division_team_events("id"),                        --> ID del evento
  "team_participant_id" uuid not null references competition_division_team_participants("id"),       --> ID del participante (equipo)
  "judge_id" uuid references users("id"),                                                            --> ID del juez que validó
  "hit" integer not null,                                                                            --> Numero del HIT del evento
  "time" interval,                                                                                   --> tiempo en segundos (para eventos de tiempo)
  "reps" integer,                                                                                    --> repeticiones completadas
  "weight" int,                                                                                      --> peso levantado
  "score" decimal(8,2),                                                                              --> puntuación calculada
  "notes" text                                                                                       --> notas adicionales (penalties, etc.)
);

create unique index idx_competition_team_event_results on competition_division_team_event_results(event_id, team_participant_id, hit);
create index idx_competition_team_event_results_participant on competition_division_team_event_results(team_participant_id);
create index idx_competition_team_event_results_event on competition_division_team_event_results(event_id);
create index idx_competition_team_event_results_judge on competition_division_team_event_results(judge_id);

create table competition_leaderboard_teams
(
  "id" uuid primary key default gen_random_uuid(),
  "created_at" timestamp with time zone default now(),
  "updated_at" timestamp with time zone default now(),
  "division_id" uuid not null references competition_division_teams("id"),
  "team_participant_id" uuid not null references teams("id"),
  "total_points" decimal(8,2) not null
);