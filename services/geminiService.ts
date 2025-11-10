
import { GoogleGenAI } from "@google/genai";
import { ResumeData, Experience } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateSummary(data: ResumeData): Promise<string> {
  const experienceText = data.experience.map(exp => `Job: ${exp.jobTitle} at ${exp.company}. Description: ${exp.description}`).join('\n');
  const skillsText = data.skills.join(', ');

  const prompt = `
    Based on the following resume details, write a concise and professional summary of 2-4 sentences for a person named ${data.personalInfo.fullName}. 
    Highlight key skills and experience. Do not use personal pronouns like "I" or "My".

    Experience:
    ${experienceText}

    Skills:
    ${skillsText}

    Summary:
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Error: Could not generate summary.";
  }
}

export async function getExperienceSuggestion(experience: Experience): Promise<string> {
  const prompt = `
    Rewrite the following job description for a resume to be more impactful. Use strong action verbs and focus on achievements and quantifiable results. 
    The job title was "${experience.jobTitle}". Keep the output in a bulleted list format (using '-') and do not add any introductory text.

    Original Description:
    ${experience.description}

    Improved Description:
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error getting suggestion:", error);
    return "Error: Could not get suggestions.";
  }
}
