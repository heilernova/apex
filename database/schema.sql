-- Esquema de la base de datos para la aplicación Apex para PostgreSQL
-- Autor: Heiler Nova

drop schema public cascade;
create schema public;
create extension if not exists "unaccent";
create extension if not exists "pgcrypto";

create table geo_countries
(
  "code" char(2) primary key,                  --> Código ISO 3166-1 alpha-2
  "name" varchar(100) not null,                --> Nombre del país
  "phone_code" varchar(8) not null,            --> Código telefónico
  "masculine_demonym" varchar(50),             --> Ejemplo: 'Colombiano'
  "feminine_demonym" varchar(50)               --> Ejemplo: 'Colombiana'
);

create table geo_administrative_levels
(
  "id" uuid primary key default gen_random_uuid(),
  "country_code" char(2) not null references geo_countries(code) on delete cascade on update cascade,
  "level" integer not null,                                                                                  --> nivel jerárquico (1=estado, 2=provincia, 3=condado, etc.)
  "name" varchar(50) not null,                                                                               --> nombre del nivel
  "name_plural" varchar(50),                                                                                 --> nombre del nivel (state, province, county, etc.)
  "description" varchar(255)                                                                                 --> descripción del nivel
);

create table geo_administrative_divisions
(
  "id" uuid primary key default gen_random_uuid(),
  "country_code" char(2) not null,
  "level_id" uuid not null references geo_administrative_levels(id) on delete cascade on update cascade,
  "parent_id" uuid,                                                                                           --> permite jerarquía multinivel
  "code" varchar(20),                                                                                         --> código de la división
  "name" varchar(50) not null,                                                                                --> nombre
  "is_city" boolean default false,                                                                            --> indica si es ciudad
  "is_capital" boolean default false,                                                                         --> indica si es capital de la división padre
  "enabled" boolean default true,                                                                             --> estado de la división
  "created_at" timestamp default current_timestamp,                                                           --> marca temporal de creación
  "updated_at" timestamp default current_timestamp,                                                           --> marca temporal de última actualización

  constraint fk_admin_divisions_country 
    foreign key (country_code) references geo_countries(code) 
    on delete cascade on update cascade,
  
  constraint fk_admin_divisions_parent 
    foreign key (parent_id) references geo_administrative_divisions(id) 
    on delete cascade on update cascade,
  
  constraint uk_admin_divisions_country_parent_code 
    unique (country_code, parent_id, code)
);

create type user_status as enum('active', 'inactive', 'blocked', 'banned');
create type user_role as enum('admin', 'collaborator', 'user');

create domain cellphone as varchar check (value ~* '^\+\d+ \d{3} \d{3} \d{4}$');
create domain email as varchar(254) check (value ~* '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$');
create domain username as varchar(40) check (value ~* '^[a-zA-Z0-9._%+-]{3,40}$');
create type gender as enum('M', 'F');

create type athlete_category as enum('beginner', 'intermediate', 'advanced', 'rx', 'elite', 'master');
create type gym_category as enum('box', 'gym');
create type judge_level as enum('L1', 'L2', 'L3', 'L4', 'L5');

-- Usuarios de la aplicación
create table users
(
  "id" uuid primary key default gen_random_uuid(),                              --> Identificador único del usuario
  "created_at" timestamp with time zone default now(),                          --> Fecha y hora de creación del usuario
  "updated_at" timestamp with time zone default now(),                          --> Fecha y hora de la última actualización del usuario
  "last_login_at" timestamp with time zone default now(),                       --> Fecha y hora del último inicio de sesión
  "status" user_status not null default 'active',                               --> Estado del usuario (activo, inactivo, bloqueado, baneado)
  "role" user_role not null default 'user',                                     --> Rol del usuario (admin, colaborador, usuario)
  "is_coach" boolean not null default false,                                    --> Indica si el usuario es coach
  "judge_level" judge_level default null,                                       --> Nivel de juez (null = no es juez, valor = es juez con ese nivel)
  "verified" boolean not null default false,                                    --> Indica si el usuario ha verificado su cuenta
  "category" athlete_category not null default 'beginner',                      --> Categoría del atleta
  "email_address" email not null unique,                                        --> Correo electrónico
  "email_verified" boolean not null default false,                              --> Indica si el correo electrónico ha sido verificado
  "cellphone_number" cellphone not null,                                        --> Número de teléfono celular
  "cellphone_verified" boolean not null default false,                          --> Indica si el celular ha sido verificado
  "username" username not null unique,                                          --> Nombre de usuario sin espacios ni caracteres especiales
  "alias" varchar(40) default null,                                             --> Nombre para mostrar
  "first_name" varchar(20) not null,                                            --> Nombre
  "last_name" varchar(20) not null,                                             --> Apellido
  "gender" gender not null,                                                     --> Genero (M=masculino, F=femenino)
  "birthdate" date not null,                                                    --> Fecha de nacimiento
  "height" integer not null,                                                    --> Altura en cm
  "weight" integer not null,                                                    --> Peso en kg
  "location_id" uuid not null references geo_administrative_divisions("id"),    --> Ubicación de residencia
  "nationality" char(2) not null references geo_countries("code"),              --> Nacionalidad
  "disciplines" text[] not null default array[]::text[],                        --> Disciplinas practicadas
  "jwt_secret" uuid not null default gen_random_uuid(),                         --> Secreto único para invalidar tokens JWT
  "session_key" uuid not null default gen_random_uuid(),                        --> Clave de sesión para validar e invalidar sesiones
  "password_hash" text not null,                                                --> Hash de la contraseña
  "social_media" jsonb not null default '{}'::jsonb,                            --> Redes sociales del usuario en formato JSON
  "permissions" text[] not null default array[]::text[],                        --> Permisos adicionales
  "avatar" varchar(500) default null,                                           --> URL de avatar/cara
  "cover" varchar(500) default null,                                            --> imagen de banner del perfil
  "athlete_photo" varchar(500) default null                                     --> imagen de cuerpo completo
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
  "location_id" uuid references geo_administrative_divisions("id"),       --> Ubicación de origen del equipo
  "country_code" char(2) references geo_countries("code"),                --> País de origen del equipo
  "seo_title" varchar(70),                                                --> Título SEO
  "seo_description" varchar(160),                                         --> Descripción SEO
  "seo_keywords" text[] not null default array[]::text[],                 --> Palabras clave SEO
  "seo_open_graph_images" jsonb not null default '[]'::jsonb,             --> Imágenes para Open Graph
  "images" text[] not null default array[]::text[]                        --> Imágenes del equipo
);

create table team_members
(
  "user_id" uuid not null references users("id") on delete cascade,        --> ID del usuario
  "team_id" uuid not null references teams("id") on delete cascade,        --> ID del equipo
  "is_captain" boolean not null default false,                             --> Es el capitán del equipo
  "joined_at" timestamp with time zone default now(),                      --> Fecha de ingreso al equipo
  primary key ("user_id", "team_id")
);

-- Asegurar que solo haya un capitán por equipo
create unique index idx_team_members_one_captain 
on team_members (team_id) 
where is_captain = true;

-- Gimnasios
create type gym_status as enum('active', 'inactive', 'closed');
create table disciplines
(
  "id" uuid primary key default gen_random_uuid(),
  "name" varchar(100) not null unique
);

create table gyms
(
  "id" uuid primary key default gen_random_uuid(),                             --> Identificador único del gimnasio
  "created_at" timestamp with time zone default now(),                         --> Fecha y hora de creación del gimnasio
  "updated_at" timestamp with time zone default now(),                         --> Fecha y hora de la última actualización del gimnasio
  "status" gym_status not null default 'active',                               --> Estado del gimnasio (activo, inactivo, cerrado)
  "type" gym_category not null,                                                --> Tipo de gimnasio (box, gym)
  "name" varchar(100) not null unique,                                         --> Nombre del gimnasio
  "cellphone" cellphone not null,                                              --> Número de contacto
  "email" email not null,                                                      --> Correo de contacto
  "social_networks" jsonb not null default '{}'::jsonb,                        --> Redes sociales del gimnasio en formato JSON
  "address" varchar(100) not null,                                             --> Dirección del gimnasio
  "location_id" uuid not null references geo_administrative_divisions("id"),   --> Ubicación donde se encuentra el gimnasio
  "slug" varchar(100) not null,                                                --> Slug del gimnasio
  "url_google_maps" varchar(200) not null,                                     --> URL de Google Maps
  "geo_latitude" numeric(9,6) not null,                                        --> Latitud geográfica
  "geo_longitude" numeric(9,6) not null,                                       --> Longitud geográfica
  "seo_title" varchar(70),                                                     --> Título SEO
  "seo_description" varchar(160),                                              --> Descripción SEO
  "seo_keywords" text[] not null default array[]::text[],                      --> Palabras clave SEO
  "seo_open_graph_images" jsonb[] not null default array[]::jsonb[],           --> Imágenes para Open Graph
  "social_media" jsonb not null default '{}'::jsonb,                           --> Redes sociales del gimnasio en formato JSON
  "images" text[] not null default array[]::text[],                            --> Imágenes del gimnasio
  "description" text default null,                                             --> Descripción del gimnasio
  "disciplines" text[] not null default array[]::text[],                       --> Disciplinas ofrecidas en el gimnasio
  "schedules" jsonb not null default '[]'::jsonb,                              --> Horarios de atención (JSON)
  "membership_plans" jsonb not null default '[]'::jsonb                        --> Planes de membresía (JSON
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

create view vi_gym_members as
select 
  u.id,
  u.name,
  u.slug,
  d.user_id,
  d.status,
  d.role,
  d.joined_date
from gyms u
inner join gym_members d on d.gym_id = u.id;

create view vi_athletes as
select
  u.id,
  u.verified,
  initcap(u.alias) as name,
  u.nationality,
  u.category,
  u.gender,
  u.is_coach,
  u.judge_level,
  u.height,
  u.weight,
  extract(year from age(u.birthdate))::int as "age",
  u.social_media,
  u.avatar,
  jsonb_build_object(
    'id', u.location_id,
    'name', b.name
  ) as "location",
  case
    when l.id is not null then
      jsonb_build_object(
        'id', l.id,
        'name', l.name,
        'role', l.role,
        'slug', l.slug,
        'status', l.status,
        'joinedDate', l.joined_date
      )
    else
      null
  end as "gym"
from users u
inner join geo_administrative_divisions b on b.id = u.location_id
left join vi_gym_members l on l.user_id = u.id;

create type rm_type as enum('weight', 'reps', 'time');

-- Ejercicios
create table exercises
(
  "id" uuid primary key default gen_random_uuid(),                              --> Identificador único del ejercicio
  "created_at" timestamp with time zone default now(),                          --> Fecha y hora de creación del ejercicio
  "updated_at" timestamp with time zone default now(),                          --> Fecha y hora de la última actualización del ejercicio
  "published" boolean not null default false,                                   --> Indica si el ejercicio está publicado
  "name_en" varchar(100) not null,                                              --> Nombre en inglés
  "name_es" varchar(100) not null,                                              --> Nombre en español
  "slug" varchar(100) not null unique,                                          --> Slug para URLs amigables
  "allowed_rm_types" text[] not null default ARRAY[]::text[],                   --> Tipos de RM permitidos para este ejercicio
  "description" varchar(500),                                                   --> Descripción del ejercicio
  "tags" text[] not null default array[]::text[],                               --> Etiquetas del ejercicio
  "muscle_groups" text[] not null default array[]::text[],                      --> Grupos musculares
  "videos" jsonb not null default '[]'::jsonb,                                  --> Videos del ejercicio (YouTube, Vimeo, etc.)
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
  "target_reps" integer,                                                       --> Repeticiones objetivo (ej: para 5RM, target_reps=5)
  "type" rm_type not null,                                                  --> Tipo de RM (weight, reps, time)
  "result" numeric(12, 3) not null,                                            --> Resultado numérico para ordenar (peso en kg, repeticiones, tiempo en segundos)
  "notes" varchar(200)                                                         --> Notas del registro de RM
);

create type workout_type as enum('AMRAP', 'EMOM', 'RFT', 'TABATA', 'BENCHMARK', 'FOR_TIME', 'STRENGTH', 'CHIPPER', 'LADDER');

-- Rutinas de entrenamiento
create table workouts
(
  "id" uuid primary key default gen_random_uuid(),                                     --> Identificador único de la rutina
  "created_at" timestamp with time zone default now(),                                 --> Fecha y hora de creación de la rutina
  "updated_at" timestamp with time zone default now(),                                 --> Fecha y hora de la última actualización de la rutina
  "published" boolean not null default false,                                          --> Indica si la rutina está publicada
  "editable " boolean not null default true,                                           --> Indica si la rutina es editable por otros usuarios
  "gym_id" uuid references gyms("id"),                                                 --> ID del gimnasio (opcional)
  "name" varchar(100) not null unique,                                                 --> Nombre de la rutina
  "slug" varchar(100) not null unique,                                                 --> Slug para URLs amigables
  "description" varchar(200) not null,                                                 --> Descripción detallada de la rutina
  "type" workout_type not null,                                                        --> Tipo de rutina (AMRAP, EMOM, RFT, TABATA, BENCHMARK, FOR_TIME, STRENGTH, CHIPPER, LADDER)
  "time_cap" interval,                                                                 --> límite de tiempo en horas o minutos (opcional)
  "difficulty" integer not null default 1,
  "disciplines" text[] not null default array[]::text[],                               --> Disciplina de la rutina (ej: crossfit, weightlifting, gymnastics, etc.)
  "score_order" varchar(4) not null check (score_order in ('asc', 'desc')),            --> orden de puntuación (ascendente o descendente)
  "content" jsonb not null default '{}'::jsonb,                                        --> lista de ejercicios en formato JSON
  "seo_title" varchar(70),                                                             --> Título SEO
  "seo_description" varchar(160),                                                      --> Descripción SEO
  "seo_keywords" text[] not null default array[]::text[],                              --> Palabras clave SEO
  "seo_open_graph_images" jsonb not null default '[]'::jsonb,                          --> Imágenes para Open Graph
  "images" text[] not null default array[]::text[]                                     --> Imágenes de la rutina
);

-- Historial de los resultados de rutinas realizadas por los usuarios
create table workout_results
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
  "updated_at" timestamp with time zone default now(),                              --> Fecha y hora de la última actualización del patrocinador                                                           --> Estado del patrocinador (active, inactive)
  "name" varchar(100) not null unique,                                              --> Nombre del patrocinador
  "description" varchar(500) not null,                                              --> Descripción del patrocinador
  "website_url" varchar(200) not null,                                              --> URL del sitio web del patrocinador
  "social_networks" jsonb not null default '{}'::jsonb,                             --> Redes sociales del patrocinador en formato JSON
  "seo_title" varchar(70),                                                          --> Título SEO para el patrocinador
  "seo_description" varchar(160),                                                   --> Descripción SEO para el patrocinador
  "seo_keywords" text[] not null default array[]::text[],                           --> Palabras clave SEO para el patrocinador
  "seo_open_graph_images" jsonb not null default '{}'::jsonb,                       --> Imágenes Open Graph en formato JSON
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
  "location_id" uuid not null references geo_administrative_divisions("id"),        --> Ubicación donde se realiza la competencia
  "slug" varchar(100) not null unique,                                              --> Slug para URLs amigables
  "cellphone" cellphone not null,                                                   --> Número de contacto
  "email" email not null,                                                           --> Correo de contacto
  "social_networks" jsonb not null default '{}'::jsonb,                             --> Redes sociales de la competencia en formato JSON
  "seo_title" varchar(70),                                                          --> Título SEO para la competencia
  "seo_description" varchar(160),                                                   --> Descripción SEO para la competencia
  "seo_keywords" text[] not null default array[]::text[],                           --> Palabras clave SEO para la competencia
  "seo_open_graph_images" jsonb not null default '{}'::jsonb,                       --> Imágenes Open Graph en formato JSON
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
  "location_id" uuid not null references geo_administrative_divisions("id")        --> Ubicación donde se realiza la competencia
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

------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------
-- Vistas para la API

create view vi_users_api as
select
  u.id,
  u.created_at as "createdAt",
  u.updated_at as "updatedAt",
  u.last_login_at as "lastLoginAt",
  u.verified,
  u.role,
  u.status,
  u.is_coach as "isCoach",
  u.judge_level as "judgeLevel",
  jsonb_build_object(
    'address', u.email_address,
    'verified', u.email_verified
  ) as "email",
  jsonb_build_object(
    'number', u.cellphone_number,
    'verified', u.cellphone_verified
  ) as "cellphone",
  u.jwt_secret as "jwtSecret",
  u.password_hash as "passwordHash",
  u.session_key as "sessionKey",
  u.username,
  u.alias,
  u.first_name as "firstName",
  u.last_name as "lastName",
  u.gender,
  u.birthdate,
  extract(year from age(u.birthdate))::int as "age",
  u.height,
  u.weight,
  u.nationality,
  u.category,
  jsonb_build_object(
    'id', u.location_id,
    'name', b.name
  ) as "location",
  u.disciplines,
  u.social_media as "socialMedia",
  u.avatar,
  u.cover,
  u.athlete_photo as "athletePhoto",
  case
    when g.id is not null then
      jsonb_build_object(
        'id', g.id,
        'name', g.name,
        'role', g.role,
        'slug', g.slug,
        'status', g.status,
        'joinedDate', g.joined_date
      )
    else
      null
  end as "gym"
from users u
inner join geo_administrative_divisions b on b.id = u.location_id
left join vi_gym_members g on g.user_id = u.id;

create view vi_athletes_api as
select
  u.id,
  u.verified,
  initcap(u.alias) as name,
  u.nationality,
  u.category,
  u.gender,
  u.is_coach as "isCoach",
  u.judge_level as "judgeLevel",
  u.height,
  u.weight,
  extract(year from age(u.birthdate))::int as "age",
  u.social_media as "socialMedia",
  u.disciplines,
  u.avatar,
  jsonb_build_object(
    'id', u.location_id,
    'name', b.name
  ) as "location",
  case
    when l.id is not null then
      jsonb_build_object(
        'id', l.id,
        'name', l.name,
        'role', l.role,
        'slug', l.slug,
        'status', l.status,
        'joinedDate', l.joined_date
      )
    else
      null
  end as "gym"
from users u
inner join geo_administrative_divisions b on b.id = u.location_id
left join vi_gym_members l on l.user_id = u.id;


create view vi_exercises_api as
select
  e.id,
  e.created_at as "createdAt",
  e.updated_at as "updatedAt",
  e.published,
  jsonb_build_object(
    'en', e.name_en,
    'es', e.name_es
  ) as "name",
  e.slug,
  e.allowed_rm_types as "allowedRmTypes",
  e.description,
  e.tags,
  e.muscle_groups as "muscleGroups",
  e.videos,
  jsonb_build_object(
    'title', e.seo_title,
    'description', e.seo_description,
    'keywords', e.seo_keywords,
    'openGraphImages', e.seo_open_graph_images
  ) as "seo",
  e.images
from exercises e;

create view vi_workouts_api as
select 
  w.id,
  w.created_at as "createdAt",
  w.updated_at as "updatedAt",
  w.published,
  w.editable,
  w.gym_id as "gymId",
  w.name,
  w.description,
  w.type,
  w.time_cap as "timeCap",
  w.score_order as "scoreOrder",
  w.difficulty,
  w.disciplines,
  w.content,
  w.slug,
  jsonb_build_object(
    'title', w.seo_title,
    'description', w.seo_description,
    'keywords', w.seo_keywords,
    'openGraphImages', w.seo_open_graph_images
  ) as "seo",
  w.images
from workouts w;

create view vi_gyms_api as
select
  g.id,
  g.created_at as "createdAt",
  g.updated_at as "updatedAt",
  g.name,
  g.cellphone,
  g.email,
  g.social_networks as "socialNetworks",
  jsonb_build_object(
    'id', g.location_id,
    'name', l.name,
    'address', g.address,
    'latitude', g.geo_latitude,
    'longitude', g.geo_longitude,
    'googleMaps', g.url_google_maps
  ) as "location",
  g.slug,
  jsonb_build_object(
    'title', g.seo_title,
    'description', g.seo_description,
    'keywords', g.seo_keywords,
    'openGraphImages', g.seo_open_graph_images
  ) as "seo",
  g.social_media as "socialMedia",
  g.images,
  g.schedules, 
  g.membership_plans as "membershipPlans",
  g.disciplines as "disciplines",
  g.description
from gyms g
inner join geo_administrative_divisions l on l.id = g.location_id;
