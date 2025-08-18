import { getRecipeById } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import RecipeScaler from '@/components/recipe-scaler';
import { Clock, Pencil, User, UtensilsCrossed } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function RecipePage({ params }: { params: { id: string } }) {
  const recipe = await getRecipeById(params.id);

  if (!recipe) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="bg-card rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-64 md:h-96 w-full">
          <Image
            src={recipe.main_image_url}
            alt={`Image of ${recipe.title}`}
            fill
            priority
            className="object-cover"
            data-ai-hint={recipe.data_ai_hint}
          />
           <div className="absolute top-4 right-4">
              <Button asChild>
                <Link href={`/manage-recipe/${recipe.id}`}>
                  <Pencil className="mr-2 h-4 w-4" /> Edit Recipe
                </Link>
              </Button>
            </div>
        </div>
        <div className="p-6 md:p-8">
          <Badge variant="secondary">{recipe.cuisine_type}</Badge>
          <h1 className="font-headline text-4xl md:text-5xl font-bold mt-2 mb-4">{recipe.title}</h1>
          <p className="text-lg text-muted-foreground mb-6">{recipe.description}</p>

          <div className="flex flex-wrap items-center gap-4 md:gap-8 mb-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={recipe.author?.avatar_url} alt={recipe.author?.username} />
                <AvatarFallback>{recipe.author?.username?.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>{recipe.author?.username}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{formatDistanceToNow(new Date(recipe.created_at), { addSuffix: true })}</span>
            </div>
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="h-5 w-5" />
              <span>Serves {recipe.servings}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <RecipeScaler
                ingredients={recipe.ingredients}
                originalServings={recipe.servings}
              />
            </div>
            <div className="md:col-span-2">
              <h2 className="font-headline text-3xl font-semibold mb-4">Instructions</h2>
              <ol className="space-y-6">
                {recipe.steps.map((step) => (
                  <li key={step.id} className="flex gap-4">
                    <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold text-lg">
                      {step.step_number}
                    </div>
                    <p className="pt-1">{step.instruction}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
