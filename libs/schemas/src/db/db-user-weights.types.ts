export interface DbUserWeights {
  id: string; // Unique identifier for the weight entry
  created_at: Date; // ISO timestamp of when the entry was created
  user_id: string;
  weight: number; // Weight in kilograms
}