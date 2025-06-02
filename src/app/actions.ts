"use server";

import { recommendPoi, type RecommendPoiInput, type RecommendPoiOutput } from "@/ai/flows/poi-recommendation";

export async function getPoiRecommendationsAction(input: RecommendPoiInput): Promise<RecommendPoiOutput | { error: string }> {
  try {
    const result = await recommendPoi(input);
    return result;
  } catch (error) {
    console.error("Error getting POI recommendations:", error);
    // It's better to return a generic error message to the client
    return { error: "Failed to get recommendations. Please try again." };
  }
}
