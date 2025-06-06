
"use server";

import { recommendPoi, type RecommendPoiInput, type RecommendPoiOutput } from "@/ai/flows/poi-recommendation";
import { planTrip, type AiTripPlanInput, type AiTripPlanOutput } from "@/ai/flows/trip-planner-flow";
import { getSupportChatResponse, type SupportChatbotInput, type SupportChatbotOutput } from "@/ai/flows/support-chatbot-flow";

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

    