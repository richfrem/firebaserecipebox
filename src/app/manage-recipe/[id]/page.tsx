import RecipeForm from "@/components/recipe-form";
import { getRecipeById } from "@/lib/mock-data";
import { notFound } from "next/navigation";

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
