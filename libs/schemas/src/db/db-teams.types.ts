import { AthleteCategory } from "../types";
import { TeamGender } from "../types/team.types";

export interface DbTeam {
  id: string; // Unique identifier for the team
  created_at: Date; // ISO timestamp of when the team was created
  updated_at: Date; // ISO timestamp of when the team was last updated
  name: string; // Name of the team
  category: AthleteCategory;
  team_size: number; // Number of members in the team
  gender: TeamGender; // 'M', 'F', or 'X'
  slug: string; // Slug for URLs
  city_id: string; // Reference to the city where the team is based
  country_id: string; // Reference to the country where the team is based
  country_code: string; // ISO country code
  seo_title: string | null; // SEO title for the team page
  seo_description: string | null; // SEO description for the team page
  seo_keywords: string[]; // SEO keywords for the team page
  seo_open_graph_images: string[]; // Open Graph images for the team page
  images: string[]; // Images for the team
  description: string | null; // Description of the team
}

export interface DbTeamInsert {
  name: string; // Name of the team
  category: AthleteCategory;
  team_size: number; // Number of members in the team
  gender: TeamGender; // 'M', 'F', or 'X'
  slug: string; // Slug for URLs
  city_id: string; // Reference to the city where the team is based
  country_id: string; // Reference to the country where the team is based
  country_code: string; // ISO country code
  seo_title?: string | null; // SEO title for the team page
  seo_description?: string | null; // SEO description for the team page
  seo_keywords?: string[]; // SEO keywords for the team page
  description?: string | null; // Description of the team
}

export interface DbTeamUpdate {
  updated_at: Date; // ISO timestamp of when the team was last updated
  name?: string; // Name of the team
  category?: AthleteCategory;
  team_size?: number; // Number of members in the team
  gender?: TeamGender; // 'M', 'F', or 'X'
  slug?: string; // Slug for URLs
  city_id?: string; // Reference to the city where the team is based
  country_id?: string; // Reference to the country where the team is based
  country_code?: string; // ISO country code
  seo_title?: string | null; // SEO title for the team page
  seo_description?: string | null; // SEO description for the team page
  seo_keywords?: string[]; // SEO keywords for the team page
  seo_open_graph_images?: string[]; // Open Graph images for the team page
  images?: string[]; // Images for the team
  description?: string | null; // Description of the team
}

export interface DbTeamMember {
  created_at: Date; // ISO timestamp of when the entry was created
  user_id: string; // Reference to the user
  team_id: string; // Reference to the team
  is_captain: boolean; // Whether the user is the captain of the team
  joined_at: Date; // ISO timestamp of when the user joined the team
}
