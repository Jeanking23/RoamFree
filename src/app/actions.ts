
"use server";

import { recommendPoi, type RecommendPoiInput, type RecommendPoiOutput } from "@/ai/flows/poi-recommendation";
import { planTrip, type AiTripPlanInput, type AiTripPlanOutput } from "@/ai/flows/trip-planner-flow";
import { getSupportChatResponse, type SupportChatbotInput, type SupportChatbotOutput } from "@/ai/flows/support-chatbot-flow";
import { getSavedPlaces, addSavedPlace } from "@/services/places";
import type { SavedPlace } from "@/services/places";
import { sendPasswordResetEmail } from "@/lib/auth";

export async function getPoiRecommendationsAction(input: RecommendPoiInput): Promise<RecommendPoiOutput | { error: string }> {
  try {
    const result = await recommendPoi(input);
    return result;
  } catch (error) {
    console.error("Error getting POI recommendations:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { error: `Failed to get recommendations: ${errorMessage}` };
  }
}

export async function getAiTripPlanAction(input: AiTripPlanInput): Promise<AiTripPlanOutput | { error: string }> {
  try {
    const result = await planTrip(input);
    return result;
  } catch (error) {
    console.error("Error getting AI trip plan:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { error: `Failed to generate trip plan: ${errorMessage}` };
  }
}

export async function getSupportChatbotResponseAction(input: SupportChatbotInput): Promise<SupportChatbotOutput | { error: string }> {
  try {
    const result = await getSupportChatResponse(input);
    return result;
  } catch (error) {
    console.error("Error getting chatbot response:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { error: `Chatbot failed to respond: ${errorMessage}` };
  }
}

export async function getSavedPlacesAction(): Promise<SavedPlace[] | { error: string }> {
  try {
    const places = await getSavedPlaces();
    return places;
  } catch (error) {
    console.error("Error getting saved places:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { error: `Failed to fetch saved places: ${errorMessage}` };
  }
}

export async function addSavedPlaceAction(place: Omit<SavedPlace, 'id'>): Promise<{ id: string } | { error: string }> {
    if (!place.name || !place.address) {
        return { error: "Name and address are required." };
    }
    try {
        const placeId = await addSavedPlace(place);
        return { id: placeId };
    } catch (error) {
        console.error("Error adding saved place:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return { error: `Failed to save place: ${errorMessage}` };
    }
}

export async function sendPasswordResetAction(email: string): Promise<{ success: boolean } | { error: string }> {
  if (!email) {
    return { error: "Email is required." };
  }
  try {
    const result = await sendPasswordResetEmail(email);
    return result;
  } catch (error) {
    console.error("Error in sendPasswordResetAction:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { error: `Failed to send password reset email: ${errorMessage}` };
  }
}
