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
import { createRecipe } from "@/app/actions";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

const recipeFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  description: z.string().min(10, "Description must be at least 10 characters long."),
  cuisine_type: z.string().min(2, "Cuisine type is required."),
  servings: z.coerce.number({ invalid_type_error: "Servings must be a number" }).int().min(1, "Servings must be at least 1."),
  main_image_url: z.string().url({ message: "Please enter a valid image URL." }).optional().or(z.literal('')),
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

export default function RecipeForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      title: "",
      description: "",
      cuisine_type: "",
      servings: 4,
      main_image_url: "",
      ingredients: [{ name: "", quantity: 1, unit: "" }],
      steps: [{ instruction: "" }],
    },
  });

  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
    control: form.control,
    name: "ingredients",
  });

  const { fields: stepFields, append: appendStep, remove: removeStep } = useFieldArray({
    control: form.control,
    name: "steps",
  });

  function onSubmit(data: RecipeFormValues) {
    startTransition(async () => {
      const result = await createRecipe(data);

      if (result.error) {
        toast({
          title: "Error Saving Recipe",
          description: result.error,
          variant: "destructive",
        });
      } else if (result.data) {
        toast({
          title: "Recipe Submitted!",
          description: "Your new recipe has been saved successfully.",
        });
        router.push(`/recipe/${result.data.id}`);
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
            <FormField control={form.control} name="main_image_url" render={({ field }) => (
              <FormItem>
                <FormLabel>Main Image URL</FormLabel>
                <FormControl><Input placeholder="https://example.com/image.jpg" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
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
            </CardHeader>
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
            <Button type="submit" size="lg" disabled={isPending}>
                {isPending ? "Saving..." : "Save Recipe"}
            </Button>
        </div>
      </form>
    </Form>
  );
}
