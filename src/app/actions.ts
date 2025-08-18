"use server";

import { scaleRecipeIngredients, ScaleRecipeIngredientsInput, ScaleRecipeIngredientsOutput } from '@/ai/flows/scale-recipe-ingredients';
import { addRecipe, updateRecipe } from '@/lib/mock-data';
import type { Recipe } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Readable } from 'stream';

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
  main_image: z.instanceof(File).optional(),
  ingredients: z.array(z.object({
    name: z.string().min(1, "Ingredient name is required."),
    quantity: z.coerce.number({ invalid_type_error: "Quantity must be a number" }).min(0.01, "Quantity must be positive."),
    unit: z.string().min(1, "Unit is required.")
  })).min(1, "At least one ingredient is required."),
  steps: z.array(z.object({
    instruction: z.string().min(5, "Instruction is too short.")
  })).min(1, "At least one step is required."),
});

type ActionResponse = {
  data?: Recipe;
  error?: string;
  validationErrors?: any;
};

async function uploadImageAndGetURL(image: File) {
    if (!image || image.size === 0) return null;

    try {
        const storageRef = ref(storage, `recipes/${Date.now()}_${image.name}`);
        const imageBuffer = await image.arrayBuffer();
        await uploadBytes(storageRef, imageBuffer, { contentType: image.type });
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    } catch(error) {
        console.error("Error uploading image:", error);
        return null;
    }
}


export async function createRecipe(formData: FormData): Promise<ActionResponse> {
    const rawData = Object.fromEntries(formData.entries());
    const ingredients = JSON.parse(rawData.ingredients as string);
    const steps = JSON.parse(rawData.steps as string);

    const parsedInput = recipeFormSchema.safeParse({
        ...rawData,
        servings: parseInt(rawData.servings as string, 10),
        main_image: rawData.main_image,
        ingredients,
        steps,
    });


    if (!parsedInput.success) {
        return { error: 'Invalid input. Please check your recipe details.', validationErrors: parsedInput.error.flatten().fieldErrors };
    }
    
    try {
        let imageUrl = 'https://placehold.co/1200x800.png';
        if (parsedInput.data.main_image && parsedInput.data.main_image.size > 0) {
            const uploadedUrl = await uploadImageAndGetURL(parsedInput.data.main_image);
            if (uploadedUrl) {
                imageUrl = uploadedUrl;
            }
        }

        const newRecipeData = {
            ...parsedInput.data,
            main_image_url: imageUrl,
            user_id: 'user-1', // Mock user id
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

export async function updateRecipeAction(id: string, formData: FormData): Promise<ActionResponse> {
    const rawData = Object.fromEntries(formData.entries());
    const ingredients = JSON.parse(rawData.ingredients as string);
    const steps = JSON.parse(rawData.steps as string);

    const parsedInput = recipeFormSchema.safeParse({
        ...rawData,
        servings: parseInt(rawData.servings as string, 10),
        main_image: rawData.main_image,
        ingredients,
        steps,
    });


    if (!parsedInput.success) {
        return { error: 'Invalid input. Please check your recipe details.', validationErrors: parsedInput.error.flatten().fieldErrors };
    }
    
    try {
        let imageUrl = rawData.existing_main_image_url as string || 'https://placehold.co/1200x800.png';

        if (parsedInput.data.main_image && parsedInput.data.main_image.size > 0) {
            const uploadedUrl = await uploadImageAndGetURL(parsedInput.data.main_image);
            if (uploadedUrl) {
                imageUrl = uploadedUrl;
            }
        }
        
        const updatedRecipeData = {
            ...parsedInput.data,
            main_image_url: imageUrl,
            user_id: 'user-1', // Mock user id
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
