"use server";

import { scaleRecipeIngredients, ScaleRecipeIngredientsInput, ScaleRecipeIngredientsOutput } from '@/ai/flows/scale-recipe-ingredients';
import { z } from 'zod';

const actionInputSchema = z.object({
  ingredients: z.array(z.object({
    name: z.string(),
    quantity: z.number(),
    unit: z.string(),
  })),
  targetServings: z.number().min(1),
  originalServings: z.number().min(1),
});

type ActionResponse = {
  data?: ScaleRecipeIngredientsOutput;
  error?: string;
};

export async function getScaledIngredients(input: ScaleRecipeIngredientsInput): Promise<ActionResponse> {
    const parsedInput = actionInputSchema.safeParse(input);

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
