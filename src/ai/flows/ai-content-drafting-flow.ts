'use server';
/**
 * @fileOverview This file provides an AI-powered content drafting tool.
 *
 * - aiContentDrafting - A function that generates initial drafts for event descriptions or partner blurbs.
 * - AiContentDraftingInput - The input type for the aiContentDrafting function.
 * - AiContentDraftingOutput - The return type for the aiContentDrafting function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AiContentDraftingInputSchema = z.object({
  contentType: z.enum(['event', 'partner']).describe('The type of content to draft (event or partner blurb).'),
  title: z.string().optional().describe('The name of the event or partner.'),
  details: z.string().optional().describe('Additional details or context for the content.'),
  keywords: z.string().optional().describe('Comma-separated keywords to influence content generation.'),
  length: z.enum(['short', 'medium', 'long']).optional().describe('Desired length of the generated content.'),
});
export type AiContentDraftingInput = z.infer<typeof AiContentDraftingInputSchema>;

const AiContentDraftingOutputSchema = z.object({
  draft: z.string().describe('The generated content draft.'),
});
export type AiContentDraftingOutput = z.infer<typeof AiContentDraftingOutputSchema>;

export async function aiContentDrafting(input: AiContentDraftingInput): Promise<AiContentDraftingOutput> {
  return aiContentDraftingFlow(input);
}

const aiContentDraftingPrompt = ai.definePrompt({
  name: 'aiContentDraftingPrompt',
  input: { schema: AiContentDraftingInputSchema },
  output: { schema: AiContentDraftingOutputSchema },
  prompt: `You are an expert content creator for a tech community platform named "Superteam Connect Malaysia". Your goal is to help administrators draft compelling content quickly.

Generate a draft for a {{{contentType}}} description.

{{#if contentType "==" "event"}}
  The content should be an engaging event description.
  {{#if title}}Event Name: {{{title}}}{{/if}}
  {{#if details}}Additional details: {{{details}}}{{/if}}
  {{#if keywords}}Key topics/keywords: {{{keywords}}}{{/if}}
{{else}}
  The content should be a professional partner blurb.
  {{#if title}}Partner Name: {{{title}}}{{/if}}
  {{#if details}}Additional details: {{{details}}}{{/if}}
  {{#if keywords}}Key services/keywords: {{{keywords}}}{{/if}}
{{/if}}

{{#if length}}
  The draft should be {{length}} in length.
{{else}}
  The draft should be a concise and impactful medium length.
{{/if}}

Ensure the tone is professional, engaging, and aligns with a vibrant tech community.
Present the generated draft directly, without any introductory phrases like "Here's a draft:".`,
});

const aiContentDraftingFlow = ai.defineFlow(
  {
    name: 'aiContentDraftingFlow',
    inputSchema: AiContentDraftingInputSchema,
    outputSchema: AiContentDraftingOutputSchema,
  },
  async (input) => {
    const { output } = await aiContentDraftingPrompt(input);
    return output!;
  }
);
