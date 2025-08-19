
import RecipeCard from '@/components/recipe-card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { adminDb } from '@/lib/firebase-admin';
import type { Recipe, Profile } from '@/lib/types';
import { collection, getDocs, query, orderBy, limit, doc, getDoc } from 'firebase/firestore';


async function getRecipes(): Promise<Recipe[]> {
    const recipesCollectionRef = adminDb.collection('recipes');
    const q = recipesCollectionRef.orderBy('created_at', 'desc').limit(20);
    const snapshot = await q.get();

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
}


export default async function Home() {
  const recipes = await getRecipes();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center py-12">
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary">RecipeHub</h1>
        <p className="mt-4 text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto">
          Find, create, and share your next favorite meal. Your culinary adventure starts here.
        </p>
        <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/manage-recipe">Add a New Recipe</Link>
            </Button>
        </div>
      </div>

      <section>
        <h2 className="font-headline text-3xl font-semibold mb-6">Latest Recipes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>
    </div>
  );
}
