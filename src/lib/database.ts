
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, serverTimestamp, query, orderBy, limit } from "firebase/firestore";
import { db } from './firebase';
import type { Recipe, Profile } from './types';
import { adminDb } from "./firebase-admin";

const mockProfiles: Profile[] = [
  { id: 'user-1', username: 'ChefAnna', avatar_url: 'https://placehold.co/100x100.png' },
  { id: 'user-2', username: 'GourmetGary', avatar_url: 'https://placehold.co/100x100.png' },
];

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
        author: mockProfiles.find(p => p.id === data.user_id),
        ingredients: data.ingredients || [],
        steps: data.steps || [],
    };
};

export const getRecipes = async (): Promise<Recipe[]> => {
    const q = query(collection(db, 'recipes'), orderBy("created_at", "desc"), limit(20));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(fromFirestore);
};

export const getRecipeById = async (id: string): Promise<Recipe | undefined> => {
    const docRef = doc(db, 'recipes', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const recipe = fromFirestore(docSnap);
        // This is a temporary workaround to populate author data since we don't have a users collection
        if (!recipe.author && recipe.user_id) {
             const userDoc = await adminDb.collection('users').doc(recipe.user_id).get();
             if(userDoc.exists){
                 recipe.author = userDoc.data() as Profile;
             } else {
                 recipe.author = { id: recipe.user_id, username: 'Anonymous Chef' };
             }
        }
        return recipe;
    } else {
        return undefined;
    }
};

// These functions are now effectively replaced by server actions using the Admin SDK
// They are kept here to avoid breaking other parts of the app that might still reference them,
// but they should not be used for create/update operations from the client.
export const addRecipe = async (recipe: Omit<Recipe, 'id' | 'created_at' | 'author'>): Promise<string> => {
    console.warn("addRecipe from client-side is deprecated. Use server action instead.");
    const docRef = await addDoc(collection(db, 'recipes'), {
        ...recipe,
        created_at: serverTimestamp(),
    });
    return docRef.id;
};

export const updateRecipe = async (id: string, recipeData: Partial<Omit<Recipe, 'id' | 'created_at' | 'author'>>): Promise<void> => {
    console.warn("updateRecipe from client-side is deprecated. Use server action instead.");
    const docRef = doc(db, 'recipes', id);
    await updateDoc(docRef, recipeData);
};
