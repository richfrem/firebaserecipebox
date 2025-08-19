"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createRecipe, updateRecipeAction } from "@/app/actions";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { Recipe } from "@/lib/types";
import { useAuth } from "@/context/auth-context";

const recipeFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  description: z.string().min(10, "Description must be at least 10 characters long."),
  cuisine_type: z.string().min(2, "Cuisine type is required."),
  servings: z.coerce.number({ invalid_type_error: "Servings must be a number" }).int().min(1, "Servings must be at least 1."),
  main_image: z.any().optional(),
  ingredients: z.array(z.object({
    name: z.string().min(1, "Ingredient name is required."),
    quantity: z.coerce.number({ invalid_type_error: "Quantity must be a number" }).min(0.01, "Quantity must be positive."),
    unit: z.string().min(1, "Unit is required.")
  })).min(1, "At least one ingredient is required."),
  steps: z.array(z.object({
    instruction: z.string().min(5, "Instruction is too short.")
  })).min(1, "At least one step is required."),
});

type RecipeFormValues = z.infer<typeof recipeFormSchema>;

interface RecipeFormProps {
    recipe?: Recipe;
}

export default function RecipeForm({ recipe }: RecipeFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { user } = useAuth();

  const isEditMode = !!recipe;

  const defaultValues = isEditMode && recipe ? {
      ...recipe,
      steps: recipe.steps.map(s => ({ instruction: s.instruction })),
      main_image: undefined,
  } : {
      title: "",
      description: "",
      cuisine_type: "",
      servings: 4,
      main_image: undefined,
      ingredients: [{ name: "", quantity: 1, unit: "" }],
      steps: [{ instruction: "" }],
  }

  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues,
  });

  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
    control: form.control,
    name: "ingredients",
  });

  const { fields: stepFields, append: appendStep, remove: removeStep } = useFieldArray({
    control: form.control,
    name: "steps",
  });
  
  const imageRef = form.register("main_image");

  function onSubmit(data: RecipeFormValues) {
    if (!user) {
        toast({ title: "Authentication Error", description: "You must be logged in to save a recipe.", variant: "destructive"});
        return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append('user_id', user.uid);
      
      const imageFiles = data.main_image as FileList;
      if (imageFiles && imageFiles.length > 0) {
        formData.append('main_image', imageFiles[0]);
      }

      // Append other data, ensuring ingredients and steps are stringified
      Object.entries(data).forEach(([key, value]) => {
          if (key === 'main_image') return; 
          if (key === 'ingredients' || key === 'steps') {
            formData.append(key, JSON.stringify(value));
          } else if (value !== undefined && value !== null) {
              formData.append(key, String(value));
          }
      });
      
      if (isEditMode && recipe) {
          formData.append('existing_main_image_url', recipe.main_image_url);
      }

      const result = isEditMode && recipe 
        ? await updateRecipeAction(recipe.id, formData)
        : await createRecipe(formData);

      if (result.error) {
        toast({
          title: "Error Saving Recipe",
          description: result.error,
          variant: "destructive",
        });
        if (result.validationErrors) {
            Object.entries(result.validationErrors).forEach(([field, errors]) => {
               form.setError(field as keyof RecipeFormValues, { message: (errors as string[]).join(', ')})
            });
        }
      } else if (result.data) {
        toast({
          title: `Recipe ${isEditMode ? 'Updated' : 'Submitted'}!`,
          description: `Your recipe has been ${isEditMode ? 'updated' : 'saved'} successfully.`,
        });
        router.push(`/recipe/${result.data.id}`);
        router.refresh();
      }
    });
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Recipe Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl><Input placeholder="e.g., Classic Spaghetti Carbonara" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl><Textarea placeholder="A short, enticing description of your dish..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="cuisine_type" render={({ field }) => (
                <FormItem>
                  <FormLabel>Cuisine</FormLabel>
                  <FormControl><Input placeholder="e.g., Italian" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="servings" render={({ field }) => (
                <FormItem>
                  <FormLabel>Servings</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            {isEditMode && recipe?.main_image_url && (
                <div>
                    <p className="text-sm text-muted-foreground mb-2">Current Image:</p>
                    <img src={recipe.main_image_url} alt={recipe.title} className="w-48 h-auto rounded-md mb-4" />
                </div>
            )}
            <FormItem>
                <FormLabel>{isEditMode ? "Upload New Image" : "Main Image"}</FormLabel>
                 <FormControl><Input type="file" {...imageRef} /></FormControl>
                <FormMessage />
            </FormItem>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Ingredients</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 {ingredientFields.map((field, index) => (
                    <div key={field.id} className="flex flex-col md:flex-row gap-2 items-start">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-grow w-full">
                            <FormField control={form.control} name={`ingredients.${index}.name`} render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={index !== 0 ? "sr-only" : ""}>Name</FormLabel>
                                    <FormControl><Input placeholder="e.g., Flour" {...field} /></FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name={`ingredients.${index}.quantity`} render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={index !== 0 ? "sr-only" : ""}>Quantity</FormLabel>
                                    <FormControl><Input type="number" placeholder="e.g., 500" {...field} /></FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name={`ingredients.${index}.unit`} render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={index !== 0 ? "sr-only" : ""}>Unit</FormLabel>
                                    <FormControl><Input placeholder="e.g., grams" {...field} /></FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                        </div>
                        <Button type="button" variant="outline" size="icon" className="mt-0 md:mt-6" onClick={() => removeIngredient(index)} disabled={ingredientFields.length <= 1}>
                           <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                 ))}
                 <Button type="button" variant="outline" onClick={() => appendIngredient({ name: "", quantity: 1, unit: "" })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Ingredient
                 </Button>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Steps</CardTitle>
            </Header>
            <CardContent className="space-y-4">
                {stepFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-start">
                         <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-muted text-muted-foreground font-bold text-lg mt-6">
                            {index + 1}
                        </div>
                        <FormField control={form.control} name={`steps.${index}.instruction`} render={({ field }) => (
                            <FormItem className="flex-grow">
                                <FormLabel className={index !== 0 ? "sr-only" : ""}>Instruction</FormLabel>
                                <FormControl><Textarea placeholder="Describe this step..." {...field} /></FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                        <Button type="button" variant="outline" size="icon" className="mt-6" onClick={() => removeStep(index)} disabled={stepFields.length <= 1}>
                           <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
                 <Button type="button" variant="outline" onClick={() => appendStep({ instruction: "" })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Step
                 </Button>
            </CardContent>
        </Card>
        
        <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={isPending || !user}>
                {isPending ? "Saving..." : (isEditMode ? "Save Changes" : "Save Recipe")}
            </Button>
        </div>
      </form>
    </Form>
  );
}
