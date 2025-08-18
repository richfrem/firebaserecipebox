
import { z } from "zod";

export interface Ingredient {
  id: string;
  recipe_id: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface Step {
  id: string;
  recipe_id: string;
  step_number: number;
  instruction: string;
  image_url?: string;
}

export interface Recipe {
  id: string;
  user_id: string;
  title: string;
  description: string;
  cuisine_type: string;
  servings: number;
  main_image_url: string;
  data_ai_hint: string;
  created_at: string;
  ingredients: Ingredient[];
  steps: Step[];
  author?: Profile;
}

export interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
}

const emailFormSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export type EmailFormValues = z.infer<typeof emailFormSchema>;
