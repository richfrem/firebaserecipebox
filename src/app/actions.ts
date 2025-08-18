"use server";

import { scaleRecipeIngredients, ScaleRecipeIngredientsInput, ScaleRecipeIngredientsOutput } from '@/ai/flows/scale-recipe-ingredients';
import { addRecipe, updateRecipe } from '@/lib/mock-data';
import type { Recipe } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const scaleActionInputSchema = z.object({
  ingredients: z.array(z.object({
    name: z.string(),
    quantity: z.number(),
    unit: z.string(),
  })),
  targetServings: z.number().min(1),
  originalServings: z.number().min(1),
});

type ScaleActionResponse = {
  data?: ScaleRecipeIngredientsOutput;
  error?: string;
};

export async function getScaledIngredients(input: ScaleRecipeIngredientsInput): Promise<ScaleActionResponse> {
    const parsedInput = scaleActionInputSchema.safeParse(input);

    if (!parsedInput.success) {
        return { error: 'Invalid input. Please check the serving size and ingredients.' };
    }

    try {
        const scaledIngredients = await scaleRecipeIngredients(parsedInput.data);
        return { data: scaledIngredients };
    } catch (error) {
        console.error("Error scaling ingredients:", error);
        return { error: 'Failed to scale ingredients. The AI model may be temporarily unavailable. Please try again later.' };
    }
}


const recipeFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  description: z.string().min(10, "Description must be at least 10 characters long."),
  cuisine_type: z.string().min(2, "Cuisine type is required."),
  servings: z.coerce.number({ invalid_type_error: "Servings must be a number" }).int().min(1, "Servings must be at least 1."),
  main_image_url: z.string().url({ message: "Please enter a valid image URL." }).optional().or(z.literal('')),
  ingredients: z.array(z.object({
    name: z.string().min(1, "Ingredient name is required."),
    quantity: z.coerce.number({ invalid_type_error: "Quantity must be a number" }).min(0.01, "Quantity must be positive."),
    unit: z.string().min(1, "Unit is required.")
  })).min(1, "At least one ingredient is required."),
  steps: z.array(z.object({
    instruction: z.string().min(5, "Instruction is too short.")
  })).min(1, "At least one step is required."),
});

type RecipeFormValues = z.infer<typeof recipeFormSchema>;

type ActionResponse = {
  data?: Recipe;
  error?: string;
};

export async function createRecipe(input: RecipeFormValues): Promise<ActionResponse> {
    const parsedInput = recipeFormSchema.safeParse(input);

    if (!parsedInput.success) {
        return { error: 'Invalid input. Please check your recipe details.' };
    }
    
    try {
        const newRecipeData = {
            ...parsedInput.data,
            user_id: 'user-1', // Mock user id
            main_image_url: parsedInput.data.main_image_url || 'https://placehold.co/1200x800.png',
            data_ai_hint: parsedInput.data.title.toLowerCase().split(' ').slice(0,2).join(' '),
            steps: parsedInput.data.steps.map((step, index) => ({
                id: `s-new-${index}`,
                recipe_id: '',
                step_number: index + 1,
                instruction: step.instruction,
            })),
            ingredients: parsedInput.data.ingredients.map((ing, index) => ({
                ...ing,
                id: `i-new-${index}`,
                recipe_id: '',
            }))
        };
        const newRecipe = await addRecipe(newRecipeData);
        revalidatePath('/');
        revalidatePath(`/recipe/${newRecipe.id}`);
        return { data: newRecipe };
    } catch (error) {
        console.error("Error creating recipe:", error);
        return { error: 'Failed to save the recipe. Please try again later.' };
    }
}

export async function updateRecipeAction(id: string, input: RecipeFormValues): Promise<ActionResponse> {
    const parsedInput = recipeFormSchema.safeParse(input);

    if (!parsedInput.success) {
        return { error: 'Invalid input. Please check your recipe details.' };
    }
    
    try {
        const updatedRecipeData = {
            ...parsedInput.data,
            user_id: 'user-1', // Mock user id
            main_image_url: parsedInput.data.main_image_url || 'https://placehold.co/1200x800.png',
            data_ai_hint: parsedInput.data.title.toLowerCase().split(' ').slice(0,2).join(' '),
            steps: parsedInput.data.steps.map((step, index) => ({
                id: `s-upd-${id}-${index}`,
                recipe_id: id,
                step_number: index + 1,
                instruction: step.instruction,
            })),
            ingredients: parsedInput.data.ingredients.map((ing, index) => ({
                ...ing,
                id: `i-upd-${id}-${index}`,
                recipe_id: id,
            }))
        };
        const updatedRecipe = await updateRecipe(id, updatedRecipeData);
        if (!updatedRecipe) {
             return { error: 'Recipe not found or could not be updated.' };
        }
        revalidatePath('/');
        revalidatePath(`/recipe/${updatedRecipe.id}`);
        return { data: updatedRecipe };
    } catch (error) {
        console.error("Error updating recipe:", error);
        return { error: 'Failed to update the recipe. Please try again later.' };
    }
}
