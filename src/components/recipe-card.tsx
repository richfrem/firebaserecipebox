import Link from 'next/link';
import Image from 'next/image';
import type { Recipe } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ChefHat } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`/recipe/${recipe.id}`} className="group block">
      <Card className="h-full overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-lg group-hover:-translate-y-1">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src={recipe.main_image_url}
              alt={`Image of ${recipe.title}`}
              fill
              className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
              data-ai-hint={recipe.data_ai_hint}
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <Badge variant="secondary" className="mb-2">{recipe.cuisine_type}</Badge>
          <CardTitle className="font-headline text-xl leading-tight mb-2">{recipe.title}</CardTitle>
          <div className="flex items-center gap-2 pt-2 text-sm text-muted-foreground">
             <Avatar className="h-6 w-6">
                <AvatarImage src={recipe.author?.avatar_url} alt={recipe.author?.username} />
                <AvatarFallback><ChefHat className="h-4 w-4" /></AvatarFallback>
             </Avatar>
             <span>{recipe.author?.username || 'Unknown Chef'}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
