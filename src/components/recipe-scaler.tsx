"use client";

import { useState, useTransition } from 'react';
import type { Ingredient } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getScaledIngredients } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface RecipeScalerProps {
  ingredients: Ingredient[];
  originalServings: number;
}

export default function RecipeScaler({ ingredients, originalServings }: RecipeScalerProps) {
  const [targetServings, setTargetServings] = useState(originalServings);
  const [scaledIngredients, setScaledIngredients] = useState<Omit<Ingredient, 'id' | 'recipe_id'>[] | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleScaleRecipe = () => {
    startTransition(async () => {
      if (targetServings <= 0) {
        toast({
          title: 'Invalid Input',
          description: 'Please enter a serving size greater than zero.',
          variant: 'destructive',
        });
        return;
      }

      const result = await getScaledIngredients({
        ingredients: ingredients.map(({ name, quantity, unit }) => ({ name, quantity, unit })),
        originalServings,
        targetServings,
      });

      if (result.error) {
        toast({
          title: 'Scaling Error',
          description: result.error,
          variant: 'destructive',
        });
        setScaledIngredients(null);
      } else if (result.data) {
        setScaledIngredients(result.data);
        toast({
          title: 'Success!',
          description: `Recipe scaled to ${targetServings} servings.`,
        });
      }
    });
  };

  const currentIngredients = scaledIngredients ?? ingredients;

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="font-headline text-3xl font-semibold">Ingredients</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-2">
          <Label htmlFor="servings" className="font-bold">Servings</Label>
          <div className="flex items-center gap-2">
            <Input
              id="servings"
              type="number"
              value={targetServings}
              onChange={(e) => setTargetServings(Number(e.target.value))}
              min="1"
              className="w-24"
            />
            <Button onClick={handleScaleRecipe} disabled={isPending}>
              {isPending ? 'Scaling...' : 'Scale'}
            </Button>
          </div>
        </div>

        <ul className="space-y-3">
          {currentIngredients.map((ingredient, index) => (
            <li key={index} className="flex justify-between items-baseline border-b border-dashed pb-2">
              <span className="flex-1 mr-2">{ingredient.name}</span>
              <span className="text-right font-medium text-primary">
                {Number(ingredient.quantity.toFixed(2))} {ingredient.unit}
              </span>
            </li>
          ))}
        </ul>

        {isPending && (
          <Alert className="mt-4">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Calculating...</AlertTitle>
            <AlertDescription>
              Our AI chef is adjusting the recipe for you. Please wait a moment.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
