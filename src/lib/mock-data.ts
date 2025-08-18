
import type { Recipe, Profile } from './types';

const mockProfiles: Profile[] = [
  { id: 'user-1', username: 'ChefAnna', avatar_url: 'https://placehold.co/100x100.png' },
  { id: 'user-2', username: 'GourmetGary', avatar_url: 'https://placehold.co/100x100.png' },
];

let mockRecipes: Recipe[] = [
  {
    id: '1',
    user_id: 'user-1',
    title: 'Classic Spaghetti Carbonara',
    description: 'A traditional Italian pasta dish from Rome made with egg, hard cheese, cured pork, and black pepper.',
    cuisine_type: 'Italian',
    servings: 4,
    main_image_url: 'https://placehold.co/1200x800.png',
    data_ai_hint: 'pasta carbonara',
    created_at: new Date().toISOString(),
    author: mockProfiles[0],
    ingredients: [
      { id: 'i1-1', recipe_id: '1', name: 'Spaghetti', quantity: 400, unit: 'grams' },
      { id: 'i1-2', recipe_id: '1', name: 'Guanciale (cured pork cheek)', quantity: 150, unit: 'grams' },
      { id: 'i1-3', recipe_id: '1', name: 'Large egg yolks', quantity: 4, unit: 'count' },
      { id: 'i1-4', recipe_id: '1', name: 'Pecorino Romano cheese, grated', quantity: 50, unit: 'grams' },
      { id: 'i1-5', recipe_id: '1', name: 'Black pepper, freshly ground', quantity: 1, unit: 'tsp' },
    ],
    steps: [
      { id: 's1-1', recipe_id: '1', step_number: 1, instruction: 'Bring a large pot of salted water to a boil.' },
      { id: 's1-2', recipe_id: '1', step_number: 2, instruction: 'Cut the guanciale into small strips. Fry in a pan over medium heat until crisp. Remove from heat.' },
      { id: 's1-3', recipe_id: '1', step_number: 3, instruction: 'In a bowl, whisk the egg yolks and Pecorino Romano. Season with a generous amount of black pepper.' },
      { id: 's1-4', recipe_id: '1', step_number: 4, instruction: 'Cook the spaghetti until al dente. Reserve a cup of pasta water, then drain the pasta.' },
      { id: 's1-5', recipe_id: '1', step_number: 5, instruction: 'Add the drained pasta to the pan with the guanciale. Add a splash of pasta water and toss. Remove from heat and quickly pour in the egg and cheese mixture, stirring vigorously. Serve immediately.' },
    ],
  },
  {
    id: '2',
    user_id: 'user-2',
    title: 'Spicy Thai Green Curry',
    description: 'A fragrant and flavorful Thai curry with chicken, coconut milk, and a homemade green curry paste.',
    cuisine_type: 'Thai',
    servings: 4,
    main_image_url: 'https://placehold.co/1200x800.png',
    data_ai_hint: 'thai curry',
    created_at: new Date().toISOString(),
    author: mockProfiles[1],
    ingredients: [
      { id: 'i2-1', recipe_id: '2', name: 'Chicken breast, sliced', quantity: 500, unit: 'grams' },
      { id: 'i2-2', recipe_id: '2', name: 'Coconut milk', quantity: 400, unit: 'ml' },
      { id: 'i2-3', recipe_id: '2', name: 'Green curry paste', quantity: 3, unit: 'tbsp' },
      { id: 'i2-4', recipe_id: '2', name: 'Bamboo shoots, sliced', quantity: 225, unit: 'grams' },
      { id: 'i2-5', recipe_id: '2', name: 'Thai basil leaves', quantity: 1, unit: 'cup' },
      { id: 'i2-6', recipe_id: '2', name: 'Fish sauce', quantity: 2, unit: 'tbsp' },
      { id: 'i2-7', recipe_id: '2', name: 'Palm sugar', quantity: 1, unit: 'tbsp' },
    ],
    steps: [
      { id: 's2-1', recipe_id: '2', step_number: 1, instruction: 'In a large wok or pot, heat half of the coconut milk over medium heat until the oil separates.' },
      { id: 's2-2', recipe_id: '2', step_number: 2, instruction: 'Add the green curry paste and cook for 2 minutes until fragrant.' },
      { id: 's2-3', recipe_id: '2', step_number: 3, instruction: 'Add the chicken and cook until no longer pink.' },
      { id: 's2-4', recipe_id: '2', step_number: 4, instruction: 'Pour in the remaining coconut milk, fish sauce, and palm sugar. Bring to a simmer.' },
      { id: 's2-5', recipe_id: '2', step_number: 5, instruction: 'Add the bamboo shoots and cook for 5-7 minutes. Stir in the Thai basil leaves just before serving.' },
    ],
  },
  {
    id: '3',
    user_id: 'user-1',
    title: 'Hearty Lentil Soup',
    description: 'A nutritious and comforting soup made with brown lentils, vegetables, and savory herbs.',
    cuisine_type: 'Vegetarian',
    servings: 6,
    main_image_url: 'https://placehold.co/1200x800.png',
    data_ai_hint: 'lentil soup',
    created_at: new Date().toISOString(),
    author: mockProfiles[0],
    ingredients: [
      { id: 'i3-1', recipe_id: '3', name: 'Brown lentils, rinsed', quantity: 1, unit: 'cup' },
      { id: 'i3-2', recipe_id: '3', name: 'Vegetable broth', quantity: 6, unit: 'cups' },
      { id: 'i3-3', recipe_id: '3', name: 'Diced onion', quantity: 1, unit: 'count' },
      { id: 'i3-4', recipe_id: '3', name: 'Carrots, chopped', quantity: 2, unit: 'count' },
      { id: 'i3-5', recipe_id: '3', name: 'Celery stalks, chopped', quantity: 2, unit: 'count' },
      { id: 'i3-6', recipe_id: '3', name: 'Canned diced tomatoes', quantity: 400, unit: 'grams' },
      { id: 'i3-7', recipe_id: '3', name: 'Cumin', quantity: 1, unit: 'tsp' },
    ],
    steps: [
      { id: 's3-1', recipe_id: '3', step_number: 1, instruction: 'In a large pot, sauté the onion, carrots, and celery until softened.' },
      { id: 's3-2', recipe_id: '3', step_number: 2, instruction: 'Add the vegetable broth, lentils, diced tomatoes, and cumin. Bring to a boil.' },
      { id: 's3-3', recipe_id: '3', step_number: 3, instruction: 'Reduce heat, cover, and simmer for 45-50 minutes, or until lentils are tender.' },
      { id: 's3-4', recipe_id: '3', step_number: 4, instruction: 'Season with salt and pepper to taste before serving.' },
    ],
  },
  {
    id: '4',
    user_id: 'user-2',
    title: 'Chocolate Avocado Mousse',
    description: 'A surprisingly delicious and healthy dessert that uses avocado for a creamy texture.',
    cuisine_type: 'Dessert',
    servings: 4,
    main_image_url: 'https://placehold.co/1200x800.png',
    data_ai_hint: 'chocolate mousse',
    created_at: new Date().toISOString(),
    author: mockProfiles[1],
    ingredients: [
      { id: 'i4-1', recipe_id: '4', name: 'Ripe avocados', quantity: 2, unit: 'count' },
      { id: 'i4-2', recipe_id: '4', name: 'Unsweetened cocoa powder', quantity: 0.5, unit: 'cup' },
      { id: 'i4-3', recipe_id: '4', name: 'Maple syrup', quantity: 0.5, unit: 'cup' },
      { id: 'i4-4', recipe_id: '4', name: 'Non-dairy milk', quantity: 0.25, unit: 'cup' },
      { id: 'i4-5', recipe_id: '4', name: 'Vanilla extract', quantity: 1, unit: 'tsp' },
    ],
    steps: [
      { id: 's4-1', recipe_id: '4', step_number: 1, instruction: 'Combine all ingredients in a high-speed blender.' },
      { id: 's4-2', recipe_id: '4', step_number: 2, instruction: 'Blend until completely smooth, scraping down the sides as needed.' },
      { id: 's4-3', recipe_id: '4', step_number: 3, instruction: 'Divide the mousse into serving dishes and chill for at least 30 minutes before serving.' },
    ],
  }
];

export const getRecipes = async (): Promise<Recipe[]> => {
  return Promise.resolve(mockRecipes);
};

export const getRecipeById = async (id: string): Promise<Recipe | undefined> => {
  return Promise.resolve(mockRecipes.find(recipe => recipe.id === id));
};

export const addRecipe = async (recipe: Omit<Recipe, 'id' | 'created_at' | 'author'>): Promise<Recipe> => {
  const highestId = mockRecipes.reduce((maxId, r) => Math.max(maxId, parseInt(r.id, 10)), 0);
  const newId = (highestId + 1).toString();
  
  const newRecipe: Recipe = {
    ...recipe,
    id: newId,
    created_at: new Date().toISOString(),
    author: mockProfiles[0], // Mock author
  };
  mockRecipes.push(newRecipe);
  return Promise.resolve(newRecipe);
};

export const updateRecipe = async (id: string, recipeData: Omit<Recipe, 'id' | 'created_at' | 'author'>): Promise<Recipe | undefined> => {
  const recipeIndex = mockRecipes.findIndex(r => r.id === id);
  if (recipeIndex === -1) {
    return Promise.resolve(undefined);
  }

  const existingRecipe = mockRecipes[recipeIndex];

  const updatedRecipe: Recipe = {
    ...existingRecipe,
    ...recipeData,
  };

  mockRecipes[recipeIndex] = updatedRecipe;
  return Promise.resolve(updatedRecipe);
};
