import RecipeForm from "@/components/recipe-form";

export default function ManageRecipePage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
        <div className="text-center mb-8">
            <h1 className="font-headline text-4xl md:text-5xl font-bold">Create a New Recipe</h1>
            <p className="mt-2 text-lg text-muted-foreground">Share your culinary creations with the world.</p>
        </div>
        <RecipeForm />
    </div>
  );
}
