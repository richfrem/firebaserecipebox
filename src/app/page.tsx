import RecipeCard from '@/components/recipe-card';
import { getRecipes } from '@/lib/database';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
