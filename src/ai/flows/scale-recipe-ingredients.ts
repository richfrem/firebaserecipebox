'use server';

/**
 * @fileOverview Dynamically scales recipe ingredient quantities based on the desired number of servings.
 *
 * - scaleRecipeIngredients - A function that handles the scaling of recipe ingredients.
 * - ScaleRecipeIngredientsInput - The input type for the scaleRecipeIngredients function.
 * - ScaleRecipeIngredientsOutput - The return type for the scaleRecipeIngredients function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScaleRecipeIngredientsInputSchema = z.object({
  ingredients: z.array(
    z.object({
      name: z.string().describe('The name of the ingredient.'),
      quantity: z.number().describe('The quantity of the ingredient.'),
      unit: z.string().describe('The unit of measurement for the ingredient (e.g., grams, cups, tbsp).'),
    })
  ).describe('An array of ingredients with their quantities and units.'),
  targetServings: z.number().describe('The desired number of servings for the recipe.'),
  originalServings: z.number().describe('The original number of servings the recipe was designed for.'),
});
export type ScaleRecipeIngredientsInput = z.infer<typeof ScaleRecipeIngredientsInputSchema>;

const ScaleRecipeIngredientsOutputSchema = z.array(
  z.object({
    name: z.string().describe('The name of the ingredient.'),
    quantity: z.number().describe('The scaled quantity of the ingredient.'),
    unit: z.string().describe('The unit of measurement for the ingredient (e.g., grams, cups, tbsp).'),
  })
);
export type ScaleRecipeIngredientsOutput = z.infer<typeof ScaleRecipeIngredientsOutputSchema>;

export async function scaleRecipeIngredients(
  input: ScaleRecipeIngredientsInput
): Promise<ScaleRecipeIngredientsOutput> {
  return scaleRecipeIngredientsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scaleRecipeIngredientsPrompt',
  input: {schema: ScaleRecipeIngredientsInputSchema},
  output: {schema: ScaleRecipeIngredientsOutputSchema},
  prompt: `You are a professional chef skilled in scaling recipes. Given a list of ingredients with their quantities, the original number of servings, and the target number of servings, you will calculate the new quantities for each ingredient.

Pay close attention to the units of measurement and perform any necessary conversions to ensure accuracy. Take into account volume and density conversions, and other measurement concerns. Return the scaled ingredients with their new quantities and original units.

Original Servings: {{{originalServings}}}
Target Servings: {{{targetServings}}}

Ingredients:
{{#each ingredients}}
- {{quantity}} {{unit}} {{name}}
{{/each}}

Scaled Ingredients:
`,
});

const scaleRecipeIngredientsFlow = ai.defineFlow(
  {
    name: 'scaleRecipeIngredientsFlow',
    inputSchema: ScaleRecipeIngredientsInputSchema,
    outputSchema: ScaleRecipeIngredientsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
