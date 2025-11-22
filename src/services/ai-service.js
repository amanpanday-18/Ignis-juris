import { GoogleGenerativeAI } from "@google/generative-ai";
import { documentTemplates as templates } from '../data/templates';

// Initialize Gemini API
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const AIService = {
    async generateDocument(templateId, formData) {
        try {
            // 1. Get the template details
            const template = templates.find(t => t.id === templateId);
            if (!template) throw new Error('Template not found');

            // 2. Construct the prompt
            let prompt = `Act as an expert legal professional in India. Draft a valid and professional ${template.name} based on the following details:\n\n`;

            // Add form data to prompt
            Object.entries(formData).forEach(([key, value]) => {
                // Format key to be more readable (e.g., "tenantName" -> "Tenant Name")
                const readableKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                prompt += `- ${readableKey}: ${value}\n`;
            });

            prompt += `\nInstructions:\n`;
            prompt += `- Ensure the document follows standard Indian legal formats.\n`;
            prompt += `- Use clear, professional, and legally binding language.\n`;
            prompt += `- Include standard clauses relevant to a ${template.name}.\n`;
            prompt += `- Format the output clearly with proper headings and sections.\n`;
            prompt += `- Do NOT include any markdown formatting like bolding (**text**) or code blocks. Just plain text or standard indentation.\n`;
            prompt += `- The output should be ready to copy-paste into a document editor.\n`;

            // 3. Call Gemini API
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            return text;
        } catch (error) {
            console.error('AI Generation Error:', error);
            throw new Error('Failed to generate document. Please check your internet connection or API key.');
        }
    }
};
