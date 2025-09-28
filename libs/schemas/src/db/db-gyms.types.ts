import { GymMemberRole, GymMemberStatus, GymStatus, GymType } from '../types';

export interface DbGym {
  id: string; // Identificador único del gimnasio
  created_at: Date; // Marca de tiempo ISO de cuando se creó el gimnasio
  updated_at: Date; // Marca de tiempo ISO de cuando se actualizó por última vez el gimnasio
  status: GymStatus; // Estado del gimnasio
  type: GymType; // Tipo de gimnasio
  name: string; // Nombre del gimnasio
  cellphone: string; // Número de celular del gimnasio
  email: string; // Correo electrónico del gimnasio
  social_networks: { [key: string]: string }; // Redes sociales del gimnasio
  address: string; // Dirección del gimnasio
  city_id: string; // Referencia a la ciudad donde se encuentra el gimnasio
  slug: string; // Slug para URLs
  url_google_maps: string; // URL de Google Maps del gimnasio
  geo_latitude: number; // Latitud geográfica del gimnasio
  geo_longitude: number; // Longitud geográfica del gimnasio
  seo_title: string | null; // Título SEO para la página del gimnasio
  seo_description: string | null; // Descripción SEO para la página del gimnasio
  seo_keywords: string[]; // Palabras clave SEO para la página del gimnasio
  seo_open_graph_images: string[]; // Imágenes Open Graph para la página del gimnasio
  images: string[]; // Imágenes del gimnasio
  description: string | null; // Descripción del gimnasio
}

export interface DbGymInsert {
  status: GymStatus; // Estado del gimnasio
  type: GymType; // Tipo de gimnasio
  name: string; // Nombre del gimnasio
  cellphone: string; // Número de celular del gimnasio
  email: string; // Correo electrónico del gimnasio
  social_networks: { [key: string]: string }; // Redes sociales del gimnasio
  address: string; // Dirección del gimnasio
  city_id: string; // Referencia a la ciudad donde se encuentra el gimnasio
  slug: string; // Slug para URLs
  url_google_maps: string; // URL de Google Maps del gimnasio
  geo_latitude: number; // Latitud geográfica del gimnasio
  geo_longitude: number; // Longitud geográfica del gimnasio
  seo_title?: string | null; // Título SEO para la página del gimnasio
  seo_description?: string | null; // Descripción SEO para la página del gimnasio
  seo_keywords?: string[]; // Palabras clave SEO para la página del gimnasio
  description?: string | null; // Descripción del gimnasio
}

export interface DbGymUpdate {
  status?: GymStatus; // Estado del gimnasio
  type?: GymType; // Tipo de gimnasio
  name?: string; // Nombre del gimnasio
  cellphone?: string; // Número de celular del gimnasio
  email?: string; // Correo electrónico del gimnasio
  social_networks?: { [key: string]: string }; // Redes sociales del gimnasio
  address?: string; // Dirección del gimnasio
  city_id?: string; // Referencia a la ciudad donde se encuentra el gimnasio
  slug?: string; // Slug para URLs
  url_google_maps?: string; // URL de Google Maps del gimnasio
  geo_latitude?: number; // Latitud geográfica del gimnasio
  geo_longitude?: number; // Longitud geográfica del gimnasio
  seo_title?: string | null; // Título SEO para la página del gimnasio
  seo_description?: string | null; // Descripción SEO para la página del gimnasio
  seo_keywords?: string[]; // Palabras clave SEO para la página del gimnasio
  seo_open_graph_images?: string[]; // Imágenes Open Graph para la página del gimnasio
  images?: string[]; // Imágenes del gimnasio
  description?: string | null; // Descripción del gimnasio
}

export interface DbGymMember {
  id: string; // Identificador único del miembro del gimnasio
  created_at: Date; // Marca de tiempo ISO de cuando se creó la entrada
  updated_at: Date; // Marca de tiempo ISO de cuando se actualizó por última vez la entrada
  gym_id: string; // Referencia al gimnasio
  user_id: string; // Referencia al usuario
  role: GymMemberRole; // Rol del miembro en el gimnasio
  status: GymMemberStatus; // Estado del miembro en el gimnasio
  joined_date: Date; // Marca de tiempo ISO de cuando el usuario se unió al gimnasio
}

export interface DbGymMemberInsert {
  gym_id: string; // Referencia al gimnasio
  user_id: string; // Referencia al usuario
  role: GymMemberRole; // Rol del miembro en el gimnasio
  status: GymMemberStatus; // Estado del miembro en el gimnasio
  joined_date?: Date; // Marca de tiempo ISO de cuando el usuario se unió al gimnasio
}

export interface DbGymMemberUpdate {
  updated_at: Date; // Marca de tiempo ISO de cuando se actualizó por última vez la entrada
  role?: GymMemberRole; // Rol del miembro en el gimnasio
  status?: GymMemberStatus; // Estado del miembro en el gimnasio
  joined_date?: Date; // Marca de tiempo ISO de cuando el usuario se unió al gimnasio
}