# **App Name**: RecipeHub

## Core Features:

- Recipe Gallery: Display recipes in an image-focused, responsive grid using RecipeCard components on the homepage.
- User Authentication: Implement a user authentication page with email/password inputs and social login buttons (Google, Microsoft, Apple).
- Recipe Details: Show a recipe detail page displaying the main image prominently and providing comprehensive details about the recipe.
- Dynamic Scaling Tool: Integrate a recipe scaling tool that dynamically adjusts ingredient quantities based on the desired number of servings. The tool should recompute quantities using appropriate conversion rules and taking into account volume and density conversions, and other measurement concerns.
- Recipe Management Form: Implement a form for adding or editing recipes with dynamic fields for ingredients and steps.
- Data Access Control: Secure recipes such that unauthenticated users can view all, but authenticated users can only modify their own recipes, enabled via RLS policies in Supabase.

## Style Guidelines:

- Primary color: Warm orange (#FF7043) to evoke feelings of warmth, appetite, and home cooking.
- Background color: Light orange (#FFF3E0) - a desaturated version of the primary color to ensure it doesn't distract from the recipes but remains inviting.
- Accent color: Analogous yellow-orange (#FFAB40) for interactive elements and highlights, adding vibrancy without clashing.
- Headline font: 'Belleza' (sans-serif) for headings to reflect the fashion and design style
- Body font: 'Alegreya' (serif) for body text to provide an elegant and intellectual feel for reading recipes.
- Use simple, line-based icons to represent different recipe categories and actions, maintaining a clean and modern look.
- Emphasize large, high-quality images of the recipes to draw users in and make the app visually appealing.