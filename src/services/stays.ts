// src/services/stays.ts
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import type { MockStay } from '@/lib/mock-data';

/**
 * Fetches all stays from the Firestore 'stays' collection.
 * Note: For production, you would implement pagination, filtering, and sorting.
 * @returns A promise that resolves to an array of stay objects.
 */
export async function getAllStays(): Promise<MockStay[]> {
  try {
    const staysCollection = collection(db, 'stays');
    const staysSnapshot = await getDocs(staysCollection);
    const staysList = staysSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as MockStay));
    return staysList;
  } catch (error) {
    console.error("Error fetching stays from Firestore:", error);
    // In a real app, you might want to throw the error or return an empty array
    // and handle it gracefully in the UI.
    throw new Error("Failed to fetch stays.");
  }
}

/**
 * Fetches a single stay by its ID from the Firestore 'stays' collection.
 * @param id The ID of the stay to fetch.
 * @returns A promise that resolves to the stay object or null if not found.
 */
export async function getStayById(id: string): Promise<MockStay | null> {
  try {
    const stayDocRef = doc(db, 'stays', id);
    const stayDocSnap = await getDoc(stayDocRef);

    if (stayDocSnap.exists()) {
      return { id: stayDocSnap.id, ...stayDocSnap.data() } as MockStay;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching stay by ID from Firestore:", error);
    throw new Error("Failed to fetch stay details.");
  }
}
