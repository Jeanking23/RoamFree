// src/services/places.ts
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, addDoc } from 'firebase/firestore';

export interface SavedPlace {
  id: string;
  name: string;
  address: string;
}

/**
 * Fetches all saved places from the Firestore 'saved_places' collection.
 * @returns A promise that resolves to an array of saved place objects.
 */
export async function getSavedPlaces(): Promise<SavedPlace[]> {
  try {
    const placesCollection = collection(db, 'saved_places');
    const placesSnapshot = await getDocs(placesCollection);
    const placesList = placesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as SavedPlace));
    // Simple mock data if collection is empty
    if (placesList.length === 0) {
        return [
            { id: 'home_mock', name: 'Home', address: '123 Home St, Hometown, USA' },
            { id: 'work_mock', name: 'Work', address: '456 Business Ave, Worktown, USA' },
        ];
    }
    return placesList;
  } catch (error) {
    console.error("Error fetching saved places from Firestore:", error);
    throw new Error("Failed to fetch saved places.");
  }
}

/**
 * Adds a new saved place to the Firestore 'saved_places' collection.
 * @param place An object containing the name and address of the place to save.
 * @returns A promise that resolves to the ID of the newly created document.
 */
export async function addSavedPlace(place: Omit<SavedPlace, 'id'>): Promise<string> {
  try {
    const placesCollection = collection(db, 'saved_places');
    const docRef = await addDoc(placesCollection, place);
    return docRef.id;
  } catch (error) {
    console.error("Error adding saved place to Firestore:", error);
    throw new Error("Failed to add saved place.");
  }
}
