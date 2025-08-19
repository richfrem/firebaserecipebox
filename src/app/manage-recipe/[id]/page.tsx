
import RecipeForm from "@/components/recipe-form";
import type { Recipe } from '@/lib/types';
import { notFound } from "next/navigation";
import { getRecipeById } from "@/app/actions";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
