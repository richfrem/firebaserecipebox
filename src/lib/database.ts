
import { collection, getDocs, getDoc, doc, query, orderBy, limit } from "firebase/firestore";
import { db } from './firebase';
import type { Recipe, Profile } from './types';

// This file now ONLY contains client-side or general-purpose data fetching.
// Server-only data fetching has been moved directly into Server Components.

// Helper to convert Firestore doc to Recipe
const fromFirestore = (doc: any): Recipe => {
    const data = doc.data();
    return {
        id: doc.id,
        user_id: data.user_id,
        title: data.title,
        description: data.description,
        cuisine_type: data.cuisine_type,
        servings: data.servings,
        main_image_url: data.main_image_url,
        data_ai_hint: data.data_ai_hint,
        created_at: data.created_at?.toDate().toISOString() || new Date().toISOString(),
        author: data.author, // Keep author simple for now
        ingredients: data.ingredients || [],
        steps: data.steps || [],
    };
};

// This function uses the CLIENT SDK and is safe to be imported anywhere.
export const getRecipesClient = async (): Promise<Recipe[]> => {
    const q = query(collection(db, 'recipes'), orderBy("created_at", "desc"), limit(20));
    const snapshot = await getDocs(q);
    const recipes = snapshot.docs.map(fromFirestore);

    // Manually fetch author for each recipe (example of client-side join)
    for(let recipe of recipes) {
        if(recipe.user_id) {
            const userDocRef = doc(db, 'users', recipe.user_id);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                recipe.author = userDocSnap.data() as Profile;
            }
        }
    }
    return recipes;
};

// This function uses the CLIENT SDK and is safe to be imported anywhere.
export const getRecipeByIdClient = async (id: string): Promise<Recipe | undefined> => {
    const docRef = doc(db, 'recipes', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const recipe = fromFirestore(docSnap);
        if (recipe.user_id) {
            const userDocRef = doc(db, 'users', recipe.user_id);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                recipe.author = userDocSnap.data() as Profile;
            }
        }
        return recipe;
    } else {
        return undefined;
    }
};
