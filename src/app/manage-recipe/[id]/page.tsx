
import RecipeForm from "@/components/recipe-form";
import { adminDb } from '@/lib/firebase-admin';
import type { Recipe, Profile } from '@/lib/types';
import { notFound } from "next/navigation";

export const runtime = 'nodejs';

async function getRecipeById(id: string): Promise<Recipe | undefined> {
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
};

export default async function ManageRecipePage({ params }: { params: { id: string } }) {
  const recipe = await getRecipeById(params.id);

  if (!recipe) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
        <div className="text-center mb-8">
            <h1 className="font-headline text-4xl md:text-5xl font-bold">Edit Your Recipe</h1>
            <p className="mt-2 text-lg text-muted-foreground">Refine your culinary masterpiece.</p>
        </div>
        <RecipeForm recipe={recipe} />
    </div>
  );
}
