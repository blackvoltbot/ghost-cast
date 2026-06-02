'use server';
/**
 * @fileOverview An AI agent for diagnosing technical issues based on session data and logs.
 *
 * - adminIssueDiagnosis - A function that handles the technical issue diagnosis process.
 * - AdminIssueDiagnosisInput - The input type for the adminIssueDiagnosis function.
 * - AdminIssueDiagnosisOutput - The return type for the adminIssueDiagnosis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdminIssueDiagnosisInputSchema = z.object({
  sessionMetadata: z
    .string()
    .describe('JSON string representing session metadata such as browser, OS, connection status, etc.'),
  consoleLogs: z
    .string()
    .describe('A string containing concatenated console logs from the user session.'),
});
export type AdminIssueDiagnosisInput = z.infer<typeof AdminIssueDiagnosisInputSchema>;

const AdminIssueDiagnosisOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the diagnosed technical issue.'),
  suggestions: z.array(z.string()).describe('An array of actionable technical fixes or suggestions to resolve the issue.'),
});
export type AdminIssueDiagnosisOutput = z.infer<typeof AdminIssueDiagnosisOutputSchema>;

export async function adminIssueDiagnosis(
  input: AdminIssueDiagnosisInput
): Promise<AdminIssueDiagnosisOutput> {
  return adminIssueDiagnosisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adminIssueDiagnosisPrompt',
  input: { schema: AdminIssueDiagnosisInputSchema },
  output: { schema: AdminIssueDiagnosisOutputSchema },
  prompt: `You are an expert technical support diagnostician. Your task is to analyze user session metadata and console logs to identify technical issues and suggest actionable fixes.

Analyze the following information:

Session Metadata: {{{sessionMetadata}}}

Console Logs: {{{consoleLogs}}}

Based on this data, provide:
1. A concise summary of the diagnosed technical issue.
2. An array of actionable technical fixes or suggestions to resolve the issue.`,
});

const adminIssueDiagnosisFlow = ai.defineFlow(
  {
    name: 'adminIssueDiagnosisFlow',
    inputSchema: AdminIssueDiagnosisInputSchema,
    outputSchema: AdminIssueDiagnosisOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate diagnosis output.');
    }
    return output;
  }
);
