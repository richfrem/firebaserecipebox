import { collection, addDoc, getDocs, getDoc, doc, updateDoc, serverTimestamp, query, orderBy, limit } from "firebase/firestore";
import { db } from './firebase';
import type { Recipe, Profile, Ingredient, Step } from './types';

const mockProfiles: Profile[] = [
  { id: 'user-1', username: 'ChefAnna', avatar_url: 'https://placehold.co/100x100.png' },
  { id: 'user-2', username: 'GourmetGary', avatar_url: 'https://placehold.co/100x100.png' },
];

// Firestore collection reference
const recipesCollection = collection(db, 'recipes');

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
    const q = query(recipesCollection, orderBy("created_at", "desc"), limit(20));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(fromFirestore);
};

export const getRecipeById = async (id: string): Promise<Recipe | undefined> => {
    const docRef = doc(db, 'recipes', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return fromFirestore(docSnap);
    } else {
        return undefined;
    }
};

export const addRecipe = async (recipe: Omit<Recipe, 'id' | 'created_at' | 'author'>): Promise<string> => {
    const newRecipeData = {
        ...recipe,
        created_at: serverTimestamp(),
    };
    const docRef = await addDoc(recipesCollection, newRecipeData);
    return docRef.id;
};

export const updateRecipe = async (id: string, recipeData: Partial<Omit<Recipe, 'id' | 'created_at' | 'author'>>): Promise<void> => {
    const docRef = doc(db, 'recipes', id);
    await updateDoc(docRef, recipeData);
};
