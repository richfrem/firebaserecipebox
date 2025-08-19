
"use server";

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { Recipe, Profile, ScaleRecipeIngredientsOutput } from '@/lib/types';
import { scaleRecipeIngredients, ScaleRecipeIngredientsInput } from '@/ai/flows/scale-recipe-ingredients';
import { admin, adminDb, adminStorage } from '@/lib/firebase-admin';


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
  ingredients: z.array(z.object({
    name: z.string().min(1, "Ingredient name is required."),
    quantity: z.coerce.number({ invalid_type_error: "Quantity must be a number" }).min(0.01, "Quantity must be positive."),
    unit: z.string().min(1, "Unit is required.")
  })).min(1, "At least one ingredient is required."),
  steps: z.array(z.object({
    instruction: z.string().min(5, "Instruction is too short.")
  })).min(1, "At least one step is required."),
  user_id: z.string(),
});

type ActionResponse = {
  data?: Recipe;
  error?: string;
  validationErrors?: any;
};


async function uploadImageAndGetURL(image: File, userId: string): Promise<string | null> {
    if (!image || image.size === 0) return null;

    try {
        const bucket = adminStorage.bucket();
        const timestamp = Date.now();
        const fileName = `${timestamp}_${image.name}`;
        const filePath = `recipes/${userId}/${fileName}`;
        
        const buffer = Buffer.from(await image.arrayBuffer());

        const file = bucket.file(filePath);
        await file.save(buffer, {
          metadata: {
            contentType: image.type,
          },
        });

        const [publicUrl] = await file.getSignedUrl({
          action: 'read',
          expires: '03-09-2491', 
        });

        return publicUrl;
    } catch(error) {
        console.error("Error uploading image with Admin SDK:", error);
        throw new Error("Image upload failed.");
    }
}


export async function createRecipe(formData: FormData): Promise<ActionResponse> {
    const rawData = Object.fromEntries(formData.entries());
    const ingredients = JSON.parse(rawData.ingredients as string);
    const steps = JSON.parse(rawData.steps as string);
    const imageFile = formData.get('main_image') as File | undefined;
    const userId = rawData.user_id as string;

    const parsedInput = recipeFormSchema.safeParse({
        ...rawData,
        servings: parseInt(rawData.servings as string, 10),
        ingredients,
        steps,
    });

    if (!parsedInput.success) {
        return { error: 'Invalid input. Please check your recipe details.', validationErrors: parsedInput.error.flatten().fieldErrors };
    }
     if (!userId) {
        return { error: 'You must be logged in to create a recipe.' };
    }
    
    try {
        let imageUrl = 'https://placehold.co/1200x800.png';

        if (imageFile && imageFile.size > 0) {
            const uploadedUrl = await uploadImageAndGetURL(imageFile, userId);
            if (uploadedUrl) {
                imageUrl = uploadedUrl;
            }
        }
        
        const recipeDataForDb = {
            ...parsedInput.data,
            main_image_url: imageUrl,
            data_ai_hint: parsedInput.data.title.toLowerCase().split(' ').slice(0,2).join(' '),
            steps: parsedInput.data.steps.map((step, index) => ({
                step_number: index + 1,
                instruction: step.instruction,
            })),
            created_at: admin.firestore.FieldValue.serverTimestamp(),
        };

        const newRecipeRef = await adminDb.collection('recipes').add(recipeDataForDb);
        
        const finalRecipe: Recipe = {
            ...recipeDataForDb,
            id: newRecipeRef.id,
            created_at: new Date().toISOString(), 
            ingredients: recipeDataForDb.ingredients.map(ing => ({...ing, id: '', recipe_id: newRecipeRef.id})), 
            steps: recipeDataForDb.steps.map(s => ({...s, id: '', recipe_id: newRecipeRef.id})),
        }
        
        revalidatePath('/');
        revalidatePath(`/recipe/${newRecipeRef.id}`);
        return { data: finalRecipe };

    } catch (error: any) {
        console.error("Error creating recipe:", error);
        return { error: `Failed to save the recipe. ${error.message}` };
    }
}

export async function updateRecipeAction(id: string, formData: FormData): Promise<ActionResponse> {
    const rawData = Object.fromEntries(formData.entries());
    const ingredients = JSON.parse(rawData.ingredients as string);
    const steps = JSON.parse(rawData.steps as string);
    const newImageFile = formData.get('main_image') as File | undefined;
    const userId = rawData.user_id as string;

    const parsedInput = recipeFormSchema.safeParse({
        ...rawData,
        servings: parseInt(rawData.servings as string, 10),
        ingredients,
        steps,
    });

    if (!parsedInput.success) {
        return { error: 'Invalid input. Please check your recipe details.', validationErrors: parsedInput.error.flatten().fieldErrors };
    }
    if (!userId) {
        return { error: 'You must be logged in to update a recipe.' };
    }
    
    try {
        let imageUrl = rawData.existing_main_image_url as string;
        
        if (newImageFile && newImageFile.size > 0) {
            const uploadedUrl = await uploadImageAndGetURL(newImageFile, userId);
            if (uploadedUrl) {
                imageUrl = uploadedUrl;
            }
        }
        
        const updatedRecipeData = {
            ...parsedInput.data,
            main_image_url: imageUrl || 'https://placehold.co/1200x800.png',
            data_ai_hint: parsedInput.data.title.toLowerCase().split(' ').slice(0,2).join(' '),
            steps: parsedInput.data.steps.map((step, index) => ({
                step_number: index + 1,
                instruction: step.instruction,
            }))
        };
        
        await adminDb.collection('recipes').doc(id).update(updatedRecipeData);

        const finalRecipe: Recipe = {
             id: id,
             created_at: new Date().toISOString(), 
            ...updatedRecipeData,
            ingredients: updatedRecipeData.ingredients.map(ing => ({...ing, id: '', recipe_id: id})),
            steps: updatedRecipeData.steps.map(s => ({...s, id: '', recipe_id: id})),
        }

        revalidatePath('/');
        revalidatePath(`/recipe/${id}`);
        return { data: finalRecipe };
    } catch (error: any) {
        console.error("Error updating recipe:", error);
        return { error: `Failed to update the recipe. ${error.message}` };
    }
}


// --- DATA FETCHING ACTIONS ---

export async function getRecipes(): Promise<Recipe[]> {
    try {
        const recipesCollectionRef = adminDb.collection('recipes');
        const snapshot = await recipesCollectionRef.limit(20).get();

        if (snapshot.empty) {
            return [];
        }

        const recipes = await Promise.all(snapshot.docs.map(async (doc) => {
            const data = doc.data();
            const recipe: Recipe = {
                id: doc.id,
                user_id: data.user_id,
                title: data.title,
                description: data.description,
                cuisine_type: data.cuisine_type,
                servings: data.servings,
                main_image_url: data.main_image_url,
                data_ai_hint: data.data_ai_hint,
                created_at: data.created_at?.toDate().toISOString() || new Date().toISOString(),
                ingredients: data.ingredients || [],
                steps: data.steps || [],
                author: undefined,
            };

            if (data.user_id) {
                try {
                    const userDoc = await adminDb.collection('users').doc(data.user_id).get();
                    if (userDoc.exists) {
                        recipe.author = userDoc.data() as Profile;
                    }
                } catch (error) {
                    console.error(`Failed to fetch author for recipe ${recipe.id}`, error);
                    recipe.author = { id: data.user_id, username: 'Unknown Chef' };
                }
            }
            return recipe;
        }));

        return recipes;
    } catch (error: any) {
        if (error.code === 5 || error.code === 'NOT_FOUND') {
            console.log("Firestore database not found. Please create a database in the Firebase console.");
            return [];
        }
        console.error("Error fetching recipes:", error);
        throw error;
    }
}


export async function getRecipeById(id: string): Promise<Recipe | undefined> {
    try {
        const docRef = adminDb.collection('recipes').doc(id);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
            const data = docSnap.data();
            if (!data) return undefined;

            const recipe: Recipe = {
                id: docSnap.id,
                user_id: data.user_id,
                title: data.title,
                description: data.description,
                cuisine_type: data.cuisine_type,
                servings: data.servings,
                main_image_url: data.main_image_url,
                data_ai_hint: data.data_ai_hint,
                created_at: data.created_at?.toDate().toISOString() || new Date().toISOString(),
                ingredients: data.ingredients || [],
                steps: data.steps || [],
            };
            
            if (recipe.user_id) {
                const userDoc = await adminDb.collection('users').doc(recipe.user_id).get();
                if (userDoc.exists) {
                    recipe.author = userDoc.data() as Profile;
                } else {
                    recipe.author = { id: recipe.user_id, username: 'Anonymous Chef' };
                }
            }
            return recipe;
        } else {
            return undefined;
        }
    } catch (error: any) {
        if (error.code === 5 || error.code === 'NOT_FOUND') {
            console.log("Firestore database not found. Please create a database in the Firebase console.");
            return undefined;
        }
        console.error(`Error fetching recipe by id ${id}:`, error);
        throw error;
    }
};

    