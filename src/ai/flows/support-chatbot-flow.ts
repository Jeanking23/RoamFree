
'use server';
/**
 * @fileOverview AI flow for a customer support chatbot.
 *
 * - getSupportChatResponse - A function that provides a response to a user's support query.
 * - SupportChatbotInput - The input type for the getSupportChatResponse function.
 * - SupportChatbotOutput - The return type for the getSupportChatResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SupportChatbotInputSchema = z.object({
  query: z.string().describe('The user\'s question or support request related to RoamFree services (bookings, listings, account issues, etc.).'),
  // conversationHistory: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })).optional().describe("Optional history of the conversation so far."),
});
export type SupportChatbotInput = z.infer<typeof SupportChatbotInputSchema>;

const SupportChatbotOutputSchema = z.object({
  response: z.string().describe('A helpful and relevant response from the AI chatbot to address the user\'s query. If the query is complex or requires human intervention, the bot should state its limitations and suggest contacting human support.'),
});
export type SupportChatbotOutput = z.infer<typeof SupportChatbotOutputSchema>;

export async function getSupportChatResponse(input: SupportChatbotInput): Promise<SupportChatbotOutput> {
  return supportChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'supportChatbotPrompt',
  input: {schema: SupportChatbotInputSchema},
  output: {schema: SupportChatbotOutputSchema},
  prompt: `You are a friendly and helpful customer support chatbot for "RoamFree", a travel and accommodation booking platform.
Your goal is to assist users with their questions about our services.

RoamFree offers:
- Accommodation Search (hotels, vacation rentals, land)
- Transportation Booking (rides, rental cars)
- Attraction Tickets
- Property Listing for Owners
- User Accounts and Profiles

User's Query: {{{query}}}

{{#if conversationHistory}}
Conversation History:
{{#each conversationHistory}}
{{role}}: {{content}}
{{/each}}
{{/if}}

Please provide a clear, concise, and helpful response.
- If the question is about a feature RoamFree offers, provide information or guidance.
- If the question is about account issues (e.g., password reset, payment problems), explain how to resolve it or where to find help (e.g., "You can reset your password from the login page.").
- If the query is too complex, involves sensitive personal information, or requires human intervention, politely state your limitations and guide the user to contact human support (e.g., "For this specific issue, please contact our human support team through the 'Send us a Message' form or by calling us.").
- Do not make up information or promise features that don't exist.
- Be empathetic and professional.
`,
});

const supportChatbotFlow = ai.defineFlow(
  {
    name: 'supportChatbotFlow',
    inputSchema: SupportChatbotInputSchema,
    outputSchema: SupportChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("The AI chatbot failed to generate a response.");
    }
    return output;
  }
);

    