// src/services/stays.ts
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { allMockStays, type MockStay } from '@/lib/mock-data';

/**
 * Fetches all stays.
 * This function now returns a rich set of mock data to ensure results are always available.
 * @returns A promise that resolves to an array of stay objects.
 */
export async function getAllStays(): Promise<MockStay[]> {
  // Return mock data directly to ensure there's always a list of stays to search through.
  // In a real production app, this would fetch from a live database.
  return Promise.resolve(allMockStays);
}

/**
 * Fetches a single stay by its ID from the Firestore 'stays' collection.
 * @param id The ID of the stay to fetch.
 * @returns A promise that resolves to the stay object or null if not found.
 */
export async function getStayById(id: string): Promise<MockStay | null> {
  // First, check the mock data as it's our primary source now for the list view
  const mockStay = allMockStays.find(stay => stay.id === id);
  if (mockStay) {
    return Promise.resolve(mockStay);
  }

  // Fallback to Firestore if not in mock data (for potential future use)
  try {
    const stayDocRef = doc(db, 'stays', id);
    const stayDocSnap = await getDoc(stayDocRef);

    if (stayDocSnap.exists()) {
      return { id: stayDocSnap.id, ...stayDocSnap.data() } as MockStay;
    } else {
      console.log("No such document in Firestore!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching stay by ID from Firestore:", error);
    throw new Error("Failed to fetch stay details.");
  }
}
